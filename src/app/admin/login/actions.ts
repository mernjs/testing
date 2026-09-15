"use server";

import { redirect } from "next/navigation";
import {
  verifyAdminCredentials,
  createAdminSession,
  setAdminSessionCookie,
  getSessionAdminUser,
} from "@/lib/admin-auth";

export interface AdminLoginState {
  error?: string;
}

export async function adminLoginAction(_prevState: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
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
  await setAdminSessionCookie(token);

  const user = await getSessionAdminUser(token);
  if (user?.mustChangePassword) redirect("/admin/change-password");
  redirect("/admin");
}
