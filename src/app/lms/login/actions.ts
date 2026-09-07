"use server";

import { redirect } from "next/navigation";
import { verifyLmsCredentials, createLmsSession, setSessionCookie } from "@/lib/lms-auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifyLmsCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createLmsSession(result.adminId);
  await setSessionCookie(token);
  redirect("/lms");
}
