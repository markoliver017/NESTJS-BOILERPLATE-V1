import {
  pgTable,
  integer,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { theaters } from './theaters-schema';

// ==========================================
//  THEATER GROUPS
// ==========================================

export const theaterGroups = pgTable('theater_groups', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 120 }).notNull(),
  shortCode: varchar('short_code', { length: 10 }).notNull().unique(),
  logoUrl: varchar('logo_url', { length: 255 }),
  website: varchar('website', { length: 255 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const theaterGroupsRelations = relations(theaterGroups, ({ many }) => ({
  theaters: many(theaters),
}));
