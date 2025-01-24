import { db } from '../db/db';
import { userAccounts, friends, contributions } from '../db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import { sql } from 'drizzle-orm/sql';

const userId = 'abadlagal';

const now = new Date();
const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

// const friendEntries2 = db.select().from()

const friendEntries = db
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
  .toSQL();

console.log(friendEntries);
