import {
  pgTable,
  integer,
  varchar,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
//  MOVIE PRODUCTION COMPANIES
// ==========================================

export const movieProductionCompanies = pgTable('movie_production_companies', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 120 }).notNull(),
  shortCode: varchar('short_code', { length: 20 }),
  contactName: varchar('contact_name', { length: 120 }),
  contactEmail: varchar('contact_email', { length: 120 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const movieProductionCompaniesRelations = relations(
  movieProductionCompanies,
  ({ many }) => ({
    movies: many('movies' as any),
    checkerAuthorizations: many('checkerProductionCompanies' as any),
    taxRuleOverrides: many('cinemaProductionTaxRules' as any),
    reportSchedules: many('productionReportSchedules' as any),
  }),
);
