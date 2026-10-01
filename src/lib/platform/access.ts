import "server-only";
import { getEntitlements } from "@/lib/platform/billing/entitlements";
import { enabledModules } from "@/lib/platform/onboarding/state";
import type { EventArea } from "@/lib/platform/events/catalog";
import { hasLmsAccess } from "@/lib/lms-roles";
import { hasPmsStaffRole, normalizePmsRoles } from "@/lib/pms-roles";
import { canViewAllEmployees } from "@/lib/hrms-roles";
import { hasFmsAccess } from "@/lib/fms-roles";

/**
 * Which cross-panel areas a person may see company-wide data for — the one
 * rule behind the company KPIs, global search, recent activity and the AI
 * assistant. An area is visible only when its panel is in the company's plan,
 * switched on, AND the person's roles give them company-wide access there
 * (the same tier each panel uses for its own "see everything" views; people
 * with narrower access use the panel itself, which scopes to their own work).
 */

export interface AccessUser {
  id: string;
  email: string;
  roles: readonly string[];
}

export type Area = EventArea;

const AREA_MODULE: Record<Area, string> = { leads: "lms", clients: "pms", projects: "pms", tasks: "pms", invoices: "fms", employees: "hrms", leave: "hrms" };

function roleAllows(area: Area, roles: readonly string[]): boolean {
  if (roles.includes("super_admin")) return true;
  switch (area) {
    case "leads":
      return hasLmsAccess(roles);
    case "clients":
    case "projects":
    case "tasks":
      return hasPmsStaffRole(normalizePmsRoles([...roles]));
    case "invoices":
      return hasFmsAccess(roles);
    case "employees":
    case "leave":
      return canViewAllEmployees({ roles });
  }
}

export async function accessibleAreas(user: Pick<AccessUser, "roles">): Promise<Set<Area>> {
  const [entitlements, enabled] = await Promise.all([getEntitlements(), enabledModules()]);
  const out = new Set<Area>();
  for (const area of Object.keys(AREA_MODULE) as Area[]) {
    const moduleKey = AREA_MODULE[area];
    if (entitlements.modules !== null && !entitlements.modules.has(moduleKey)) continue;
    if (enabled && !enabled.has(moduleKey)) continue;
    if (roleAllows(area, user.roles)) out.add(area);
  }
  return out;
}
