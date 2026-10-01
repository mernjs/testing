import "server-only";
import { accessibleAreas } from "@/lib/platform/access";
import { getEntitlements } from "@/lib/platform/billing/entitlements";
import { enabledModules } from "@/lib/platform/onboarding/state";
import { canManageExpenses, canManageFinance, canManageProcurement } from "@/lib/prms-roles";
import type { AccessGrant, EntityDef, IntelArea } from "@/lib/intelligence/catalog/types";

/**
 * Who may read which entity. Nothing here invents a rule: every area is the
 * company-wide tier an existing panel already uses.
 *  - leads, clients, projects, tasks, invoices, employees, leave: `accessibleAreas()`
 *    (platform/access.ts) — plan + enabled panel + role tier; the same rule behind the
 *    Staff Hub KPIs, global search and the "Ask about your business" box. People whose
 *    panel role is the self-service tier (employee portals) get nothing company-wide.
 *  - procurement (vendors, purchase orders): PRMS `canManageProcurement` or `canManageFinance`.
 *  - expenses: PRMS `canManageExpenses` (admin, procurement manager, finance). Department
 *    managers only see their own department's expenses in PRMS, so they get none here.
 * Both PRMS rules honour the Super Admin's permission overrides, and the PRMS panel must be in the plan and enabled.
 */

export interface IntelAccessUser {
  roles: readonly string[];
  permissionOverrides?: Record<string, boolean> | null;
}

export async function intelAreas(user: IntelAccessUser): Promise<Set<IntelArea>> {
  const out = new Set<IntelArea>(await accessibleAreas(user));
  const [entitlements, enabled] = await Promise.all([getEntitlements(), enabledModules()]);
  const prmsOn = (entitlements.modules === null || entitlements.modules.has("prms")) && (!enabled || enabled.has("prms"));
  if (prmsOn) {
    const ctx = { roles: user.roles, permissionOverrides: user.permissionOverrides ?? null };
    if (canManageProcurement(ctx) || canManageFinance(ctx)) out.add("procurement");
    if (canManageExpenses(ctx)) out.add("expenses");
  }
  return out;
}

/**
 * What the user may see of an entity: null = nothing; "all" = every non-sensitive field;
 * otherwise only the listed fields (union of the grants they hold).
 */
export function grantedFields(def: Pick<EntityDef, "access">, areas: ReadonlySet<IntelArea>): "all" | ReadonlySet<string> | null {
  let any = false;
  const subset = new Set<string>();
  for (const g of def.access as readonly AccessGrant[]) {
    if (!areas.has(g.area)) continue;
    if (!g.fields) return "all";
    any = true;
    for (const f of g.fields) subset.add(f);
  }
  return any ? subset : null;
}
