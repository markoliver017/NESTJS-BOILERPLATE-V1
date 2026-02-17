import { pgTable, integer, text, timestamp, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { checkers } from './checkers-schema';
import { movieProductionCompanies } from './movie-production-companies-schema';

// ==========================================
//  CHECKER PRODUCTION COMPANIES (Junction)
// ==========================================

export const checkerProductionCompanies = pgTable(
  'checker_production_companies',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    checkerId: integer('checker_id')
      .notNull()
      .references(() => checkers.id, { onDelete: 'cascade' }),
    productionCompanyId: integer('production_company_id')
      .notNull()
      .references(() => movieProductionCompanies.id, { onDelete: 'cascade' }),
    authorizedFrom: date('authorized_from').notNull(),
    authorizedUntil: date('authorized_until'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
  },
);

export const checkerProductionCompaniesRelations = relations(
  checkerProductionCompanies,
  ({ one }) => ({
    checker: one(checkers, {
      fields: [checkerProductionCompanies.checkerId],
      references: [checkers.id],
    }),
    productionCompany: one(movieProductionCompanies, {
      fields: [checkerProductionCompanies.productionCompanyId],
      references: [movieProductionCompanies.id],
    }),
  }),
);
