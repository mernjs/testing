import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { TransactionStatusBadge, TransactionTypeBadge } from "@/components/fms/StatusBadges";
import { getCustomerDetail } from "@/lib/fms/customers";
import { getClientStatusMeta } from "@/lib/pms/constants";
import { formatMoney } from "@/lib/fms/constants";
import { formatDate } from "@/lib/utils";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getCustomerDetail(id);
  if (!detail) notFound();
  const { client, financials, transactions } = detail;

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "FMS", href: "/fms" }, { label: "Customers", href: "/fms/customers" }, { label: client.companyName }]} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{client.companyName}</h1>
          <p className="text-sm text-muted-foreground">{client.clientCode} · {client.industry ?? "No industry set"}</p>
        </div>
        <Badge className={getClientStatusMeta(client.status).badgeClass}>{getClientStatusMeta(client.status).label}</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <CardHeader><CardTitle>Contact &amp; Billing</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Primary Contact" value={client.primaryContact.name || "—"} />
            <Row label="Email" value={client.primaryContact.email ?? "—"} />
            <Row label="Phone" value={client.primaryContact.phone ?? "—"} />
            <Row label="Billing Address" value={client.billing.addressLine ?? "—"} />
            <Row label="GSTIN" value={client.billing.gstin ?? "—"} />
            <Row label="Currency" value={client.billing.currency} />
            <Row label="Payment Terms" value={client.billing.paymentTermsDays ? `${client.billing.paymentTermsDays} days` : "—"} />
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader><CardTitle>Financial Summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Total Received" value={formatMoney(financials.totalReceived, client.billing.currency)} />
            <Row label="Outstanding Receivable" value={formatMoney(financials.totalOutstanding, client.billing.currency)} />
            <Row label="Income Transactions" value={String(financials.transactionCount)} />
          </CardContent>
        </GlassCard>
      </div>

      <GlassCard>
        <CardHeader><CardTitle>Transactions</CardTitle></CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions recorded for this customer yet.</p>
          ) : (
            <ul className="divide-y divide-border/40">
              {transactions.map((t) => (
                <li key={t._id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <div className="flex min-w-0 items-center gap-2">
                    <Link href={`/fms/transactions/${t._id}`} className="font-medium text-primary hover:underline">
                      {t.transactionNumber}
                    </Link>
                    <TransactionTypeBadge type={t.type} />
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>{formatDate(t.transactionDate)}</span>
                    <span className="font-medium text-foreground">{formatMoney(t.amount, t.currency)}</span>
                    <TransactionStatusBadge status={t.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </GlassCard>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}
