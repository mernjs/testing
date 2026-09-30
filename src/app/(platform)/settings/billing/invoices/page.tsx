import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import GlassCard from "@/components/lms/GlassCard";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { currentCompanyId } from "@/lib/platform/tenancy/context";
import { formatInvoiceDate, listCompanySaasInvoices } from "@/lib/platform/billing/invoices";
import { formatMoney } from "@/lib/platform/billing/types";

export const metadata: Metadata = { title: "Invoices", robots: { index: false, follow: false } };

const STATUS: Record<string, string> = { paid: "Paid", unpaid: "Unpaid", void: "Void" };

export default async function BillingInvoicesPage() {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  if (!user.roles.includes("super_admin")) redirect("/workspace");
  const invoices = await listCompanySaasInvoices(await currentCompanyId());

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Settings
        </Link>
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-xl">Invoices</CardTitle>
            <CardDescription>GST tax invoices for your subscription (a paid invoice is also your receipt), and any credit notes against them.</CardDescription>
          </CardHeader>
          <CardContent>
            {invoices.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-muted-foreground">
                <FileText className="size-8 opacity-40" />
                No invoices yet — one is issued automatically after every subscription payment.
              </div>
            ) : (
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv._id} data-invoice-id={inv._id} data-invoice-number={inv.number}>
                      <TableCell>
                        <span className="font-medium">{inv.number}</span>
                        <span className="block text-xs text-muted-foreground">
                          {inv.kind === "credit_note"
                            ? `Credit note against ${inv.original?.number ?? ""}`
                            : [inv.planName, inv.interval === "yearly" ? "Yearly" : inv.interval === "monthly" ? "Monthly" : null, STATUS[inv.status]].filter(Boolean).join(" · ")}
                        </span>
                      </TableCell>
                      <TableCell>{formatInvoiceDate(inv.issuedAt)}</TableCell>
                      <TableCell className="text-xs">{inv.periodStart && inv.periodEnd ? `${formatInvoiceDate(inv.periodStart)} – ${formatInvoiceDate(inv.periodEnd)}` : "—"}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {inv.kind === "credit_note" ? "− " : ""}
                        {formatMoney(inv.total, inv.currency)}
                        <span className="block text-xs text-muted-foreground">incl. GST {formatMoney(inv.taxTotal, inv.currency)}</span>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`/api/platform/billing/invoices/${inv._id}/pdf?download=1`}
                          aria-label={`Download ${inv.number}`}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Download className="size-4" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
