import { redirect } from "next/navigation";
import { getCurrentHrmsUser } from "@/lib/hrms-auth";
import { hasStaffRole } from "@/lib/hrms-roles";
import HrmsSidebarShell from "@/components/hrms/HrmsSidebarShell";
import HrmsTopbar from "@/components/hrms/HrmsTopbar";
import { SidebarCollapseProvider } from "@/components/admin/SidebarCollapseContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { listNotifications, unreadCount, runNotificationSweep } from "@/lib/hrms/notifications";

export default async function ProtectedHrmsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentHrmsUser();
  if (!user) redirect("/hrms/login");
  if (user.mustChangePassword) redirect("/hrms/change-password");
  if (!hasStaffRole(user.roles)) redirect(user.employeeId ? "/hrms/me" : "/hrms/login");

  // Throttled internally to once/hour across the app.
  await runNotificationSweep();
  const [notifications, unread] = await Promise.all([
    listNotifications(user, { pageSize: 8 }),
    unreadCount(user),
  ]);

  return (
    <TooltipProvider delay={200}>
      <SidebarCollapseProvider>
        <div className="relative flex h-screen gap-3 overflow-hidden bg-[#e9ebee] p-3 dark:bg-background">
          <div className="admin-ambient pointer-events-none absolute inset-0 overflow-hidden">
            <div className="admin-ambient-mid" />
            <div className="absolute inset-0 bg-grid-slate-900/[0.015] dark:bg-grid-slate-400/[0.02] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
          </div>

          <HrmsSidebarShell
            email={user.email}
            roles={user.roles}
            createdAt={user.createdAt.toISOString()}
            lastLoginAt={user.lastLoginAt ? user.lastLoginAt.toISOString() : null}
          />

          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-3">
            <div className="admin-surface relative z-30 shrink-0 rounded-3xl border border-border/40 bg-background/95 shadow-none backdrop-blur-md dark:bg-card/85">
              <HrmsTopbar
                roles={user.roles}
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
              />
            </div>
            <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-2xl">{children}</main>
          </div>
        </div>
      </SidebarCollapseProvider>
      <Toaster position="top-right" richColors closeButton />
    </TooltipProvider>
  );
}
