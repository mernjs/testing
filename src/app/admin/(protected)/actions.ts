"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, destroyAdminSessionByToken, clearAdminSessionCookie } from "@/lib/admin-auth";

export async function adminLogoutAction(): Promise<void> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) await destroyAdminSessionByToken(token);
  await clearAdminSessionCookie();
  redirect("/admin/login");
}
