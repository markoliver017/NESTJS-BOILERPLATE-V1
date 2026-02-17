import { pgTable, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { cinemaFormats } from './cinema-formats-schema';
import { cinemas } from './cinemas-schema';

// ==========================================
//  CINEMA FORMAT MAP (Junction)
// ==========================================

export const cinemaFormatMap = pgTable('cinema_format_map', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  cinemaId: integer('cinema_id')
    .notNull()
    .references(() => cinemas.id, { onDelete: 'cascade' }),
  cinemaFormatId: integer('cinema_format_id')
    .notNull()
    .references(() => cinemaFormats.id, { onDelete: 'cascade' }),
  seatCount: integer('seat_count'),
  isPrimary: boolean('is_primary').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const cinemaFormatMapRelations = relations(
  cinemaFormatMap,
  ({ one }) => ({
    cinema: one(cinemas, {
      fields: [cinemaFormatMap.cinemaId],
      references: [cinemas.id],
    }),
    cinemaFormat: one(cinemaFormats, {
      fields: [cinemaFormatMap.cinemaFormatId],
      references: [cinemaFormats.id],
    }),
  }),
);
