import type { EmailProvider } from "@/lib/platform/email/types";

/** Resend (https://resend.com) over its REST API — no SDK dependency. Needs `RESEND_API_KEY`. */
export const resendEmailProvider: EmailProvider = {
  id: "resend",
  async send(message) {
    const key = process.env.RESEND_API_KEY;
    if (!key) return { ok: false, error: "RESEND_API_KEY is not set" };
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: message.from,
        to: Array.isArray(message.to) ? message.to : [message.to],
        subject: message.subject,
        html: message.html,
        text: message.text,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(15_000),
    });
    const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
    if (!res.ok) return { ok: false, error: `Resend ${res.status}: ${body.message ?? body.name ?? "request failed"}` };
    return { ok: true, id: body.id ?? null };
  },
};
