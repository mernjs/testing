"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { deleteConversation, bulkDeleteConversations } from "@/lib/chat-conversations";
import {
  updateChatbotConfig,
  validateChatbotConfig,
  type ChatbotConfigInput,
} from "@/lib/chatbot-config";
import { isOpenAIConfigured } from "@/lib/openai";
import { beginWebsiteIndex, runWebsiteIndex, urlsForPageIds } from "@/lib/kb-website";
import { reindexPdf, deletePdf } from "@/lib/kb-pdf";
import { deleteVoiceConversation, bulkDeleteVoiceConversations } from "@/lib/voice-conversations";
import { siteUrl } from "@/lib/seo";

// Every action re-checks the session — render-time gating on the page alone
// is not a security boundary for the action endpoint.
async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

function crawlBaseUrl(): string {
  return process.env.CHATBOT_CRAWL_BASE_URL || siteUrl;
}

// ---------------------------------------------------------------------------
// Conversations
// ---------------------------------------------------------------------------

export async function deleteConversationAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteConversation(id);
  revalidatePath("/admin/chatbot/conversations");
  revalidatePath("/admin/chatbot");
  redirect("/admin/chatbot/conversations");
}

export async function deleteConversationInPlaceAction(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const ok = await deleteConversation(id);
  if (!ok) return { error: "Conversation not found." };
  revalidatePath("/admin/chatbot/conversations");
  revalidatePath("/admin/chatbot");
  return {};
}

export async function bulkDeleteConversationsAction(ids: string[]): Promise<{ deleted: number }> {
  await requireAdmin();
  const deleted = await bulkDeleteConversations(ids);
  revalidatePath("/admin/chatbot/conversations");
  revalidatePath("/admin/chatbot");
  return { deleted };
}

// ---------------------------------------------------------------------------
// Knowledge base
// ---------------------------------------------------------------------------

export async function triggerWebsiteIndexAction(mode: "full" | "incremental"): Promise<{ runId?: string; error?: string }> {
  const admin = await requireAdmin();
  if (!isOpenAIConfigured()) return { error: "OPENAI_API_KEY is not configured." };
  const incremental = mode === "incremental";
  const { runId, logger } = await beginWebsiteIndex({ triggeredBy: admin.email, incremental });
  after(() => runWebsiteIndex(logger, { baseUrl: crawlBaseUrl(), incremental, triggeredBy: admin.email }));
  revalidatePath("/admin/chatbot/knowledge-base");
  return { runId };
}

export async function reindexPagesAction(pageIds: string[]): Promise<{ runId?: string; error?: string }> {
  const admin = await requireAdmin();
  if (!isOpenAIConfigured()) return { error: "OPENAI_API_KEY is not configured." };
  const urls = await urlsForPageIds(pageIds);
  if (urls.length === 0) return { error: "No matching pages selected." };
  const { runId, logger } = await beginWebsiteIndex({ triggeredBy: admin.email, onlyUrls: urls });
  after(() =>
    runWebsiteIndex(logger, { baseUrl: crawlBaseUrl(), onlyUrls: urls, triggeredBy: admin.email })
  );
  revalidatePath("/admin/chatbot/knowledge-base");
  return { runId };
}

export async function reindexPdfAction(id: string): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  if (!isOpenAIConfigured()) return { error: "OPENAI_API_KEY is not configured." };
  const ok = await reindexPdf(id, admin.email);
  if (!ok) return { error: "Document not found." };
  revalidatePath("/admin/chatbot/knowledge-base");
  return {};
}

export async function deletePdfAction(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const ok = await deletePdf(id);
  if (!ok) return { error: "Document not found." };
  revalidatePath("/admin/chatbot/knowledge-base");
  return {};
}

// ---------------------------------------------------------------------------
// AI configuration
// ---------------------------------------------------------------------------

export async function saveChatbotConfigAction(
  input: ChatbotConfigInput
): Promise<{ error?: string; fieldErrors?: Record<string, string> }> {
  const admin = await requireAdmin();
  const validation = validateChatbotConfig(input);
  if (!validation.valid) {
    return { error: "Please fix the highlighted fields.", fieldErrors: validation.errors };
  }
  await updateChatbotConfig(validation.data, admin.email);
  revalidatePath("/admin/chatbot/config");
  revalidatePath("/admin/chatbot");
  return {};
}

// ---------------------------------------------------------------------------
// Conversation AI (voice)
// ---------------------------------------------------------------------------

export async function saveVoiceConfigAction(
  voice: unknown
): Promise<{ error?: string; fieldErrors?: Record<string, string> }> {
  const admin = await requireAdmin();
  const validation = validateChatbotConfig({ voice });
  if (!validation.valid) {
    return { error: validation.errors.voice ?? "Please fix the highlighted fields.", fieldErrors: validation.errors };
  }
  await updateChatbotConfig(validation.data, admin.email);
  revalidatePath("/admin/chatbot/voice/config");
  revalidatePath("/admin/chatbot/voice");
  return {};
}

export async function deleteVoiceConversationAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteVoiceConversation(id);
  revalidatePath("/admin/chatbot/voice/conversations");
  revalidatePath("/admin/chatbot/voice");
  redirect("/admin/chatbot/voice/conversations");
}

export async function deleteVoiceConversationInPlaceAction(id: string): Promise<{ error?: string }> {
  await requireAdmin();
  const ok = await deleteVoiceConversation(id);
  if (!ok) return { error: "Conversation not found." };
  revalidatePath("/admin/chatbot/voice/conversations");
  revalidatePath("/admin/chatbot/voice");
  return {};
}

export async function bulkDeleteVoiceConversationsAction(ids: string[]): Promise<{ deleted: number }> {
  await requireAdmin();
  const deleted = await bulkDeleteVoiceConversations(ids);
  revalidatePath("/admin/chatbot/voice/conversations");
  revalidatePath("/admin/chatbot/voice");
  return { deleted };
}
