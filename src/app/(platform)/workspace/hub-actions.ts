"use server";

import { getCurrentHubUser } from "@/lib/hub-auth";
import { globalSearch, type SearchHit } from "@/lib/platform/search";
import { askBusiness, type AssistantReply } from "@/lib/platform/ai/assistant";
import { listNotifications, markAllRead, markRead, unreadCount, type NotificationView } from "@/lib/platform/notifications";

/** Server actions behind the Staff Hub's search palette, notification bell and "Ask about your business" box. */

export async function hubSearchAction(query: string): Promise<SearchHit[]> {
  const user = await getCurrentHubUser();
  if (!user) return [];
  return globalSearch(user, String(query ?? ""));
}

export async function hubAskAction(question: string): Promise<AssistantReply> {
  const user = await getCurrentHubUser();
  if (!user) return { ok: false, error: "Sign in again to continue." };
  return askBusiness(user, question);
}

export async function hubUnreadCountAction(): Promise<number> {
  const user = await getCurrentHubUser();
  return user ? unreadCount(user.id) : 0;
}

export async function hubMarkReadAction(id: string): Promise<{ unread: number }> {
  const user = await getCurrentHubUser();
  if (!user) return { unread: 0 };
  await markRead(user.id, String(id));
  return { unread: await unreadCount(user.id) };
}

export async function hubMarkAllReadAction(): Promise<{ items: NotificationView[]; unread: number }> {
  const user = await getCurrentHubUser();
  if (!user) return { items: [], unread: 0 };
  await markAllRead(user.id);
  return { items: await listNotifications(user.id), unread: 0 };
}
