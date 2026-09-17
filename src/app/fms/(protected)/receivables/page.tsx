import Link from "next/link";
import { Clock, AlertTriangle } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import CategoryBarChart from "@/components/lms/CategoryBarChart";
import { receivablesAging, customerWiseReceivables, totalOutstandingInvoices, overdueInvoices } from "@/lib/fms/receivables";
import { AGING_BUCKET_LABELS, formatMoney } from "@/lib/fms/constants";

export default async function ReceivablesPage() {
  const [aging, byCustomer, outstanding, overdue] = await Promise.all([
    receivablesAging(),
    customerWiseReceivables(),
    totalOutstandingInvoices(),
    overdueInvoices(),
  ]);

  const agingByLabel = new Map(aging.map((a) => [a.label, a.amount]));
  const chartData = AGING_BUCKET_LABELS.map((label) => ({ label, value: agingByLabel.get(label) ?? 0 }));

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "FMS", href: "/fms" }, { label: "Receivables" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Accounts Receivable</h1>
        <p className="text-sm text-muted-foreground">Real aging computed from open customer invoices.</p>
      </div>

      <KpiGrid>
        <KpiCard label="Total Outstanding" value={<span>{formatMoney(outstanding.amount)}</span>} accent icon={<Clock className="size-4" />} />
        <KpiCard label="Outstanding Invoices" value={outstanding.count} icon={<Clock className="size-4" />} />
        <KpiCard label="Overdue" value={overdue.count} tone={overdue.count > 0 ? "down" : undefined} icon={<AlertTriangle className="size-4" />} />
        <KpiCard label="Overdue Amount" value={<span>{formatMoney(overdue.amount)}</span>} icon={<AlertTriangle className="size-4" />} />
      </KpiGrid>

      <GlassCard>
        <CardHeader><CardTitle>Aging</CardTitle></CardHeader>
        <CardContent><CategoryBarChart data={chartData} /></CardContent>
      </GlassCard>

      <GlassCard interactive={false}>
        <CardHeader><CardTitle>Customer-wise Receivables</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Open Invoices</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byCustomer.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">No outstanding receivables.</TableCell>
                </TableRow>
              )}
              {byCustomer.map((c) => (
                <TableRow key={c.customerId}>
                  <TableCell>
                    <Link href={`/fms/customers/${c.customerId}`} className="font-medium text-primary hover:underline">
                      {c.customerName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{c.invoiceCount}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(c.outstanding)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </GlassCard>
    </div>
  );
}
