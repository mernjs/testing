"use server";

import { redirect } from "next/navigation";
import { verifyAdminCredentials, createAdminSession, setSessionCookie } from "@/lib/admin-auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifyAdminCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createAdminSession(result.adminId);
  await setSessionCookie(token);
  redirect("/admin");
}
