import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Building2, CalendarPlus, CircleCheck, CirclePause, Clock, CreditCard, Hourglass, Sparkles, Timer } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import PlatformPageHeader from "@/components/platform/panel/PlatformPageHeader";
import { requirePlatformAccess } from "@/lib/platform/console/access";
import { getPlatformKpis } from "@/lib/platform/console/companies";
import { getSubscriptionSnapshot } from "@/lib/platform/console/overview";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function PlatformDashboardPage({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  await requirePlatformAccess();
  const { denied } = await searchParams;
  const [kpis, subs] = await Promise.all([getPlatformKpis(), getSubscriptionSnapshot()]);
  const overdue = subs.counts.past_due + subs.counts.grace;

  return (
    <div className="space-y-6 p-1">
      <PlatformPageHeader title="Dashboard" description="The whole SaaS platform at a glance — tenants, subscriptions and what needs attention." />
      {denied && (
        <p role="alert" className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-300">
          Your platform role doesn&apos;t include access to that page. Ask a Platform Owner if you need it.
        </p>
      )}

      <KpiGrid cols={6}>
        <KpiCard label="Companies" value={kpis.total} icon={<Building2 className="size-4" />} />
        <KpiCard label="Active" value={kpis.active} icon={<CircleCheck className="size-4" />} />
        <KpiCard label="Suspended" value={kpis.suspended} icon={<CirclePause className="size-4" />} />
        <KpiCard label="New (7 days)" value={kpis.createdLast7Days} icon={<Sparkles className="size-4" />} />
        <KpiCard label="New (30 days)" value={kpis.createdLast30Days} icon={<CalendarPlus className="size-4" />} />
        <KpiCard label="Awaiting approval" value={kpis.pendingApprovals} icon={<Hourglass className="size-4" />} />
      </KpiGrid>

      <KpiGrid cols={4}>
        <KpiCard label="On trial" value={subs.counts.trialing} icon={<Timer className="size-4" />} />
        <KpiCard label="Paying" value={subs.counts.active} icon={<CreditCard className="size-4" />} />
        <KpiCard label="Payment overdue" value={overdue} icon={<AlertTriangle className="size-4" />} />
        <KpiCard label="Suspended / ended" value={subs.counts.suspended + subs.counts.canceled} icon={<Clock className="size-4" />} />
      </KpiGrid>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle className="text-base">Trials ending in 7 days</CardTitle>
            <CardDescription>Companies that haven&apos;t chosen a plan yet.</CardDescription>
          </CardHeader>
          <CardContent>
            {subs.trialsEndingSoon.length === 0 ? (
              <p className="text-sm text-muted-foreground">No trials end in the next week.</p>
            ) : (
              <ul className="divide-y divide-border">
                {subs.trialsEndingSoon.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                    <Link href={`/platform/companies/${t.id}`} className="truncate font-medium hover:underline">
                      {t.name}
                    </Link>
                    <span className="shrink-0 text-xs text-muted-foreground" suppressHydrationWarning>
                      {t.daysLeft <= 0 ? "ends today" : `${t.daysLeft} day${t.daysLeft === 1 ? "" : "s"} left`} · {formatDateTime(t.endsAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </GlassCard>

        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle className="text-base">Needs attention</CardTitle>
            <CardDescription>Decisions and follow-ups waiting for the platform team.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Link href="/platform/signups" className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-muted/50">
              <span>Sign-ups awaiting approval</span>
              <span className="font-semibold">{kpis.pendingApprovals}</span>
            </Link>
            <Link href="/platform/companies?status=suspended" className="flex items-center justify-between rounded-lg border px-3 py-2 hover:bg-muted/50">
              <span>Suspended companies</span>
              <span className="font-semibold">{kpis.suspended}</span>
            </Link>
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span>Subscriptions with overdue payment</span>
              <span className="font-semibold">{overdue}</span>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
