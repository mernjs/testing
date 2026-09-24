import { notFound, redirect } from "next/navigation";
import ChatWorkspace from "@/components/aibots/ChatWorkspace";
import { PageHeader } from "@/components/aibots/AibotsUi";
import { getViewer, can } from "@/lib/aibots/viewer";
import { botsCollection, toSummary } from "@/lib/aibots/bots";
import { getChat } from "@/lib/aibots/chats";
import { workspaceMessages } from "@/lib/aibots/workspace";
import { recordAuditThrottled } from "@/lib/aibots/audit";

/** Read-only transcript of any user's chat (VIEW_CHATS). Viewing is logged. */
export default async function OversightChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const viewer = await getViewer();
  if (!viewer) redirect("/aibots/login");
  if (!can(viewer, "VIEW_CHATS")) redirect("/aibots");
  const { chatId } = await params;
  const chat = await getChat(viewer, chatId, { allowOversight: true }).catch(() => null);
  if (!chat) notFound();
  // Deleted bots still render their old chats here, so read the row directly.
  const bot = await (await botsCollection()).findOne({ _id: chat.botId });
  if (!bot) notFound();
  if (chat.userId !== viewer.userId) {
    await recordAuditThrottled({ actorId: viewer.userId, actorEmail: viewer.email, action: "view", entity: "chat", entityId: chat._id, entityLabel: chat.title, botId: chat.botId, summary: `Chat of ${chat.userEmail}` }, 30 * 60 * 1000);
  }
  const { messages, error } = await workspaceMessages(chat);
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <PageHeader title={chat.title} crumbs={[{ label: "All Chats", href: "/aibots/chats" }, { label: chat.title }]} />
      <div className="min-h-0 flex-1">
        <ChatWorkspace bot={toSummary(bot)} chats={[]} chatId={chat._id} chatTitle={chat.title} initialMessages={messages} ownerEmail={chat.userEmail} readOnly openAIReady historyError={error} />
      </div>
    </div>
  );
}
