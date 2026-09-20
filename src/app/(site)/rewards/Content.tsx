"use client";

import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgePercent, CalendarClock, CheckCircle2, ChevronDown, Coins, Gift, Info, ListChecks, Repeat, Sparkles, Ticket, Wallet } from "lucide-react";
import type { AudienceGuide, RewardsGuide } from "@/lib/wallet/guide";
import type { GuideAudience } from "@/lib/wallet/earn-guide";

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const card = "rounded-2xl border border-border/50 bg-muted/30 p-6";

function SectionHead({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {body && <p className="mt-3 text-lg text-muted-foreground">{body}</p>}
    </div>
  );
}

export default function RewardsContent({
  guide,
  signedIn,
  defaultAudience,
  faqs,
}: {
  guide: RewardsGuide;
  signedIn: boolean;
  defaultAudience: string;
  faqs: { question: string; answer: string }[];
}) {
  const start = (guide.audiences.some((a) => a.id === defaultAudience) ? defaultAudience : "trainee") as GuideAudience;
  const [aud, setAud] = React.useState<GuideAudience>(start);
  const a = guide.audiences.find((x) => x.id === aud) as AudienceGuide;
  const offersUsage = a.usage.find((u) => u.module === "offers");

  // Worked example for the stacking explanation (clearly labelled as an example).
  const price = 10000;
  const offerOff = price * 0.1;
  const couponOff = price * 0.05;
  const afterDiscounts = price - offerOff - couponOff;
  const exampleBalance = 1000; // assumed wallet balance for the illustration
  const creditCap = offersUsage?.allowed ? Math.min(exampleBalance, Math.floor((afterDiscounts * offersUsage.maxPercent) / 100)) : 0;

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      {/* HERO */}
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
              <Coins className="h-4 w-4 text-primary" /> <span>1 YO Credit = ₹1 off</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="mb-6 text-5xl font-black leading-[1.1] tracking-tight text-foreground sm:text-6xl">
              Ways to earn <span className="bg-gradient-to-r from-primary to-[#ff8e75] bg-clip-text text-transparent">YO Credits</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl leading-8 text-muted-foreground">
              Earn credits for signing up, completing every stage of your journey, referring friends and more — then use them on offers, fees and invoices. Everything below shows exactly how much, when, and what you need to complete.
            </motion.p>
            <motion.div variants={fadeIn} className="mt-8 flex flex-wrap gap-3">
              <Link href={signedIn ? "/portal/wallet" : "/register"} className="group inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
                {signedIn ? "Open my wallet" : "Create free account"} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/offers" className="inline-flex items-center gap-2 rounded-xl border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">
                See live offers
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHead eyebrow="How it works" title="Earn. Track. Use." />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: Sparkles, t: "1 · Earn", b: "Sign up and complete activities. Credits are added to your wallet automatically — you get a notification each time." },
              { icon: Wallet, t: "2 · Track", b: "Your wallet shows your balance, every transaction, what's expiring and what you can still earn." },
              { icon: BadgePercent, t: "3 · Use", b: "Apply credits on offers, course fees and invoices, on top of offer discounts and coupon codes." },
            ].map(({ icon: Icon, t, b }) => (
              <div key={t} className={card}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><Icon className="h-6 w-6 text-primary" /></div>
                <h3 className="text-lg font-semibold text-foreground">{t}</h3>
                <p className="mt-1 text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BY USER TYPE */}
      <section className="border-y border-border/50 bg-muted/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHead eyebrow="By account type" title="What you can earn" body="Pick your account type — amounts are the live rewards for that type." />
          <div role="tablist" aria-label="Account type" className="mb-8 flex flex-wrap gap-2">
            {guide.audiences.map((x) => (
              <button key={x.id} role="tab" aria-selected={x.id === aud} onClick={() => setAud(x.id)} className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${x.id === aud ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-foreground"}`}>
                {x.label}
              </button>
            ))}
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6">
            <p className="max-w-2xl text-muted-foreground">{a.blurb}</p>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Earn up to</p>
              <p className="text-3xl font-black tabular-nums text-primary">{a.potential.toLocaleString("en-IN")} <span className="text-base font-bold">credits</span></p>
              <p className="text-xs text-muted-foreground">from one-time rewards + journey stages, before repeat rewards & referrals</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {a.ways.map((w) => (
              <div key={`${w.type}-${w.title}`} className={card}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-foreground">{w.title}</h3>
                  <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-sm font-bold tabular-nums text-primary">+{w.amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground"><Repeat className="h-3 w-3" /> {w.frequency}</span>
                  {w.expiresInDays && <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground"><CalendarClock className="h-3 w-3" /> Valid {w.expiresInDays} days</span>}
                </div>
                <p className="mt-4 text-sm"><span className="font-semibold text-foreground">When you get it: </span><span className="text-muted-foreground">{w.when}</span></p>
                <div className="mt-3">
                  <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-foreground"><ListChecks className="h-4 w-4 text-primary" /> What to complete</p>
                  <ol className="space-y-1 text-sm text-muted-foreground">
                    {w.steps.map((s, i) => (
                      <li key={i} className="flex gap-2"><span className="font-semibold text-primary">{i + 1}.</span> {s}</li>
                    ))}
                  </ol>
                </div>
                {w.note && <p className="mt-3 flex gap-1.5 text-xs text-muted-foreground"><Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {w.note}</p>}
              </div>
            ))}
          </div>

          {a.stages.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-1 text-xl font-bold text-foreground">Journey stage rewards</h3>
              <p className="mb-4 text-muted-foreground">You earn each time our team completes one of these stages on your journey.</p>
              <div className="overflow-x-auto rounded-2xl border border-border/50">
                <table className="w-full min-w-[420px] text-sm">
                  <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <tr><th className="px-5 py-3 font-semibold">Stage completed</th><th className="px-5 py-3 text-right font-semibold">Credits</th></tr>
                  </thead>
                  <tbody>
                    {a.stages.map((s) => (
                      <tr key={s.key} className="border-t border-border/40">
                        <td className="px-5 py-3 text-foreground">{s.label}</td>
                        <td className="px-5 py-3 text-right font-bold tabular-nums text-primary">+{s.amount.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className={card}>
              <h3 className="mb-1 flex items-center gap-2 text-xl font-bold text-foreground"><Gift className="h-5 w-5 text-primary" /> Referral program</h3>
              {a.referral.state === "off" ? (
                <p className="text-muted-foreground">Referrals are paused for this account type right now.</p>
              ) : (
                <>
                  <p className="text-muted-foreground">Share your link from Portal → Referrals. {a.referral.campaignName ? <>Current campaign: <strong className="text-foreground">{a.referral.campaignName}</strong>.</> : null}</p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-3"><dt className="text-muted-foreground">You earn</dt><dd className="font-bold text-primary">+{a.referral.referrer.toLocaleString("en-IN")}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Your friend earns</dt><dd className="font-bold text-primary">+{a.referral.referee.toLocaleString("en-IN")}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Paid when</dt><dd className="text-right font-medium text-foreground">{a.referral.event}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Max referrals per person</dt><dd className="font-medium text-foreground">{a.referral.cap}</dd></div>
                  </dl>
                  <p className="mt-4 text-xs text-muted-foreground">Self-referrals, duplicate accounts and unusual sign-up patterns are rejected or held for review.</p>
                </>
              )}
            </div>

            <div className={card}>
              <h3 className="mb-1 flex items-center gap-2 text-xl font-bold text-foreground"><Wallet className="h-5 w-5 text-primary" /> Where you can use credits</h3>
              <p className="mb-3 text-muted-foreground">Limits for {a.label.toLowerCase()} accounts.</p>
              <ul className="space-y-2.5 text-sm">
                {a.usage.map((u) => (
                  <li key={u.module} className="flex items-start justify-between gap-3 border-b border-border/40 pb-2.5 last:border-0">
                    <span className="font-medium text-foreground">{u.label}</span>
                    {u.allowed ? (
                      <span className="text-right text-muted-foreground">
                        up to <strong className="text-foreground">{u.maxPercent}%</strong> of the amount
                        {u.maxPerUse ? `, max ${u.maxPerUse.toLocaleString("en-IN")} credits per use` : ""}
                        {u.minOrder ? `, min order ${inr(u.minOrder)}` : ""}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Not available yet</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS & COUPONS */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHead eyebrow="Offers & coupons" title="How to use offers, coupon codes and credits together" body="Apply them in this order — each one only reduces what's left." />

          <div className="grid gap-5 lg:grid-cols-3">
            <div className={card}>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground"><Sparkles className="h-5 w-5 text-primary" /> 1 · Festival offer</h3>
              <ol className="space-y-1.5 text-sm text-muted-foreground">
                <li>1. Open the <Link href="/offers" className="font-medium text-primary underline">Offers page</Link> while a campaign is live.</li>
                <li>2. Choose the offer for your service and press <em>Claim</em>.</li>
                <li>3. Fill the short claim form (name, email, phone and a few details).</li>
                <li>4. The offer discount is calculated on our server from the original price.</li>
              </ol>
            </div>
            <div className={card}>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground"><Ticket className="h-5 w-5 text-primary" /> 2 · Coupon code</h3>
              <ol className="space-y-1.5 text-sm text-muted-foreground">
                <li>1. In the claim form find the <em>Coupon code</em> box.</li>
                <li>2. Type your code and press <em>Apply</em> to preview the extra saving.</li>
                <li>3. Coupons stack with the offer — the total discount never exceeds the price.</li>
                <li>4. Each coupon has its own rules (below); it&apos;s re-checked when you submit.</li>
              </ol>
            </div>
            <div className={card}>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground"><Coins className="h-5 w-5 text-primary" /> 3 · Your credits</h3>
              <ol className="space-y-1.5 text-sm text-muted-foreground">
                <li>1. Sign in first — credits are only used by the signed-in owner.</li>
                <li>2. Use the <em>same email</em> as your account in the claim form.</li>
                <li>3. Tick <em>Use my YashOrbit Credits</em>.</li>
                <li>4. Credits cover part of what remains, up to your account limit.</li>
              </ol>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className={card}>
              <h3 className="mb-3 text-lg font-semibold text-foreground">Coupon rules to check</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  ["Validity", "A coupon works only between its start and end date, and only while it is active."],
                  ["Who / what", "Some coupons are for a specific audience (student, intern, client, hiring) or a specific service."],
                  ["Minimum order", "Some need a minimum order value before they apply."],
                  ["Cap", "Percentage coupons can have a maximum discount amount."],
                  ["Limits", "Coupons can have a total usage limit and a per-person limit — once used up they stop working."],
                  ["Campaign", "A coupon can be tied to one campaign and won't work in another."],
                ].map(([k, v]) => (
                  <li key={k} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><strong className="text-foreground">{k}:</strong> {v}</span></li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">Coupon codes are shared through campaigns and by our team — they aren&apos;t listed publicly. If the box says a code is invalid, the message tells you exactly which rule it failed.</p>
            </div>

            <div className={card}>
              <h3 className="mb-1 text-lg font-semibold text-foreground">Worked example</h3>
              <p className="mb-3 text-xs text-muted-foreground">Illustration only — real amounts depend on the offer, coupon and your account limit ({a.label}).</p>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Original price</dt><dd className="tabular-nums text-foreground">{inr(price)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Offer: 10% off</dt><dd className="tabular-nums text-green-600 dark:text-green-400">− {inr(offerOff)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Coupon: 5% of original price</dt><dd className="tabular-nums text-green-600 dark:text-green-400">− {inr(couponOff)}</dd></div>
                <div className="flex justify-between border-t border-border/50 pt-2"><dt className="font-medium text-foreground">After offer + coupon</dt><dd className="font-semibold tabular-nums text-foreground">{inr(afterDiscounts)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Credits used (say you have {exampleBalance.toLocaleString("en-IN")}; limit {offersUsage?.allowed ? `${offersUsage.maxPercent}%` : "none"})</dt><dd className="tabular-nums text-green-600 dark:text-green-400">− {inr(creditCap)}</dd></div>
                <div className="flex justify-between border-t border-border/50 pt-2 text-base"><dt className="font-bold text-foreground">You pay</dt><dd className="font-black tabular-nums text-primary">{inr(afterDiscounts - creditCap)}</dd></div>
              </dl>
            </div>
          </div>

          {guide.offers.campaign && (
            <div className="mt-8">
              <h3 className="mb-1 text-xl font-bold text-foreground">Live now: {guide.offers.campaign.name}</h3>
              <p className="mb-4 text-muted-foreground">Ends {new Date(guide.offers.campaign.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}.</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {guide.offers.items.map((o) => (
                  <Link key={o.id} href={o.href} className={`${card} block transition-colors hover:border-primary/40`}>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{o.badge}</span>
                    <p className="mt-3 font-semibold text-foreground">{o.title}</p>
                    <p className="text-xs text-muted-foreground">{o.category}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* RULES */}
      <section className="border-y border-border/50 bg-muted/10 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHead eyebrow="Good to know" title="Credit rules at a glance" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "Promotional", b: "Credits are rewards, not money. No cash-out, no transfers." },
              { t: "Expiry", b: "Each reward has a validity. Oldest credits expire first and we warn you 7 days before." },
              { t: "Paid once per event", b: "Nothing pays twice for the same step — retries and re-clicks are safe." },
              { t: "Fair use", b: "Credits earned through misuse or fake referrals can be reversed. All changes are logged in your ledger." },
            ].map((x) => (
              <div key={x.t} className={card}>
                <h3 className="font-semibold text-foreground">{x.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{x.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <SectionHead eyebrow="FAQ" title="Questions about credits" />
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.question} className="group rounded-2xl border border-border/50 bg-muted/30 p-5 open:bg-muted/50">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-foreground">
                  {f.question}
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-muted-foreground">{f.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground">Ready to start earning?</h3>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">Create your free account and your welcome credits are added instantly.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href={signedIn ? "/portal/wallet" : "/register"} className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90">
                {signedIn ? "Open my wallet" : "Create free account"} <ArrowRight className="h-4 w-4" />
              </Link>
              {!signedIn && <Link href="/login" className="inline-flex items-center rounded-xl border border-border px-7 py-3.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary">Log in</Link>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
