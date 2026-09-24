import Link from "next/link";
import { redirect } from "next/navigation";
import { Bot, Plus } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/aibots/AibotsUi";
import BotPicker from "@/components/aibots/BotPicker";
import { Button } from "@/components/ui/button";
import { getViewer, can } from "@/lib/aibots/viewer";
import { listUsableBots } from "@/lib/aibots/bots";

export default async function GenerateChatPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/aibots/login");
  const bots = await listUsableBots(viewer);

  return (
    <div className="space-y-4">
      <PageHeader title="Generate Chat" crumbs={[{ label: "Generate Chat" }]} description="Pick a bot — the new chat uses its instructions, model and knowledge base automatically." />
      {bots.length === 0 ? (
        <EmptyState icon={<Bot className="size-5" />} title="No bots are available to you yet">
          {can(viewer, "CREATE_BOT") ? (
            <Button className="mt-2" size="sm" nativeButton={false} render={<Link href="/aibots/bots/new" />}>
              <Plus className="size-4" /> Create the first bot
            </Button>
          ) : (
            "Ask an AI Bots manager to share a bot with you or your role."
          )}
        </EmptyState>
      ) : (
        <BotPicker bots={bots} />
      )}
    </div>
  );
}
