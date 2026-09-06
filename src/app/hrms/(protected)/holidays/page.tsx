import Breadcrumbs from "@/components/admin/Breadcrumbs";
import HolidayManager from "@/components/hrms/HolidayManager";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { canManageHolidays } from "@/lib/hrms-roles";
import { listHolidays, listHolidayYears, serializeHoliday } from "@/lib/hrms/holidays";

export default async function HolidaysPage({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const user = await getCurrentHrmsUser();
  const canManage = !!user && canManageHolidays(user.roles);

  const sp = await searchParams;
  const thisYear = new Date().getUTCFullYear();
  const activeYear = Number(sp.year) && Number(sp.year) > 2000 ? Number(sp.year) : thisYear;

  const [holidays, years] = await Promise.all([listHolidays(activeYear), listHolidayYears()]);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "HRMS", href: "/hrms" }, { label: "Holidays" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Holiday Calendar</h1>
        <p className="text-sm text-muted-foreground">Company-wide holidays. Excluded from working-day counts in attendance and leave.</p>
      </div>

      <HolidayManager
        holidays={holidays.map(serializeHoliday).map((h) => ({ _id: h._id, date: h.date, name: h.name, type: h.type }))}
        years={years}
        activeYear={activeYear}
        canManage={canManage}
      />
    </div>
  );
}
