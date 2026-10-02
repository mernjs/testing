"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Mail, MailCheck } from "lucide-react";
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

  const sent = state.status === "sent";
  const button = "inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-60";
  return (
    <motion.div
      id="verify-banner"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm transition-colors ${sent ? "border-emerald-500/40 bg-emerald-500/10" : "border-amber-500/40 bg-amber-500/10"}`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${sent ? "bg-emerald-500/20 text-emerald-600" : "bg-amber-500/20 text-amber-600"}`}>
          {sent ? <MailCheck className="size-4.5" /> : <Mail className="size-4.5" />}
        </span>
        <div role="status" aria-live="polite" className="min-w-0">
          {sent ? (
            <>
              <p className="font-semibold text-foreground">Check your inbox</p>
              <p className="text-xs text-muted-foreground">
                We sent a link to <span className="break-all font-medium text-foreground">{state.email}</span>. It stays valid for 24 hours — check spam too.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-foreground">Verify your email address</p>
              <p className="text-xs text-muted-foreground">
                <span className="break-all">{email}</span> isn&apos;t verified yet. It takes one click and keeps your account secure.
              </p>
            </>
          )}
          {state.status === "error" && (
            <p id="verify-banner-error" className="mt-1 text-xs text-destructive">
              {state.error}
            </p>
          )}
        </div>
      </div>
      {sent ? (
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
    </motion.div>
  );
}

/** One-off success toast after the verification page redirects here with `?emailVerified=1`. */
export function VerifiedNotice() {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("emailVerified") !== "1") return;
    toast.success("Email verified", { description: "Thank you — your account is now more secure." });
    url.searchParams.delete("emailVerified");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, []);
  return null;
}
