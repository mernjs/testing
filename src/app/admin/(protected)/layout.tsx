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
      <div className="flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-background md:block">
          <div className="flex h-14 items-center border-b border-border/60 px-4">
            <span className="text-sm font-bold">
              <span className="text-foreground">Yash</span>
              <span className="text-primary">Orbit</span> Admin
            </span>
          </div>
          <AdminSidebar />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar adminEmail={admin.email} />
          <main className="flex-1 overflow-x-hidden p-4 md:p-6">{children}</main>
        </div>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </TooltipProvider>
  );
}
