import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==========================================
//  CINEMA FORMATS
// ==========================================

export const cinemaFormats = pgTable('cinema_formats', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  code: varchar('code', { length: 20 }).notNull().unique(),
  label: varchar('label', { length: 60 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const cinemaFormatsRelations = relations(cinemaFormats, ({ many }) => ({
  cinemaFormatMappings: many('cinemaFormatMap' as any),
  movieFormatMappings: many('movieFormatMap' as any),
}));
