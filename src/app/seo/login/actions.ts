"use server";

import { redirect } from "next/navigation";
import {
  verifySeoCredentials,
  createSeoSession,
  setSeoSessionCookie,
  getSessionSeoUser,
} from "@/lib/seo-auth";
import { provisionAccessibleSessions } from "@/lib/cross-module-sso";

export interface SeoLoginState {
  error?: string;
}

export async function seoLoginAction(_prevState: SeoLoginState, formData: FormData): Promise<SeoLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifySeoCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createSeoSession(result.adminId);
  await setSeoSessionCookie(token);

  // Mint a real session in every other panel this account's roles actually
  // grant access to, so no separate login is needed to open them.
  await provisionAccessibleSessions(result.adminId, "seo");

  const user = await getSessionSeoUser(token);
  if (user?.mustChangePassword) redirect("/seo/change-password");
  redirect("/seo");
}
