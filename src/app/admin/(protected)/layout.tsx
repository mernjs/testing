import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { getStaleLeadsSummary, getRecentLeadsSummary, type Lead } from "@/lib/leads";
import { getStaleApplicationsSummary, getRecentApplicationsSummary, type CareerApplication } from "@/lib/career-applications";
import AdminSidebarShell from "@/components/admin/AdminSidebarShell";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { SidebarCollapseProvider } from "@/components/admin/SidebarCollapseContext";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { SerializedLead, SerializedCareerApplication } from "@/components/admin/types";

function serializeLead(lead: Lead): SerializedLead {
  return {
    ...lead,
    _id: String(lead._id),
    createdAt: new Date(lead.createdAt).toISOString(),
    updatedAt: new Date(lead.updatedAt).toISOString(),
  };
}

function serializeApplication(application: CareerApplication): SerializedCareerApplication {
  return {
    _id: String(application._id),
    positionSlug: application.positionSlug,
    positionTitle: application.positionTitle,
    name: application.name,
    email: application.email,
    phone: application.phone,
    coverNote: application.coverNote,
    status: application.status,
    notes: application.notes,
    resume: application.resume,
    source: application.source,
    createdAt: new Date(application.createdAt).toISOString(),
    updatedAt: new Date(application.updatedAt).toISOString(),
  };
}

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const [staleLeadsSummary, staleApplicationsSummary, recentLeadsSummary, recentApplicationsSummary] = await Promise.all([
    getStaleLeadsSummary(),
    getStaleApplicationsSummary(),
    getRecentLeadsSummary(),
    getRecentApplicationsSummary(),
  ]);

  const staleLeads = staleLeadsSummary.items.map(serializeLead);
  const staleApplications = staleApplicationsSummary.items.map(serializeApplication);
  const recentLeads = recentLeadsSummary.items.map(serializeLead);
  const recentApplications = recentApplicationsSummary.items.map(serializeApplication);

  return (
    <TooltipProvider delay={200}>
      <SidebarCollapseProvider>
        <div className="relative flex h-screen gap-3 overflow-hidden bg-muted/30 p-3">
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute top-[-15%] left-[20%] h-[50%] w-[50%] rounded-full bg-primary/[0.05] blur-[140px]" />
            <div className="absolute bottom-[-15%] right-[10%] h-[45%] w-[45%] rounded-full bg-yashorbit-coral/[0.05] blur-[140px]" />
          </div>

          <AdminSidebarShell
            adminEmail={admin.email}
            createdAt={admin.createdAt.toISOString()}
            lastLoginAt={admin.lastLoginAt ? admin.lastLoginAt.toISOString() : null}
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
            <div className="admin-surface shrink-0 rounded-2xl border border-border/50 bg-card/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-8px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:bg-card/40">
              <AdminTopbar
                staleLeads={staleLeads}
                staleLeadsCount={staleLeadsSummary.count}
                staleApplications={staleApplications}
                staleApplicationsCount={staleApplicationsSummary.count}
                recentLeads={recentLeads}
                recentApplications={recentApplications}
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
