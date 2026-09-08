import { redirect } from "next/navigation";
import { getCurrentPrmsUser } from "@/lib/prms-auth";
import { hasPrmsStaffRole } from "@/lib/prms-roles";

/**
 * Staff-only management pages (dashboard, vendors, requisitions, settings…).
 * The shared shell + session check live in the parent `(protected)` layout;
 * this group only adds the role gate. Employees who reach one of these URLs are
 * bounced to their portal home.
 */
export default async function StaffPrmsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentPrmsUser();
  if (!user) redirect("/prms/login");
  if (!hasPrmsStaffRole(user.roles)) redirect("/prms/me");
  return <>{children}</>;
}
