"use client";

import Link from "next/link";
import React, { useActionState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bell, Coins, Eye, EyeOff, LayoutDashboard, Loader2, Route, ShieldCheck, Sparkles } from "lucide-react";
import { portalLoginAction, type PortalLoginState } from "@/app/portal/login/actions";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const input =
  "w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
const initial: PortalLoginState = {};

export default function LoginContent() {
  const [state, formAction, pending] = useActionState(portalLoginAction, initial);
  const [show, setShow] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <section className="relative flex-1 overflow-hidden bg-background pb-20 pt-28 sm:pt-32 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-[10%] -top-[20%] h-[60%] w-[60%] animate-blob rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
          <div className="animation-delay-2000 absolute right-[5%] top-[10%] h-[50%] w-[50%] animate-blob rounded-full bg-secondary/15 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
          <div className="animation-delay-4000 absolute -bottom-[20%] left-[20%] h-[70%] w-[70%] animate-blob rounded-full bg-[#ff8e75]/15 blur-[140px] mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute inset-0 bg-grid-slate-900/[0.02] [mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-grid-slate-400/[0.02]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-xl">
              <motion.div variants={fadeIn} className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-md">
                <Sparkles className="h-4 w-4 animate-pulse text-primary" /> <span>Welcome back</span>
              </motion.div>
              <motion.h1 variants={fadeIn} className="mb-6 text-5xl font-black leading-[1.1] tracking-tight text-foreground sm:text-6xl">
                Log in to your <span className="bg-gradient-to-r from-primary to-[#ff8e75] bg-clip-text text-transparent">portal</span>.
              </motion.h1>
              <motion.p variants={fadeIn} className="text-xl leading-8 text-muted-foreground">
                One login — your dashboard, journey, wallet and referrals, built for your account type.
              </motion.p>
              <motion.div variants={fadeIn} className="mt-10 space-y-4">
                {[
                  { icon: LayoutDashboard, t: "Live dashboard", b: "Progress, deadlines, payments and analytics in one place." },
                  { icon: Route, t: "Your journey", b: "See every stage and what's coming next." },
                  { icon: Coins, t: "Credits & rewards", b: "Track your wallet and see every way to earn more." },
                  { icon: Bell, t: "Instant updates", b: "Notifications the moment something changes." },
                ].map(({ icon: Icon, t, b }) => (
                  <div key={t} className="flex items-center gap-4 rounded-2xl border border-border/50 bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
                    <div>
                      <p className="font-semibold text-foreground">{t}</p>
                      <p className="text-sm text-muted-foreground">{b}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
              <motion.p variants={fadeIn} className="mt-6 text-sm text-muted-foreground">
                New to credits? See <Link href="/rewards" className="font-semibold text-primary underline">all the ways to earn</Link>.
              </motion.p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-border/50 bg-muted/20 p-8 shadow-2xl backdrop-blur-sm sm:p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <form action={formAction} className="relative z-10 space-y-6" noValidate>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Sign in</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Use the email and password for your YashOrbit account.</p>
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-foreground">Email</label>
                    <input id="email" name="email" type="email" required autoComplete="username" autoFocus className={input} placeholder="Enter your email" />
                  </div>
                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-semibold text-foreground">Password</label>
                    <div className="relative">
                      <input id="password" name="password" type={show ? "text" : "password"} required autoComplete="current-password" className={`${input} pr-12`} placeholder="Enter your password" />
                      <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-muted-foreground">
                      <input type="checkbox" name="remember" className="accent-primary" /> Remember me
                    </label>
                    <Link href="/portal/forgot-password" className="font-semibold text-primary hover:underline">Forgot password?</Link>
                  </div>
                  {state?.error && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-center text-sm text-red-500">{state.error}</p>}
                  <button type="submit" disabled={pending} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                    {pending ? <>Signing in <Loader2 className="h-4 w-4 animate-spin" /></> : <>Sign In <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
                  </button>
                  <p className="text-center text-sm text-muted-foreground">
                    New here? <Link href="/register" className="font-semibold text-primary underline">Create your account</Link> and get welcome credits.
                  </p>
                  <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5" /> You only ever see your own information.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
