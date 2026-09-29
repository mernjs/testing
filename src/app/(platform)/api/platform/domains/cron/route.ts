import { NextRequest, NextResponse } from "next/server";
import { recheckPendingDomains } from "@/lib/platform/domains/custom";

/**
 * Daily re-check of every company's pending custom domains (Vercel Cron,
 * `Authorization: Bearer $CRON_SECRET`). Refuses to run without a configured secret.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, companies: await recheckPendingDomains() });
}
