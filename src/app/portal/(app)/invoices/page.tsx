import { ReceiptText } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { guardPortalPage } from "@/lib/portal/guard";
import { getClientOverview } from "@/lib/portal/client";
import { PortalPageHeader } from "@/components/portal/widgets";
import EmptyPortalState from "@/components/portal/EmptyPortalState";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Invoices · YashOrbit Portal" };

export default async function InvoicesPage() {
  const user = await guardPortalPage("client");
  const data = await getClientOverview(user.clientId);
  if (!data) return <EmptyPortalState title="No billing yet" body="Your invoice summary appears here once projects are set up." />;

  const inv = data.invoiceSummary;
  const money = (n: number) => `${inv.currency === "INR" ? "₹" : inv.currency + " "}${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      <Breadcrumbs items={[{ label: "Portal", href: "/portal" }, { label: "Invoices" }]} />
      <PortalPageHeader title="Invoice Summary" subtitle="A milestone-billing view of your engagements" />

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Contract value", value: inv.contractValue, tone: "" },
          { label: "Billed to date", value: inv.billed, tone: "text-green-600 dark:text-green-400" },
          { label: "In progress", value: inv.inProgress, tone: "" },
          { label: "Outstanding", value: inv.outstanding, tone: "text-foreground" },
        ].map((s) => (
          <GlassCard key={s.label}>
            <CardContent className="py-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={cn("mt-1 text-lg font-bold", s.tone || "text-foreground")}>{money(s.value)}</p>
            </CardContent>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ReceiptText className="size-4" /> Milestone billing
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Project</th>
                <th className="py-2 pr-3 font-medium">Milestone</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 text-right font-medium">Amount</th>
                <th className="py-2 text-right font-medium">Billed</th>
              </tr>
            </thead>
            <tbody>
              {inv.lines.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">No milestones to bill yet.</td>
                </tr>
              )}
              {inv.lines.map((l, i) => (
                <tr key={i} className="border-b border-border/40 last:border-0">
                  <td className="py-2 pr-3 text-muted-foreground">{l.projectCode}</td>
                  <td className="py-2 pr-3 text-foreground">{l.milestone}</td>
                  <td className="py-2 pr-3 capitalize text-muted-foreground">{l.status.replace(/_/g, " ")}</td>
                  <td className="py-2 pr-3 text-right tabular-nums text-foreground">{money(l.amount)}</td>
                  <td className="py-2 text-right">
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", l.billed ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground")}>
                      {l.billed ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </GlassCard>

      <p className="text-xs text-muted-foreground">
        This is an indicative summary based on milestone completion against each project&apos;s agreed value. Formal
        tax invoices are issued separately by the YashOrbit accounts team.
      </p>
    </div>
  );
}
