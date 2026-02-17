import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  decimal,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { formulaTypeEnum } from './enums';

// ==========================================
//  TAX RULES
// ==========================================

export const taxRules = pgTable('tax_rules', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  formulaType: formulaTypeEnum('formula_type').notNull(),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).notNull(),
  divisor: decimal('divisor', { precision: 5, scale: 2 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const taxRulesRelations = relations(taxRules, ({ many }) => ({
  cinemas: many('cinemas' as any),
  theaters: many('theaters' as any),
}));
