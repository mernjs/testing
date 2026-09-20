import { NextResponse } from "next/server";
import { normalizeReferralCode } from "@/lib/referral";
import { getReferralPreview } from "@/lib/wallet/referrals";

/** Public, rate-limit-friendly, minimal: says whether a code is live and shows the referrer's first name only. Reveals nothing else about the account. */
export async function GET(req: Request) {
  const code = normalizeReferralCode(new URL(req.url).searchParams.get("code"));
  if (!code) return NextResponse.json({ valid: false, welcomeBonus: 0 });
  const preview = await getReferralPreview(code);
  return NextResponse.json(preview, { headers: { "Cache-Control": "no-store" } });
}
