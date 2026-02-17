import { pgTable, integer, decimal, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { cinemaFormats } from './cinema-formats-schema';
import { movies } from './movies-schema';

// ==========================================
//  MOVIE FORMAT MAP (Junction)
// ==========================================

export const movieFormatMap = pgTable('movie_format_map', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  movieId: integer('movie_id')
    .notNull()
    .references(() => movies.id, { onDelete: 'cascade' }),
  cinemaFormatId: integer('cinema_format_id')
    .notNull()
    .references(() => cinemaFormats.id, { onDelete: 'cascade' }),
  priceAdjustment: decimal('price_adjustment', { precision: 10, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const movieFormatMapRelations = relations(movieFormatMap, ({ one }) => ({
  movie: one(movies, {
    fields: [movieFormatMap.movieId],
    references: [movies.id],
  }),
  cinemaFormat: one(cinemaFormats, {
    fields: [movieFormatMap.cinemaFormatId],
    references: [cinemaFormats.id],
  }),
}));
