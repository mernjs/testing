import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, UserCheck, SearchX } from "lucide-react";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { getWorkspaceNav } from "@/lib/workspace/access";
import { loadExecutiveOverview } from "@/lib/workspace/executive-overview";
import { PANEL_CONFIGS, getPanelHeadlineStats, type PanelKey } from "@/lib/workspace/panel-analytics";
import ExecutiveSection from "@/components/workspace/ExecutiveSection";
import { AnalyticsFilterBar } from "@/components/workspace/AnalyticsFilterBar";
import { PanelPerformanceMatrix } from "@/components/workspace/CommandCenterSections";
import { PanelAnalyticsBlock } from "./analytics/[panel]/PanelAnalyticsBlock";

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local.split(/[._-]/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ") || email;
}

const first = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export default async function HubDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  if (user.mustChangePassword) redirect("/workspace/change-password");

  const sp = await searchParams;
  const q = first(sp.q)?.trim().toLowerCase() ?? "";
  const onlyPanel = first(sp.panel);

  // The matrix numbers come from the executive loader (null for anyone without the Command Center permission).
  const executive = await loadExecutiveOverview(
    { roles: user.roles, permissionOverrides: user.permissionOverrides ?? null },
    { dateFrom: first(sp.dateFrom), dateTo: first(sp.dateTo), granularity: first(sp.granularity) },
  );

  // Which panels this person gets comes from the Workspace navigation (roles, permission overrides, plan, switched-on panels).
  const session = await getWorkspaceNav();
  const allowed = new Set(session?.nav.allowed ?? []);
  const locked = session?.nav.lockedPanels ?? [];
  const panelKeys = (Object.keys(PANEL_CONFIGS) as PanelKey[]).sort((a, b) => PANEL_CONFIGS[a].label.localeCompare(PANEL_CONFIGS[b].label));
  const visibleKeys = panelKeys.filter((k) => allowed.has(`analytics.${k}`) || allowed.has(`panel.${k}`));

  const matches = (k: PanelKey) => {
    const c = PANEL_CONFIGS[k];
    return (!onlyPanel || onlyPanel === k) && (!q || c.label.toLowerCase().includes(q) || k.includes(q) || c.description.toLowerCase().includes(q));
  };
  const sections = visibleKeys.filter((k) => allowed.has(`analytics.${k}`) && matches(k));
  const matrixPanels = visibleKeys.filter(matches);
  const matrixLocked = locked.filter((k) => panelKeys.includes(k as PanelKey) && matches(k as PanelKey));

  const headline = Object.fromEntries(
    await Promise.all(matrixPanels.map(async (k) => [k, await getPanelHeadlineStats(k, { dateFrom: first(sp.dateFrom), dateTo: first(sp.dateTo) })] as const)),
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative space-y-8">
      {/* ── Welcome ── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/40 bg-gradient-to-r from-primary/10 via-card to-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{greeting}, {nameFromEmail(user.email)}</h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3" />
              Staff Hub
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as <span className="font-semibold text-foreground">{user.email}</span> · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Link
          href="/hrms/me"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md transition-all hover:scale-[1.02] hover:bg-primary/90"
        >
          <UserCheck className="size-4" />
          My Attendance Portal
        </Link>
      </div>

      {/* ── Section 1: whole-dashboard search & filter + panel performance matrix ── */}
      <section id="dashboard-overview" data-section="overview" className="space-y-6">
        <AnalyticsFilterBar
          title="Whole Dashboard Search & Filter"
          fields={[
            { key: "q", label: "Search panels", type: "text", placeholder: "Search any panel, e.g. finance, leads, SEO…" },
            { key: "panel", label: "Panel", type: "select", options: visibleKeys.map((k) => ({ label: PANEL_CONFIGS[k].label, value: k })) },
          ]}
        />
        <PanelPerformanceMatrix modules={executive?.modules} stats={headline} panels={matrixPanels} locked={matrixLocked} />
      </section>

      {/* ── Section 2: one analytics block per panel ── */}
      {sections.length === 0 ? (
        <ExecutiveSection title="Panel analytics">
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/60 py-12 text-center text-sm text-muted-foreground">
            <SearchX className="size-6" />
            {q || onlyPanel ? "No panel matches your search." : "No panel analytics are available for your account yet."}
          </div>
        </ExecutiveSection>
      ) : (
        sections.map((k) => (
          <div key={k} className="rounded-3xl border border-border/40 bg-card/40 p-5 shadow-sm sm:p-6">
            <PanelAnalyticsBlock panel={k} user={user} sp={sp} prefix={k} compact />
          </div>
        ))
      )}
    </div>
  );
}
