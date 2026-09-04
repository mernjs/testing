"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SESSION_COOKIE, destroySessionByToken, clearSessionCookie } from "@/lib/admin-auth";

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await destroySessionByToken(token);
  }
  await clearSessionCookie();
  redirect("/admin/login");
}
