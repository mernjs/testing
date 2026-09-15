"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { setPortalUserStatus, forceLogoutPortalUser } from "@/lib/admin/portal-users";

function revalidate() {
  revalidatePath("/admin/portal/users");
}

export async function updatePortalUserStatusAction(id: string, status: "active" | "suspended"): Promise<{ ok: boolean }> {
  await requireAdminUser();
  const ok = await setPortalUserStatus(id, status);
  revalidate();
  return { ok };
}

export async function bulkUpdatePortalUserStatusAction(ids: string[], status: "active" | "suspended"): Promise<{ updated: number }> {
  await requireAdminUser();
  let updated = 0;
  for (const id of ids) {
    const ok = await setPortalUserStatus(id, status);
    if (ok) updated += 1;
  }
  revalidate();
  return { updated };
}

export async function forceLogoutPortalUserAction(id: string): Promise<{ sessionsCleared: number }> {
  await requireAdminUser();
  const sessionsCleared = await forceLogoutPortalUser(id);
  revalidate();
  return { sessionsCleared };
}
