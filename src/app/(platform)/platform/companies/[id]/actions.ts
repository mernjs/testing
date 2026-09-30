"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { setCompanyStatus, type SetStatusResult } from "@/lib/platform/console/companies";
import { extendTrial } from "@/lib/platform/billing/trials";

export async function setCompanyStatusAction(companyId: string, status: string): Promise<SetStatusResult> {
  const user = await requirePlatformAdmin();
  if (status !== "active" && status !== "suspended") return { ok: false, error: "Unknown status." };
  const res = await setCompanyStatus(String(companyId), status, user.id);
  if (res.ok) revalidatePath("/platform", "layout");
  return res;
}

export async function extendTrialAction(companyId: string, days: number): Promise<{ ok: true; trialEndsAt: string } | { ok: false; error: string }> {
  const user = await requirePlatformAdmin();
  const res = await extendTrial(String(companyId), Number(days), user.id);
  if (!res.ok) return res;
  revalidatePath("/platform", "layout");
  return { ok: true, trialEndsAt: res.trialEndsAt.toISOString() };
}
