import {
  pgTable,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth-schema';

export const auditTrails = pgTable('audit_trails', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  // UUID handling in MySQL is usually done via varchar(36)
  userId: text('user_id')
    .notNull()
    // This handles the onDelete: 'CASCADE' logic at the database level
    .references(() => user.id, { onDelete: 'cascade' }),

  controller: varchar('controller', { length: 255 }).notNull(),
  action: varchar('action', { length: 255 }).notNull(),

  isError: boolean('is_error').default(false),

  details: text('details'),

  // 45 is standard length for IPv6 support
  ipAddress: varchar('ip_address', { length: 255 }),

  // Sequelize STRING defaults to 255.
  // If your User Agents are longer, consider using text() instead.
  userAgent: varchar('user_agent', { length: 255 }),

  stackTrace: text('stack_trace'),

  // Drizzle equivalent of { timestamps: true }
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Define Application-level Relations
export const auditTrailRelations = relations(auditTrails, ({ one }) => ({
  user: one(user, {
    fields: [auditTrails.userId],
    references: [user.id],
  }),
}));
