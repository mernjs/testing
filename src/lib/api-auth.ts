import { NextRequest } from "next/server";

/**
 * Guards admin-only endpoints (reading/editing/deleting stored lead PII) with a
 * bearer secret. Public submission endpoints (POST) intentionally skip this.
 */
export function isAuthorizedAdminRequest(req: NextRequest): boolean {
  const secret = process.env.LEADS_API_SECRET;
  if (!secret) return false;
  const authHeader = req.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}
