import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import CampaignForm from "@/components/lms/wallet/CampaignForm";
import DeleteEntityButton from "@/components/lms/offers/DeleteEntityButton";
import { getCampaign, serializeCampaign } from "@/lib/wallet/campaigns";
import { deleteCampaignAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  if (!campaign) notFound();
  return (
    <div className="relative mx-auto max-w-2xl space-y-4">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/lms" }, { label: "Wallet", href: "/lms/wallet" }, { label: "Referral campaigns", href: "/lms/wallet/campaigns" }, { label: campaign.name }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{campaign.name}</h1>
        <DeleteEntityButton label="campaign" confirmText="Referrals already recorded are kept. New signups will no longer be attributed under this campaign." onDelete={deleteCampaignAction.bind(null, id)} redirectTo="/lms/wallet/campaigns" />
      </div>
      <GlassCard><CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader><CardContent><CampaignForm campaign={serializeCampaign(campaign)} /></CardContent></GlassCard>
    </div>
  );
}
