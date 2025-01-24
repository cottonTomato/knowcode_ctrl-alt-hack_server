import {
  pgTable,
  varchar,
  uuid,
  index,
  serial,
  unique,
  text,
  decimal,
  timestamp,
} from 'drizzle-orm/pg-core';

export const userAccounts = pgTable(
  'user_account',
  {
    userId: uuid('user_id').defaultRandom().primaryKey(),
    clerkUserId: varchar('clerk_user_id', { length: 255 }).notNull().unique(),
    locationId: varchar('location_id', { length: 255 }).notNull(),
    postalCode: varchar('postal_code', { length: 20 }).notNull(),
  },
  (users) => [
    index('idx_location_id').on(users.locationId),
    index('idx_postal_code').on(users.postalCode),
  ]
);

export const friends = pgTable(
  'friends',
  {
    userId1: uuid('user_id_1').references(() => userAccounts.userId),
    userId2: uuid('user_id_2').references(() => userAccounts.userId),
  },
  (friendEntry) => [unique().on(friendEntry.userId1, friendEntry.userId2)]
);

export const tags = pgTable('tags', {
  tagId: serial('tag_id').primaryKey(),
  tag: varchar('tag', { length: 20 }).notNull().unique(),
});

export const userTags = pgTable(
  'user_tags',
  {
    userId: uuid('user_id').references(() => userAccounts.userId),
    tagId: serial('tag_id').references(() => tags.tagId),
  },
  (userTag) => [unique('unique_user_tag').on(userTag.userId, userTag.tagId)]
);

export const event = pgTable('crowdfund_event', {
  eventId: uuid('event_id').defaultRandom().primaryKey(),
  locationId: varchar('location_id', { length: 255 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  eventDescription: text('event_description').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  targetAmount: decimal('target_amount', { precision: 10, scale: 2 }).notNull(),
});

export const eventTags = pgTable(
  'event_tags',
  {
    eventId: uuid('event_id').references(() => event.eventId),
    tagId: serial('tag_id').references(() => tags.tagId),
  },
  (eventTag) => [unique('unique_user_tag').on(eventTag.eventId, eventTag.tagId)]
);

export const contributions = pgTable(
  'contributions',
  {
    userId: uuid('user_id').references(() => userAccounts.userId),
    eventId: uuid('event_id').references(() => event.eventId),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    contributedAt: timestamp('contributed_at').defaultNow(),
  },
  (contributionEntry) => [
    unique().on(contributionEntry.userId, contributionEntry.eventId),
  ]
);
