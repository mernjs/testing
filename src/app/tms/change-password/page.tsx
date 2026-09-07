import { redirect } from "next/navigation";
import BrandMark from "@/components/BrandMark";
import { brandify } from "@/lib/brand";
import { getCurrentTmsUser } from "@/lib/tms-auth";
import ChangePasswordForm from "@/components/tms/ChangePasswordForm";

export default async function ChangePasswordPage() {
  const user = await getCurrentTmsUser();
  if (!user) redirect("/tms/login");

  return (
    <div className="lms-shell flex min-h-screen flex-col items-center justify-center gap-6 bg-[#e9ebee] px-4 py-12 dark:bg-background">
      <div className="flex items-center gap-2 text-lg font-bold">
        <BrandMark className="size-7 shrink-0" />
        {brandify("YashOrbit")} <span className="text-foreground">TMS</span>
      </div>
      <div className="w-full max-w-sm">
        <ChangePasswordForm forced={user.mustChangePassword} />
      </div>
    </div>
  );
}
