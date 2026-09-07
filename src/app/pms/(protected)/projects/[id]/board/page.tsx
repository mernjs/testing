import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import ProjectTabs from "@/components/pms/ProjectTabs";
import TaskBoard from "@/components/pms/tasks/TaskBoard";
import { getCurrentPmsUser } from "@/lib/pms-auth";
import { canManageProjects } from "@/lib/pms-roles";
import { getProject } from "@/lib/pms/projects";
import { boardTasks, listProjectLabels, serializeTask } from "@/lib/pms/tasks";
import { availableEmployees } from "@/lib/pms/project-members";
import { TASK_STATUS_ORDER, type TaskStatus } from "@/lib/pms/constants";
import type { SerializedTask } from "@/lib/pms/tasks";

export default async function ProjectBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, project] = await Promise.all([getCurrentPmsUser(), getProject(id)]);
  if (!project) notFound();
  const canManage = user ? canManageProjects(user.roles) : false;

  const [board, employees, labels] = await Promise.all([
    boardTasks(id),
    availableEmployees(),
    listProjectLabels(id),
  ]);

  const serializedBoard = Object.fromEntries(
    TASK_STATUS_ORDER.map((s) => [s, board[s].map((t) => serializeTask(t))])
  ) as Record<TaskStatus, SerializedTask[]>;

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "PMS", href: "/pms" },
          { label: "Projects", href: "/pms/projects" },
          { label: project.name, href: `/pms/projects/${id}` },
          { label: "Board" },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{project.name} · Board</h1>
        <Link href={`/pms/projects/${id}/tasks`} className="text-sm font-medium text-primary hover:underline">
          List view →
        </Link>
      </div>
      <ProjectTabs projectId={id} />

      <TaskBoard
        projectId={id}
        board={serializedBoard}
        employees={employees.map((e) => ({ _id: e._id, name: e.name, employeeCode: e.employeeCode }))}
        labelSuggestions={labels}
        canManage={canManage}
      />
    </div>
  );
}
