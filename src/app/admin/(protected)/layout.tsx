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
        <div className="relative flex h-screen gap-3 overflow-hidden bg-background p-3">
          <div className="admin-ambient pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="admin-ambient-mid" />
            <div className="absolute inset-0 bg-grid-slate-900/[0.015] dark:bg-grid-slate-400/[0.02] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
          </div>

          <AdminSidebarShell
            adminEmail={admin.email}
            createdAt={admin.createdAt.toISOString()}
            lastLoginAt={admin.lastLoginAt ? admin.lastLoginAt.toISOString() : null}
          />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
            <div className="admin-surface relative z-30 shrink-0 rounded-3xl border border-border/60 bg-background/90 shadow-md backdrop-blur-md dark:bg-card/85">
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
