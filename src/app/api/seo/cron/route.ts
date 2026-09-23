import { NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/lib/seo-panel/settings";
import { runCrawl, latestCompletedRun, CrawlBusyError } from "@/lib/seo-panel/crawler";
import { syncSearchConsole } from "@/lib/seo-panel/integrations/gsc";
import { syncAnalytics } from "@/lib/seo-panel/integrations/ga4";
import { verifyBacklinks } from "@/lib/seo-panel/backlinks";

export const maxDuration = 300;

/**
 * Daily SEO housekeeping (Vercel Cron, `Authorization: Bearer $CRON_SECRET`):
 * Search Console + Analytics sync when enabled, the scheduled website audit
 * (daily or weekly per Settings), and a weekly backlink re-verification on
 * Mondays. Refuses to run without a configured secret.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const s = await getSettings();
  const out: Record<string, unknown> = {};
  const attempt = async (key: string, fn: () => Promise<unknown>) => {
    try {
      out[key] = await fn();
    } catch (err) {
      out[key] = { error: err instanceof Error ? err.message : "failed" };
    }
  };
  if (s.schedule.syncSearchData && s.integrations.gsc.enabled) await attempt("gsc", syncSearchConsole);
  if (s.schedule.syncSearchData && s.integrations.ga4.enabled) await attempt("ga4", syncAnalytics);

  const last = await latestCompletedRun();
  const ageDays = last ? (Date.now() - last.startedAt.getTime()) / 86400000 : Infinity;
  const due = (s.schedule.auditFrequency === "daily" && ageDays >= 0.9) || (s.schedule.auditFrequency === "weekly" && ageDays >= 6.9);
  if (due) {
    await attempt("audit", async () => {
      try {
        const run = await runCrawl({ trigger: "schedule", actorId: null, actorEmail: null });
        return { runId: run._id, status: run.status, pages: run.pagesCrawled };
      } catch (err) {
        if (err instanceof CrawlBusyError) return { skipped: "audit already running" };
        throw err;
      }
    });
  }
  if (s.schedule.verifyBacklinks && new Date().getDay() === 1) await attempt("backlinks", () => verifyBacklinks());
  return NextResponse.json({ ok: true, ...out });
}
