import { HRMS_ROLES, HRMS_ROLE_META } from "@/lib/hrms-roles";
import { PMS_ROLES, PMS_ROLE_META } from "@/lib/pms-roles";
import { PRMS_ROLES, PRMS_ROLE_META } from "@/lib/prms-roles";
import { TMS_ROLES, TMS_ROLE_META } from "@/lib/tms-roles";
import { CHAT_ROLES, CHAT_ROLE_META } from "@/lib/messenger-roles";

/**
 * Every real role literal that can appear in `admin_users.roles`, grouped by
 * the module that defines it — pulled directly from each module's own
 * `*-roles.ts` (the actual source of truth every login check reads), not a
 * separate/parallel list. `super_admin` is the one literal shared by every
 * module (it already implicitly grants full access everywhere — see each
 * module's own role file) so it's shown once, not repeated per group.
 *
 * `/lms` (CRM) has no role gate at all — any `admin_users` account can sign
 * in there, so it isn't a group here.
 */

export interface RoleOption {
  value: string;
  label: string;
  description: string;
}

export interface RoleGroup {
  module: string;
  roles: RoleOption[];
}

function group<T extends string>(
  moduleLabel: string,
  all: readonly T[],
  meta: Record<T, { label: string; description: string }>
): RoleGroup {
  return {
    module: moduleLabel,
    roles: all.filter((r) => r !== "super_admin").map((r) => ({ value: r, ...meta[r] })),
  };
}

export const ROLE_GROUPS: RoleGroup[] = [
  group("HRMS", HRMS_ROLES, HRMS_ROLE_META),
  group("PMS (Projects)", PMS_ROLES, PMS_ROLE_META),
  group("Procurement", PRMS_ROLES, PRMS_ROLE_META),
  group("Training", TMS_ROLES, TMS_ROLE_META),
  group("YashChat", CHAT_ROLES, CHAT_ROLE_META),
];

export const ALL_KNOWN_ROLES: string[] = [
  "super_admin",
  ...ROLE_GROUPS.flatMap((g) => g.roles.map((r) => r.value)),
];

export function moduleLabelsForRoles(roles: string[]): string[] {
  if (roles.includes("super_admin")) return ["Super Admin (all modules)"];
  const labels: string[] = [];
  for (const g of ROLE_GROUPS) {
    if (g.roles.some((r) => roles.includes(r.value))) labels.push(g.module);
  }
  return labels;
}
