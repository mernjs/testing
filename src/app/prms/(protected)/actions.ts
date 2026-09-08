"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { PRMS_SESSION_COOKIE, destroyPrmsSessionByToken, clearPrmsSessionCookie } from "@/lib/prms-auth";

export async function prmsLogoutAction(): Promise<void> {
  const store = await cookies();
  const token = store.get(PRMS_SESSION_COOKIE)?.value;
  if (token) await destroyPrmsSessionByToken(token);
  await clearPrmsSessionCookie();
  redirect("/prms/login");
}
