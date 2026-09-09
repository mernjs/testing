"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  MESSENGER_SESSION_COOKIE,
  destroyMessengerSessionByToken,
  clearMessengerSessionCookie,
  getCurrentChatUser,
} from "@/lib/messenger-auth";
import { goOffline } from "@/lib/messenger/presence";
import { markRead, markAllRead } from "@/lib/messenger/notifications";

export async function messengerLogoutAction(): Promise<void> {
  const store = await cookies();
  const token = store.get(MESSENGER_SESSION_COOKIE)?.value;
  const user = await getCurrentChatUser();
  if (user) await goOffline(user.id).catch(() => {});
  if (token) await destroyMessengerSessionByToken(token);
  await clearMessengerSessionCookie();
  redirect("/messenger/login");
}

export async function markNotificationsReadAction(ids: string[]): Promise<{ ok: boolean }> {
  const user = await getCurrentChatUser();
  if (!user) return { ok: false };
  await markRead(ids, user.id);
  revalidatePath("/messenger/notifications");
  return { ok: true };
}

export async function markAllNotificationsReadAction(): Promise<{ ok: boolean }> {
  const user = await getCurrentChatUser();
  if (!user) return { ok: false };
  await markAllRead(user.id);
  revalidatePath("/messenger/notifications");
  return { ok: true };
}
