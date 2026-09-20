"use client";

import Link from "next/link";
import React, { useActionState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Coins, Gift, LayoutDashboard, Loader2, Route, Share2, Sparkles, UserPlus } from "lucide-react";
import { useReferralCode } from "@/lib/useReferralCode";
import { formatCredits } from "@/lib/wallet/constants";
import { portalJoinAction, type PortalJoinState } from "@/app/portal/join/actions";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const TYPES = [
  { value: "student", label: "Student — courses & training" },
  { value: "intern", label: "Intern — internship program" },
  { value: "client", label: "Client / Business — projects & services" },
  { value: "job_seeker", label: "Job seeker / Hiring" },
];

const input =
  "w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
const initial: PortalJoinState = {};

export default function RegisterContent({
  initialCode,
  referrerName,
  welcomeBonus,
  codeRejected,
  referral,
}: {
  initialCode: string;
  referrerName: string | null;
  welcomeBonus: number;
  codeRejected: boolean;
  referral: { referrer: number; referee: number; event: string } | null;
}) {
  const [state, formAction, pending] = useActionState(portalJoinAction, initial);
  const stored = useReferralCode();
  const [code, setCode] = React.useState(initialCode);
  const fe = state.fieldErrors ?? {};

  // Cookie-blocked browsers: fall back to the localStorage capture once.
  React.useEffect(() => {
    if (!initialCode && stored) setCode(stored); // eslint-disable-line react-hooks/set-state-in-effect
  }, [stored, initialCode]);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <section className="relative overflow-hidden border-b border-border/50 bg-background pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-[10%] -top-[20%] h-[60%] w-[60%] animate-blob rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
          <div className="animation-delay-2000 absolute right-[5%] top-[10%] h-[50%] w-[50%] animate-blob rounded-full bg-secondary/15 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
          <div className="animation-delay-4000 absolute -bottom-[20%] left-[20%] h-[70%] w-[70%] animate-blob rounded-full bg-[#ff8e75]/15 blur-[140px] mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute inset-0 bg-grid-slate-900/[0.02] [mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-grid-slate-400/[0.02]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
            <motion.div variants={fadeIn} className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-md">
              <Sparkles className="h-4 w-4 animate-pulse text-primary" />
              <span>Free account · Portal access · Earn credits</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="mb-6 text-5xl font-black leading-[1.1] tracking-tight text-foreground sm:text-6xl">
              Create your account.{" "}
              <span className="bg-gradient-to-r from-primary to-[#ff8e75] bg-clip-text text-transparent">Earn as you go.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl leading-8 text-muted-foreground">
              One account for your dashboard, journey tracking, wallet and referrals. Get credits for signing up — and for every step you complete after.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="space-y-10">
              <div>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Everything in one place</h2>
                <p className="text-lg text-muted-foreground">Sign up in under a minute and get instant access to your portal.</p>
              </div>
              <div className="space-y-5">
                {[
                  { icon: LayoutDashboard, title: "Your personal dashboard", body: "Live progress, deadlines, payments, notifications and analytics for your account type." },
                  { icon: Route, title: "Track every stage", body: "See exactly where your application, training or project stands — and what's next." },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} className="flex gap-4 rounded-2xl border border-border/50 bg-muted/30 p-6 transition-colors hover:bg-muted/50">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10"><Icon className="h-6 w-6 text-primary" /></div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                      <p className="text-muted-foreground">{body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {referral && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                  <h3 className="mb-1 flex items-center gap-2 text-xl font-bold text-foreground"><Gift className="h-5 w-5 text-primary" /> Refer &amp; earn</h3>
                  <p className="text-muted-foreground">Share your link once you&apos;re in. When someone joins through it, you both earn credits.</p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/50 bg-background/60 p-4 text-center">
                      <p className="text-xs font-medium text-muted-foreground">You earn</p>
                      <p className="text-2xl font-black tabular-nums text-primary">+{referral.referrer.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-background/60 p-4 text-center">
                      <p className="text-xs font-medium text-muted-foreground">Your friend earns</p>
                      <p className="text-2xl font-black tabular-nums text-primary">+{referral.referee.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  <ol className="mt-5 space-y-3">
                    {[
                      { icon: Share2, t: "Share your link", b: "Copy your code or link from Portal → Referrals." },
                      { icon: UserPlus, t: "Friend joins", b: "They sign up through it, or enter your code." },
                      { icon: Coins, t: "You both earn", b: `Credits are added when: ${referral.event.toLowerCase()}.` },
                    ].map(({ icon: Icon, t, b }, i) => (
                      <li key={t} className="flex items-start gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{i + 1} · {t}</p>
                          <p className="text-xs text-muted-foreground">{b}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4 text-xs text-muted-foreground">Credits are promotional and have no cash value. <Link href="/rewards" className="font-semibold text-primary underline">See every way to earn →</Link></p>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-muted/20 p-8 shadow-2xl backdrop-blur-sm sm:p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="relative">
                  {referrerName && (
                    <div className="mb-6 flex gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
                      <Gift className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span><strong>{referrerName}</strong> invited you.{welcomeBonus > 0 && <> Join to earn a welcome bonus of up to <strong>{formatCredits(welcomeBonus)}</strong>.</>}</span>
                    </div>
                  )}
                  {codeRejected && <p className="mb-6 rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">That referral link isn&apos;t active right now, but you can still join.</p>}

                  <form action={formAction} className="relative z-10 space-y-6" noValidate>
                    {state.error && <p className="text-center text-sm text-red-500">{state.error}</p>}
                    <div>
                      <label htmlFor="accountType" className="mb-2 block text-sm font-semibold text-foreground">I am a…</label>
                      <select id="accountType" name="accountType" required defaultValue="" className={input}>
                        <option value="" disabled>Choose one</option>
                        {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      {fe.accountType && <p className="mt-1 text-xs text-red-500">{fe.accountType}</p>}
                    </div>
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-semibold text-foreground">Name</label>
                      <input id="name" name="name" type="text" required autoComplete="name" className={input} placeholder="Enter your full name" />
                      {fe.name && <p className="mt-1 text-xs text-red-500">{fe.name}</p>}
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-semibold text-foreground">Email</label>
                        <input id="email" name="email" type="email" required autoComplete="email" className={input} placeholder="Enter your email" />
                        {fe.email && <p className="mt-1 text-xs text-red-500">{fe.email}</p>}
                      </div>
                      <div>
                        <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-foreground">Phone Number</label>
                        <input id="phone" name="phone" type="tel" required autoComplete="tel" className={input} placeholder="Enter your phone number" />
                        {fe.phone && <p className="mt-1 text-xs text-red-500">{fe.phone}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-foreground">Password</label>
                        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className={input} placeholder="At least 8 characters" />
                        {fe.password && <p className="mt-1 text-xs text-red-500">{fe.password}</p>}
                      </div>
                      <div>
                        <label htmlFor="confirm" className="mb-2 block text-sm font-semibold text-foreground">Confirm Password</label>
                        <input id="confirm" name="confirm" type="password" required autoComplete="new-password" className={input} placeholder="Repeat password" />
                        {fe.confirm && <p className="mt-1 text-xs text-red-500">{fe.confirm}</p>}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="referralCode" className="mb-2 block text-sm font-semibold text-foreground">Referral code <span className="font-normal text-muted-foreground">(optional)</span></label>
                      <input id="referralCode" name="referralCode" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={10} className={`${input} font-mono uppercase tracking-widest`} placeholder="e.g. C7B8VU5X" />
                    </div>
                    <label className="flex items-start gap-3 text-sm text-muted-foreground">
                      <input type="checkbox" name="terms" className="mt-1" />
                      <span>I agree to the <a href="/about/terms-and-conditions" className="underline hover:text-primary">Terms</a> and <a href="/about/privacy-policy" className="underline hover:text-primary">Privacy Policy</a>. Credits are promotional and have no cash value.</span>
                    </label>
                    {fe.terms && <p className="text-xs text-red-500">{fe.terms}</p>}
                    <button type="submit" disabled={pending} className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                      {pending ? <>Creating account <Loader2 className="h-4 w-4 animate-spin" /></> : <>Create Account &amp; Open Portal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
                    </button>
                    <p className="mt-4 text-center text-xs text-muted-foreground">
                      Already have an account? <Link href="/login" className="font-semibold text-primary underline">Log in</Link>
                    </p>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
