import type { ReqHandler } from '../../types';
import { db, eventImages, events } from '../../db';
import { eq, sql } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

export const getEvents: ReqHandler<object> = async function (req, res) {
  const eventList = await db
    .select({
      name: events.name,
      description: events.description,
      startDate: events.startDate,
      endDate: events.endDate,
      isVolunteer: events.isVolunteer,
      isCrowdfund: events.isCrowdfund,
      fundrasingGoad: events.fundraisingGoal,
      fundsRaised: events.fundsRaised,
      volunteerRoles: events.volunteerRoles,
      volunteerCount: events.volunteerCount,
      images: sql<
        Array<{ url: string; altText: string }>
      >`ARRAY_AGG(JSON_BUILD_OBJECT('url', ${eventImages.imageUri},'altText', ${eventImages.altText}))`.as(
        'images'
      ),
    })
    .from(events)
    .leftJoin(eventImages, eq(events.eventId, eventImages.eventId))
    .groupBy(events.eventId);

  res.status(StatusCodes.OK).json({ status: 'Success', data: eventList });
};
