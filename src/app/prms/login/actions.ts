"use server";

import { redirect } from "next/navigation";
import {
  verifyPrmsCredentials,
  createPrmsSession,
  setPrmsSessionCookie,
  getSessionPrmsUser,
} from "@/lib/prms-auth";
import { hasPrmsStaffRole } from "@/lib/prms-roles";

export interface PrmsLoginState {
  error?: string;
}

export async function prmsLoginAction(_prevState: PrmsLoginState, formData: FormData): Promise<PrmsLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifyPrmsCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createPrmsSession(result.adminId);
  await setPrmsSessionCookie(token);

  const user = await getSessionPrmsUser(token);
  if (user?.mustChangePassword) redirect("/prms/change-password");
  if (user && !hasPrmsStaffRole(user.roles)) redirect("/prms/me");
  redirect("/prms");
}
