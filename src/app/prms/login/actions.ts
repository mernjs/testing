"use server";

import { redirect } from "next/navigation";
import {
  verifyPrmsCredentials,
  createPrmsSession,
  setPrmsSessionCookie,
  getSessionPrmsUser,
} from "@/lib/prms-auth";
import { hasPrmsStaffRole } from "@/lib/prms-roles";
import { provisionAccessibleSessions } from "@/lib/cross-module-sso";

export interface PrmsLoginState {
  error?: string;
}

export async function prmsLoginAction(_prevState: PrmsLoginState, formData: FormData): Promise<PrmsLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifyPrmsCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createPrmsSession(result.adminId);
  await setPrmsSessionCookie(token);

  // Mint a real session in every other panel this account's roles actually
  // grant access to, so no separate login is needed to open them.
  await provisionAccessibleSessions(result.adminId, "prms");

  const user = await getSessionPrmsUser(token);
  if (user?.mustChangePassword) redirect("/prms/change-password");
  if (user && !hasPrmsStaffRole(user.roles)) redirect("/prms/me");
  redirect("/prms");
}
