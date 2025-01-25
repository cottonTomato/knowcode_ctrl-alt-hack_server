import type { ReqHandler } from '../../types';
import { db, userAccounts, contributions, events } from '../../db';
import { eq, desc, sql, ilike, and, gte, lte } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { clerkClient } from '@clerk/express';
import { IAddEventToCal, IFindUser } from './user.dto';
import { Unauthenticated } from '../../errors';

export const onBoardUser: ReqHandler<object> = async function (req, res) {
  const userId = req.auth.userId!;

  const user = await clerkClient.users.getUser(userId);

  await db.insert(userAccounts).values({
    userId: userId,
    firstname: user.firstName!,
    lastname: user.lastName!,
    email: user.primaryEmailAddressId!,
  });

  res.status(StatusCodes.CREATED).json({ status: 'Success' });
};

export const getMonthlyContributions: ReqHandler<object> = async function (
  req,
  res
) {
  const userId = req.auth.userId!;

  const monthlyContributions = await db
    .select({
      month: sql<string>`DATE_TRUNC('month', contribution_date)`.as('month'),
      totalContribution: sql<number>`SUM('amount')`.as('total_amount'),
    })
    .from(contributions)
    .where(eq(contributions.userId, userId))
    .groupBy(sql`DATE_TRUNC('month', 'contributed_at')`)
    .orderBy(desc(sql`DATE_TRUNC('month', 'contributed_at')`))
    .limit(5);

  res
    .status(StatusCodes.OK)
    .json({ status: 'Success', data: monthlyContributions });
};

export const getUserByEmail: ReqHandler<IFindUser> = async function (req, res) {
  const { query } = req.body;
  const users = await db
    .select({
      id: userAccounts.userId,
      firstname: userAccounts.firstname,
      lastname: userAccounts.lastname,
      email: userAccounts.email,
    })
    .from(userAccounts)
    .where(ilike(userAccounts.email, query));

  res.status(StatusCodes.OK).json({ status: 'Success', data: users });
};

export const getTopUsers: ReqHandler<object> = async function (_req, res) {
  const now = new Date();
  const firstDayOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const topUsers = await db
    .select({
      userId: userAccounts.userId,
      amount: sql<number>`SUM('${contributions.amount}')`.as(
        'total_contributions'
      ),
    })
    .from(userAccounts)
    .leftJoin(
      contributions,
      and(
        eq(contributions.userId, userAccounts.userId),
        gte(contributions.contributedAt, firstDayOfLastMonth),
        lte(contributions.contributedAt, firstDayOfThisMonth)
      )
    )
    .groupBy(userAccounts.userId)
    .orderBy(desc(sql`total_contributions`))
    .limit(10);

  res.status(StatusCodes.OK).json({ status: 'Success', data: topUsers });
};

export const addEventToCalendar: ReqHandler<IAddEventToCal> = async function (
  req,
  res
) {
  const { eventId } = req.body;
  const event = await db
    .select({
      summary: events.name,
      description: events.description,
      location: events.locationId,
      start: { date: events.startDate },
      end: { date: events.endDate },
    })
    .from(events)
    .where(eq(events.eventId, eventId));

  const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
    req.auth.userId!,
    'oauth_google'
  );

  const accessToken = clerkResponse.data[0].token;

  if (!accessToken) {
    throw new Unauthenticated('No OAuth Token found');
  }

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ ...event, eventType: 'outOfOffice' }),
    }
  );

  if (response.ok) {
    res.status(StatusCodes.CREATED).json({ status: 'Success' });
  } else {
    res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ status: 'Failure' });
  }
};
