"use server";

import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { destroySessionsEverywhere } from "@/lib/cross-module-sso";

/**
 * Centralized logout: destroys this account's session in EVERY panel (not
 * just Admin's own), on every device — see `cross-module-sso.ts`. Redirects
 * to `/admin/login` specifically (not the generic `/workspace/login`) since Admin
 * is the one panel gated on a real privilege boundary (`super_admin` only) —
 * a deliberate exception, not an oversight.
 */
export async function adminLogoutAction(): Promise<void> {
  const user = await getCurrentAdminUser();
  if (user && ObjectId.isValid(user.id)) {
    await destroySessionsEverywhere(new ObjectId(user.id));
  }
  redirect("/admin/login");
}
