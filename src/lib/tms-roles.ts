/**
 * TMS (Training Management System) role model. Like the HRMS and PMS panels,
 * TMS access is gated on the shared `admin_users.roles` array — there is no
 * separate TMS user store. An account can sign into `/tms` only if it carries
 * at least one of these roles (see `verifyTmsCredentials` in `tms-auth.ts`).
 *
 * `super_admin` is the same literal used by the LMS / HRMS / PMS panels and
 * implicitly grants full TMS access.
 */

export const TMS_ROLES = ["super_admin", "tms_admin", "tms_manager", "mentor", "training_student"] as const;

export type TmsRole = (typeof TMS_ROLES)[number];

/** Roles that open the full staff panel (dashboard, programs, batches, students…). */
export const TMS_STAFF_ROLES: TmsRole[] = ["super_admin", "tms_admin", "tms_manager", "mentor"];

export const TMS_ROLE_META: Record<TmsRole, { label: string; description: string }> = {
  super_admin: {
    label: "Super Admin",
    description: "Full access: programs, batches, students, finance, certificates, settings and the audit log.",
  },
  tms_admin: {
    label: "TMS Admin",
    description: "Run every program and batch, manage students, issue certificates, configure settings and payments.",
  },
  tms_manager: {
    label: "Training Manager",
    description: "Manage programs, batches, applications, students, classes, projects and assignments. No finance or settings.",
  },
  mentor: {
    label: "Mentor",
    description: "Deliver assigned batches — classes, assignments and project reviews. No CRM edits or finance.",
  },
  training_student: {
    label: "Student",
    description: "Self-service portal only — enrolled program, batch, schedule, assignments, certificates and payments.",
  },
};

export function isTmsRole(value: unknown): value is TmsRole {
  return typeof value === "string" && (TMS_ROLES as readonly string[]).includes(value);
}

/** Normalises an arbitrary stored value into a clean, de-duplicated role list. */
export function normalizeTmsRoles(value: unknown): TmsRole[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter(isTmsRole)));
}

/** Can open the TMS panel at `/tms/*` (staff panel or student portal). */
export function hasTmsAccess(roles: readonly string[] | undefined | null): boolean {
  return normalizeTmsRoles(roles).length > 0;
}

/** Can open the full staff panel (dashboard, programs, batches, students, settings). */
export function hasTmsStaffRole(roles: readonly TmsRole[]): boolean {
  return roles.some((r) => TMS_STAFF_ROLES.includes(r));
}

/** Only the `training_student` role — belongs in the `/tms/me` portal. */
export function isStudentOnly(roles: readonly TmsRole[]): boolean {
  return roles.length > 0 && !hasTmsStaffRole(roles);
}

export function isTmsAdmin(roles: readonly TmsRole[]): boolean {
  return roles.includes("super_admin") || roles.includes("tms_admin");
}

/** Full delivery-operations access: programs, batches, applications, students, classes, projects. */
export function canManageTraining(roles: readonly TmsRole[]): boolean {
  return roles.includes("super_admin") || roles.includes("tms_admin") || roles.includes("tms_manager");
}

/** Create / edit / archive any program or batch. */
export function canManageProgramsBatches(roles: readonly TmsRole[]): boolean {
  return canManageTraining(roles);
}

/** Create / edit students + move applications through the pipeline. */
export function canManageStudents(roles: readonly TmsRole[]): boolean {
  return canManageTraining(roles);
}

/** Issue, reissue and revoke certificates. */
export function canIssueCertificates(roles: readonly TmsRole[]): boolean {
  return isTmsAdmin(roles);
}

/** Record payments, edit fee structures and view revenue analytics. */
export function canManagePayments(roles: readonly TmsRole[]): boolean {
  return isTmsAdmin(roles);
}

/** Edit TMS settings (categories, technology suggestions, institute identity). */
export function canManageSettings(roles: readonly TmsRole[]): boolean {
  return isTmsAdmin(roles);
}

/** Read the audit log. */
export function canViewAuditLog(roles: readonly TmsRole[]): boolean {
  return isTmsAdmin(roles);
}

export function primaryTmsRoleLabel(roles: readonly TmsRole[]): string {
  if (roles.includes("super_admin")) return TMS_ROLE_META.super_admin.label;
  if (roles.includes("tms_admin")) return TMS_ROLE_META.tms_admin.label;
  if (roles.includes("tms_manager")) return TMS_ROLE_META.tms_manager.label;
  if (roles.includes("mentor")) return TMS_ROLE_META.mentor.label;
  if (roles.includes("training_student")) return TMS_ROLE_META.training_student.label;
  return "No Access";
}
