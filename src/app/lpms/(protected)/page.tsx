import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  FileText,
  CheckSquare,
  PencilLine,
  Bot,
  CalendarClock,
  Plus,
  ArrowRight,
  Clock,
  Layers,
} from 'lucide-react';
import { CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import GlassCard from '@/components/lms/GlassCard';
import KpiGrid from '@/components/lms/KpiGrid';
import Breadcrumbs from '@/components/lms/Breadcrumbs';
import KpiLink from '@/components/sop/KpiLink';
import { BarsChart, DonutChart, TrendChart } from '@/components/sop/SopCharts';
import { getViewer } from '@/lib/lpms/viewer';
import { getLpmsDashboard } from '@/lib/lpms/analytics';
import { lpmsCan } from '@/lib/lpms-roles';

function ChartCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <GlassCard interactive={false} className={className}>
      <CardHeader className="pb-1">
        <CardTitle className="text-sm font-bold">{title}</CardTitle>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </GlassCard>
  );
}

export default async function LpmsDashboardPage() {
  const viewer = await getViewer();
  if (!viewer) redirect('/lpms/login');

  const d = await getLpmsDashboard(viewer);
  const k = d.kpis;

  const ctx = { roles: viewer.roles, permissionOverrides: viewer.overrides };
  const canCreate = lpmsCan(ctx, 'CREATE');
  const canApprove = lpmsCan(ctx, 'APPROVE');

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'LPMS', href: '/lpms' }, { label: 'Dashboard' }]} />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Legal &amp; Document Automation
          </h1>
          <p className="text-sm text-muted-foreground">
            Documents, templates, and approval workflows you can access. Click any tile or chart to open the matching list.
          </p>
        </div>
        {canCreate && (
          <Link href="/lpms/documents/new" className={buttonVariants({ size: 'sm' })}>
            <Plus className="size-3.5" data-icon="inline-start" />
            New Document
          </Link>
        )}
      </div>

      {/* Pending approvals action banner */}
      {k.pendingApprovals > 0 && canApprove && (
        <Link
          href="/lpms/approvals"
          className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm transition-colors hover:bg-primary/10"
        >
          <CheckSquare className="size-5 shrink-0 text-primary" />
          <span className="min-w-0 flex-1">
            <span className="font-semibold text-foreground">
              {k.pendingApprovals} document{k.pendingApprovals === 1 ? '' : 's'} waiting for your approval
            </span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
        </Link>
      )}

      {/* KPI tiles */}
      <KpiGrid>
        <KpiLink
          href="/lpms/documents"
          label="Total Documents"
          value={k.totalDocuments}
          accent
          icon={<FileText className="size-4" />}
        />
        <KpiLink
          href="/lpms/documents?status=active"
          label="Active Documents"
          value={k.activeDocuments}
          icon={<CheckSquare className="size-4" />}
        />
        <KpiLink
          href="/lpms/documents?status=draft"
          label="Draft Documents"
          value={k.draftDocuments}
          icon={<PencilLine className="size-4" />}
        />
        <KpiLink
          href="/lpms/approvals"
          label="Pending Approvals"
          value={k.pendingApprovals}
          tone={k.pendingApprovals > 0 ? 'down' : undefined}
          icon={<Clock className="size-4" />}
        />
        <KpiLink
          href="/lpms/documents?filter=ai"
          label="AI Generated"
          value={k.aiGenerated}
          icon={<Bot className="size-4" />}
        />
        <KpiLink
          href="/lpms/documents?attention=expiring"
          label="Expiring Documents"
          value={k.expiringDocuments}
          tone={k.expiringDocuments > 0 ? 'down' : undefined}
          icon={<CalendarClock className="size-4" />}
        />
      </KpiGrid>

      {/* Charts grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Documents by Status" description="Draft → Review → Approved → Active → Archived">
          <DonutChart data={d.byStatus} emptyLabel="No documents yet." />
        </ChartCard>

        <ChartCard title="Documents by Maker Type" description="Click a bar to filter the document list">
          <BarsChart data={d.byMakerType} emptyLabel="No documents yet." />
        </ChartCard>

        <ChartCard title="Documents by Category">
          <BarsChart data={d.byCategory} emptyLabel="No categories configured yet." />
        </ChartCard>

        <ChartCard title="Document Creation Trend" description="New documents per month, last 12 months">
          <TrendChart
            data={d.creationTrend}
            id="lpms-create"
          />
        </ChartCard>
      </div>

      {/* Recent Documents table */}
      {d.recentDocuments.length > 0 && (
        <GlassCard interactive={false}>
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold">Recent Documents</CardTitle>
              <Link
                href="/lpms/documents"
                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                View all
                <ArrowRight className="size-3" />
              </Link>
            </div>
            <CardDescription className="text-xs">Last 5 created or updated documents</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border/40 text-sm">
              {d.recentDocuments.map((doc) => (
                <li key={doc.id}>
                  <Link
                    href={`/lpms/documents/${doc.id}`}
                    className="flex items-center justify-between gap-3 py-2 hover:text-primary"
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-2">
                      <Layers className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="min-w-0 truncate font-medium">{doc.title || 'Untitled Document'}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {doc.documentNumber && (
                        <span className="text-xs text-muted-foreground">{doc.documentNumber}</span>
                      )}
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize text-muted-foreground">
                        {doc.status}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </GlassCard>
      )}
    </div>
  );
}
