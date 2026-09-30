import type { Metadata } from "next";
import Link from "next/link";
import { BadgePercent, CalendarClock, Gauge, IndianRupee, TrendingUp, Users } from "lucide-react";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import GlassCard from "@/components/lms/GlassCard";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePlatformAdmin } from "@/lib/platform/console/access";
import { getPlatformKpis } from "@/lib/platform/console/companies";
import { getRevenueDashboard, AT_RISK_TRIAL_DAYS, type AtRiskRow } from "@/lib/platform/billing/metrics";
import { formatMoney } from "@/lib/platform/billing/types";
import { cn } from "@/lib/utils";
import ConsoleNav from "../ConsoleNav";
import { CollectedChart, EmptyChart, MovementsChart, MrrTrendChart, type ChartMonth } from "./RevenueCharts";

export const metadata: Metadata = { title: "Revenue · Platform console", robots: { index: false, follow: false } };

// Fixed locale + fixed zone: the same text on every server, no hydration drift.
const IST_DATE = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Kolkata" });
const IST_DATETIME = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

const pct = (v: number | null) => (v === null ? "—" : `${(v * 100).toFixed(v > 0 && v < 0.1 ? 1 : 0)}%`);
const signedMoney = (v: number) => (v < 0 ? `−${formatMoney(-v)}` : formatMoney(v));

const STATUS_LABEL: Record<string, string> = {
  trialing: "Trialing",
  active: "Active",
  past_due: "Past due",
  grace: "Grace period",
  suspended: "Suspended",
  canceled: "Canceled",
};

const RISK_TONE: Record<AtRiskRow["status"], string> = {
  grace: "bg-destructive/15 text-destructive",
  past_due: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  trialing: "bg-muted text-muted-foreground",
};

export default async function ConsoleRevenuePage() {
  await requirePlatformAdmin();
  const [kpis, d] = await Promise.all([getPlatformKpis(), getRevenueDashboard()]);

  const chart: ChartMonth[] = d.months.map((m) => ({ label: m.label, mrr: m.mrr, new: m.new, expansion: m.expansion, contraction: m.contraction, churn: m.churn, net: m.net, collected: m.collected, invoices: m.invoices }));
  const hasMrrHistory = d.months.some((m) => m.mrr > 0);
  const hasMovements = d.months.some((m) => m.new || m.expansion || m.contraction || m.churn);
  const hasCash = d.months.some((m) => m.collected > 0);
  const lastMonth = d.months[d.months.length - 2];
  const tc = d.trialConversion;
  const brandNew = d.mrr === 0 && !hasMrrHistory && !hasCash && !hasMovements;

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <ConsoleNav active="revenue" pendingApprovals={kpis.pendingApprovals} />

        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Subscription revenue across every customer company (the platform owner is excluded). MRR is pre-tax at catalogue prices; yearly plans count as ⅟₁₂ per month.
          </p>
          <p className="text-xs text-muted-foreground" data-testid="revenue-as-of">
            As of {IST_DATETIME.format(new Date(d.generatedAt))} IST
          </p>
        </div>

        <KpiGrid cols={6}>
          <KpiCard label="MRR" value={formatMoney(d.mrr)} accent icon={<IndianRupee className="size-4" />} />
          <KpiCard label="ARR" value={formatMoney(d.arr)} icon={<TrendingUp className="size-4" />} />
          <KpiCard label="Paying companies" value={d.paying} icon={<Users className="size-4" />} />
          <KpiCard label="Trialing" value={d.counts.trialing} icon={<CalendarClock className="size-4" />} />
          <KpiCard label="ARPU (monthly)" value={d.arpu === null ? "—" : formatMoney(d.arpu)} icon={<Gauge className="size-4" />} />
          <KpiCard label={`Trial conversion (${tc.windowDays}d)`} value={pct(tc.rate)} icon={<BadgePercent className="size-4" />} />
        </KpiGrid>
        <p className="-mt-3 text-xs text-muted-foreground" data-testid="trial-conversion-note">
          Trial conversion: {tc.converted} of {tc.started - tc.open} ended trials converted{tc.open > 0 && `, ${tc.open} still running`}
          {tc.source === "current_state" ? " — estimated from current subscriptions (no trial history recorded yet)." : "."}
        </p>

        {brandNew && (
          <GlassCard interactive={false} data-testid="revenue-empty">
            <CardContent className="flex flex-col gap-1 py-5">
              <p className="font-semibold">No revenue yet</p>
              <p className="text-sm text-muted-foreground">
                Nothing has been billed so far. MRR, movements and collections fill in here as soon as the first company moves from its trial to a paid plan.
                {d.counts.trialing > 0 && ` ${d.counts.trialing} ${d.counts.trialing === 1 ? "company is" : "companies are"} trialing right now.`}
              </p>
            </CardContent>
          </GlassCard>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard interactive={false}>
            <CardHeader>
              <CardTitle className="text-base">MRR, last 12 months</CardTitle>
              <CardDescription>Month-end monthly recurring revenue; the last point is today.</CardDescription>
            </CardHeader>
            <CardContent>
              {hasMrrHistory ? <MrrTrendChart data={chart} /> : <EmptyChart title="No recurring revenue yet">The trend starts with the first paid subscription.</EmptyChart>}
              {d.history.untrackedPaying > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {d.history.untrackedPaying} paying {d.history.untrackedPaying === 1 ? "company has" : "companies have"} no subscription history yet and {d.history.untrackedPaying === 1 ? "is" : "are"} shown flat from sign-up.
                </p>
              )}
            </CardContent>
          </GlassCard>

          <GlassCard interactive={false}>
            <CardHeader>
              <CardTitle className="text-base">MRR movements</CardTitle>
              <CardDescription>
                New and expansion above the line, contraction and churn below.
                {lastMonth && ` ${lastMonth.label}: logo churn ${pct(lastMonth.logoChurnRate)}, MRR churn ${pct(lastMonth.mrrChurnRate)}.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasMovements ? (
                <MovementsChart data={chart} />
              ) : (
                <EmptyChart title="No movements recorded">Upgrades, downgrades, new paid companies and cancellations appear here month by month.</EmptyChart>
              )}
            </CardContent>
          </GlassCard>

          <GlassCard interactive={false}>
            <CardHeader>
              <CardTitle className="text-base">Plan mix</CardTitle>
              <CardDescription>Share of MRR by plan (paying companies only).</CardDescription>
            </CardHeader>
            <CardContent>
              {d.planMix.length === 0 ? (
                <EmptyChart title="No paid plans yet">Each plan&apos;s share of revenue shows here once companies subscribe.</EmptyChart>
              ) : (
                <ul className="space-y-4" data-testid="plan-mix">
                  {d.planMix.map((p) => (
                    <li key={p.planId}>
                      <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                        <span className="font-medium">{p.name}</span>
                        <span className="tabular-nums text-muted-foreground">
                          {formatMoney(p.mrr)} · {p.companies} {p.companies === 1 ? "company" : "companies"} · {pct(p.share)}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-[#2a78d6] dark:bg-[#3987e5]" style={{ width: `${Math.max(p.share * 100, p.mrr > 0 ? 1 : 0)}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground" data-testid="status-counts">
                {Object.entries(d.counts).map(([k, v]) => (
                  <span key={k}>
                    {STATUS_LABEL[k]} <span className="font-semibold tabular-nums text-foreground">{v}</span>
                  </span>
                ))}
              </div>
            </CardContent>
          </GlassCard>

          <GlassCard interactive={false}>
            <CardHeader>
              <CardTitle className="text-base">Collected revenue</CardTitle>
              <CardDescription>Paid invoices by month, including GST.</CardDescription>
            </CardHeader>
            <CardContent>
              {hasCash ? <CollectedChart data={chart} /> : <EmptyChart title="No payments collected yet">Paid subscription invoices are totalled here by the month they were paid.</EmptyChart>}
            </CardContent>
          </GlassCard>
        </div>

        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle className="text-base">At-risk subscriptions</CardTitle>
            <CardDescription>Failed payments (past due), grace periods, and trials ending within {AT_RISK_TRIAL_DAYS} days.</CardDescription>
          </CardHeader>
          <CardContent>
            {d.atRisk.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border/70 px-4 py-6 text-center text-sm text-muted-foreground" data-testid="at-risk-empty">
                Nothing at risk right now.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm" data-testid="at-risk">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="py-2 pr-3 font-medium">Company</th>
                      <th className="py-2 pr-3 font-medium">Plan</th>
                      <th className="py-2 pr-3 font-medium">Status</th>
                      <th className="py-2 pr-3 text-right font-medium">MRR at stake</th>
                      <th className="py-2 font-medium">Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.atRisk.map((r) => (
                      <tr key={r.companyId} className="border-b border-border/50 last:border-0">
                        <td className="py-2 pr-3">
                          <Link href={`/console/companies/${r.companyId}`} className="font-medium hover:underline">
                            {r.name}
                          </Link>
                          <span className="block text-xs text-muted-foreground">{r.slug}</span>
                        </td>
                        <td className="py-2 pr-3">{r.planName}</td>
                        <td className="py-2 pr-3">
                          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", RISK_TONE[r.status])}>{r.status === "trialing" ? "Trial ending" : STATUS_LABEL[r.status]}</span>
                        </td>
                        <td className="py-2 pr-3 text-right tabular-nums">{formatMoney(r.mrr)}</td>
                        <td className="py-2 tabular-nums">{r.deadline ? IST_DATE.format(new Date(r.deadline)) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </GlassCard>

        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle className="text-base">By month</CardTitle>
            <CardDescription>The figures behind the charts. Churn rates compare with the start of each month.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="revenue-months">
                <thead>
                  <tr className="border-b border-border text-right text-xs text-muted-foreground">
                    <th className="py-2 pr-3 text-left font-medium">Month</th>
                    <th className="py-2 pr-3 font-medium">MRR</th>
                    <th className="py-2 pr-3 font-medium">New</th>
                    <th className="py-2 pr-3 font-medium">Expansion</th>
                    <th className="py-2 pr-3 font-medium">Contraction</th>
                    <th className="py-2 pr-3 font-medium">Churn</th>
                    <th className="py-2 pr-3 font-medium">Net new</th>
                    <th className="py-2 pr-3 font-medium">Logo churn</th>
                    <th className="py-2 pr-3 font-medium">MRR churn</th>
                    <th className="py-2 font-medium">Collected</th>
                  </tr>
                </thead>
                <tbody className="tabular-nums">
                  {[...d.months].reverse().map((m) => (
                    <tr key={m.key} className="border-b border-border/50 text-right last:border-0">
                      <td className="py-2 pr-3 text-left">{m.label}</td>
                      <td className="py-2 pr-3">{formatMoney(m.mrr)}</td>
                      <td className="py-2 pr-3">{formatMoney(m.new)}</td>
                      <td className="py-2 pr-3">{formatMoney(m.expansion)}</td>
                      <td className="py-2 pr-3">{m.contraction ? `−${formatMoney(m.contraction)}` : formatMoney(0)}</td>
                      <td className="py-2 pr-3">{m.churn ? `−${formatMoney(m.churn)}` : formatMoney(0)}</td>
                      <td className="py-2 pr-3 font-medium">{signedMoney(m.net)}</td>
                      <td className="py-2 pr-3">{pct(m.logoChurnRate)}</td>
                      <td className="py-2 pr-3">{pct(m.mrrChurnRate)}</td>
                      <td className="py-2">{formatMoney(m.collected)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
