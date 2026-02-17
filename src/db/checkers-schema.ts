import {
  pgTable,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  date,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth-schema';
import { agencies } from './agencies-schema';

// ==========================================
//  CHECKERS
// ==========================================

export const checkers = pgTable('checkers', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  agencyId: integer('agency_id')
    .notNull()
    .references(() => agencies.id, { onDelete: 'cascade' }),
  fullName: varchar('full_name', { length: 120 }).notNull(),
  contactNo: varchar('contact_no', { length: 20 }),
  address: text('address'),
  employmentDate: date('employment_date').notNull(),
  endDate: date('end_date'),
  isActive: boolean('is_active').notNull().default(true),
  idPhotoUrl: varchar('id_photo_url', { length: 255 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const checkersRelations = relations(checkers, ({ one, many }) => ({
  user: one(user, {
    fields: [checkers.userId],
    references: [user.id],
  }),
  agency: one(agencies, {
    fields: [checkers.agencyId],
    references: [agencies.id],
  }),
  productionCompanyAuthorizations: many('checkerProductionCompanies' as any),
}));
