import { NextRequest } from "next/server";
import { PMS_SESSION_COOKIE, getSessionPmsUser } from "@/lib/pms-auth";

/**
 * Guards PMS-only API routes (CSV exports). Accepts either a logged-in PMS
 * session cookie or a `PMS_API_SECRET` bearer token for cron / external tooling.
 * Mirrors `src/lib/hrms/api-auth.ts`.
 */
export async function isAuthorizedPmsRequest(req: NextRequest): Promise<boolean> {
  const secret = process.env.PMS_API_SECRET;
  const authHeader = req.headers.get("authorization");
  if (secret && authHeader === `Bearer ${secret}`) return true;

  const sessionToken = req.cookies.get(PMS_SESSION_COOKIE)?.value;
  const user = await getSessionPmsUser(sessionToken);
  return user !== null;
}
