import { redirect } from "next/navigation";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { getEmployee, employeeFullName } from "@/lib/hrms/employees";
import { listNotifications, unreadCount } from "@/lib/hrms/notifications";
import PortalShell from "@/components/hrms/PortalShell";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentHrmsUser();
  if (!user) redirect("/hrms/login");
  if (user.mustChangePassword) redirect("/hrms/change-password");
  if (!user.employeeId) redirect("/hrms/login");

  const employee = await getEmployee(user.employeeId);
  if (!employee) redirect("/hrms/login");

  const [notifications, unread] = await Promise.all([
    listNotifications(user, { pageSize: 8 }),
    unreadCount(user),
  ]);

  return (
    <TooltipProvider delay={200}>
      <PortalShell
        name={employeeFullName(employee)}
        email={user.email}
        notifications={notifications.items.map((n) => ({
          _id: n._id,
          type: n.type,
          title: n.title,
          body: n.body,
          link: n.link,
          createdAt: n.createdAt,
          read: n.read,
        }))}
        unread={unread}
      >
        {children}
      </PortalShell>
      <Toaster position="top-right" richColors closeButton />
    </TooltipProvider>
  );
}
