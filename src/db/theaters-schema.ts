import {
  pgTable,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  decimal,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { theaterGroups } from './theater-groups-schema';
import { taxRules } from './tax-rules-schema';

// ==========================================
//  THEATERS
// ==========================================

export const theaters = pgTable('theaters', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  theaterGroupId: integer('theater_group_id')
    .notNull()
    .references(() => theaterGroups.id, { onDelete: 'cascade' }),
  taxRuleId: integer('tax_rule_id')
    .notNull()
    .references(() => taxRules.id, { onDelete: 'restrict' }),
  name: varchar('name', { length: 150 }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 80 }).notNull(),
  province: varchar('province', { length: 80 }),
  latitude: decimal('latitude', { precision: 9, scale: 6 }).notNull(),
  longitude: decimal('longitude', { precision: 9, scale: 6 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const theatersRelations = relations(theaters, ({ one, many }) => ({
  theaterGroup: one(theaterGroups, {
    fields: [theaters.theaterGroupId],
    references: [theaterGroups.id],
  }),
  taxRule: one(taxRules, {
    fields: [theaters.taxRuleId],
    references: [taxRules.id],
  }),
  cinemas: many('cinemas' as any),
}));
