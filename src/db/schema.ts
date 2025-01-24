import {
  pgTable,
  varchar,
  uuid,
  unique,
  text,
  decimal,
  timestamp,
  boolean,
  smallint,
} from 'drizzle-orm/pg-core';

export const userAccounts = pgTable('user_account', {
  userId: varchar('user_id', { length: 255 }).primaryKey(),
  firstname: varchar('firstname', { length: 20 }).notNull(),
  lastname: varchar('lastname', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
});

export const friends = pgTable(
  'friends',
  {
    userId: varchar('userId', { length: 255 }).references(
      () => userAccounts.userId
    ),
    friendId: varchar('friendId', { length: 255 }).references(
      () => userAccounts.userId
    ),
  },
  (friendEntry) => [unique().on(friendEntry.userId, friendEntry.friendId)]
);

export const event = pgTable('event', {
  eventId: uuid('event_id').defaultRandom().primaryKey(),
  name: varchar('event_name', { length: 50 }).notNull(),
  eventDescription: text('event_description').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  locationId: varchar('location_id', { length: 255 }).notNull(),
  isCrowdfund: boolean('is_crowdfund').default(false),
  isVolunteer: boolean('is_volunteer').default(false),
  fundraisingGoal: decimal('fundraising_goal', {
    precision: 10,
    scale: 2,
  }).default('0.0'),
  fundsRaised: decimal('funds_raised', {
    precision: 10,
    scale: 2,
  }).default('0.0'),
  volunteerRoles: smallint('volunteer_roles').default(0),
});

export const contributions = pgTable(
  'user_contributions',
  {
    userId: varchar('user_id', { length: 255 }).references(
      () => userAccounts.userId
    ),
    eventId: uuid('event_id').references(() => event.eventId),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    contributedAt: timestamp('contributed_at').defaultNow(),
  },
  (contributionEntry) => [
    unique().on(contributionEntry.userId, contributionEntry.eventId),
  ]
);
