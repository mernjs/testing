import Breadcrumbs from "@/components/admin/Breadcrumbs";
import VoiceConversationsDataTable from "@/components/admin/VoiceConversationsDataTable";
import { searchVoiceConversations } from "@/lib/voice-conversations";

function parseDateParam(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}${endOfDay ? "T23:59:59.999" : "T00:00:00"}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

const SORT_FIELDS = ["lastActivityAt", "startedAt", "durationMs", "voiceMessageCount"] as const;

export default async function VoiceConversationsListPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    device?: string;
    minDuration?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortDir?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const sortBy = (SORT_FIELDS as readonly string[]).includes(sp.sortBy ?? "")
    ? (sp.sortBy as (typeof SORT_FIELDS)[number])
    : "lastActivityAt";
  const sortDir = sp.sortDir === "asc" ? "asc" : "desc";

  const { items, total, totalPages } = await searchVoiceConversations({
    page,
    pageSize: 20,
    search: sp.search,
    device: sp.device,
    minDurationMs: Number(sp.minDuration) * 1000 || undefined,
    dateFrom: parseDateParam(sp.dateFrom),
    dateTo: parseDateParam(sp.dateTo, true),
    sortBy,
    sortDir,
  });

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "AI Chatbot", href: "/admin/chatbot" },
          { label: "Conversation AI", href: "/admin/chatbot/voice" },
          { label: "Voice Conversations" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold text-foreground">Voice Conversations</h1>
        <p className="text-sm text-muted-foreground">
          {total} voice conversation{total === 1 ? "" : "s"} · open one to listen to the AI responses
        </p>
      </div>

      <VoiceConversationsDataTable
        items={items}
        total={total}
        page={page}
        totalPages={totalPages}
        initialSearch={sp.search ?? ""}
        initialDevice={sp.device ?? ""}
        initialMinDuration={sp.minDuration ?? ""}
        initialDateFrom={sp.dateFrom ?? ""}
        initialDateTo={sp.dateTo ?? ""}
        initialSortBy={sortBy}
        initialSortDir={sortDir}
      />
    </div>
  );
}
