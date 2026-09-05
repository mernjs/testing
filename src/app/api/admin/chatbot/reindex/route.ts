import { NextRequest, NextResponse, after } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { isOpenAIConfigured } from "@/lib/openai";
import { beginWebsiteIndex, runWebsiteIndex } from "@/lib/kb-website";
import { listKbRuns, reapStaleRuns } from "@/lib/kb-runs";
import { siteUrl } from "@/lib/seo";

async function authorize(req: NextRequest): Promise<string | null> {
  const secret = process.env.CHATBOT_ADMIN_API_SECRET;
  const authHeader = req.headers.get("authorization");
  if (secret && authHeader === `Bearer ${secret}`) return "api";
  const admin = await getCurrentAdmin();
  return admin ? admin.email : null;
}

/** Recent indexing runs (for polling progress). */
export async function GET(req: NextRequest) {
  if (!(await authorize(req))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await reapStaleRuns();
  return NextResponse.json({ runs: await listKbRuns(15) });
}

// Indexing can take several minutes; the crawl runs in `after()` so the
// response returns immediately with a run id the caller can poll.
export const maxDuration = 800;

/**
 * Triggers a knowledge-base re-index of the website content. Authorised by
 * either an admin session or the `CHATBOT_ADMIN_API_SECRET` bearer token
 * (mirrors src/app/api/indexing/route.ts) so it can be run from cron / CI.
 */
export async function POST(req: NextRequest) {
  const triggeredBy = await authorize(req);
  if (!triggeredBy) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isOpenAIConfigured()) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 503 });
  }

  let body: { incremental?: unknown; baseUrl?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    // no body — default to a full re-index
  }

  const baseUrl =
    (typeof body.baseUrl === "string" && body.baseUrl) ||
    process.env.CHATBOT_CRAWL_BASE_URL ||
    req.nextUrl.origin ||
    siteUrl;
  const incremental = body.incremental === true;

  const { runId, logger } = await beginWebsiteIndex({ triggeredBy, incremental });
  after(() => runWebsiteIndex(logger, { baseUrl, incremental, triggeredBy }));

  return NextResponse.json({ ok: true, runId });
}
