import { redirect } from "next/navigation";
import { getCurrentPmsUser } from "@/lib/pms-auth";
import { hasPmsStaffRole } from "@/lib/pms-roles";

/**
 * Staff-only management pages (dashboard, clients, projects analytics, costing,
 * settings, activity, calendar). The shared shell + session check live in the
 * parent `(protected)` layout; this group only adds the role gate. Employees who
 * reach one of these URLs are bounced to their portal home.
 */
export default async function StaffPmsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentPmsUser();
  if (!user) redirect("/pms/login");
  if (!hasPmsStaffRole(user.roles)) redirect(user.employeeId ? "/pms/me" : "/pms/login");
  return <>{children}</>;
}
