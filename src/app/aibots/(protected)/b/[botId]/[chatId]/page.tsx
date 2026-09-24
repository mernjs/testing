import { notFound, redirect } from "next/navigation";
import ChatWorkspace from "@/components/aibots/ChatWorkspace";
import { getViewer, can } from "@/lib/aibots/viewer";
import { getBot, canUseBot, toSummary } from "@/lib/aibots/bots";
import { getChat, listMyChats } from "@/lib/aibots/chats";
import { workspaceMessages } from "@/lib/aibots/workspace";
import { isOpenAIConfigured } from "@/lib/openai";

/** Continue one of the viewer's own chats. Other people's chats are only readable at /aibots/chats/[id]. */
export default async function BotChatPage({ params }: { params: Promise<{ botId: string; chatId: string }> }) {
  const viewer = await getViewer();
  if (!viewer) redirect("/aibots/login");
  const { botId, chatId } = await params;
  const bot = await getBot(botId);
  if (!bot || !canUseBot(viewer, bot)) notFound();
  const chat = await getChat(viewer, chatId).catch(() => null);
  if (!chat || chat.botId !== bot._id) notFound();
  const [chats, { messages, error }] = await Promise.all([listMyChats(viewer, bot._id), workspaceMessages(chat)]);
  return (
    <ChatWorkspace
      key={chat._id}
      bot={toSummary(bot)}
      chats={chats}
      chatId={chat._id}
      chatTitle={chat.title}
      initialMessages={messages}
      ownerEmail={viewer.email}
      canManageBot={can(viewer, "EDIT_BOT")}
      openAIReady={isOpenAIConfigured()}
      historyError={error}
    />
  );
}
