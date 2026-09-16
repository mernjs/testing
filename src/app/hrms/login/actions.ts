"use server";

import { redirect } from "next/navigation";
import {
  verifyHrmsCredentials,
  createHrmsSession,
  setHrmsSessionCookie,
  getSessionHrmsUser,
} from "@/lib/hrms-auth";
import { hasStaffRole } from "@/lib/hrms-roles";
import { provisionAccessibleSessions } from "@/lib/cross-module-sso";

export interface HrmsLoginState {
  error?: string;
}

export async function hrmsLoginAction(_prevState: HrmsLoginState, formData: FormData): Promise<HrmsLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifyHrmsCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createHrmsSession(result.adminId);
  await setHrmsSessionCookie(token);

  // Mint a real session in every other panel this account's roles actually
  // grant access to, so no separate login is needed to open them.
  await provisionAccessibleSessions(result.adminId, "hrms");

  const user = await getSessionHrmsUser(token);
  if (user?.mustChangePassword) redirect("/hrms/change-password");
  if (user && hasStaffRole(user.roles)) redirect("/hrms");
  redirect("/hrms/me");
}
