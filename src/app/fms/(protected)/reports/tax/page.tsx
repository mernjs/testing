import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { getTaxSummary } from "@/lib/fms/reports/tax";
import { formatMoney } from "@/lib/fms/constants";

function monthStart(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
}

export default async function TaxReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const dateFromStr = sp.dateFrom ?? monthStart();
  const dateToStr = sp.dateTo ?? new Date().toISOString().slice(0, 10);
  const dateFrom = new Date(`${dateFromStr}T00:00:00`);
  const dateTo = new Date(`${dateToStr}T23:59:59`);

  const result = await getTaxSummary({ dateFrom, dateTo });

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "FMS", href: "/fms" }, { label: "Reports" }, { label: "Tax" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Tax Report</h1>
        <p className="text-sm text-muted-foreground">
          Tax collected on income vs. tax paid on expenses, from settled transactions&apos; <code>taxAmount</code>.
          A single flat figure per transaction, not a CGST/SGST/IGST breakdown.
        </p>
      </div>

      <GlassCard interactive={false}>
        <CardContent className="py-4">
          <form className="flex flex-wrap items-end gap-3" method="get">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">From</label>
              <Input type="date" name="dateFrom" defaultValue={dateFromStr} className="h-9" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">To</label>
              <Input type="date" name="dateTo" defaultValue={dateToStr} className="h-9" />
            </div>
            <Button type="submit" size="sm" variant="secondary">Apply</Button>
            <div className="ml-auto flex items-center gap-3 text-sm">
              {(["csv", "xlsx", "pdf"] as const).map((fmt) => (
                <a
                  key={fmt}
                  href={`/api/fms/reports/tax?format=${fmt}&dateFrom=${dateFromStr}&dateTo=${dateToStr}`}
                  className="text-primary hover:underline"
                >
                  Export {fmt.toUpperCase()}
                </a>
              ))}
            </div>
          </form>
        </CardContent>
      </GlassCard>

      <KpiGrid>
        <KpiCard label="Tax Collected" value={<span>{formatMoney(result.taxCollected)}</span>} tone="up" />
        <KpiCard label="Tax Paid" value={<span>{formatMoney(result.taxPaid)}</span>} tone="down" />
        <KpiCard label="Net Payable" value={<span>{formatMoney(result.netPayable)}</span>} accent />
      </KpiGrid>
    </div>
  );
}
