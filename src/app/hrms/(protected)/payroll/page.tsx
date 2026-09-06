import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import PayrollRunManager from "@/components/hrms/PayrollRunManager";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { canRunPayroll } from "@/lib/hrms-roles";
import { listRuns, serializeRun } from "@/lib/hrms/payroll-run";

export default async function PayrollPage() {
  const user = await getCurrentHrmsUser();
  if (!user || !canRunPayroll(user.roles)) redirect("/hrms");

  const runs = (await listRuns()).map(serializeRun);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "HRMS", href: "/hrms" }, { label: "Payroll" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Payroll</h1>
        <p className="text-sm text-muted-foreground">
          Generate monthly runs, review payslips, approve, and lock the period once paid.
        </p>
      </div>

      <PayrollRunManager
        runs={runs.map((r) => ({
          _id: r._id,
          month: r.month,
          status: r.status,
          payslipCount: r.payslipCount,
          totalGross: r.totalGross,
          totalNet: r.totalNet,
          totalEmployerCost: r.totalEmployerCost,
          generatedAt: r.generatedAt,
        }))}
      />
    </div>
  );
}
