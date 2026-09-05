import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <TooltipProvider delay={200}>
      <div className="relative flex min-h-screen gap-3 bg-muted/30 p-3">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-15%] left-[20%] h-[50%] w-[50%] rounded-full bg-primary/[0.05] blur-[140px]" />
          <div className="absolute bottom-[-15%] right-[10%] h-[45%] w-[45%] rounded-full bg-[#ff8e75]/[0.05] blur-[140px]" />
        </div>

        <aside className="hidden w-60 shrink-0 rounded-2xl border border-border/50 bg-card/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-8px_rgba(0,0,0,0.12)] backdrop-blur-xl md:block dark:bg-card/40">
          <div className="flex h-14 items-center border-b border-border/50 px-4">
            <span className="text-sm font-bold">
              <span className="text-foreground">Yash</span>
              <span className="text-primary">Orbit</span> Admin
            </span>
          </div>
          <AdminSidebar />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="rounded-2xl border border-border/50 bg-card/70 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-8px_rgba(0,0,0,0.12)] backdrop-blur-xl dark:bg-card/40">
            <AdminTopbar adminEmail={admin.email} />
          </div>
          <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto rounded-2xl">{children}</main>
        </div>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </TooltipProvider>
  );
}
