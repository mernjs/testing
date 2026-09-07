import { redirect } from "next/navigation";
import { getCurrentPmsUser } from "@/lib/pms-auth";
import { hasPmsAccess } from "@/lib/pms-roles";
import PmsSidebarShell from "@/components/pms/PmsSidebarShell";
import PmsTopbar from "@/components/pms/PmsTopbar";
import { SidebarCollapseProvider } from "@/components/lms/SidebarCollapseContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function ProtectedPmsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentPmsUser();
  if (!user) redirect("/pms/login");
  if (user.mustChangePassword) redirect("/pms/change-password");
  if (!hasPmsAccess(user.roles)) redirect("/pms/login");

  return (
    <TooltipProvider delay={200}>
      <SidebarCollapseProvider>
        <div className="relative flex h-screen gap-3 overflow-hidden bg-[#e9ebee] p-3 dark:bg-background">
          <div className="lms-ambient pointer-events-none absolute inset-0 overflow-hidden">
            <div className="lms-ambient-mid" />
            <div className="absolute inset-0 bg-grid-slate-900/[0.015] dark:bg-grid-slate-400/[0.02] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
          </div>

          <PmsSidebarShell
            email={user.email}
            roles={user.roles}
            createdAt={user.createdAt.toISOString()}
            lastLoginAt={user.lastLoginAt ? user.lastLoginAt.toISOString() : null}
          />

          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-3">
            <div className="lms-surface relative z-30 shrink-0 rounded-3xl border border-border/40 bg-background/95 shadow-none backdrop-blur-md dark:bg-card/85">
              <PmsTopbar roles={user.roles} />
            </div>
            <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-2xl">{children}</main>
          </div>
        </div>
      </SidebarCollapseProvider>
      <Toaster position="top-right" richColors closeButton />
    </TooltipProvider>
  );
}
