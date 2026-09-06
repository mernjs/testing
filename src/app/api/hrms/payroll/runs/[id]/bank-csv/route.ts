import { NextRequest, NextResponse } from "next/server";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { canRunPayroll } from "@/lib/hrms-roles";
import { getRun, getPayslipsForRun } from "@/lib/hrms/payroll-run";
import { toCsv } from "@/lib/csv";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Context) {
  const user = await getCurrentHrmsUser();
  if (!user || !canRunPayroll(user.roles)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const run = await getRun(id);
  if (!run) return NextResponse.json({ error: "Run not found." }, { status: 404 });
  if (run.status === "draft") {
    return NextResponse.json({ error: "Approve the run before exporting the bank file." }, { status: 400 });
  }

  const slips = await getPayslipsForRun(id);
  const csv = toCsv(slips, [
    { header: "Employee Code", value: (s) => s.employeeCode },
    { header: "Beneficiary Name", value: (s) => s.employeeName },
    { header: "Account Number", value: (s) => s.bankAccountNumber ?? "" },
    { header: "IFSC", value: (s) => s.bankIfsc ?? "" },
    { header: "Amount", value: (s) => s.netPay },
    { header: "Narration", value: () => `Salary ${run.month}` },
  ]);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bank-transfer-${run.month}.csv"`,
    },
  });
}
