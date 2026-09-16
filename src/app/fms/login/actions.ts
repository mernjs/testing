"use server";

import { redirect } from "next/navigation";
import {
  verifyFmsCredentials,
  createFmsSession,
  setFmsSessionCookie,
  getSessionFmsUser,
} from "@/lib/fms-auth";
import { provisionAccessibleSessions } from "@/lib/cross-module-sso";

export interface FmsLoginState {
  error?: string;
}

export async function fmsLoginAction(_prevState: FmsLoginState, formData: FormData): Promise<FmsLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifyFmsCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createFmsSession(result.adminId);
  await setFmsSessionCookie(token);

  // Mint a real session in every other panel this account's roles actually
  // grant access to, so no separate login is needed to open them.
  await provisionAccessibleSessions(result.adminId, "fms");

  const user = await getSessionFmsUser(token);
  if (user?.mustChangePassword) redirect("/fms/change-password");
  redirect("/fms");
}
