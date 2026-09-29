import type { EmailProvider } from "@/lib/platform/email/types";

/**
 * Development adapter: prints the message instead of sending it, so sign-up
 * and invite links can be followed locally without an email account. Refuses
 * in production, where silently dropping mail would strand real users.
 */
export const consoleEmailProvider: EmailProvider = {
  id: "console",
  async send(message) {
    if (process.env.NODE_ENV === "production" && process.env.EMAIL_PROVIDER !== "console") {
      return { ok: false, error: "No email provider configured (set RESEND_API_KEY or EMAIL_PROVIDER)" };
    }
    console.log(`\n[email:console] to=${[message.to].flat().join(", ")} subject="${message.subject}"\n${message.text}\n`);
    return { ok: true, id: null };
  },
};
