import { redirect } from "next/navigation";
import BrandMark from "@/components/BrandMark";
import { brandify } from "@/lib/brand";
import { getCurrentHubUser } from "@/lib/hub-auth";
import HubChangePasswordForm from "@/components/hub/HubChangePasswordForm";

export default async function HubChangePasswordPage() {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");

  return (
    <div className="lms-shell flex min-h-screen flex-col items-center justify-center gap-6 bg-[#e9ebee] px-4 py-12 dark:bg-background">
      <div className="flex items-center gap-2 text-lg font-bold">
        <BrandMark className="size-7 shrink-0" />
        {brandify("YashOrbit")} <span className="text-foreground">Staff Hub</span>
      </div>
      <div className="w-full max-w-sm">
        <HubChangePasswordForm forced={user.mustChangePassword} />
      </div>
    </div>
  );
}
