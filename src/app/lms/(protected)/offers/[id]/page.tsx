import Link from "next/link";
import { notFound } from "next/navigation";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import CampaignForm from "@/components/lms/offers/CampaignForm";
import DeleteEntityButton from "@/components/lms/offers/DeleteEntityButton";
import { getCampaign, serializeCampaign } from "@/lib/offers/campaigns";
import { listOffersForCampaign } from "@/lib/offers/offers";
import { formatOfferBadge, getOfferStatusMeta } from "@/lib/offers/constants";
import { getCategoryLabel } from "@/lib/categories";
import { deleteCampaignAction } from "../actions";
import { deleteOfferAction } from "./offers/actions";

export const dynamic = "force-dynamic";

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  if (!campaign) notFound();

  const offers = await listOffersForCampaign(id);
  const serialized = serializeCampaign(campaign);

  return (
    <div className="relative mx-auto max-w-3xl space-y-4">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/lms" },
          { label: "Festival Offers", href: "/lms/offers" },
          { label: campaign.name },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{campaign.name}</h1>
        <div className="flex items-center gap-2">
          <Link href={`/lms/offers/${id}/analytics`} className={buttonVariants({ variant: "outline", size: "sm" })}>
            Analytics
          </Link>
          <DeleteEntityButton
            label="campaign"
            confirmText="This also hides every offer under this campaign from the public page. This can't be undone."
            onDelete={deleteCampaignAction.bind(null, id)}
            redirectTo="/lms/offers"
          />
        </div>
      </div>

      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignForm campaign={serialized} />
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Offers in this campaign</CardTitle>
          <Link href={`/lms/offers/${id}/offers/new`} className={buttonVariants({ size: "sm" })}>
            New offer
          </Link>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Offer</th>
                <th className="py-2 pr-3 font-medium">Service</th>
                <th className="py-2 pr-3 font-medium">Discount</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {offers.map((o) => {
                const meta = getOfferStatusMeta(o.status);
                return (
                  <tr key={o._id} className="border-b border-border/40 last:border-0">
                    <td className="py-2 pr-3">
                      <Link href={`/lms/offers/${id}/offers/${o._id}`} className="font-medium text-foreground hover:text-primary hover:underline">
                        {o.title}
                      </Link>
                      <span className="flex gap-1 text-xs text-muted-foreground">
                        {o.isDealOfTheDay && <span className="text-primary">Deal of the Day</span>}
                        {o.isFeatured && <span>Featured</span>}
                        {o.isFlashDeal && <span>Flash</span>}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">{getCategoryLabel(o.category)}</td>
                    <td className="py-2 pr-3 text-foreground">{formatOfferBadge(o.pricing)}</td>
                    <td className="py-2 pr-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.badgeClass}`}>
                        <span className={`size-1.5 rounded-full ${meta.dotClass}`} />
                        {meta.label}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <DeleteEntityButton
                        label="offer"
                        confirmText="This removes the offer from the public page immediately. This can't be undone."
                        onDelete={deleteOfferAction.bind(null, id, o._id)}
                      />
                    </td>
                  </tr>
                );
              })}
              {offers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    No offers yet.{" "}
                    <Link href={`/lms/offers/${id}/offers/new`} className="text-primary hover:underline">
                      Add the first one
                    </Link>
                    .
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </GlassCard>
    </div>
  );
}
