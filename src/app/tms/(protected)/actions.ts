"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { TMS_SESSION_COOKIE, destroyTmsSessionByToken, clearTmsSessionCookie } from "@/lib/tms-auth";

export async function tmsLogoutAction(): Promise<void> {
  const store = await cookies();
  const token = store.get(TMS_SESSION_COOKIE)?.value;
  if (token) await destroyTmsSessionByToken(token);
  await clearTmsSessionCookie();
  redirect("/tms/login");
}
