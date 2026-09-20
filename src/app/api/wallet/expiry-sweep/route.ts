import { NextRequest, NextResponse } from "next/server";
import { getCurrentLmsUser } from "@/lib/lms-auth";
import { runExpirySweep } from "@/lib/wallet/expiry";

/**
 * Expiry sweep + expiring-soon warnings. Authorised by an LMS session or the
 * `WALLET_CRON_SECRET` bearer token, so an external scheduler (Vercel Cron,
 * GitHub Actions, cron-job.org) can call it hourly/daily — same pattern as
 * the chatbot reindex route. Wallet correctness never depends on this running
 * (expiry is also reconciled on every read/spend); it just makes it timely
 * and sends the warnings.
 */
async function authorized(req: NextRequest): Promise<boolean> {
  // Vercel Cron sends `Authorization: Bearer $CRON_SECRET`; other schedulers can use WALLET_CRON_SECRET.
  const header = req.headers.get("authorization");
  for (const secret of [process.env.CRON_SECRET, process.env.WALLET_CRON_SECRET]) {
    if (secret && header === `Bearer ${secret}`) return true;
  }
  return Boolean(await getCurrentLmsUser());
}

export async function POST(req: NextRequest) {
  if (!(await authorized(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await runExpirySweep());
}
export const GET = POST;
