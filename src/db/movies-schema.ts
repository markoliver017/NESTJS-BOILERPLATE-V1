import {
  pgTable,
  integer,
  varchar,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { movieProductionCompanies } from './movie-production-companies-schema';

// ==========================================
//  MOVIES
// ==========================================

export const movies = pgTable('movies', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  productionCompanyId: integer('production_company_id')
    .notNull()
    .references(() => movieProductionCompanies.id, { onDelete: 'restrict' }),
  title: varchar('title', { length: 200 }).notNull(),
  distributor: varchar('distributor', { length: 120 }),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const moviesRelations = relations(movies, ({ one, many }) => ({
  productionCompany: one(movieProductionCompanies, {
    fields: [movies.productionCompanyId],
    references: [movieProductionCompanies.id],
  }),
  hourlyReports: many('hourlyReports' as any),
  dailySummaries: many('dailySummaries' as any),
  formatMappings: many('movieFormatMap' as any),
}));
