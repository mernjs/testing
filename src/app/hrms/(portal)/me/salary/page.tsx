import Link from "next/link";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/admin/GlassCard";
import { Badge } from "@/components/ui/badge";
import SalaryStructureView from "@/components/hrms/SalaryStructureView";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { getPayrollProfile } from "@/lib/hrms/payroll";
import { payslipsForEmployee } from "@/lib/hrms/payroll-run";
import { payrollRunStatusMeta, monthLabelLong } from "@/lib/hrms/payroll-status";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function MySalaryPage() {
  const user = await getCurrentHrmsUser();
  const employeeId = user!.employeeId!;

  const [profile, payslips] = await Promise.all([getPayrollProfile(employeeId), payslipsForEmployee(employeeId)]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Salary &amp; Payslips</h1>
        <p className="text-sm text-muted-foreground">Your current structure and published payslips.</p>
      </div>

      {profile ? (
        <SalaryStructureView basic={profile.basic} hra={profile.hra} allowances={profile.allowances} deductions={profile.deductions} />
      ) : (
        <GlassCard interactive={false}>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            Your salary structure has not been set up yet.
          </CardContent>
        </GlassCard>
      )}

      <GlassCard interactive={false}>
        <CardHeader><CardTitle>Payslips</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {payslips.length === 0 && <p className="text-sm text-muted-foreground">No payslips have been published yet.</p>}
          {payslips.map(({ payslip, run }) => {
            const meta = payrollRunStatusMeta(run.status);
            return (
              <Link
                key={payslip._id}
                href={`/hrms/me/salary/${payslip.month}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 p-3 text-sm transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="font-medium">{monthLabelLong(payslip.month)}</p>
                  <p className="text-xs text-muted-foreground">
                    {run.paidAt ? `Paid ${formatDate(run.paidAt)}` : `Approved ${run.approvedAt ? formatDate(run.approvedAt) : ""}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground tabular-nums">{formatCurrency(payslip.netPay)}</span>
                  <Badge className={meta.badgeClass}>{meta.label}</Badge>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </GlassCard>
    </div>
  );
}
