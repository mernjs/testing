"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PMS_SESSION_COOKIE, destroyPmsSessionByToken, clearPmsSessionCookie } from "@/lib/pms-auth";

export async function pmsLogoutAction(): Promise<void> {
  const store = await cookies();
  const token = store.get(PMS_SESSION_COOKIE)?.value;
  if (token) await destroyPmsSessionByToken(token);
  await clearPmsSessionCookie();
  redirect("/pms/login");
}
