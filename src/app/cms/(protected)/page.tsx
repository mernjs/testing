import Link from "next/link";
import {
  Files, Image as ImageIcon, Menu as MenuIcon, Palette, ArrowRight, FileCheck2, Construction, Activity, Plus, Upload,
  BadgeInfo, Database, CircleCheck, CircleDashed, PenLine, Archive, Newspaper, Briefcase, Users, Boxes, LayoutDashboard,
} from "lucide-react";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import CmsPageHeader from "@/components/cms/ui/CmsPageHeader";
import { ContentStatusBadge, PendingChangesBadge } from "@/components/cms/ui/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import { listPages } from "@/lib/cms/pages";
import { listThemes, getActiveThemeKey } from "@/lib/cms/theme";
import { getSettings } from "@/lib/cms/settings";
import { listMedia } from "@/lib/cms/media";
import { listNavItems } from "@/lib/cms/nav";
import { listAudit, AUDIT_ACTION_LABEL } from "@/lib/cms/audit";
import { listAdminRecords } from "@/lib/cms/collections/store";
import { COLLECTIONS } from "@/lib/cms/collections/registry";
import type { CollectionKey } from "@/lib/cms/collections/types";
import { SITE_AREAS, areaOf, timeAgo, displayTitle } from "@/lib/cms/site-areas";
import { getViewer, can } from "@/lib/cms/viewer";
import { cn } from "@/lib/utils";

const COLLECTION_ICON: Record<CollectionKey, React.ComponentType<{ className?: string }>> = { blog: Newspaper, jobs: Briefcase, engagement: Users, products: Boxes };

export default async function CmsDashboardPage() {
  const keys = Object.keys(COLLECTIONS) as CollectionKey[];
  const [viewer, pages, themes, activeKey, settings, media, nav, audit, collections] = await Promise.all([
    getViewer(),
    listPages(),
    listThemes(),
    getActiveThemeKey(),
    getSettings(),
    listMedia(),
    listNavItems(),
    listAudit({ pageSize: 10 }),
    Promise.all(keys.map(async (k) => ({ key: k, rows: await listAdminRecords(k) }))),
  ]);

  const count = (status: string) => pages.filter((p) => p.status === status).length;
  const published = count("published");
  const drafts = count("draft");
  const archived = count("archived");
  const pending = pages.filter((p) => p.hasUnpublishedChanges).sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  const activeTheme = themes.find((t) => t._id === activeKey);
  const records = collections.flatMap((c) => c.rows);
  const recordsLive = records.filter((r) => r.state === "published").length;
  const byArea = SITE_AREAS.map((a) => ({ ...a, count: pages.filter((p) => areaOf(p.path) === a.key).length })).filter((a) => a.count > 0);

  const pct = (n: number) => (pages.length ? (n / pages.length) * 100 : 0);
  const quick = [
    { href: "/cms/pages", label: "New page", icon: Plus, show: viewer ? can(viewer, "PAGES_CREATE") : false },
    { href: "/cms/media", label: "Upload media", icon: Upload, show: true },
    { href: "/cms/navigation", label: "Edit menu", icon: MenuIcon, show: true },
    { href: "/cms/site-identity", label: "Site identity", icon: BadgeInfo, show: true },
  ].filter((q) => q.show);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <CmsPageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description="An overview of the website's content, what's waiting to be published and recent activity."
        actions={quick.map((q) => (
          <Link key={q.href + q.label} href={q.href} className={buttonVariants({ variant: q.label === "New page" ? "default" : "outline", size: "sm" })}>
            <q.icon className="size-3.5" /> {q.label}
          </Link>
        ))}
      />

      {settings.maintenanceMode.enabled && (
        <Link href="/cms/settings" className="flex items-center gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground transition-colors hover:bg-amber-500/15">
          <Construction className="size-5 shrink-0 text-amber-600" />
          <span>
            <strong>Maintenance mode is on</strong> — public visitors currently see the maintenance page. Turn it off in Settings.
          </span>
          <ArrowRight className="ml-auto size-4 shrink-0" />
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Link href="/cms/pages"><KpiCard label="Published pages" value={published} icon={<Files className="size-4" />} accent /></Link>
        <Link href="/cms/pages?status=pending"><KpiCard label="Awaiting publish" value={pending.length} icon={<PenLine className="size-4" />} /></Link>
        <Link href="/cms/collections"><KpiCard label="Live records" value={recordsLive} icon={<Database className="size-4" />} /></Link>
        <Link href="/cms/media"><KpiCard label="Media files" value={media.length} icon={<ImageIcon className="size-4" />} /></Link>
      </div>

      <GlassCard interactive={false} className="space-y-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-foreground">Publishing status</p>
          <p className="text-xs text-muted-foreground">{pages.length} pages in the CMS</p>
        </div>
        <div className="flex h-2.5 overflow-hidden rounded-full bg-muted" role="img" aria-label={`${published} published, ${drafts} draft, ${archived} archived`}>
          <div className="bg-emerald-500" style={{ width: `${pct(published)}%` }} />
          <div className="bg-sky-500" style={{ width: `${pct(drafts)}%` }} />
          <div className="bg-muted-foreground/40" style={{ width: `${pct(archived)}%` }} />
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><CircleCheck className="size-3.5 text-emerald-500" /> {published} published</span>
          <span className="flex items-center gap-1.5"><CircleDashed className="size-3.5 text-sky-500" /> {drafts} draft</span>
          <span className="flex items-center gap-1.5"><PenLine className="size-3.5 text-amber-500" /> {pending.length} with unpublished changes</span>
          <span className="flex items-center gap-1.5"><Archive className="size-3.5" /> {archived} archived</span>
        </div>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-5">
        <GlassCard interactive={false} className="p-5 lg:col-span-3">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <PenLine className="size-4 text-primary" /> Needs publishing
            </p>
            {pending.length > 0 && (
              <Link href="/cms/pages?status=pending" className="text-xs font-medium text-primary hover:underline">View all</Link>
            )}
          </div>
          {pending.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-2 pb-4 text-center text-sm text-muted-foreground">
              <FileCheck2 className="size-8 text-emerald-500" />
              Everything in the CMS is published.
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-border/60">
              {pending.slice(0, 7).map((p) => (
                <li key={p._id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{displayTitle(p.title, p.path)}</p>
                    <p className="truncate font-mono text-xs text-muted-foreground">{p.path} · edited {timeAgo(p.updatedAt)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {p.live ? <PendingChangesBadge className="hidden sm:inline-flex" /> : <ContentStatusBadge status="draft" />}
                    <Link href={`/cms/pages/${p._id}`} className={buttonVariants({ variant: "outline", size: "xs" })}>Edit</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard interactive={false} className="p-5 lg:col-span-2">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Activity className="size-4 text-primary" /> Recent activity
          </p>
          {audit.items.length === 0 ? (
            <p className="mt-6 text-center text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ol className="relative mt-4 space-y-3 border-l border-border/60 pl-4">
              {audit.items.map((a) => (
                <li key={a._id} className="relative text-sm">
                  <span className="absolute -left-[21px] top-1.5 size-2 rounded-full bg-primary/70 ring-4 ring-background" />
                  <p className="text-foreground">
                    <span className="font-medium">{AUDIT_ACTION_LABEL[a.action] ?? a.action}</span>{" "}
                    <span className="text-muted-foreground">{a.entity}</span>
                    {a.entityLabel ? <span className="text-foreground"> “{a.entityLabel}”</span> : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.actorEmail ?? "system"} · <time dateTime={new Date(a.createdAt).toISOString()} title={new Date(a.createdAt).toLocaleString()}>{timeAgo(a.createdAt)}</time>
                  </p>
                </li>
              ))}
            </ol>
          )}
          <Link href="/cms/audit-logs" className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            Full audit log <ArrowRight className="size-3" />
          </Link>
        </GlassCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard interactive={false} className="p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Files className="size-4 text-primary" /> Pages by site area
          </p>
          <ul className="mt-3 space-y-1">
            {byArea.map((a) => (
              <li key={a.key}>
                <Link href={`/cms/pages?area=${a.key}`} className="group flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-primary/5">
                  <span className="flex-1 text-foreground group-hover:text-primary">{a.label}</span>
                  <span className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                    <span className="block h-full rounded-full bg-primary/60" style={{ width: `${pct(a.count)}%` }} />
                  </span>
                  <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">{a.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard interactive={false} className="p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Database className="size-4 text-primary" /> Collections
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {collections.map(({ key, rows }) => {
              const Icon = COLLECTION_ICON[key];
              const live = rows.filter((r) => r.state === "published").length;
              const changes = rows.filter((r) => r.hasUnpublishedChanges).length;
              return (
                <li key={key}>
                  <Link href={`/cms/collections/${key}`} className="group flex items-center gap-3 rounded-xl border border-border/50 p-3 transition-colors hover:border-primary/40 hover:bg-primary/5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="size-4" /></span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground group-hover:text-primary">{COLLECTIONS[key].label}</span>
                      <span className={cn("block text-xs", changes ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
                        {live} live{changes ? ` · ${changes} unpublished` : ""}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <Link href="/cms/navigation" className="flex items-center gap-1.5 hover:text-primary"><MenuIcon className="size-3.5" /> {nav.length} menu items</Link>
            <Link href="/cms/theme" className="flex items-center gap-1.5 hover:text-primary"><Palette className="size-3.5" /> Theme: {activeTheme?.name ?? activeKey}</Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
