"use server";

import { revalidatePath } from "next/cache";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { setCompanyStatus, type SetStatusResult } from "@/lib/platform/console/companies";

export async function setCompanyStatusAction(companyId: string, status: string): Promise<SetStatusResult> {
  const user = await requirePlatformAdmin();
  if (status !== "active" && status !== "suspended") return { ok: false, error: "Unknown status." };
  const res = await setCompanyStatus(String(companyId), status, user.id);
  if (res.ok) revalidatePath("/console", "layout");
  return res;
}
