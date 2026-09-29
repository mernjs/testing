import type { Metadata } from "next";
import { Building2, CalendarPlus, CircleCheck, CirclePause, Hourglass, Sparkles } from "lucide-react";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { getPlatformKpis, listCompanies } from "@/lib/platform/console/companies";
import ConsoleNav from "./ConsoleNav";
import CompaniesFilterBar from "./CompaniesFilterBar";
import CompaniesGrid from "./CompaniesGrid";

export const metadata: Metadata = { title: "Platform console", robots: { index: false, follow: false } };

export default async function PlatformConsolePage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  await requirePlatformAdmin();
  const sp = await searchParams;
  const status = sp.status === "active" || sp.status === "suspended" ? sp.status : "all";
  const [kpis, list] = await Promise.all([getPlatformKpis(), listCompanies({ q: sp.q, status, page: Number(sp.page) || 1 })]);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <ConsoleNav active="companies" pendingApprovals={kpis.pendingApprovals} />
        <KpiGrid cols={6}>
          <KpiCard label="Companies" value={kpis.total} icon={<Building2 className="size-4" />} />
          <KpiCard label="Active" value={kpis.active} icon={<CircleCheck className="size-4" />} />
          <KpiCard label="Suspended" value={kpis.suspended} icon={<CirclePause className="size-4" />} />
          <KpiCard label="New (7 days)" value={kpis.createdLast7Days} icon={<Sparkles className="size-4" />} />
          <KpiCard label="New (30 days)" value={kpis.createdLast30Days} icon={<CalendarPlus className="size-4" />} />
          <KpiCard label="Awaiting approval" value={kpis.pendingApprovals} icon={<Hourglass className="size-4" />} />
        </KpiGrid>
        <CompaniesGrid
          rows={list.rows}
          total={list.total}
          page={list.page}
          totalPages={list.totalPages}
          hasActiveFilters={Boolean(sp.q || status !== "all")}
          filters={<CompaniesFilterBar initialSearch={sp.q ?? ""} initialStatus={status} />}
        />
      </div>
    </div>
  );
}
