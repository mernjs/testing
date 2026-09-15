import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { searchChannels } from "@/lib/admin/yashchat";
import ChannelsFilterBar from "./ChannelsFilterBar";
import ChannelsGrid from "./ChannelsGrid";

export default async function AdminChannelsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; kind?: string; archived?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const archived = sp.archived === "true" ? true : sp.archived === "false" ? false : undefined;

  const { items, total, totalPages } = await searchChannels({
    page,
    pageSize: 20,
    search: sp.search,
    kind: sp.kind,
    archived,
  });

  const hasActiveFilters = Boolean(sp.search || sp.kind || sp.archived);

  const exportParams = new URLSearchParams();
  if (sp.search) exportParams.set("search", sp.search);
  if (sp.kind) exportParams.set("kind", sp.kind);
  if (sp.archived) exportParams.set("archived", sp.archived);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "YashChat" }, { label: "Channels" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Channels</h1>
        <p className="text-sm text-muted-foreground">{total} channel{total === 1 ? "" : "s"}.</p>
      </div>

      <ChannelsGrid
        rows={items}
        total={total}
        page={page}
        totalPages={totalPages}
        hasActiveFilters={hasActiveFilters}
        exportHref={`/api/admin/yashchat/channels/export?${exportParams.toString()}`}
        filters={<ChannelsFilterBar initialSearch={sp.search ?? ""} initialKind={sp.kind ?? ""} initialArchived={sp.archived ?? ""} />}
      />
    </div>
  );
}
