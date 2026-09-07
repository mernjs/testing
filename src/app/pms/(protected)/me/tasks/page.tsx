import Breadcrumbs from "@/components/lms/Breadcrumbs";
import MyTasksView from "@/components/pms/MyTasksView";
import { getCurrentPmsUser } from "@/lib/pms-auth";
import { tasksForAssignee } from "@/lib/pms/tasks";

export default async function MyTasksPage() {
  const user = await getCurrentPmsUser();
  if (!user?.employeeId) return null;

  const rows = await tasksForAssignee(user.employeeId, { includeDone: true });
  const projects = Array.from(new Map(rows.map((t) => [t.projectId, { _id: t.projectId, name: t.projectName }])).values());

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "PMS", href: "/pms/me" }, { label: "My Tasks" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">My Tasks</h1>
        <p className="text-sm text-muted-foreground">Every task assigned to you, across all projects. Open one to update it.</p>
      </div>

      <MyTasksView
        tasks={rows.map((t) => ({
          _id: t._id,
          taskCode: t.taskCode,
          title: t.title,
          status: t.status,
          priority: t.priority,
          dueDate: t.dueDate,
          projectId: t.projectId,
          projectName: t.projectName,
          projectCode: t.projectCode,
        }))}
        projects={projects}
      />
    </div>
  );
}
