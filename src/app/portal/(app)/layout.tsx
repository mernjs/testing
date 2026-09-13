import { redirect } from "next/navigation";
import { getCurrentPortalUser } from "@/lib/portal-auth";
import { listPortalNotifications, portalUnreadCount } from "@/lib/portal/notifications";
import { listPortalLeadSummaries } from "@/lib/portal/lead";
import PortalSidebarShell from "@/components/portal/PortalSidebarShell";
import PortalTopbar from "@/components/portal/PortalTopbar";
import TempPasswordBanner from "@/components/portal/TempPasswordBanner";
import { SidebarCollapseProvider } from "@/components/lms/SidebarCollapseContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata = { title: "YashOrbit Portal", robots: { index: false, follow: false } };

export default async function PortalAppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentPortalUser();
  if (!user) redirect("/portal/login");
  if (user.mustChangePassword) redirect("/portal/change-password");

  const [notifications, unread, leads] = await Promise.all([
    listPortalNotifications(user.id, 10),
    portalUnreadCount(user.id),
    listPortalLeadSummaries(user),
  ]);

  return (
    <TooltipProvider delay={200}>
      <SidebarCollapseProvider>
        <div className="lms-shell relative flex h-screen gap-3 overflow-hidden bg-[#e9ebee] p-3 dark:bg-background">
          <div className="lms-ambient pointer-events-none absolute inset-0 overflow-hidden">
            <div className="lms-ambient-mid" />
            <div className="absolute inset-0 bg-grid-slate-900/[0.015] dark:bg-grid-slate-400/[0.02] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
          </div>

          <PortalSidebarShell role={user.role} displayName={user.displayName} email={user.email} />

          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-3">
            <div className="lms-surface relative z-30 shrink-0 rounded-3xl border border-border/40 bg-background/95 shadow-none backdrop-blur-md dark:bg-card/85">
              <PortalTopbar
                role={user.role}
                displayName={user.displayName}
                unread={unread}
                leads={leads}
                notifications={notifications.map((n) => ({
                  _id: n._id,
                  type: n.type,
                  title: n.title,
                  body: n.body,
                  link: n.link,
                  createdAt: n.createdAt.toISOString(),
                  read: n.read,
                }))}
              />
            </div>
            <main className="min-h-0 flex-1 overflow-y-auto rounded-2xl">
              <TempPasswordBanner />
              {children}
            </main>
          </div>
        </div>
      </SidebarCollapseProvider>
      <Toaster position="top-right" richColors closeButton />
    </TooltipProvider>
  );
}
