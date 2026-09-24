"use server";

import { redirect } from "next/navigation";
import {
  verifyAibotsCredentials,
  createAibotsSession,
  setAibotsSessionCookie,
  getSessionAibotsUser,
} from "@/lib/aibots-auth";
import { provisionAccessibleSessions } from "@/lib/cross-module-sso";

export interface AibotsLoginState {
  error?: string;
}

export async function aibotsLoginAction(_prevState: AibotsLoginState, formData: FormData): Promise<AibotsLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifyAibotsCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createAibotsSession(result.adminId);
  await setAibotsSessionCookie(token);

  // Mint a real session in every other panel this account's roles actually
  // grant access to, so no separate login is needed to open them.
  await provisionAccessibleSessions(result.adminId, "aibots");

  const user = await getSessionAibotsUser(token);
  if (user?.mustChangePassword) redirect("/aibots/change-password");
  redirect("/aibots");
}
