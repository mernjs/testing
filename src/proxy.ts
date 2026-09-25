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

export function proxy(request: NextRequest) {
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
