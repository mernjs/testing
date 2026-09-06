import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import PayslipView from "@/components/hrms/PayslipView";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { payslipsForEmployee } from "@/lib/hrms/payroll-run";

export default async function MyPayslipPage({ params }: { params: Promise<{ month: string }> }) {
  const user = await getCurrentHrmsUser();
  const employeeId = user!.employeeId!;
  const { month } = await params;

  const entry = (await payslipsForEmployee(employeeId)).find((e) => e.payslip.month === month);
  if (!entry) notFound();
  const { payslip, run } = entry;

  return (
    <div className="space-y-4">
      <Link href="/hrms/me/salary" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground print:hidden">
        <ChevronLeft className="size-4" /> Back to payslips
      </Link>
      <PayslipView
        data={{
          month: payslip.month,
          employeeName: payslip.employeeName,
          employeeCode: payslip.employeeCode,
          workingDays: payslip.workingDays,
          lopDays: payslip.lopDays,
          earnings: payslip.earnings,
          grossPay: payslip.grossPay,
          deductions: payslip.deductions,
          totalDeductions: payslip.totalDeductions,
          employerContributions: payslip.employerContributions,
          employerCost: payslip.employerCost,
          netPay: payslip.netPay,
          bankAccountLast4: payslip.bankAccountLast4,
          bankName: payslip.bankName,
          ifsc: payslip.ifsc,
          runStatus: run.status,
        }}
      />
    </div>
  );
}
