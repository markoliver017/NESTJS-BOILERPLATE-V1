import {
  pgTable,
  integer,
  text,
  timestamp,
  date,
  decimal,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth-schema';
import { cinemas } from './cinemas-schema';
import { movies } from './movies-schema';

// ==========================================
//  DAILY SUMMARIES
// ==========================================

export const dailySummaries = pgTable('daily_summaries', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  cinemaId: integer('cinema_id')
    .notNull()
    .references(() => cinemas.id, { onDelete: 'cascade' }),
  movieId: integer('movie_id')
    .notNull()
    .references(() => movies.id, { onDelete: 'cascade' }),
  reportDate: date('report_date').notNull(),
  totalGross: decimal('total_gross', { precision: 12, scale: 2 }).notNull(),
  totalTax: decimal('total_tax', { precision: 12, scale: 2 }).notNull(),
  totalNet: decimal('total_net', { precision: 12, scale: 2 }).notNull(),
  approvedBy: text('approved_by').references(() => user.id, {
    onDelete: 'set null',
  }),
  approvedAt: timestamp('approved_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const dailySummariesRelations = relations(dailySummaries, ({ one }) => ({
  cinema: one(cinemas, {
    fields: [dailySummaries.cinemaId],
    references: [cinemas.id],
  }),
  movie: one(movies, {
    fields: [dailySummaries.movieId],
    references: [movies.id],
  }),
  approver: one(user, {
    fields: [dailySummaries.approvedBy],
    references: [user.id],
  }),
}));
