import { SetMetadata } from '@nestjs/common';

export type UserRole =
  | 'checker'
  | 'agency_admin'
  | 'production_viewer'
  | 'system_admin';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
