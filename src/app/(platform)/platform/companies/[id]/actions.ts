"use server";

import { revalidatePath } from "next/cache";
import { checkPlatformPermission } from "@/lib/platform/console/access";
import { recordPlatformAudit } from "@/lib/platform/audit";
import { getCompany } from "@/lib/platform/tenancy/companies";
import { setCompanyStatus, type SetStatusResult } from "@/lib/platform/console/companies";

export async function setCompanyStatusAction(companyId: string, status: string): Promise<SetStatusResult> {
  const auth = await checkPlatformPermission("companies.status");
  if (!auth.ok) return auth;
  if (status !== "active" && status !== "suspended") return { ok: false, error: "Unknown status." };
  const id = String(companyId);
  const before = await getCompany(id);
  const res = await setCompanyStatus(id, status, auth.user.id);
  if (res.ok) {
    await recordPlatformAudit({
      actorId: auth.user.id,
      action: status === "suspended" ? "company.suspend" : "company.activate",
      target: { type: "company", id },
      companyId: id,
      details: { name: before?.name ?? null, from: before?.status ?? null, to: status },
    });
    revalidatePath("/platform", "layout");
  }
  return res;
}
