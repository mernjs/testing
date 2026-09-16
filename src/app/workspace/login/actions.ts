"use server";

import { redirect } from "next/navigation";
import {
  verifyHubCredentials,
  createHubSession,
  setHubSessionCookie,
  getSessionHubUser,
} from "@/lib/hub-auth";
import { provisionAccessibleSessions } from "@/lib/cross-module-sso";

export interface HubLoginState {
  error?: string;
}

export async function hubLoginAction(_prevState: HubLoginState, formData: FormData): Promise<HubLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifyHubCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createHubSession(result.adminId);
  await setHubSessionCookie(token);

  // Mint a real session in every other panel this account's roles actually
  // grant access to, so no separate login is needed to open them.
  await provisionAccessibleSessions(result.adminId, "hub");

  const user = await getSessionHubUser(token);
  if (user?.mustChangePassword) redirect("/workspace/change-password");
  redirect("/workspace");
}
