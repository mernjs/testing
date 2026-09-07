/**
 * PMS (Project Management System) role model. Like the HRMS panel, PMS access
 * is gated on the shared `admin_users.roles` array — there is no separate PMS
 * user store. An account can sign into `/pms` only if it carries at least one
 * of these roles (see `verifyPmsCredentials` in `pms-auth.ts`).
 *
 * `super_admin` is the same literal used by the HRMS/LMS panels and implicitly
 * grants full PMS access.
 */

export const PMS_ROLES = ["super_admin", "pms_admin", "pms_manager"] as const;

export type PmsRole = (typeof PMS_ROLES)[number];

export const PMS_ROLE_META: Record<PmsRole, { label: string; description: string }> = {
  super_admin: {
    label: "Super Admin",
    description: "Full access: clients, projects, teams, settings and the activity log.",
  },
  pms_admin: {
    label: "PMS Admin",
    description: "Manage every client and project, configure settings, read the activity log.",
  },
  pms_manager: {
    label: "Project Manager",
    description: "Create and run projects, manage clients and project teams. No settings or audit.",
  },
};

export function isPmsRole(value: unknown): value is PmsRole {
  return typeof value === "string" && (PMS_ROLES as readonly string[]).includes(value);
}

/** Normalises an arbitrary stored value into a clean, de-duplicated role list. */
export function normalizePmsRoles(value: unknown): PmsRole[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter(isPmsRole)));
}

/** Can open the PMS panel at `/pms/*`. */
export function hasPmsAccess(roles: readonly string[] | undefined | null): boolean {
  return normalizePmsRoles(roles).length > 0;
}

export function isPmsAdmin(roles: readonly PmsRole[]): boolean {
  return roles.includes("super_admin") || roles.includes("pms_admin");
}

/** Create / edit / archive any client. */
export function canManageClients(roles: readonly PmsRole[]): boolean {
  return roles.length > 0; // every PMS role can manage clients
}

/** Create / edit / delete any project + manage any project's team. */
export function canManageProjects(roles: readonly PmsRole[]): boolean {
  return roles.length > 0;
}

/** See every project vs. only projects the user manages / is a member of. */
export function canViewAllProjects(roles: readonly PmsRole[]): boolean {
  return isPmsAdmin(roles);
}

/** Edit PMS settings (categories, default currency, technology suggestions). */
export function canManageSettings(roles: readonly PmsRole[]): boolean {
  return isPmsAdmin(roles);
}

/** Read the activity log. */
export function canViewActivityLog(roles: readonly PmsRole[]): boolean {
  return isPmsAdmin(roles);
}

export function primaryPmsRoleLabel(roles: readonly PmsRole[]): string {
  if (roles.includes("super_admin")) return PMS_ROLE_META.super_admin.label;
  if (roles.includes("pms_admin")) return PMS_ROLE_META.pms_admin.label;
  if (roles.includes("pms_manager")) return PMS_ROLE_META.pms_manager.label;
  return "No Access";
}
