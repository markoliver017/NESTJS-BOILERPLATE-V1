import {
  pgTable,
  integer,
  text,
  boolean,
  timestamp,
  decimal,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth-schema';
import { cinemas } from './cinemas-schema';

// ==========================================
//  CHECKER ATTENDANCE
// ==========================================

export const checkerAttendance = pgTable('checker_attendance', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  checkerId: text('checker_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  cinemaId: integer('cinema_id')
    .notNull()
    .references(() => cinemas.id, { onDelete: 'cascade' }),
  timeIn: timestamp('time_in').notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 8 }).notNull(),
  longitude: decimal('longitude', { precision: 11, scale: 8 }).notNull(),
  isValid: boolean('is_valid').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const checkerAttendanceRelations = relations(
  checkerAttendance,
  ({ one }) => ({
    checker: one(user, {
      fields: [checkerAttendance.checkerId],
      references: [user.id],
    }),
    cinema: one(cinemas, {
      fields: [checkerAttendance.cinemaId],
      references: [cinemas.id],
    }),
  }),
);
