import { redirect } from "next/navigation";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { hasStaffRole } from "@/lib/hrms-roles";

/**
 * Staff-only management pages (dashboard, employees, payroll, settings, audit …).
 * The shared shell + session check live in the parent `(protected)` layout;
 * this group only adds the role gate. Employees who reach one of these URLs are
 * bounced to their self-service home.
 */
export default async function StaffHrmsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentHrmsUser();
  if (!user) redirect("/hrms/login");
  if (!hasStaffRole(user.roles)) redirect(user.employeeId ? "/hrms/me" : "/hrms/login");
  return <>{children}</>;
}
