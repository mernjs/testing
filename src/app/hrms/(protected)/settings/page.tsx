import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import Tabs from "@/components/hrms/Tabs";
import OrgSettingsForm from "@/components/hrms/OrgSettingsForm";
import LeaveTypesManager from "@/components/hrms/LeaveTypesManager";
import PayrollConfigForm from "@/components/hrms/PayrollConfigForm";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { canManageSettings } from "@/lib/hrms-roles";
import { getOrgSettings } from "@/lib/hrms/settings";
import { listLeaveTypes } from "@/lib/hrms/leave";
import { getPayrollConfig } from "@/lib/hrms/payroll-config";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await getCurrentHrmsUser();
  if (!user || !canManageSettings(user.roles)) redirect("/hrms");

  const sp = await searchParams;
  const tab = ["schedule", "leave", "payroll"].includes(sp.tab ?? "") ? sp.tab! : "schedule";

  const [settings, leaveTypes, payrollConfig] = await Promise.all([
    getOrgSettings(),
    listLeaveTypes(true),
    getPayrollConfig(),
  ]);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "HRMS", href: "/hrms" }, { label: "Settings" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Work schedule, leave configuration and statutory payroll rates.
        </p>
      </div>

      <Tabs
        initial={tab}
        syncParam="tab"
        tabs={[
          {
            key: "schedule",
            label: "Work Schedule",
            content: (
              <OrgSettingsForm
                settings={{
                  workingDays: settings.workingDays,
                  shiftStart: settings.shiftStart,
                  shiftEnd: settings.shiftEnd,
                  graceMinutes: settings.graceMinutes,
                  earlyDepartureMinutes: settings.earlyDepartureMinutes,
                  halfDayHours: settings.halfDayHours,
                  fullDayHours: settings.fullDayHours,
                  timezone: settings.timezone,
                }}
              />
            ),
          },
          {
            key: "leave",
            label: "Leave Types",
            content: (
              <LeaveTypesManager
                types={leaveTypes.map((t) => ({
                  _id: t._id,
                  code: t.code,
                  label: t.label,
                  paid: t.paid,
                  defaultAnnualQuota: t.defaultAnnualQuota,
                  allowNegativeBalance: t.allowNegativeBalance,
                  active: t.active,
                }))}
              />
            ),
          },
          {
            key: "payroll",
            label: "Payroll",
            content: (
              <PayrollConfigForm
                config={{
                  pfEmployeePercent: payrollConfig.pfEmployeePercent,
                  pfWageCeiling: payrollConfig.pfWageCeiling,
                  epsPercent: payrollConfig.epsPercent,
                  pfEmployerPercent: payrollConfig.pfEmployerPercent,
                  esiEmployeePercent: payrollConfig.esiEmployeePercent,
                  esiEmployerPercent: payrollConfig.esiEmployerPercent,
                  esiGrossThreshold: payrollConfig.esiGrossThreshold,
                  professionalTaxMonthly: payrollConfig.professionalTaxMonthly,
                  tdsRegime: payrollConfig.tdsRegime,
                  financialYearStartMonth: payrollConfig.financialYearStartMonth,
                }}
              />
            ),
          },
        ]}
      />
    </div>
  );
}
