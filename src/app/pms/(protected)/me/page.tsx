import Link from "next/link";
import { ListChecks, AlarmClock, CalendarClock } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import KpiCard from "@/components/lms/KpiCard";
import KpiGrid from "@/components/lms/KpiGrid";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { PriorityBadge, TaskStatusBadge, ProjectStatusBadge } from "@/components/pms/StatusBadges";
import { getCurrentPmsUser } from "@/lib/pms-auth";
import { tasksForAssignee } from "@/lib/pms/tasks";
import { searchProjects, serializeProject } from "@/lib/pms/projects";
import { cn, formatDate } from "@/lib/utils";

export default async function MyWorkPage() {
  const user = await getCurrentPmsUser();

  if (!user?.employeeId) {
    return (
      <div className="space-y-4">
        <Breadcrumbs items={[{ label: "PMS", href: "/pms" }, { label: "My Work" }]} />
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">My Work</h1>
        <GlassCard>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Your PMS account isn’t linked to an employee record, so there are no personal task
            assignments to show. Ask an admin to link your account via <span className="font-mono">npm run pms:grant</span>.
          </CardContent>
        </GlassCard>
      </div>
    );
  }

  const [tasks, managed] = await Promise.all([
    tasksForAssignee(user.employeeId),
    searchProjects({ projectManagerId: user.employeeId, pageSize: 50 }),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const in7Date = new Date();
  in7Date.setDate(in7Date.getDate() + 7);
  const in7 = in7Date.toISOString().slice(0, 10);
  const overdue = tasks.filter((t) => t.dueDate && t.dueDate < today).length;
  const dueSoon = tasks.filter((t) => t.dueDate && t.dueDate >= today && t.dueDate <= in7).length;
  const managedProjects = managed.items.map((p) => serializeProject(p));

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "PMS", href: "/pms" }, { label: "My Work" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">My Work</h1>
        <p className="text-sm text-muted-foreground">Open tasks assigned to you across every project.</p>
      </div>

      <KpiGrid>
        <KpiCard label="Open Tasks" value={tasks.length} accent icon={<ListChecks className="size-4" />} />
        <KpiCard label="Overdue" value={overdue} tone={overdue > 0 ? "down" : undefined} icon={<AlarmClock className="size-4" />} />
        <KpiCard label="Due This Week" value={dueSoon} icon={<CalendarClock className="size-4" />} />
        <KpiCard label="Projects I Manage" value={managedProjects.length} icon={<ListChecks className="size-4" />} />
      </KpiGrid>

      <GlassCard>
        <CardHeader><CardTitle>Assigned Tasks</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {tasks.length === 0 && <p className="text-sm text-muted-foreground">Nothing assigned to you right now.</p>}
          {tasks.map((t) => (
            <Link
              key={t._id}
              href={`/pms/projects/${t.projectId}/tasks/${t._id}`}
              className="block rounded-lg border border-border/60 p-3 text-sm transition-colors hover:bg-muted/50"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="min-w-0 truncate font-medium">{t.title}</span>
                <div className="flex items-center gap-1.5">
                  <PriorityBadge priority={t.priority} />
                  <TaskStatusBadge status={t.status} />
                </div>
              </div>
              <p className={cn("mt-0.5 text-xs text-muted-foreground", t.dueDate && t.dueDate < today && "font-medium text-destructive")}>
                {t.projectCode} · {t.projectName}
                {t.dueDate ? ` · Due ${formatDate(t.dueDate)}` : ""}
              </p>
            </Link>
          ))}
        </CardContent>
      </GlassCard>

      {managedProjects.length > 0 && (
        <GlassCard>
          <CardHeader><CardTitle>Projects I Manage</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {managedProjects.map((p) => (
              <Link
                key={p._id}
                href={`/pms/projects/${p._id}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3 text-sm transition-colors hover:bg-muted/50"
              >
                <span className="min-w-0 truncate font-medium">{p.name}</span>
                <ProjectStatusBadge status={p.status} />
              </Link>
            ))}
          </CardContent>
        </GlassCard>
      )}
    </div>
  );
}
