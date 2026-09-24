import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { getCurrentDlmsUser } from "@/lib/dlms-auth";
import { hasDlmsAccess } from "@/lib/dlms-roles";
import { getViewer, can } from "@/lib/dlms/viewer";
import { listDlmsNotifications } from "@/lib/dlms/notifications";
import { countRecords } from "@/lib/dlms/records";
import DlmsSidebarShell from "@/components/dlms/DlmsSidebarShell";
import DlmsTopbar from "@/components/dlms/DlmsTopbar";
import type { DlmsNavFlags } from "@/components/dlms/DlmsSidebar";
import { EmptyState } from "@/components/dlms/DlmsUi";
import { SidebarCollapseProvider } from "@/components/lms/SidebarCollapseContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata = { title: "YashOrbit Digi Locker", robots: { index: false, follow: false } };

export default async function ProtectedDlmsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentDlmsUser();
  if (!user) redirect("/dlms/login");
  if (user.mustChangePassword) redirect("/dlms/change-password");
  if (!hasDlmsAccess(user.roles)) redirect("/dlms/login");
  const viewer = await getViewer();
  if (!viewer) redirect("/dlms/login");

  const canView = can(viewer, "VIEW");
  const [bell, expired] = await Promise.all([
    listDlmsNotifications(viewer.userId),
    canView ? Promise.all((["credential", "document", "link"] as const).map((t) => countRecords(viewer, t, { expiry: "expired" }))).then((c) => c.reduce((a, b) => a + b, 0)) : Promise.resolve(0),
  ]);
  const flags: DlmsNavFlags = {
    company: viewer.companyAccess && canView,
    audit: can(viewer, "VIEW_AUDIT"),
    settings: can(viewer, "MANAGE_SETTINGS") || can(viewer, "MANAGE_ACCESS"),
    expired,
  };

  return (
    <TooltipProvider delay={200}>
      <SidebarCollapseProvider>
        <div className="relative flex h-screen gap-3 overflow-hidden bg-[#e9ebee] p-3 dark:bg-background">
          <div className="lms-ambient pointer-events-none absolute inset-0 overflow-hidden">
            <div className="lms-ambient-mid" />
            <div className="absolute inset-0 bg-grid-slate-900/[0.015] dark:bg-grid-slate-400/[0.02] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
          </div>

          <DlmsSidebarShell
            email={user.email}
            roles={user.roles}
            flags={flags}
            createdAt={user.createdAt.toISOString()}
            lastLoginAt={user.lastLoginAt ? user.lastLoginAt.toISOString() : null}
          />

          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-3">
            <div className="lms-surface relative z-30 shrink-0 rounded-3xl border border-border/40 bg-background/95 shadow-none backdrop-blur-md dark:bg-card/85">
              <DlmsTopbar roles={user.roles} flags={flags} notifications={bell.items} unread={bell.unread} />
            </div>
            <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-2xl">
              {canView ? (
                children
              ) : (
                <EmptyState icon={<ShieldAlert className="size-5" />} title="You don't have permission to view the vault">
                  Ask a Super Admin to grant the “View” capability for Digi Locker.
                </EmptyState>
              )}
            </main>
          </div>
        </div>
      </SidebarCollapseProvider>
      <Toaster position="top-right" richColors closeButton />
    </TooltipProvider>
  );
}
