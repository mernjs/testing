import { NextRequest, NextResponse } from "next/server";
import { getChatbotConfig } from "@/lib/chatbot-config";
import { applyChatCookies, ensureVisitorCookie, hashClientIp } from "@/lib/chatbot-sessions";
import { validateIdentity, upsertVisitorProfile } from "@/lib/chat-visitors";

/** Captures the visitor's details from the pre-chat form. */
export async function POST(req: NextRequest) {
  const config = await getChatbotConfig();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = validateIdentity(body, config.preChat);
  if (!validation.valid) {
    return NextResponse.json({ error: "Please check the highlighted fields.", fields: validation.errors }, { status: 422 });
  }

  const { visitorId, cookiesToSet } = ensureVisitorCookie(req);
  await upsertVisitorProfile(visitorId, { ...validation.data, ipHash: hashClientIp(req) });

  const res = NextResponse.json({ ok: true, identified: true, name: validation.data.name });
  return applyChatCookies(res, cookiesToSet);
}
