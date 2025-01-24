import type { RequestHandler } from 'express';
import type { ReqHandler } from '../../types';
import { IAddFriendsDto } from './events.dto';
import { db } from '../../db/db';
import { userAccounts, friends, contributions } from '../../db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { sql } from 'drizzle-orm/sql';
import { StatusCodes } from 'http-status-codes';

type AddFriendHandler = ReqHandler<IAddFriendsDto>;

export const addFriend: AddFriendHandler = async function (req, res) {
  const { friendId } = req.body;
  const userId = req.auth.userId!;

  await db.insert(friends).values({ userId, friendId });

  res.status(StatusCodes.CREATED).json({ status: 'Success' });
};

export const getFriendList: RequestHandler = async function (req, res) {
  const userId = req.auth.userId!;

  const now = new Date();
  const firstDayOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const friendEntries = await db
    .select({
      firstname: userAccounts.firstname,
      lastname: userAccounts.lastname,
      monthlyContributions: sql`SUM(${contributions.amount})`.as(
        'total_contributions'
      ),
    })
    .from(friends)
    .innerJoin(userAccounts, eq(friends.friendId, userAccounts.userId))
    .leftJoin(
      contributions,
      and(
        eq(contributions.userId, friends.friendId),
        gte(contributions.contributedAt, firstDayOfLastMonth),
        lte(contributions.contributedAt, firstDayOfThisMonth)
      )
    )
    .where(eq(friends.userId, userId))
    .groupBy(friends.friendId);

  res.status(StatusCodes.OK).json({ status: 'Success', data: friendEntries });
};
