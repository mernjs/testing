import "server-only";
import { consoleEmailProvider } from "@/lib/platform/email/console";
import { resendEmailProvider } from "@/lib/platform/email/resend";
import type { EmailMessage, EmailProvider, EmailResult } from "@/lib/platform/email/types";

export type { EmailMessage, EmailResult } from "@/lib/platform/email/types";

/**
 * Outgoing email, behind a provider chosen at the platform level — never by
 * application code. `EMAIL_PROVIDER` picks the adapter (`resend` | `console`);
 * unset, it's Resend when `RESEND_API_KEY` exists, else the console adapter
 * (development: the message is printed, nothing is sent). Adding SES,
 * SendGrid or SMTP means adding one adapter file and one entry below.
 *
 * Server-only: provider credentials never reach the browser.
 */
const PROVIDERS: Record<string, EmailProvider> = {
  resend: resendEmailProvider,
  console: consoleEmailProvider,
};

export function activeEmailProvider(): EmailProvider {
  const configured = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (configured) {
    const provider = PROVIDERS[configured];
    if (!provider) throw new Error(`Unknown EMAIL_PROVIDER "${configured}" (expected one of: ${Object.keys(PROVIDERS).join(", ")})`);
    return provider;
  }
  return process.env.RESEND_API_KEY ? resendEmailProvider : consoleEmailProvider;
}

/** The platform's default sender, e.g. `YashOrbit <no-reply@yashorbit.com>`. */
export function defaultFrom(): string {
  return process.env.EMAIL_FROM?.trim() || "YashOrbit <no-reply@yashorbit.com>";
}

/**
 * Sends one message. Never throws: a failed send is reported in the result
 * (and logged) so a flaky provider can't break the flow that triggered it —
 * callers decide whether the email was essential.
 */
export async function sendEmail(message: Omit<EmailMessage, "from"> & { from?: string }): Promise<EmailResult> {
  try {
    const provider = activeEmailProvider();
    const result = await provider.send({ ...message, from: message.from ?? defaultFrom() });
    if (!result.ok) console.error(`[email:${provider.id}] send failed`, result.error);
    return result;
  } catch (err) {
    console.error("[email] send failed", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
