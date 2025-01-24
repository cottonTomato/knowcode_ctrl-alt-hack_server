import { RequestHandler } from 'express';
import { db } from '../../db/db';
import { tags } from '../../db/schema';
import { StatusCodes } from 'http-status-codes';

export const getTags: RequestHandler = async function (_req, res) {
  const tagList = await db.select().from(tags);

  res.status(StatusCodes.OK).json({ tags: tagList });
};
