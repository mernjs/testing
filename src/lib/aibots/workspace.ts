import "server-only";
import { isOpenAIConfigured } from "@/lib/openai";
import { citationTitles } from "@/lib/aibots/engine";
import { friendlyError } from "@/lib/aibots/knowledge";
import { loadTranscript, type ChatDoc } from "@/lib/aibots/chats";
import type { WorkspaceMessage } from "@/components/aibots/ChatWorkspace";

/** Reads a chat's transcript back from its OpenAI Conversation and shapes it for the workspace. */
export async function workspaceMessages(chat: ChatDoc): Promise<{ messages: WorkspaceMessage[]; error: string | null }> {
  if (!isOpenAIConfigured()) return { messages: [], error: "OpenAI isn't configured on this server, so this chat's history can't be loaded." };
  try {
    const transcript = await loadTranscript(chat);
    const allCited = [...new Set(transcript.flatMap((m) => m.citedFileIds))];
    const titles = new Map((await citationTitles(chat.botId, allCited)).map((c) => [c.fileId, c.title]));
    return {
      messages: transcript.map((m) => ({
        id: m.id,
        role: m.role,
        text: m.text,
        attachments: m.attachments,
        citations: [...new Set(m.citedFileIds.map((id) => titles.get(id) ?? "Knowledge base document"))],
      })),
      error: null,
    };
  } catch (err) {
    console.error("[aibots] transcript load failed", friendlyError(err));
    return { messages: [], error: "This chat's history couldn't be loaded from OpenAI right now. New messages still continue the same conversation." };
  }
}
