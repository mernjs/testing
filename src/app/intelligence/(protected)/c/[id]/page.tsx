import { notFound, redirect } from "next/navigation";
import ChatWorkspace from "@/components/intelligence/ChatWorkspace";
import { getCurrentIntelligenceUser } from "@/lib/intelligence-auth";
import { getConversation, listMessages } from "@/lib/intelligence/conversations";
import { isOpenAIConfigured } from "@/lib/openai";

/** One of the signed-in user's own conversations, re-rendered from its stored answers (no query is re-run). */
export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentIntelligenceUser();
  if (!user) redirect("/intelligence/login");
  const { id } = await params;
  const conversation = await getConversation(user.id, id);
  if (!conversation) notFound();
  const messages = await listMessages(user.id, conversation._id);
  return <ChatWorkspace conversationId={conversation._id} title={conversation.title} initialMessages={messages} ownerEmail={user.email} openAIReady={isOpenAIConfigured()} />;
}
