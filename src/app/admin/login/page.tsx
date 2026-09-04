import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin-auth";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-10 lg:flex">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] h-[60%] w-[60%] rounded-full bg-primary/20 blur-[100px] animate-blob" />
          <div className="absolute -bottom-[15%] -right-[5%] h-[55%] w-[55%] rounded-full bg-[#ff8e75]/20 blur-[120px] animate-blob animation-delay-2000" />
        </div>

        <div className="relative z-10 text-lg font-bold">
          <span className="text-foreground">Yash</span>
          <span className="text-primary">Orbit</span> Admin
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Manage every lead,{" "}
            <span className="bg-gradient-to-r from-primary to-[#ff8e75] bg-clip-text text-transparent">in one place.</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Track submissions across every category, update statuses, and keep your team on top of every inbound request.
          </p>
        </div>

        <p className="relative z-10 text-xs text-muted-foreground">Private admin area — not indexed, not public.</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        <LoginForm />
      </div>
    </div>
  );
}
