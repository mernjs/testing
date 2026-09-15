"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { markAdminNotificationRead, markAllAdminNotificationsRead, type NotificationModule } from "@/lib/admin/notifications";

export async function markNotificationReadAction(module: NotificationModule, id: string): Promise<{ ok: boolean }> {
  const user = await getCurrentAdminUser();
  if (!user) return { ok: false };
  await markAdminNotificationRead(module, id, user.id);
  revalidatePath("/admin/notifications");
  return { ok: true };
}

export async function markAllNotificationsReadAction(): Promise<{ ok: boolean }> {
  const user = await getCurrentAdminUser();
  if (!user) return { ok: false };
  await markAllAdminNotificationsRead(user);
  revalidatePath("/admin/notifications");
  return { ok: true };
}
