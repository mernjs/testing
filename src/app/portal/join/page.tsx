import { redirect } from "next/navigation";
import { getCurrentPortalUser } from "@/lib/portal-auth";
import PortalAuthShell from "@/components/portal/PortalAuthShell";
import { resolveReferralCode } from "@/lib/wallet/referral-capture";
import { getReferralPreview } from "@/lib/wallet/referrals";
import JoinForm from "./JoinForm";

export const metadata = { title: "Join · YashOrbit Portal", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PortalJoinPage({ searchParams }: { searchParams: Promise<{ ref?: string }> }) {
  if (await getCurrentPortalUser()) redirect("/portal");
  const { ref } = await searchParams;
  const code = await resolveReferralCode(ref);
  const preview = code ? await getReferralPreview(code) : null;

  return (
    <PortalAuthShell
      headline={
        <>
          Create your free account,{" "}
          <span className="bg-gradient-to-r from-primary to-yashorbit-coral bg-clip-text text-transparent">earn credits.</span>
        </>
      }
      sub="Join in under a minute. Get signup credits, share your own referral link and use your credits on YashOrbit offers."
    >
      <JoinForm
        initialCode={code ?? ""}
        referrerName={preview?.valid ? preview.referrerFirstName ?? null : null}
        welcomeBonus={preview?.valid ? preview.welcomeBonus : 0}
        codeRejected={Boolean(code && preview && !preview.valid)}
      />
    </PortalAuthShell>
  );
}
