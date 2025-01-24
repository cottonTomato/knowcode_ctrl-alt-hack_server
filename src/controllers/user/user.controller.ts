import type { RequestHandler } from 'express';
import { db } from '../../db/db';
import { userAccounts } from '../../db/schema';
import { StatusCodes } from 'http-status-codes';
import { clerkClient } from '@clerk/express';

export const onBoardUser: RequestHandler = async function (req, res) {
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
