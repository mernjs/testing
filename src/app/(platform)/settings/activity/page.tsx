import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { listEventActors, listEvents } from "@/lib/platform/events";
import { EVENT_TYPES, eventLabel, isEventType } from "@/lib/platform/events/catalog";
import { formatDateTime } from "@/lib/utils";
import ActivityFilterBar from "./ActivityFilterBar";

export const metadata: Metadata = { title: "Activity log", robots: { index: false, follow: false } };

type SP = { type?: string; actor?: string; from?: string; to?: string; page?: string };
const PAGE_SIZE = 50;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

function day(value: string | undefined, endOfDay: boolean): Date | undefined {
  if (!value || !DAY.test(value)) return undefined;
  const d = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function ActivitySettingsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  if (!user.roles.includes("super_admin")) redirect("/workspace");

  const sp = await searchParams;
  const page = Math.max(1, Math.floor(Number(sp.page)) || 1);
  const type = isEventType(sp.type) ? sp.type : "";
  const [list, actors] = await Promise.all([
    listEvents({ types: type ? [type] : undefined, actorId: sp.actor || undefined, from: day(sp.from, false), to: day(sp.to, true) }, { limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }),
    listEventActors(),
  ]);
  const totalPages = Math.max(1, Math.ceil(list.total / PAGE_SIZE));
  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries({ type, actor: sp.actor, from: sp.from, to: sp.to })) if (v) params.set(k, v);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/settings/activity?${qs}` : "/settings/activity";
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <Link href="/settings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Company settings
        </Link>
        <GlassCard interactive={false}>
          <CardHeader>
            <CardTitle className="text-xl">Activity log</CardTitle>
            <CardDescription>What happened across your workspace — who did what, and when. Kept for 180 days.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ActivityFilterBar initial={{ type, actor: sp.actor ?? "", from: sp.from ?? "", to: sp.to ?? "" }} types={EVENT_TYPES.map((t) => ({ value: t.type, label: t.label }))} actors={actors} />

            <p id="activity-count" className="text-xs text-muted-foreground">
              {list.total.toLocaleString("en-IN")} {list.total === 1 ? "event" : "events"}
            </p>

            {list.items.length === 0 ? (
              <p className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">Nothing matches these filters yet.</p>
            ) : (
              <ul id="activity-list" className="divide-y rounded-xl border">
                {list.items.map((e) => (
                  <li key={e.id} className="flex flex-col gap-0.5 px-3 py-2.5 sm:flex-row sm:items-baseline sm:gap-3" data-event-type={e.type}>
                    <span className="shrink-0 text-xs text-muted-foreground sm:w-40">{formatDateTime(e.at)}</span>
                    <span className="min-w-0 flex-1 text-sm break-words">
                      <span className="font-medium">{eventLabel(e.type)}</span>
                      {e.label && (
                        <>
                          {": "}
                          {e.url ? (
                            <Link href={e.url} className="text-primary underline-offset-4 hover:underline">
                              {e.label}
                            </Link>
                          ) : (
                            e.label
                          )}
                        </>
                      )}
                      {e.source === "import" && <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground">import</span>}
                    </span>
                    <span className="shrink-0 text-xs break-all text-muted-foreground">{e.actorEmail ?? (e.actorId ? "Someone" : "Automatic")}</span>
                  </li>
                ))}
              </ul>
            )}

            {totalPages > 1 && (
              <nav className="flex items-center justify-between text-sm" aria-label="Pages">
                {page > 1 ? (
                  <Link href={pageHref(page - 1)} className="text-primary hover:underline">
                    ← Newer
                  </Link>
                ) : (
                  <span />
                )}
                <span className="text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages ? (
                  <Link href={pageHref(page + 1)} className="text-primary hover:underline">
                    Older →
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            )}
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
