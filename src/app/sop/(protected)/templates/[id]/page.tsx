import { notFound, redirect } from "next/navigation";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import TemplateEditor from "@/components/sop/TemplateEditor";
import { getViewer } from "@/lib/sop/viewer";
import { getTemplate } from "@/lib/sop/templates";
import { getTaxonomy } from "@/lib/sop/taxonomy";
import { sopCan } from "@/lib/sop-roles";

export default async function TemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const viewer = await getViewer();
  if (!viewer) redirect("/sop/login");
  const ctx = { roles: viewer.roles, permissionOverrides: viewer.overrides };
  const canManage = sopCan(ctx, "MANAGE_TEMPLATES");
  if (!canManage && !sopCan(ctx, "CREATE")) redirect("/sop");
  const { id } = await params;
  const [template, tax] = await Promise.all([getTemplate(id), getTaxonomy()]);
  if (!template || (!template.active && !canManage)) notFound();

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "SOP", href: "/sop" }, { label: "Templates", href: "/sop/templates" }, { label: template.name }]} />
      <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{template.name}</h1>
      <GlassCard interactive={false}>
        <CardContent className="p-5">
          <TemplateEditor
            templateId={template._id}
            canEdit={canManage}
            departmentOptions={tax.departments.map((d) => ({ id: d.code, label: d.name, sub: d.code }))}
            initial={{ name: template.name, description: template.description, departmentCodes: template.departmentCodes, sections: template.sections, active: template.active, isSystem: template.isSystem }}
          />
        </CardContent>
      </GlassCard>
    </div>
  );
}
