import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { searchMeetings } from "@/lib/admin/yashchat";
import MeetingsFilterBar from "./MeetingsFilterBar";
import MeetingsGrid from "./MeetingsGrid";

export default async function AdminMeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);

  const { items, total, totalPages } = await searchMeetings({
    page,
    pageSize: 20,
    search: sp.search,
    status: sp.status,
  });

  const hasActiveFilters = Boolean(sp.search || sp.status);

  const exportParams = new URLSearchParams();
  if (sp.search) exportParams.set("search", sp.search);
  if (sp.status) exportParams.set("status", sp.status);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "YashChat" }, { label: "Meetings" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Meetings</h1>
        <p className="text-sm text-muted-foreground">{total} meeting{total === 1 ? "" : "s"}.</p>
      </div>

      <MeetingsGrid
        rows={items}
        total={total}
        page={page}
        totalPages={totalPages}
        hasActiveFilters={hasActiveFilters}
        exportHref={`/api/admin/yashchat/meetings/export?${exportParams.toString()}`}
        filters={<MeetingsFilterBar initialSearch={sp.search ?? ""} initialStatus={sp.status ?? ""} />}
      />
    </div>
  );
}
