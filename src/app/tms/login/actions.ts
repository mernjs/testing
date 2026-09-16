"use server";

import { redirect } from "next/navigation";
import {
  verifyTmsCredentials,
  createTmsSession,
  setTmsSessionCookie,
  getSessionTmsUser,
} from "@/lib/tms-auth";
import { hasTmsStaffRole } from "@/lib/tms-roles";
import { provisionAccessibleSessions } from "@/lib/cross-module-sso";

export interface TmsLoginState {
  error?: string;
}

export async function tmsLoginAction(_prevState: TmsLoginState, formData: FormData): Promise<TmsLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifyTmsCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createTmsSession(result.adminId);
  await setTmsSessionCookie(token);

  // Mint a real session in every other panel this account's roles actually
  // grant access to, so no separate login is needed to open them.
  await provisionAccessibleSessions(result.adminId, "tms");

  const user = await getSessionTmsUser(token);
  if (user?.mustChangePassword) redirect("/tms/change-password");
  if (user && !hasTmsStaffRole(user.roles)) redirect("/tms/me");
  redirect("/tms");
}
