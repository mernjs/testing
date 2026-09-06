import Link from "next/link";
import { CalendarDays, FileText, Wallet, CalendarClock } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/admin/GlassCard";
import { Badge } from "@/components/ui/badge";
import ClockWidget from "@/components/hrms/ClockWidget";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { getEmployee, employeeFullName } from "@/lib/hrms/employees";
import { getClockState, todayIsWorkingDay } from "@/lib/hrms/self-service";
import { getBalances, getEmployeeLeaveHistory, currentYear } from "@/lib/hrms/leave";
import { listHolidays } from "@/lib/hrms/holidays";
import { payslipsForEmployee } from "@/lib/hrms/payroll-run";
import { todayDateString } from "@/lib/hrms/time";
import { formatDate, formatCurrency } from "@/lib/utils";

export default async function MeDashboard() {
  const user = await getCurrentHrmsUser();
  const employeeId = user!.employeeId!;
  const year = currentYear();

  const [employee, clock, today, balances, history, holidays, payslips] = await Promise.all([
    getEmployee(employeeId),
    getClockState(employeeId),
    todayIsWorkingDay(),
    getBalances(employeeId, year),
    getEmployeeLeaveHistory(employeeId, 5),
    listHolidays(year),
    payslipsForEmployee(employeeId),
  ]);

  const name = employee ? employeeFullName(employee) : "there";
  const pending = history.filter((h) => h.status === "pending").length;
  const upcoming = holidays.filter((h) => h.date >= todayDateString()).slice(0, 4);
  const latestPayslip = payslips[0];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">Hi, {name.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">{employee?.employeeCode} · Your day at a glance.</p>
      </div>

      <ClockWidget
        dayLabel={today.label}
        working={today.working}
        checkIn={clock.checkIn}
        checkOut={clock.checkOut}
        workedMinutes={clock.workedMinutes}
        locked={clock.locked}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <GlassCard>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-4" /> Leave Balances
            </CardTitle>
            <Link href="/hrms/me/leave" className="text-xs text-primary hover:underline">Manage</Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {balances.filter((b) => b.allocated > 0 || b.used > 0).map((b) => (
              <div key={b.leaveTypeCode} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{b.label}</span>
                <span className="font-semibold text-foreground">
                  {b.available} <span className="text-xs font-normal text-muted-foreground">/ {b.allocated}</span>
                </span>
              </div>
            ))}
            {pending > 0 && (
              <p className="pt-1 text-xs text-muted-foreground">
                {pending} request{pending === 1 ? "" : "s"} awaiting approval
              </p>
            )}
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="size-4" /> Latest Payslip
            </CardTitle>
            <Link href="/hrms/me/salary" className="text-xs text-primary hover:underline">All payslips</Link>
          </CardHeader>
          <CardContent>
            {latestPayslip ? (
              <Link href={`/hrms/me/salary/${latestPayslip.payslip.month}`} className="block rounded-lg border border-border/60 p-3 text-sm hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{latestPayslip.payslip.month}</span>
                  <Badge className={latestPayslip.run.status === "paid" ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-secondary/60 text-secondary-foreground"}>
                    {latestPayslip.run.status}
                  </Badge>
                </div>
                <p className="mt-1 text-lg font-bold text-foreground">{formatCurrency(latestPayslip.payslip.netPay)}</p>
                <p className="text-xs text-muted-foreground">net pay</p>
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">No payslips published yet.</p>
            )}
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="size-4" /> Upcoming Holidays
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.length === 0 && <p className="text-sm text-muted-foreground">No holidays coming up.</p>}
            {upcoming.map((h) => (
              <div key={h._id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{h.name}</span>
                <span className="font-medium text-foreground">{formatDate(h.date)}</span>
              </div>
            ))}
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4" /> Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/hrms/me/attendance" className="rounded-lg border border-border/60 p-3 text-center hover:bg-muted/50">My Attendance</Link>
            <Link href="/hrms/me/leave" className="rounded-lg border border-border/60 p-3 text-center hover:bg-muted/50">Apply for Leave</Link>
            <Link href="/hrms/me/documents" className="rounded-lg border border-border/60 p-3 text-center hover:bg-muted/50">My Documents</Link>
            <Link href="/hrms/me/profile" className="rounded-lg border border-border/60 p-3 text-center hover:bg-muted/50">Update Details</Link>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
