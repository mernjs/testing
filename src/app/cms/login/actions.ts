"use server";

import { redirect } from "next/navigation";
import {
  verifyCmsCredentials,
  createCmsSession,
  setCmsSessionCookie,
  getSessionCmsUser,
} from "@/lib/cms-auth";
import { provisionAccessibleSessions } from "@/lib/cross-module-sso";

export interface CmsLoginState {
  error?: string;
}

export async function cmsLoginAction(_prevState: CmsLoginState, formData: FormData): Promise<CmsLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifyCmsCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createCmsSession(result.adminId);
  await setCmsSessionCookie(token);

  // Mint a real session in every other panel this account's roles actually
  // grant access to, so no separate login is needed to open them.
  await provisionAccessibleSessions(result.adminId, "cms");

  const user = await getSessionCmsUser(token);
  if (user?.mustChangePassword) redirect("/cms/change-password");
  redirect("/cms");
}
