import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { searchClients, listIndustries, serializeClient } from "@/lib/pms/clients";
import { isValidClientStatus } from "@/lib/pms/constants";
import ClientsFilterBar from "./ClientsFilterBar";
import ClientsGrid, { type AdminClientRow } from "./ClientsGrid";

export default async function AdminClientsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    industry?: string;
    sortBy?: string;
    sortDir?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const status = sp.status && isValidClientStatus(sp.status) ? sp.status : undefined;
  const sortBy = sp.sortBy === "companyName" ? "companyName" : "createdAt";
  const sortDir = sp.sortDir === "asc" ? "asc" : "desc";

  const [{ items, total, totalPages }, industries] = await Promise.all([
    searchClients({ page, pageSize: 20, search: sp.search, status, industry: sp.industry, sortBy, sortDir }),
    listIndustries(),
  ]);

  const rows: AdminClientRow[] = items.map((c) => ({ ...serializeClient(c), projectCount: c.projectCount }));
  const hasActiveFilters = Boolean(sp.search || sp.status || sp.industry);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "CRM" }, { label: "Clients" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Clients</h1>
        <p className="text-sm text-muted-foreground">{total} client{total === 1 ? "" : "s"}.</p>
      </div>

      <ClientsGrid
        rows={rows}
        total={total}
        page={page}
        totalPages={totalPages}
        sortBy={sortBy}
        sortDir={sortDir}
        hasActiveFilters={hasActiveFilters}
        filters={
          <ClientsFilterBar
            initialSearch={sp.search ?? ""}
            initialStatus={status ?? ""}
            initialIndustry={sp.industry ?? ""}
            industries={industries}
          />
        }
      />
    </div>
  );
}
