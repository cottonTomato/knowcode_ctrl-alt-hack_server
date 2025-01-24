import type { ReqHandler } from '../../types';
import { db, userAccounts, contributions } from '../../db';
import { eq, desc, sql } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';
import { clerkClient } from '@clerk/express';

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
