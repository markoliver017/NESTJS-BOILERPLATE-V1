import { pgEnum } from 'drizzle-orm/pg-core';

// ==========================================
//  ENUMS
// ==========================================

export const userRoleEnum = pgEnum('user_role', [
  'checker',
  'agency_admin',
  'production_viewer',
  'system_admin',
  'user',
]);

export const formulaTypeEnum = pgEnum('formula_type', [
  'gross_based',
  'ticket_based',
  'custom',
]);

export const reportStatusEnum = pgEnum('report_status', [
  'pending',
  'approved',
  'rejected',
]);

export const culturalTaxAmountTypeEnum = pgEnum('cultural_tax_amount_type', [
  'fixed_amount',
  'percentage_of_discounted_price',
]);
