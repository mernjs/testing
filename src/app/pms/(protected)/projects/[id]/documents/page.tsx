import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import ProjectTabs from "@/components/pms/ProjectTabs";
import DocumentsManager from "@/components/pms/DocumentsManager";
import { getCurrentPmsUser } from "@/lib/pms-auth";
import { canManageProjects } from "@/lib/pms-roles";
import { checkProjectAccess } from "@/lib/pms/access";
import { getProject } from "@/lib/pms/projects";
import { listCurrentDocuments, documentVersions, serializeDocument } from "@/lib/pms/documents";

export default async function ProjectDocumentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, project] = await Promise.all([getCurrentPmsUser(), getProject(id)]);
  if (!project) notFound();
  if (user && !(await checkProjectAccess(user, id)).allowed) notFound();
  const canManage = user ? canManageProjects(user.roles) : false;

  const current = await listCurrentDocuments(id);
  const groups = await Promise.all(
    current.map(async (doc) => ({
      current: serializeDocument(doc),
      versions: (await documentVersions(doc.rootId)).map((v) => serializeDocument(v)),
    }))
  );

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "PMS", href: "/pms" },
          { label: "Projects", href: "/pms/projects" },
          { label: project.name, href: `/pms/projects/${id}` },
          { label: "Files" },
        ]}
      />
      <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{project.name} · Files</h1>
      <ProjectTabs projectId={id} />
      <DocumentsManager projectId={id} groups={groups} canManage={canManage} />
    </div>
  );
}
