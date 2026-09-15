import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { searchDirectConversations } from "@/lib/admin/yashchat";
import DirectMessagesFilterBar from "./DirectMessagesFilterBar";
import DirectMessagesGrid from "./DirectMessagesGrid";

export default async function AdminDirectMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);

  const { items, total, totalPages } = await searchDirectConversations({ page, pageSize: 20, search: sp.search });
  const hasActiveFilters = Boolean(sp.search);

  const exportParams = new URLSearchParams();
  if (sp.search) exportParams.set("search", sp.search);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "YashChat" }, { label: "Direct Messages" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Direct Message Conversations</h1>
        <p className="text-sm text-muted-foreground">{total} conversation{total === 1 ? "" : "s"}.</p>
      </div>

      <DirectMessagesGrid
        rows={items}
        total={total}
        page={page}
        totalPages={totalPages}
        hasActiveFilters={hasActiveFilters}
        exportHref={`/api/admin/yashchat/direct-messages/export?${exportParams.toString()}`}
        filters={<DirectMessagesFilterBar initialSearch={sp.search ?? ""} />}
      />
    </div>
  );
}
