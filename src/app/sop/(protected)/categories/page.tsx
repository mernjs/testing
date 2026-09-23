import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import CategoriesManager from "@/components/sop/CategoriesManager";
import { getViewer } from "@/lib/sop/viewer";
import { getTaxonomy } from "@/lib/sop/taxonomy";
import { listVisibleSummaries } from "@/lib/sop/sops";
import { sopCan } from "@/lib/sop-roles";

export default async function CategoriesPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/sop/login");
  const [tax, summaries] = await Promise.all([getTaxonomy(), listVisibleSummaries(viewer)]);
  const canManage = sopCan({ roles: viewer.roles, permissionOverrides: viewer.overrides }, "MANAGE_TEMPLATES");
  const rows = tax.categories.map((c) => ({
    id: c._id,
    name: c.name,
    color: c.color,
    description: c.description,
    active: c.active,
    count: summaries.filter((s) => s.categoryId === c._id && s.status !== "archived").length,
  }));

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "SOP", href: "/sop" }, { label: "Categories" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Categories</h1>
        <p className="text-sm text-muted-foreground">Cross-department groupings for SOPs. Click a category to see its SOPs.</p>
      </div>
      <CategoriesManager rows={rows} canManage={canManage} />
    </div>
  );
}
