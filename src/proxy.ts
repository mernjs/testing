import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isMaintenanceOn, isPublicSitePath } from "@/lib/cms/maintenance-gate";
import { resolveCompanyIdByHost } from "@/lib/platform/tenancy/companies";

/**
 * First-touch referral capture, server side. A `?ref=CODE` on any page view
 * is stored in an HttpOnly cookie for 30 days (first code wins) so the
 * attribution survives even when the browser blocks localStorage, the visitor
 * bounces through /portal/login, or they sign up days later. Sign-up actions
 * read this cookie server-side — the client can't forge or drop it.
 */
const COOKIE = "yo_ref";
const MAX_AGE = 30 * 24 * 60 * 60;

// Same name as CMS_SESSION_COOKIE in src/lib/cms-auth.ts (not imported: that module is heavier than the proxy needs).
const CMS_SESSION_COOKIE = "cms_session";

export async function proxy(request: NextRequest) {
  // Every page belongs to the company whose domain it was requested on. A
  // host no company owns gets a plain "no workspace here" page, not an
  // error. A registry lookup failure falls through (fail open): the page's
  // own data access resolves the company again and fails safe on its own.
  let companyId: string | null | undefined;
  try {
    companyId = await resolveCompanyIdByHost(request.headers.get("host"));
  } catch (err) {
    console.error("[tenancy] company lookup failed in proxy", err);
  }
  if (companyId === null) {
    return NextResponse.rewrite(new URL("/workspace-not-found", request.url), { status: 404 });
  }

  // CMS maintenance mode: visitors to the public site get the maintenance page
  // (503, so search engines retry instead of indexing it). Anyone signed in to
  // the CMS still sees the real site, to check their work before reopening.
  if (companyId && isPublicSitePath(request.nextUrl.pathname) && !request.cookies.get(CMS_SESSION_COOKIE) && (await isMaintenanceOn(companyId))) {
    return NextResponse.rewrite(new URL("/maintenance", request.url), { status: 503, headers: { "Retry-After": "3600" } });
  }

  const raw = request.nextUrl.searchParams.get("ref");
  const code = raw?.trim().toUpperCase();
  const response = NextResponse.next();
  if (code && /^[A-Z0-9]{6,10}$/.test(code) && !request.cookies.get(COOKIE)) {
    response.cookies.set(COOKIE, code, { maxAge: MAX_AGE, path: "/", sameSite: "lax", httpOnly: true, secure: process.env.NODE_ENV === "production" });
  }
  // Anonymous, first-party device id — lets the referral fraud check notice one browser creating several "referred" accounts. HttpOnly, random, carries no personal data.
  if (!request.cookies.get("yo_did")) {
    response.cookies.set("yo_did", crypto.randomUUID(), { maxAge: 365 * 24 * 60 * 60, path: "/", sameSite: "lax", httpOnly: true, secure: process.env.NODE_ENV === "production" });
  }
  return response;
}

export const config = {
  // Page views only — skip API routes, Next internals and static files.
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
