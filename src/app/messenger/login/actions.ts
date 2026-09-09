"use server";

import { redirect } from "next/navigation";
import {
  verifyChatCredentials,
  createMessengerSession,
  setMessengerSessionCookie,
  getSessionChatUser,
} from "@/lib/messenger-auth";

export interface MessengerLoginState {
  error?: string;
}

export async function messengerLoginAction(
  _prevState: MessengerLoginState,
  formData: FormData
): Promise<MessengerLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const result = await verifyChatCredentials(email, password);
  if (!result.ok) {
    return { error: result.error };
  }

  const token = await createMessengerSession(result.adminId);
  await setMessengerSessionCookie(token);

  const user = await getSessionChatUser(token);
  if (user?.mustChangePassword) redirect("/messenger/change-password");
  redirect("/messenger");
}
