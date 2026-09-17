import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { getProfitAndLoss } from "@/lib/fms/reports/profit-and-loss";
import { groupSum } from "@/lib/fms/dashboard";
import { getVendor } from "@/lib/prms/vendors";
import { formatMoney } from "@/lib/fms/constants";

const SETTLED_STATUSES = ["completed", "reconciled"];

function monthStart(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
}

export default async function ExpenseReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const dateFromStr = sp.dateFrom ?? monthStart();
  const dateToStr = sp.dateTo ?? new Date().toISOString().slice(0, 10);
  const dateFrom = new Date(`${dateFromStr}T00:00:00`);
  const dateTo = new Date(`${dateToStr}T23:59:59`);

  const [pl, byVendorRaw] = await Promise.all([
    getProfitAndLoss({ dateFrom, dateTo }),
    groupSum("vendorId", { type: "expense", status: { $in: SETTLED_STATUSES }, transactionDate: { $gte: dateFrom, $lte: dateTo } }),
  ]);
  const byVendor = await Promise.all(
    byVendorRaw
      .filter((r) => r.label && r.label !== "—")
      .map(async (r) => ({ label: (await getVendor(r.label).catch(() => null))?.companyName ?? r.label, value: r.value }))
  );

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "FMS", href: "/fms" }, { label: "Reports" }, { label: "Expense" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Expense Report</h1>
        <p className="text-sm text-muted-foreground">Expenses by account and by vendor for the selected range, from posted journal entries and settled transactions.</p>
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
                  href={`/api/fms/reports/expense?format=${fmt}&dateFrom=${dateFromStr}&dateTo=${dateToStr}`}
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
        <KpiCard label="Total Expenses" value={<span>{formatMoney(pl.totalExpenses)}</span>} />
      </KpiGrid>

      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard interactive={false}>
          <CardHeader><CardTitle>By Account</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pl.expenses.length === 0 && (
                  <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">No expenses in this range.</TableCell></TableRow>
                )}
                {pl.expenses.map((l) => (
                  <TableRow key={l.accountId}>
                    <TableCell><Badge variant="secondary" className="mr-2">{l.accountCode}</Badge>{l.accountName}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatMoney(l.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </GlassCard>

        <GlassCard interactive={false}>
          <CardHeader><CardTitle>By Vendor</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {byVendor.length === 0 && (
                  <TableRow><TableCell colSpan={2} className="text-center text-muted-foreground">No vendor-linked expenses in this range.</TableCell></TableRow>
                )}
                {byVendor.map((v, i) => (
                  <TableRow key={`${v.label}-${i}`}>
                    <TableCell>{v.label}</TableCell>
                    <TableCell className="text-right tabular-nums">{formatMoney(v.value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
