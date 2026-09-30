"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { savePlan, setPlanActive, validatePlanInput } from "@/lib/platform/billing/plans";
import { parsePlanForm, type PlanFormErrors, type PlanFormValues } from "./planForm";

export type SavePlanActionResult = { ok: true; id: string; message: string } | { ok: false; error: string; fieldErrors?: PlanFormErrors };
export type PlanActiveActionResult = { ok: true; message: string } | { ok: false; error: string };

export async function savePlanAction(mode: "create" | "update", values: PlanFormValues): Promise<SavePlanActionResult> {
  await requirePlatformAdmin();
  if (mode !== "create" && mode !== "update") return { ok: false, error: "Unknown action." };
  if (!values || typeof values !== "object") return { ok: false, error: "Nothing to save." };
  const { input, errors } = parsePlanForm(values);
  if (Object.keys(errors).length > 0) {
    return { ok: false, error: "Fix the highlighted fields.", fieldErrors: { ...validatePlanInput(input, mode), ...errors } };
  }
  const res = await savePlan(input, mode);
  if (!res.ok) return res;
  revalidatePath("/console/plans", "layout");
  return { ok: true, id: res.plan._id, message: mode === "create" ? `Plan "${res.plan.name}" created.` : `Plan "${res.plan.name}" saved.` };
}

export async function setPlanActiveAction(id: string, active: boolean): Promise<PlanActiveActionResult> {
  await requirePlatformAdmin();
  const res = await setPlanActive(String(id), active === true);
  if (!res.ok) return res;
  revalidatePath("/console/plans", "layout");
  return { ok: true, message: active ? "Plan restored — it can be chosen again." : "Plan archived — companies already on it keep it." };
}
