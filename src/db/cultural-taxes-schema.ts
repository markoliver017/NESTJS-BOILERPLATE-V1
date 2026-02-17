import {
  pgTable,
  integer,
  varchar,
  decimal,
  boolean,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { culturalTaxAmountTypeEnum } from './enums';

// ==========================================
//  CULTURAL TAXES
// ==========================================

export const culturalTaxes = pgTable('cultural_taxes', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 120 }).notNull(),
  city: varchar('city', { length: 80 }),
  province: varchar('province', { length: 80 }),
  amountType: culturalTaxAmountTypeEnum('amount_type').notNull(),
  deductionValue: decimal('deduction_value', {
    precision: 10,
    scale: 4,
  }).notNull(),
  effectivityDate: date('effectivity_date').notNull(),
  expiryDate: date('expiry_date'),
  memoReference: varchar('memo_reference', { length: 120 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const culturalTaxesRelations = relations(culturalTaxes, ({ many }) => ({
  ticketTypes: many('ticketTypes' as any),
}));
