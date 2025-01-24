import { db, eventImages, events } from '../db';
import { eq, sql } from 'drizzle-orm';

const eventList = db
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
  .groupBy(events.eventId)
  .toSQL();

console.log(eventList);
