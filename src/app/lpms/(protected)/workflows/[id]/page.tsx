import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { getViewer } from "@/lib/lpms/viewer";
import { lpmsCan } from "@/lib/lpms-roles";
import { getWorkflow } from "@/lib/lpms/workflows";
import WorkflowForm from "@/components/lpms/WorkflowForm";

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const viewer = await getViewer();
  if (!viewer) redirect("/lpms/login");

  const ctx = { roles: viewer.roles, permissionOverrides: viewer.overrides };
  if (!lpmsCan(ctx, "MANAGE_POLICIES")) redirect("/lpms");

  const { id } = await params;
  const workflow = id === "new" ? null : await getWorkflow(id, viewer);
  if (id !== "new" && !workflow) notFound();

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Breadcrumbs
        items={[
          { label: "LPMS", href: "/lpms" },
          { label: "Workflows", href: "/lpms/workflows" },
          { label: workflow ? (workflow as any).name : "New Workflow" },
        ]}
      />

      <div className="flex items-center gap-3">
        <Link href="/lpms/workflows" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          {workflow ? `Edit: ${(workflow as any).name}` : "New Approval Workflow"}
        </h1>
      </div>

      <WorkflowForm workflow={workflow} />
    </div>
  );
}
