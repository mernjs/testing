import { NextRequest, NextResponse } from "next/server";
import { runTrialSweep } from "@/lib/platform/billing/trials";

/**
 * Daily free-trial sweep across every company — reminders at 7/3/1 days left,
 * expired trials become read-only (Vercel Cron, `Authorization: Bearer $CRON_SECRET`).
 * Refuses to run without a configured secret.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, ...(await runTrialSweep(new Date())) });
}
