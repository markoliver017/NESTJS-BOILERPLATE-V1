import {
  pgTable,
  integer,
  varchar,
  boolean,
  timestamp,
  decimal,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { cinemas } from './cinemas-schema';
import { culturalTaxes } from './cultural-taxes-schema';

// ==========================================
//  TICKET TYPES
// ==========================================

export const ticketTypes = pgTable('ticket_types', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  cinemaId: integer('cinema_id')
    .notNull()
    .references(() => cinemas.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 80 }).notNull(),
  basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 })
    .notNull()
    .default('0.00'),
  discountPct: decimal('discount_pct', { precision: 5, scale: 4 }),
  isTaxable: boolean('is_taxable').notNull().default(true),
  culturalTaxId: integer('cultural_tax_id').references(() => culturalTaxes.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const ticketTypesRelations = relations(ticketTypes, ({ one, many }) => ({
  cinema: one(cinemas, {
    fields: [ticketTypes.cinemaId],
    references: [cinemas.id],
  }),
  culturalTax: one(culturalTaxes, {
    fields: [ticketTypes.culturalTaxId],
    references: [culturalTaxes.id],
  }),
  hourlyTicketEntries: many('hourlyTicketEntries' as any),
}));
