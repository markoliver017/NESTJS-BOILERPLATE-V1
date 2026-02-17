import {
  pgTable,
  integer,
  text,
  timestamp,
  date,
  time,
  decimal,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth-schema';
import { cinemas } from './cinemas-schema';
import { movies } from './movies-schema';
import { reportStatusEnum } from './enums';
import { ticketTypes } from './ticket-types-schema';

// ==========================================
//  HOURLY REPORTS
// ==========================================

export const hourlyReports = pgTable('hourly_reports', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  cinemaId: integer('cinema_id')
    .notNull()
    .references(() => cinemas.id, { onDelete: 'cascade' }),
  movieId: integer('movie_id')
    .notNull()
    .references(() => movies.id, { onDelete: 'cascade' }),
  checkerId: text('checker_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  reportDate: date('report_date').notNull(),
  reportTime: time('report_time').notNull(),
  status: reportStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ==========================================
//  HOURLY TICKET ENTRIES
// ==========================================

export const hourlyTicketEntries = pgTable('hourly_ticket_entries', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  hourlyReportId: integer('hourly_report_id')
    .notNull()
    .references(() => hourlyReports.id, { onDelete: 'cascade' }),
  ticketTypeId: integer('ticket_type_id')
    .notNull()
    .references(() => ticketTypes.id, { onDelete: 'restrict' }),
  quantity: integer('quantity').notNull(),
  discountSnapshot: decimal('discount_snapshot', { precision: 10, scale: 2 })
    .notNull()
    .default('0.00'),
  culturalTaxSnapshot: decimal('cultural_tax_snapshot', {
    precision: 10,
    scale: 4,
  })
    .notNull()
    .default('0.0000'),
  effectivePrice: decimal('effective_price', {
    precision: 10,
    scale: 2,
  }).notNull(),
  grossAmount: decimal('gross_amount', { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).notNull(),
  netAmount: decimal('net_amount', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ==========================================
//  RELATIONS
// ==========================================

export const hourlyReportsRelations = relations(
  hourlyReports,
  ({ one, many }) => ({
    cinema: one(cinemas, {
      fields: [hourlyReports.cinemaId],
      references: [cinemas.id],
    }),
    movie: one(movies, {
      fields: [hourlyReports.movieId],
      references: [movies.id],
    }),
    checker: one(user, {
      fields: [hourlyReports.checkerId],
      references: [user.id],
    }),
    ticketEntries: many(hourlyTicketEntries),
  }),
);

export const hourlyTicketEntriesRelations = relations(
  hourlyTicketEntries,
  ({ one }) => ({
    hourlyReport: one(hourlyReports, {
      fields: [hourlyTicketEntries.hourlyReportId],
      references: [hourlyReports.id],
    }),
    ticketType: one(ticketTypes, {
      fields: [hourlyTicketEntries.ticketTypeId],
      references: [ticketTypes.id],
    }),
  }),
);
