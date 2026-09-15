"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { deleteConversation, bulkDeleteConversations } from "@/lib/chat-conversations";

function revalidate() {
  revalidatePath("/admin/chatbot/conversations");
}

export async function deleteConversationAction(id: string): Promise<{ ok: boolean }> {
  await requireAdminUser();
  const ok = await deleteConversation(id);
  if (ok) revalidate();
  return { ok };
}

export async function bulkDeleteConversationsAction(ids: string[]): Promise<{ deleted: number }> {
  await requireAdminUser();
  const deleted = await bulkDeleteConversations(ids);
  revalidate();
  return { deleted };
}
