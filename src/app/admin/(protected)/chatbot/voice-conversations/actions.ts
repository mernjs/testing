"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/admin-auth";
import { deleteVoiceConversation, bulkDeleteVoiceConversations } from "@/lib/voice-conversations";

function revalidate() {
  revalidatePath("/admin/chatbot/voice-conversations");
}

export async function deleteVoiceConversationAction(id: string): Promise<{ ok: boolean }> {
  await requireAdminUser();
  const ok = await deleteVoiceConversation(id);
  if (ok) revalidate();
  return { ok };
}

export async function bulkDeleteVoiceConversationsAction(ids: string[]): Promise<{ deleted: number }> {
  await requireAdminUser();
  const deleted = await bulkDeleteVoiceConversations(ids);
  revalidate();
  return { deleted };
}
