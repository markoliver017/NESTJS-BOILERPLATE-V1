import {
  pgTable,
  integer,
  time,
  boolean,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { movieProductionCompanies } from './movie-production-companies-schema';

// ==========================================
//  PRODUCTION REPORT SCHEDULES
// ==========================================

export const productionReportSchedules = pgTable(
  'production_report_schedules',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    productionCompanyId: integer('production_company_id')
      .notNull()
      .references(() => movieProductionCompanies.id, { onDelete: 'cascade' }),
    slotTime: time('slot_time').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    notes: varchar('notes', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
);

export const productionReportSchedulesRelations = relations(
  productionReportSchedules,
  ({ one }) => ({
    productionCompany: one(movieProductionCompanies, {
      fields: [productionReportSchedules.productionCompanyId],
      references: [movieProductionCompanies.id],
    }),
  }),
);
