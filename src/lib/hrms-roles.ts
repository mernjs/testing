/**
 * HRMS role model. Roles live on the shared `admin_users` document as a
 * `roles: string[]` array — there is no separate HRMS user store. An admin
 * account can only sign into the HRMS panel if it carries at least one of
 * these roles (see `verifyHrmsCredentials` in `hrms-auth.ts`).
 */

export const HRMS_ROLES = ["super_admin", "hr", "manager", "employee"] as const;

export type HrmsRole = (typeof HRMS_ROLES)[number];

/** Roles that grant access to the staff panel (`/hrms/*`). `employee` does not. */
export const STAFF_ROLES: HrmsRole[] = ["super_admin", "hr", "manager"];

export const HRMS_ROLE_META: Record<HrmsRole, { label: string; description: string }> = {
  super_admin: {
    label: "Super Admin",
    description: "Full access: employees, masters, payroll, audit logs, and settings.",
  },
  hr: {
    label: "HR",
    description: "Manage employees, departments, designations, teams and payroll.",
  },
  manager: {
    label: "Manager",
    description: "View and update only their own reporting line. No payroll or master data.",
  },
  employee: {
    label: "Employee",
    description: "Self-service portal only — own attendance, leave, documents and payslips.",
  },
};

export function isHrmsRole(value: unknown): value is HrmsRole {
  return typeof value === "string" && (HRMS_ROLES as readonly string[]).includes(value);
}

/** Normalises an arbitrary stored value into a clean, de-duplicated role list. */
export function normalizeRoles(value: unknown): HrmsRole[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter(isHrmsRole)));
}

export function hasAnyHrmsRole(roles: readonly string[] | undefined | null): boolean {
  return normalizeRoles(roles).length > 0;
}

export function isSuperAdmin(roles: readonly HrmsRole[]): boolean {
  return roles.includes("super_admin");
}

/** Can open the staff panel at `/hrms/*` (dashboard, employees, payroll, …). */
export function hasStaffRole(roles: readonly HrmsRole[]): boolean {
  return roles.some((r) => STAFF_ROLES.includes(r));
}

/** Only has the `employee` role — belongs in the `/hrms/me` portal. */
export function isEmployeeOnly(roles: readonly HrmsRole[]): boolean {
  return roles.length > 0 && !hasStaffRole(roles);
}

/** Run payroll, approve runs, mark paid, download the bank file. */
export function canRunPayroll(roles: readonly HrmsRole[]): boolean {
  return roles.includes("super_admin") || roles.includes("hr");
}

/** Upload / replace / delete documents on any employee. */
export function canManageEmployeeDocuments(roles: readonly HrmsRole[]): boolean {
  return roles.includes("super_admin") || roles.includes("hr");
}

/** Edit statutory payroll rates + tax config. */
export function canManagePayrollConfig(roles: readonly HrmsRole[]): boolean {
  return roles.includes("super_admin");
}

/** Create / edit / delete employees, change employment status. */
export function canManageEmployees(roles: readonly HrmsRole[]): boolean {
  return roles.includes("super_admin") || roles.includes("hr");
}

/** Create / edit / delete departments, designations and teams. */
export function canManageMasters(roles: readonly HrmsRole[]): boolean {
  return roles.includes("super_admin") || roles.includes("hr");
}

/** View and edit salary structure and bank details. */
export function canManagePayroll(roles: readonly HrmsRole[]): boolean {
  return roles.includes("super_admin") || roles.includes("hr");
}

/** See every employee vs. only the signed-in manager's reporting line. */
export function canViewAllEmployees(roles: readonly HrmsRole[]): boolean {
  return roles.includes("super_admin") || roles.includes("hr");
}

/** Read the audit trail. */
export function canViewAuditLog(roles: readonly HrmsRole[]): boolean {
  return roles.includes("super_admin");
}

/** Record / correct attendance. Managers are scoped to their reporting line. */
export function canManageAttendance(roles: readonly HrmsRole[]): boolean {
  return roles.includes("super_admin") || roles.includes("hr") || roles.includes("manager");
}

/** File and decide leave requests. Managers are scoped to their reporting line. */
export function canApproveLeave(roles: readonly HrmsRole[]): boolean {
  return roles.includes("super_admin") || roles.includes("hr") || roles.includes("manager");
}

/** Create / edit / delete holidays. */
export function canManageHolidays(roles: readonly HrmsRole[]): boolean {
  return roles.includes("super_admin") || roles.includes("hr");
}

/** Edit the org-wide work schedule and leave-type configuration. */
export function canManageSettings(roles: readonly HrmsRole[]): boolean {
  return roles.includes("super_admin");
}

export function primaryRoleLabel(roles: readonly HrmsRole[]): string {
  if (roles.includes("super_admin")) return HRMS_ROLE_META.super_admin.label;
  if (roles.includes("hr")) return HRMS_ROLE_META.hr.label;
  if (roles.includes("manager")) return HRMS_ROLE_META.manager.label;
  if (roles.includes("employee")) return HRMS_ROLE_META.employee.label;
  return "No Access";
}
