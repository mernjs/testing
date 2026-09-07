import { notFound } from "next/navigation";
import {
  Clock,
  IndianRupee,
  FolderGit2,
  BadgeCheck,
  Briefcase,
  Layers,
} from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { ProgramCategoryBadge, ProgramStatusBadge, TrainingModeBadge } from "@/components/tms/StatusBadges";
import ProgramActions from "@/components/tms/ProgramActions";
import { getCurrentTmsUser } from "@/lib/tms-auth";
import { canManageProgramsBatches } from "@/lib/tms-roles";
import { getProgram, serializeProgram } from "@/lib/tms/programs";
import { getTmsSettings } from "@/lib/tms/settings";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [program, user, settings] = await Promise.all([getProgram(id), getCurrentTmsUser(), getTmsSettings()]);
  if (!program) notFound();

  const canManage = user ? canManageProgramsBatches(user.roles) : false;
  const p = serializeProgram(program);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "TMS", href: "/tms" }, { label: "Programs", href: "/tms/programs" }, { label: p.name }]} />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{p.name}</h1>
            <ProgramStatusBadge status={p.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-mono">{p.programCode}</span>
            {p.technology ? ` · ${p.technology}` : ""}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <ProgramCategoryBadge category={p.category} />
            <TrainingModeBadge mode={p.mode} />
          </div>
        </div>
        {canManage && <ProgramActions program={p} technologySuggestions={settings.technologySuggestions} />}
      </div>

      <KpiGrid>
        <KpiCard label="Duration" value={p.durationWeeks ?? 0} suffix=" wk" accent icon={<Clock className="size-4" />} />
        <KpiCard
          label="Fees"
          value={p.fees ?? 0}
          format="currency"
          icon={<IndianRupee className="size-4" />}
        />
        <KpiCard label="Live Projects" value={p.liveProjectCount} icon={<FolderGit2 className="size-4" />} />
        <KpiCard label="Batches" value={0} icon={<Layers className="size-4" />} />
      </KpiGrid>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="whitespace-pre-wrap text-muted-foreground">{p.description || "No description yet."}</p>
            <dl className="space-y-1.5">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Currency</dt>
                <dd>{p.currency}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Fees</dt>
                <dd>{p.fees != null ? formatCurrency(p.fees, p.currency) : "—"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Certificate included</dt>
                <dd>{p.certificateIncluded ? <BadgeCheck className="size-4 text-green-600 dark:text-green-400" /> : "No"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Placement assistance</dt>
                <dd>{p.placementAssistance ? <Briefcase className="size-4 text-green-600 dark:text-green-400" /> : "No"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Last updated</dt>
                <dd>{formatDateTime(p.updatedAt)}</dd>
              </div>
            </dl>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader><CardTitle>Learning Outcomes</CardTitle></CardHeader>
          <CardContent>
            {p.learningOutcomes.length === 0 ? (
              <p className="text-sm text-muted-foreground">None listed.</p>
            ) : (
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {p.learningOutcomes.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            )}
            {p.tools.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tools.map((t) => (
                  <span key={t} className="rounded-md bg-primary/8 px-2 py-0.5 text-xs font-medium text-primary">{t}</span>
                ))}
              </div>
            )}
          </CardContent>
        </GlassCard>
      </div>

      <p className="text-xs text-muted-foreground">
        Batches, enrolments and revenue for this program appear here as later TMS phases land.
      </p>
    </div>
  );
}
