// Role type definition for type safety across the application
export type UserRole =
  | 'checker'
  | 'agency_admin'
  | 'production_viewer'
  | 'system_admin';

// Role display names
export const ROLE_LABELS: Record<UserRole, string> = {
  checker: 'Cinema Checker',
  agency_admin: 'Agency Administrator',
  production_viewer: 'Production Viewer',
  system_admin: 'System Administrator',
};

// Role permissions
export const ROLE_PERMISSIONS = {
  system_admin: [
    'manage_agencies',
    'manage_users',
    'manage_cinemas',
    'manage_tax_rules',
    'manage_ticket_types',
    'manage_movies',
    'view_all_reports',
    'approve_reports',
  ],
  agency_admin: [
    'manage_cinemas',
    'manage_ticket_types',
    'view_attendance',
    'approve_reports',
    'reject_reports',
    'override_reports',
    'view_audit_logs',
  ],
  checker: [
    'time_in',
    'submit_hourly_reports',
    'view_own_reports',
    'view_own_attendance',
  ],
  production_viewer: [
    'view_approved_reports',
    'view_daily_summaries',
    'view_cumulative_reports',
    'download_reports',
  ],
} as const;

// Helper function to check if user has permission
export function hasPermission(userRole: UserRole, permission: string): boolean {
  return (
    (ROLE_PERMISSIONS[userRole] as readonly string[])?.includes(permission) ??
    false
  );
}
