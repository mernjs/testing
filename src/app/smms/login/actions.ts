"use server";

import { redirect } from "next/navigation";
import {
  verifySmmsCredentials,
  createSmmsSession,
  setSmmsSessionCookie,
  getSessionSmmsUser,
} from "@/lib/smms-auth";
import { provisionAccessibleSessions } from "@/lib/cross-module-sso";

export interface SmmsLoginState {
  error?: string;
}

export async function smmsLoginAction(_prevState: SmmsLoginState, formData: FormData): Promise<SmmsLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifySmmsCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createSmmsSession(result.adminId);
  await setSmmsSessionCookie(token);

  // Mint a real session in every other panel this account's roles actually
  // grant access to, so no separate login is needed to open them.
  await provisionAccessibleSessions(result.adminId, "smms");

  const user = await getSessionSmmsUser(token);
  if (user?.mustChangePassword) redirect("/smms/change-password");
  redirect("/smms");
}
