import { headers } from "next/headers";
import { guardPortalPage } from "@/lib/portal/guard";
import { getReferralOverview } from "@/lib/portal/wallet";
import { REFERRAL_STATUS_META, type ReferralStatus } from "@/lib/wallet/constants";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { PortalPageHeader } from "@/components/portal/widgets";
import ReferralCodeCard from "@/components/portal/ReferralCodeCard";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Referrals · YashOrbit Portal" };

export default async function PortalReferralsPage() {
  const user = await guardPortalPage();
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "yashorbit.com";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const overview = await getReferralOverview(user.id, `${proto}://${host}`);

  return (
    <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-6">
      <Breadcrumbs items={[{ label: "Portal", href: "/portal" }, { label: "Referrals" }]} />
      <PortalPageHeader title="Refer & earn" subtitle="Share your link. When someone new joins YashOrbit through it, you both earn credits." />
      <ReferralCodeCard code={overview.code} link={overview.link} />

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          ["Total referred", overview.totalReferred],
          ["Rewarded", overview.rewarded],
          ["Credits earned", overview.creditsEarned],
          ["Pending credits", overview.pendingCredits],
        ].map(([label, value]) => (
          <GlassCard key={String(label)} interactive={false}>
            <CardContent className="py-4">
              <p className="text-xs font-medium text-muted-foreground">{label}</p>
              <p className="mt-1 text-2xl font-black text-foreground">{Number(value).toLocaleString("en-IN")}</p>
            </CardContent>
          </GlassCard>
        ))}
      </div>

      <GlassCard interactive={false}>
        <CardHeader>
          <CardTitle className="text-base">Your referrals</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">User</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Reward</th>
                <th className="py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {overview.rows.map((r) => {
                const meta = REFERRAL_STATUS_META[r.status as ReferralStatus];
                return (
                  <tr key={r.id} className="border-b border-border/40 last:border-0">
                    <td className="py-2 pr-3 text-foreground">{r.name}</td>
                    <td className="py-2 pr-3">
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.badgeClass}`}>{meta.label}</span>
                    </td>
                    <td className="py-2 pr-3 text-muted-foreground">{r.reward ? `+${r.reward.toLocaleString("en-IN")}` : "—"}</td>
                    <td className="py-2 text-muted-foreground">{formatDate(r.createdAt)}</td>
                  </tr>
                );
              })}
              {overview.rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted-foreground">No referrals yet — share your link to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </GlassCard>
    </div>
  );
}
