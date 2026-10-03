import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { getViewer } from "@/lib/lpms/viewer";
import { lpmsCan } from "@/lib/lpms-roles";
import { getMakerType } from "@/lib/lpms/makers";
import MakerTypeForm from "@/components/lpms/MakerTypeForm";

export default async function MakerTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const viewer = await getViewer();
  if (!viewer) redirect("/lpms/login");

  const ctx = { roles: viewer.roles, permissionOverrides: viewer.overrides };
  if (!lpmsCan(ctx, "MANAGE_MAKERS")) redirect("/lpms");

  const { id } = await params;
  const maker = id === "new" ? null : await getMakerType(id, viewer);
  if (id !== "new" && !maker) notFound();

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Breadcrumbs
        items={[
          { label: "LPMS", href: "/lpms" },
          { label: "Maker Types", href: "/lpms/makers" },
          { label: maker ? (maker as any).name : "New Maker Type" },
        ]}
      />

      <div className="flex items-center gap-3">
        <Link href="/lpms/makers" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          {maker ? `Edit: ${(maker as any).name}` : "New Maker Type"}
        </h1>
      </div>

      <MakerTypeForm maker={maker} />
    </div>
  );
}
