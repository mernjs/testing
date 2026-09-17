import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import CouponForm from "@/components/lms/offers/CouponForm";
import DeleteEntityButton from "@/components/lms/offers/DeleteEntityButton";
import { getCoupon, serializeCoupon } from "@/lib/offers/coupons";
import { listCampaignOptions } from "@/lib/offers/campaigns";
import { deleteCouponAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditCouponPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [coupon, campaignOptions] = await Promise.all([getCoupon(id), listCampaignOptions()]);
  if (!coupon) notFound();

  return (
    <div className="relative mx-auto max-w-2xl space-y-4">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/lms" },
          { label: "Festival Offers", href: "/lms/offers" },
          { label: "Coupons", href: "/lms/offers/coupons" },
          { label: coupon.code },
        ]}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl font-mono">{coupon.code}</h1>
        <DeleteEntityButton
          label="coupon"
          confirmText="Visitors will no longer be able to apply this code. This can't be undone."
          onDelete={deleteCouponAction.bind(null, id)}
          redirectTo="/lms/offers/coupons"
        />
      </div>
      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CouponForm coupon={serializeCoupon(coupon)} campaignOptions={campaignOptions} />
        </CardContent>
      </GlassCard>
    </div>
  );
}
