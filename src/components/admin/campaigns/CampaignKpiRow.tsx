import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlassCard from "@/components/admin/GlassCard";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { CampaignAnalytics } from "@/lib/campaigns";

function Stat({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" | "muted" }) {
  return (
    <GlassCard className="h-full">
      <CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle></CardHeader>
      <CardContent>
        <p
          className={
            "text-xl font-bold tabular-nums " +
            (tone === "up" ? "text-green-600 dark:text-green-400" : tone === "down" ? "text-destructive" : "")
          }
        >
          {value}
        </p>
      </CardContent>
    </GlassCard>
  );
}

export default function CampaignKpiRow({ totals, currency }: { totals: CampaignAnalytics["totals"]; currency: string }) {
  const roiTone = totals.roiPercent == null ? "muted" : totals.roiPercent >= 0 ? "up" : "down";
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
      <Stat label="Spend" value={formatCurrency(totals.spend, currency)} />
      <Stat label="Attributed Leads" value={totals.leadsAttributed.toLocaleString("en-IN")} />
      <Stat label="Cost / Lead" value={totals.cpl == null ? "—" : formatCurrency(totals.cpl, currency)} />
      <Stat label="Qualified" value={totals.qualified.toLocaleString("en-IN")} />
      <Stat label="Won" value={totals.completed.toLocaleString("en-IN")} />
      <Stat label="Revenue" value={totals.revenue > 0 ? formatCurrency(totals.revenue, currency) : "—"} />
      <Stat label="ROI" value={totals.roiPercent == null ? "—" : formatPercent(totals.roiPercent)} tone={roiTone} />
    </div>
  );
}
