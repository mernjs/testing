import { NextRequest, NextResponse } from "next/server";
import { runSopReminders } from "@/lib/sop/reminders";

/**
 * Daily SOP housekeeping (date-driven status changes + reminders). Vercel Cron
 * calls this with `Authorization: Bearer $CRON_SECRET`; without a configured
 * secret the route refuses to run, so it can never be triggered anonymously.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await runSopReminders();
  return NextResponse.json({ ok: true, ...result });
}
