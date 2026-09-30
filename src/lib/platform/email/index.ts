import "server-only";
import { createConsoleEmailProvider } from "@/lib/platform/email/console";
import { createResendEmailProvider } from "@/lib/platform/email/resend";
import type { EmailMessage, EmailProvider, EmailResult } from "@/lib/platform/email/types";
import { resolveEmailConfig, type ResolvedEmailConfig } from "@/lib/platform/integrations/resolve";

export type { EmailMessage, EmailResult } from "@/lib/platform/email/types";

/**
 * Outgoing email, behind a provider chosen at the platform level — never by
 * application code. Configured in Platform Panel → Integrations, falling back
 * to `EMAIL_PROVIDER` (`resend` | `console`) / `RESEND_API_KEY` /
 * `EMAIL_FROM`; with nothing set it's Resend when an API key exists, else the
 * console adapter (development: the message is printed, nothing is sent).
 * Adding SES, SendGrid or SMTP means one adapter file and one case below.
 *
 * Server-only: provider credentials never reach the browser.
 */
export async function activeEmailProvider(): Promise<EmailProvider> {
  return providerFor(await resolveEmailConfig());
}

function providerFor(cfg: ResolvedEmailConfig): EmailProvider {
  return cfg.provider === "resend" ? createResendEmailProvider(cfg.resendApiKey) : createConsoleEmailProvider(cfg.explicit);
}

/** The platform's default sender, e.g. `YashOrbit <no-reply@yashorbit.com>`. */
export async function defaultFrom(): Promise<string> {
  return (await resolveEmailConfig()).from;
}

/**
 * Sends one message. Never throws: a failed send is reported in the result
 * (and logged) so a flaky provider can't break the flow that triggered it —
 * callers decide whether the email was essential.
 */
export async function sendEmail(message: Omit<EmailMessage, "from"> & { from?: string }): Promise<EmailResult> {
  try {
    const cfg = await resolveEmailConfig();
    const provider = providerFor(cfg);
    const result = await provider.send({ ...message, from: message.from ?? cfg.from });
    if (!result.ok) console.error(`[email:${provider.id}] send failed`, result.error);
    return result;
  } catch (err) {
    console.error("[email] send failed", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
