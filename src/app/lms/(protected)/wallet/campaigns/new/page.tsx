import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import CampaignForm from "@/components/lms/wallet/CampaignForm";

export const metadata = { title: "New referral campaign · Wallet" };

export default function NewCampaignPage() {
  return (
    <div className="relative mx-auto max-w-2xl space-y-4">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/lms" }, { label: "Wallet", href: "/lms/wallet" }, { label: "Referral campaigns", href: "/lms/wallet/campaigns" }, { label: "New" }]} />
      <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">New referral campaign</h1>
      <GlassCard><CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader><CardContent><CampaignForm /></CardContent></GlassCard>
    </div>
  );
}
