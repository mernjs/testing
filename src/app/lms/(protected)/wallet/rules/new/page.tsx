import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import RewardRuleForm from "@/components/lms/wallet/RewardRuleForm";

export const metadata = { title: "New reward rule · Wallet" };

export default function NewRewardRulePage() {
  return (
    <div className="relative mx-auto max-w-2xl space-y-4">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/lms" }, { label: "Wallet", href: "/lms/wallet" }, { label: "Reward rules", href: "/lms/wallet/rules" }, { label: "New" }]} />
      <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">New reward rule</h1>
      <GlassCard><CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader><CardContent><RewardRuleForm /></CardContent></GlassCard>
    </div>
  );
}
