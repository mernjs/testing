"use server";

import { redirect } from "next/navigation";
import {
  verifyOtsCredentials,
  createOtsSession,
  setOtsSessionCookie,
  getSessionOtsUser,
} from "@/lib/ots-auth";
import { provisionAccessibleSessions } from "@/lib/cross-module-sso";

export interface OtsLoginState {
  error?: string;
}

export async function otsLoginAction(_prevState: OtsLoginState, formData: FormData): Promise<OtsLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifyOtsCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createOtsSession(result.adminId);
  await setOtsSessionCookie(token);

  // Mint a real session in every other panel this account's roles actually
  // grant access to, so no separate login is needed to open them.
  await provisionAccessibleSessions(result.adminId, "ots");

  const user = await getSessionOtsUser(token);
  if (user?.mustChangePassword) redirect("/ots/change-password");
  redirect("/ots");
}
