import PanelPageHeader from "@/components/platform/panel/PanelPageHeader";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getViewer } from "@/lib/lpms/viewer";
import { lpmsCan } from "@/lib/lpms-roles";
import { getCategory } from "@/lib/lpms/categories";
import CategoryForm from "@/components/lpms/CategoryForm";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const viewer = await getViewer();
  if (!viewer) redirect("/lpms/login");

  const ctx = { roles: viewer.roles, permissionOverrides: viewer.overrides };
  if (!lpmsCan(ctx, "MANAGE_POLICIES")) redirect("/lpms");

  const { id } = await params;
  const category = id === "new" ? null : await getCategory(id, viewer);
  if (id !== "new" && !category) notFound();

  return (
    <div className="space-y-4 p-4 sm:p-6">

      <div className="flex items-center gap-3">
        <Link href="/lpms/categories" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <ArrowLeft className="size-4" />
        </Link>
        <PanelPageHeader
          title={<>{category ? `Edit: ${(category as any).name}` : "New Category"}</>}
        />
      </div>

      <CategoryForm category={category} />
    </div>
  );
}
