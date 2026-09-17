import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import CouponForm from "@/components/lms/offers/CouponForm";
import { listCampaignOptions } from "@/lib/offers/campaigns";

export const dynamic = "force-dynamic";
export const metadata = { title: "New coupon · Festival Offers" };

export default async function NewCouponPage() {
  const campaignOptions = await listCampaignOptions();

  return (
    <div className="relative mx-auto max-w-2xl space-y-4">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/lms" },
          { label: "Festival Offers", href: "/lms/offers" },
          { label: "Coupons", href: "/lms/offers/coupons" },
          { label: "New coupon" },
        ]}
      />
      <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">New coupon</h1>
      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CouponForm campaignOptions={campaignOptions} />
        </CardContent>
      </GlassCard>
    </div>
  );
}
