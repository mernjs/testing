import { notFound, redirect } from "next/navigation";
import ChatWorkspace from "@/components/aibots/ChatWorkspace";
import { getViewer, can } from "@/lib/aibots/viewer";
import { getBot, canUseBot, toSummary } from "@/lib/aibots/bots";
import { listMyChats } from "@/lib/aibots/chats";
import { isOpenAIConfigured } from "@/lib/openai";

/** Any bot's workspace, on a fresh chat. One page serves every bot — the bot is data. */
export default async function BotWorkspacePage({ params }: { params: Promise<{ botId: string }> }) {
  const viewer = await getViewer();
  if (!viewer) redirect("/aibots/login");
  const { botId } = await params;
  const bot = await getBot(botId);
  if (!bot || !canUseBot(viewer, bot)) notFound();
  const chats = await listMyChats(viewer, bot._id);
  return (
    <ChatWorkspace
      key="new"
      bot={toSummary(bot)}
      chats={chats}
      chatId={null}
      chatTitle={null}
      initialMessages={[]}
      ownerEmail={viewer.email}
      canManageBot={can(viewer, "EDIT_BOT")}
      openAIReady={isOpenAIConfigured()}
    />
  );
}
