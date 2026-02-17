import { pgTable, integer, text, timestamp, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { taxRules } from './tax-rules-schema';
import { movieProductionCompanies } from './movie-production-companies-schema';
import { cinemas } from './cinemas-schema';

// ==========================================
//  CINEMA PRODUCTION TAX RULES (Override Junction)
// ==========================================

export const cinemaProductionTaxRules = pgTable('cinema_production_tax_rules', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  cinemaId: integer('cinema_id')
    .notNull()
    .references(() => cinemas.id, { onDelete: 'cascade' }),
  productionCompanyId: integer('production_company_id')
    .notNull()
    .references(() => movieProductionCompanies.id, { onDelete: 'cascade' }),
  taxRuleId: integer('tax_rule_id')
    .notNull()
    .references(() => taxRules.id, { onDelete: 'restrict' }),
  effectiveDate: date('effective_date').notNull(),
  expiryDate: date('expiry_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const cinemaProductionTaxRulesRelations = relations(
  cinemaProductionTaxRules,
  ({ one }) => ({
    cinema: one(cinemas, {
      fields: [cinemaProductionTaxRules.cinemaId],
      references: [cinemas.id],
    }),
    productionCompany: one(movieProductionCompanies, {
      fields: [cinemaProductionTaxRules.productionCompanyId],
      references: [movieProductionCompanies.id],
    }),
    taxRule: one(taxRules, {
      fields: [cinemaProductionTaxRules.taxRuleId],
      references: [taxRules.id],
    }),
  }),
);
