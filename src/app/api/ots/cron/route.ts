import { NextRequest, NextResponse } from "next/server";
import { runSweep } from "@/lib/ots/sweep";
import { ensureOtsIndexes } from "@/lib/ots/db";

export const maxDuration = 300;

/**
 * Finalises timed-out attempts, expires missed assignments, sends
 * "opens soon" / "due soon" / "expired" notices and releases after-close
 * results (Vercel Cron, `Authorization: Bearer $CRON_SECRET`). OTS page loads
 * also run the sweep (throttled), so it works on a once-a-day cron plan.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureOtsIndexes();
  return NextResponse.json({ ok: true, ...(await runSweep()) });
}
