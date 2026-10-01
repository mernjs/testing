import HubSidebarShell from "@/components/hub/HubSidebarShell";
import HubTopbar from "@/components/hub/HubTopbar";
import { SidebarCollapseProvider } from "@/components/lms/SidebarCollapseContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import BillingNotice from "@/components/platform/BillingNotice";
import { unreadCount } from "@/lib/platform/notifications";
import type { CurrentHubUser } from "@/lib/hub-auth";
import type { ResolvedNav } from "@/lib/workspace/nav";
import { cn } from "@/lib/utils";

/**
 * The Workspace frame: sidebar, top bar, billing notice. Shared by the Staff
 * Hub (`/workspace`) and the company pages (`/settings/*`, `/onboarding`,
 * `/upgrade`), so the whole company-level area is one application.
 *
 * `embedded` pages were written as full-screen pages; inside the frame their
 * outer wrapper only needs to fill the content area.
 */
export default async function WorkspaceShell({ user, nav, embedded = false, children }: { user: CurrentHubUser; nav: ResolvedNav; embedded?: boolean; children: React.ReactNode }) {
  const unread = await unreadCount(user.id).catch(() => 0);
  const Content = embedded ? "div" : "main";

  return (
    <TooltipProvider delay={200}>
      <SidebarCollapseProvider>
        <div className="relative flex h-screen gap-3 overflow-hidden bg-[#e9ebee] p-3 dark:bg-background">
          <div className="lms-ambient pointer-events-none absolute inset-0 overflow-hidden">
            <div className="lms-ambient-mid" />
            <div className="absolute inset-0 bg-grid-slate-900/[0.015] dark:bg-grid-slate-400/[0.02] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
          </div>

          <HubSidebarShell email={user.email} nav={nav.sections} lastLoginAt={user.lastLoginAt ? user.lastLoginAt.toISOString() : null} />

          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-3">
            <div className="lms-surface relative z-30 shrink-0 rounded-3xl border border-border/40 bg-background/95 shadow-none backdrop-blur-md dark:bg-card/85">
              <HubTopbar email={user.email} nav={nav.sections} unread={unread} />
            </div>
            <BillingNotice />
            <Content id="workspace-content" className={cn("min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-2xl", embedded && "[&>*]:min-h-full")}>
              {children}
            </Content>
          </div>
        </div>
      </SidebarCollapseProvider>
      <Toaster position="top-right" richColors closeButton />
    </TooltipProvider>
  );
}
