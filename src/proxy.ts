import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * First-touch referral capture, server side. A `?ref=CODE` on any page view
 * is stored in an HttpOnly cookie for 30 days (first code wins) so the
 * attribution survives even when the browser blocks localStorage, the visitor
 * bounces through /portal/login, or they sign up days later. Sign-up actions
 * read this cookie server-side — the client can't forge or drop it.
 */
const COOKIE = "yo_ref";
const MAX_AGE = 30 * 24 * 60 * 60;

/**
 * Site-down switch. ON by default: every page and API route answers with an
 * Apache-style "503 Service Unavailable" page. Set SITE_DOWN=0 to bring the site back. SITE_DOWN_UNTIL (ISO date) ends
 * it automatically. SITE_DOWN_BYPASS lets the owner in: open any URL with
 * `?bypass=<secret>` once and a cookie keeps that browser working.
 */
const BYPASS_COOKIE = "yo_bypass";

function siteDown(request: NextRequest) {
  if (process.env.SITE_DOWN === "0") return false;
  const until = process.env.SITE_DOWN_UNTIL ? Date.parse(process.env.SITE_DOWN_UNTIL) : NaN;
  if (!Number.isNaN(until) && Date.now() >= until) return false;
  const secret = process.env.SITE_DOWN_BYPASS;
  if (secret && request.cookies.get(BYPASS_COOKIE)?.value === secret) return false;
  return true;
}

function apacheErrorPage(host: string) {
  return `<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>503 Service Unavailable</title>
<link rel="icon" href="data:,">
</head><body>
<h1>Service Unavailable</h1>
<p>The server is temporarily unable to service your
request due to maintenance downtime or capacity
problems. Please try again later.</p>
<hr>
<address>Apache/2.4.58 (Ubuntu) Server at ${host.replace(/[^a-zA-Z0-9.:-]/g, "")} Port 443</address>
</body></html>
`;
}

export function proxy(request: NextRequest) {
  const secret = process.env.SITE_DOWN_BYPASS;
  if (secret && request.nextUrl.searchParams.get("bypass") === secret) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("bypass");
    const res = NextResponse.redirect(url);
    res.cookies.set(BYPASS_COOKIE, secret, { maxAge: 7 * 24 * 60 * 60, path: "/", sameSite: "lax", httpOnly: true, secure: process.env.NODE_ENV === "production" });
    return res;
  }

  if (siteDown(request)) {
    return new NextResponse(apacheErrorPage(request.nextUrl.hostname), {
      status: 503,
      headers: { "content-type": "text/html; charset=iso-8859-1", "retry-after": "3600", "cache-control": "no-store", server: "Apache/2.4.58 (Ubuntu)" },
    });
  }

  // Page views only below — API routes and static files pass straight through.
  const path = request.nextUrl.pathname;
  if (path.startsWith("/api") || /\.[^/]+$/.test(path)) return NextResponse.next();

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
  // Everything except Next's own build assets, so the site-down switch covers pages and API routes alike.
  matcher: ["/((?!_next/static|_next/image).*)"],
};
