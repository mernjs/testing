import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentPortalUser } from "@/lib/portal-auth";
import { resolveReferralCode } from "@/lib/wallet/referral-capture";
import { getReferralPreview } from "@/lib/wallet/referrals";
import { listRewardRules } from "@/lib/wallet/reward-rules";
import { REFERRAL_QUALIFYING_EVENT_LABELS } from "@/lib/wallet/constants";
import { resolveCampaign, DEFAULT_CAMPAIGN_SETTINGS } from "@/lib/wallet/campaigns";
import RegisterContent from "./Content";

export const metadata: Metadata = {
  title: "Create Your Account — Access the Portal & Earn Credits | YashOrbit",
  description: "Sign up free to access your YashOrbit portal, track your journey, and earn credits for every step you complete.",
  alternates: { canonical: "/register" },
  robots: { index: true, follow: true },
};

export const dynamic = "force-dynamic";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  if (await getCurrentPortalUser()) redirect("/portal");
  const { ref } = await searchParams;
  const code = await resolveReferralCode(ref);
  const preview = code ? await getReferralPreview(code) : null;

  // Refer & earn amounts as currently configured (any account type without its own rule falls back to "ALL").
  const rules = (await listRewardRules().catch(() => [])).filter((r) => r.isActive && r.amount > 0 && r.appliesToRole === "ALL" && !r.subKey);
  const amount = (t: string) => rules.find((r) => r.type === t)?.amount ?? 0;
  const resolution = await resolveCampaign("client");
  const referral =
    resolution.state === "inactive"
      ? null
      : {
          referrer: amount("referral_referrer"),
          referee: amount("referral_referee"),
          event: REFERRAL_QUALIFYING_EVENT_LABELS[resolution.state === "active" ? resolution.campaign.qualifyingEvent : DEFAULT_CAMPAIGN_SETTINGS.qualifyingEvent],
        };

  return (
    <RegisterContent
      initialCode={code ?? ""}
      referrerName={preview?.valid ? preview.referrerFirstName ?? null : null}
      welcomeBonus={preview?.valid ? preview.welcomeBonus : 0}
      codeRejected={Boolean(code && preview && !preview.valid)}
      referral={referral}
    />
  );
}
