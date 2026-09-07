"use server";

import { redirect } from "next/navigation";
import {
  verifyPmsCredentials,
  createPmsSession,
  setPmsSessionCookie,
  getSessionPmsUser,
} from "@/lib/pms-auth";
import { hasPmsStaffRole } from "@/lib/pms-roles";

export interface PmsLoginState {
  error?: string;
}

export async function pmsLoginAction(_prevState: PmsLoginState, formData: FormData): Promise<PmsLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifyPmsCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createPmsSession(result.adminId);
  await setPmsSessionCookie(token);

  const user = await getSessionPmsUser(token);
  if (user?.mustChangePassword) redirect("/pms/change-password");
  if (user && !hasPmsStaffRole(user.roles)) redirect("/pms/me");
  redirect("/pms");
}
