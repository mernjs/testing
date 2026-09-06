import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/admin/GlassCard";
import KpiCard from "@/components/admin/KpiCard";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import CategoryBarChart from "@/components/admin/CategoryBarChart";
import TimeSeriesChart from "@/components/admin/TimeSeriesChart";
import Tabs from "@/components/hrms/Tabs";
import FileLeaveSheet from "@/components/hrms/FileLeaveSheet";
import LeaveRequestsTable from "@/components/hrms/LeaveRequestsTable";
import LeaveCalendar from "@/components/hrms/LeaveCalendar";
import LeaveBalancesBrowser from "@/components/hrms/LeaveBalancesBrowser";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { canApproveLeave, canViewAllEmployees, canManageEmployees } from "@/lib/hrms-roles";
import { descendantEmployeeIds, listEmployeeOptions } from "@/lib/hrms/employees";
import {
  listLeaveRequests,
  listLeaveTypes,
  getLeaveCalendar,
  getLeaveAnalytics,
  getBalances,
  currentYear,
  isValidLeaveStatus,
  type LeaveRequestStatus,
} from "@/lib/hrms/leave";
import { monthBounds, todayDateString } from "@/lib/hrms/settings";

export default async function LeavePage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    status?: string;
    leaveType?: string;
    page?: string;
    month?: string;
    employee?: string;
  }>;
}) {
  const user = await getCurrentHrmsUser();
  const canDecide = !!user && canApproveLeave(user.roles);
  const canAllocate = !!user && canManageEmployees(user.roles);
  const restrictManagerId = user && !canViewAllEmployees(user.roles) ? user.employeeId ?? "__none__" : undefined;
  const restrictIds = restrictManagerId ? await descendantEmployeeIds(restrictManagerId) : undefined;

  const sp = await searchParams;
  const tab = ["requests", "calendar", "balances", "analytics"].includes(sp.tab ?? "") ? sp.tab! : "requests";
  const status = sp.status && isValidLeaveStatus(sp.status) ? (sp.status as LeaveRequestStatus) : undefined;
  const leaveTypeCode = sp.leaveType || undefined;
  const page = Math.max(Number(sp.page) || 1, 1);
  const month = /^\d{4}-\d{2}$/.test(sp.month ?? "") ? sp.month! : todayDateString().slice(0, 7);
  const year = currentYear();

  const { from, to } = monthBounds(month);
  const analyticsFrom = `${year}-01-01`;
  const analyticsTo = `${year}-12-31`;

  const [requestsResult, leaveTypes, calendar, analytics, employees] = await Promise.all([
    listLeaveRequests({ status, leaveTypeCode, restrictToEmployeeIds: restrictIds }, page, 30),
    listLeaveTypes(),
    getLeaveCalendar(from, to, restrictIds),
    getLeaveAnalytics(analyticsFrom, analyticsTo),
    listEmployeeOptions(),
  ]);

  const scopedEmployees = restrictIds ? employees.filter((e) => restrictIds.includes(e._id)) : employees;
  const selectedEmployeeId = sp.employee || (scopedEmployees[0]?._id ?? null);
  const balances = selectedEmployeeId ? await getBalances(selectedEmployeeId, year) : [];

  const typeOpts = leaveTypes.map((t) => ({ code: t.code, label: t.label }));

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "HRMS", href: "/hrms" }, { label: "Leave" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Leave</h1>
          <p className="text-sm text-muted-foreground">Requests, balances and the leave calendar.</p>
        </div>
        {canDecide && <FileLeaveSheet employees={scopedEmployees} leaveTypes={typeOpts} />}
      </div>

      <Tabs
        initial={tab}
        syncParam="tab"
        tabs={[
          {
            key: "requests",
            label: "Requests",
            content: (
              <LeaveRequestsTable
                items={requestsResult.items.map((r) => ({
                  _id: r._id,
                  employeeId: r.employeeId,
                  employeeName: r.employeeName,
                  employeeCode: r.employeeCode,
                  leaveTypeCode: r.leaveTypeCode,
                  leaveTypeLabel: r.leaveTypeLabel,
                  startDate: r.startDate,
                  endDate: r.endDate,
                  days: r.days,
                  reason: r.reason,
                  status: r.status,
                  decisionNote: r.decisionNote,
                  decidedAt: r.decidedAt,
                  createdAt: r.createdAt,
                }))}
                total={requestsResult.total}
                page={requestsResult.page}
                totalPages={requestsResult.totalPages}
                leaveTypes={typeOpts}
                initial={{ status: status ?? "", leaveType: leaveTypeCode ?? "", search: "" }}
                canDecide={canDecide}
              />
            ),
          },
          {
            key: "calendar",
            label: "Calendar",
            content: <LeaveCalendar month={month} entries={calendar} />,
          },
          {
            key: "balances",
            label: "Balances",
            content: (
              <LeaveBalancesBrowser
                employees={scopedEmployees}
                selectedEmployeeId={selectedEmployeeId}
                year={year}
                balances={balances.map((b) => ({ ...b }))}
                canEditAllocation={canAllocate}
              />
            ),
          },
          {
            key: "analytics",
            label: "Analytics",
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <KpiCard label="Requests (YTD)" value={analytics.totalRequests} />
                  <KpiCard label="Days Approved" value={analytics.totalDaysApproved} />
                  <KpiCard label="Approval Rate" value={analytics.approvalRate} suffix="%" />
                  <KpiCard label="Leave Types" value={leaveTypes.length} />
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <GlassCard>
                    <CardHeader><CardTitle>Requests by Type</CardTitle></CardHeader>
                    <CardContent><CategoryBarChart data={analytics.byType} /></CardContent>
                  </GlassCard>
                  <GlassCard>
                    <CardHeader><CardTitle>Requests by Department</CardTitle></CardHeader>
                    <CardContent><CategoryBarChart data={analytics.byDepartment} /></CardContent>
                  </GlassCard>
                </div>
                <GlassCard>
                  <CardHeader><CardTitle>Requests by Month</CardTitle></CardHeader>
                  <CardContent><TimeSeriesChart data={analytics.byMonth} /></CardContent>
                </GlassCard>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
