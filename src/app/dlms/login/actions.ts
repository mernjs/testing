"use server";

import { redirect } from "next/navigation";
import {
  verifyDlmsCredentials,
  createDlmsSession,
  setDlmsSessionCookie,
  getSessionDlmsUser,
} from "@/lib/dlms-auth";
import { provisionAccessibleSessions } from "@/lib/cross-module-sso";

export interface DlmsLoginState {
  error?: string;
}

export async function dlmsLoginAction(_prevState: DlmsLoginState, formData: FormData): Promise<DlmsLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifyDlmsCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createDlmsSession(result.adminId);
  await setDlmsSessionCookie(token);

  // Mint a real session in every other panel this account's roles actually
  // grant access to, so no separate login is needed to open them.
  await provisionAccessibleSessions(result.adminId, "dlms");

  const user = await getSessionDlmsUser(token);
  if (user?.mustChangePassword) redirect("/dlms/change-password");
  redirect("/dlms");
}
