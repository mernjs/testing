import { redirect } from "next/navigation";
import { getCurrentTmsUser } from "@/lib/tms-auth";
import { hasTmsStaffRole } from "@/lib/tms-roles";

/**
 * Staff-only management pages (dashboard, programs, batches, students…). The
 * shared shell + session check live in the parent `(protected)` layout; this
 * group only adds the role gate. Students who reach one of these URLs are
 * bounced to their portal home.
 */
export default async function StaffTmsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentTmsUser();
  if (!user) redirect("/tms/login");
  if (!hasTmsStaffRole(user.roles)) redirect(user.studentId ? "/tms/me" : "/tms/login");
  return <>{children}</>;
}
