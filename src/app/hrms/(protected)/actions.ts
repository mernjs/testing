"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { HRMS_SESSION_COOKIE, destroyHrmsSessionByToken, clearHrmsSessionCookie } from "@/lib/hrms-auth";

export async function hrmsLogoutAction(): Promise<void> {
  const store = await cookies();
  const token = store.get(HRMS_SESSION_COOKIE)?.value;
  if (token) await destroyHrmsSessionByToken(token);
  await clearHrmsSessionCookie();
  redirect("/hrms/login");
}
