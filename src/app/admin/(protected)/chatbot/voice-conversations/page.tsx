import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { searchVoiceConversations } from "@/lib/voice-conversations";
import VoiceConversationsFilterBar from "./VoiceConversationsFilterBar";
import VoiceConversationsGrid, { type AdminVoiceConversationRow } from "./VoiceConversationsGrid";

function parseDateParam(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(`${value}${endOfDay ? "T23:59:59.999" : "T00:00:00"}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

const SORT_FIELDS = ["lastActivityAt", "startedAt", "durationMs", "voiceMessageCount"] as const;

export default async function AdminVoiceConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    device?: string;
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
    dateFrom: parseDateParam(sp.dateFrom),
    dateTo: parseDateParam(sp.dateTo, true),
    sortBy,
    sortDir,
  });

  const rows: AdminVoiceConversationRow[] = items;
  const hasActiveFilters = Boolean(sp.search || sp.device || sp.dateFrom || sp.dateTo);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "AI Chatbot" }, { label: "Voice Conversations" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Voice Conversations</h1>
        <p className="text-sm text-muted-foreground">{total} voice conversation{total === 1 ? "" : "s"}.</p>
      </div>

      <VoiceConversationsGrid
        rows={rows}
        total={total}
        page={page}
        totalPages={totalPages}
        sortBy={sortBy}
        sortDir={sortDir}
        hasActiveFilters={hasActiveFilters}
        filters={
          <VoiceConversationsFilterBar
            initialSearch={sp.search ?? ""}
            initialDevice={sp.device ?? ""}
            initialDateFrom={sp.dateFrom ?? ""}
            initialDateTo={sp.dateTo ?? ""}
          />
        }
      />
    </div>
  );
}
