"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { verifyStripHiddenOn } from "@/lib/platform/email-verification-rule";
import { sendVerificationEmailAction, type VerifyEmailSendState } from "@/app/workspace/(protected)/actions";

const RESEND_COOLDOWN_S = 30;

/**
 * The "Verify your email" strip: shown to a signed-in user whose address isn't
 * verified yet, on every Workspace page (the dashboard included). Nothing is
 * blocked while it shows. "Verify email" sends the link and the strip changes
 * in place; Resend appears after a short cooldown.
 */
export default function VerifyEmailBanner({ email }: { email: string }) {
  const path = usePathname();
  const [state, setState] = useState<VerifyEmailSendState>({ status: "idle" });
  const [pending, start] = useTransition();
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  if (verifyStripHiddenOn(path)) return null;

  const send = () =>
    start(async () => {
      const res = await sendVerificationEmailAction().catch((): VerifyEmailSendState => ({ status: "error", error: "Something went wrong. Please try again." }));
      setState(res);
      if (res.status === "sent") setCooldown(RESEND_COOLDOWN_S);
    });

  const button = "inline-flex items-center gap-1 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60";
  return (
    <div id="verify-banner" className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-3 text-sm">
      <div role="status" aria-live="polite" className="min-w-0">
        {state.status === "sent" ? (
          <>
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              <MailCheck className="size-4" /> Check your inbox
            </span>
            <span className="text-muted-foreground"> — we sent a link to <span className="break-all font-medium text-foreground">{state.email}</span>.</span>
          </>
        ) : (
          <>
            <span className="font-semibold text-foreground">Your email address isn&apos;t verified</span>
            <span className="text-muted-foreground"> — <span className="break-all">{email}</span>. Verify it to keep your account secure.</span>
          </>
        )}
        {state.status === "error" && <span id="verify-banner-error" className="mt-1 block text-destructive">{state.error}</span>}
      </div>
      {state.status === "sent" ? (
        <button type="button" id="verify-banner-resend" onClick={send} disabled={pending || cooldown > 0} className={button}>
          {pending && <Loader2 className="size-3.5 animate-spin" />}
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
        </button>
      ) : (
        <button type="button" onClick={send} disabled={pending} className={button}>
          {pending && <Loader2 className="size-3.5 animate-spin" />}
          Verify email
        </button>
      )}
    </div>
  );
}

/** One-off success toast after the verification page redirects here with `?emailVerified=1`. */
export function VerifiedNotice() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("emailVerified") !== "1") return;
    toast.success("Email verified. Thank you!");
    url.searchParams.delete("emailVerified");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, []);
  return null;
}
