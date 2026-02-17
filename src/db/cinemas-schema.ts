import {
  pgTable,
  integer,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { theaters } from './theaters-schema';

import { ticketTypes } from './ticket-types-schema';
import { checkerAttendance } from './checker-attendance-schema';
import { hourlyReports } from './hourly-reports-schema';
import { dailySummaries } from './daily-summaries-schema';

// ==========================================
//  CINEMAS
// ==========================================

export const cinemas = pgTable('cinemas', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  theaterId: integer('theater_id')
    .notNull()
    .references(() => theaters.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 120 }).notNull(),

  geofenceRadius: integer('geofence_radius').notNull().default(100),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const cinemasRelations = relations(cinemas, ({ one, many }) => ({
  theater: one(theaters, {
    fields: [cinemas.theaterId],
    references: [theaters.id],
  }),

  ticketTypes: many(ticketTypes),
  checkerAttendance: many(checkerAttendance),
  hourlyReports: many(hourlyReports),
  dailySummaries: many(dailySummaries),
  formatMappings: many('cinemaFormatMap' as any),
  taxRuleOverrides: many('cinemaProductionTaxRules' as any),
}));
