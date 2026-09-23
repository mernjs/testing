"use server";

import { redirect } from "next/navigation";
import {
  verifySopCredentials,
  createSopSession,
  setSopSessionCookie,
  getSessionSopUser,
} from "@/lib/sop-auth";
import { provisionAccessibleSessions } from "@/lib/cross-module-sso";

export interface SopLoginState {
  error?: string;
}

export async function sopLoginAction(_prevState: SopLoginState, formData: FormData): Promise<SopLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifySopCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createSopSession(result.adminId);
  await setSopSessionCookie(token);

  // Mint a real session in every other panel this account's roles actually
  // grant access to, so no separate login is needed to open them.
  await provisionAccessibleSessions(result.adminId, "sop");

  const user = await getSessionSopUser(token);
  if (user?.mustChangePassword) redirect("/sop/change-password");
  redirect("/sop");
}
