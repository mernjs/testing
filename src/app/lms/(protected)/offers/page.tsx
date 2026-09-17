import Link from "next/link";
import { CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { searchCampaigns } from "@/lib/offers/campaigns";
import { getCampaignStatusMeta, getCampaignEffectiveStatus } from "@/lib/offers/constants";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Festival Offers · Lead Management" };

export default async function OffersCampaignsPage() {
  const { items } = await searchCampaigns({ pageSize: 100 });

  return (
    <div className="relative space-y-4">
      <Breadcrumbs items={[{ label: "Dashboard", href: "/lms" }, { label: "Festival Offers" }]} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Festival Offers</h1>
          <p className="text-sm text-muted-foreground">
            Campaigns power the public <code className="text-xs">/offers</code> page. Only one campaign is ever live at a
            time — resolved automatically by priority and date, no deploy needed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/lms/offers/coupons" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Coupons
          </Link>
          <Link href="/lms/offers/claims" className={buttonVariants({ variant: "outline", size: "sm" })}>
            Claims
          </Link>
          <Link href="/lms/offers/new" className={buttonVariants({ size: "sm" })}>
            New campaign
          </Link>
        </div>
      </div>

      <GlassCard>
        <CardContent className="overflow-x-auto py-3">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">Campaign</th>
                <th className="py-2 pr-3 font-medium">Type</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Window</th>
                <th className="py-2 pr-3 font-medium">Priority</th>
                <th className="py-2 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => {
                const effective = getCampaignEffectiveStatus(c.status, c.startDate, c.endDate);
                const meta = getCampaignStatusMeta(effective);
                return (
                  <tr key={c._id} className="border-b border-border/40 last:border-0">
                    <td className="py-2 pr-3">
                      <Link href={`/lms/offers/${c._id}`} className="font-medium text-foreground hover:text-primary hover:underline">
                        {c.name}
                      </Link>
                      <span className="block text-xs text-muted-foreground">{c.slug}</span>
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground capitalize">{c.campaignType.replace("-", " ")}</td>
                    <td className="py-2 pr-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.badgeClass}`}>
                        <span className={`size-1.5 rounded-full ${meta.dotClass}`} />
                        {meta.label}
                      </span>
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">
                      {formatDateTime(c.startDate)} → {formatDateTime(c.endDate)}
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">{c.priority}</td>
                    <td className="py-2 text-muted-foreground">{formatDateTime(c.createdAt)}</td>
                  </tr>
                );
              })}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground">
                    No campaigns yet.{" "}
                    <Link href="/lms/offers/new" className="text-primary hover:underline">
                      Create the first one
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
