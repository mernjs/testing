"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users2, ArrowRight, Calendar, Rocket, TrendingUp, Code2, ShieldCheck, HeartHandshake } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import DetailCTA from "@/components/sections/DetailCTA";
import DefaultAvatar from "@/components/ui/DefaultAvatar";
import { brandify } from "@/lib/brand";

const founders = [
  {
    name: "[NAME_OF_CEO]",
    role: "Co-Founder & CEO",
    gender: "female" as const,
    bio: "[NAME_OF_CEO] co-founded YashOrbit in 2026 as CEO, setting company strategy and culture while staying closely involved in the leadership team and the company's most important client relationships.",
    highlights: [
      { label: "Years in Leadership", value: "12+", icon: Calendar },
      { label: "Companies Co-Founded", value: "1", icon: Rocket },
      { label: "Focus", value: "Strategy & Growth", icon: TrendingUp },
    ],
    href: "/about/co-founder-ceo",
  },
  {
    name: "Priyanka Singh",
    role: "Co-Founder & COO",
    gender: "female" as const,
    bio: "Priyanka co-founded YashOrbit in 2026 as COO, owning delivery operations, hiring, and the cross-team coordination that keeps engineering, AI, and training teams shipping on schedule.",
    highlights: [
      { label: "Years in Operations", value: "9+", icon: Calendar },
      { label: "Companies Co-Founded", value: "1", icon: Rocket },
      { label: "Focus", value: "Delivery Operations & Scaling", icon: TrendingUp },
    ],
    href: "/about/co-founder-coo",
  },
];

const leadershipTeam = [
  {
    name: "Tej Pratap Singh",
    role: "Chief Technology Officer",
    gender: "male" as const,
    bio: "Leads engineering strategy, architecture standards, and the company's applied AI roadmap across every client engagement.",
    icon: Code2,
    href: "/about/cto",
  },
  {
    name: "Shikha Singh",
    role: "Chief Financial Officer",
    gender: "female" as const,
    bio: "Owns financial planning, statutory compliance, and pricing strategy across services, products, and training.",
    icon: ShieldCheck,
    href: "/about/cfo",
  },
  {
    name: "Pooja Singh",
    role: "Chief Human Resources Officer",
    gender: "female" as const,
    bio: "Owns talent acquisition, culture, and learning and development as the team grows across every function.",
    icon: HeartHandshake,
    href: "/about/chro",
  },
];

export default function LeadershipContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="about"
        categoryLabel="about"
        title="Founders & Leadership"
        subtitle={brandify("The people leading YashOrbit")}
        description={brandify("YashOrbit is co-founded and jointly led by an executive team spanning strategy, operations, technology, finance, and people — each personally accountable for their part of every engagement.")}
        icon={Users2}
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Main Founders</h2>
            <p className="text-lg leading-8 text-muted-foreground">The two co-founders who started YashOrbit and jointly set its direction.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {founders.map((founder, i) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-br from-primary/30 via-primary/0 to-secondary/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />

                <div className="relative flex flex-col h-full rounded-3xl border border-border/50 bg-muted/20 p-8 sm:p-10 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-1 group-hover:border-primary/30 transition-all duration-300">
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="relative mb-5">
                      <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-4 ring-background shadow-lg group-hover:ring-primary/25 transition-all duration-300">
                        <DefaultAvatar
                          gender={founder.gender}
                          className="transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-primary/10 text-primary text-[11px] font-semibold px-3 py-1 mb-4">
                      Co-Founder
                    </span>
                    <h3 className="text-2xl font-bold text-foreground mb-1">{founder.name}</h3>
                    <p className="text-sm font-semibold text-primary uppercase tracking-wider">{founder.role}</p>
                  </div>

                  <p className="text-base text-muted-foreground leading-relaxed mb-8">
                    {brandify(founder.bio)}
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {founder.highlights.map((h) => (
                      <div key={h.label} className="rounded-xl border border-border/50 bg-background p-3 text-center">
                        <h.icon className="h-4 w-4 text-primary mx-auto mb-2" />
                        <div className="text-sm font-bold text-foreground">{h.value}</div>
                        <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">{h.label}</div>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={founder.href}
                    className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:scale-[1.02] active:scale-95"
                  >
                    View Full Profile
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32 bg-muted/10 pt-20 sm:pt-24 relative overflow-hidden">
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[900px] h-[500px] bg-secondary/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Leadership Team</h2>
            <p className="text-lg leading-8 text-muted-foreground">The executives running technology, finance, and people alongside our founders.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadershipTeam.map((leader, i) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-primary/30 via-primary/0 to-secondary/30 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 pointer-events-none" />

                <Link
                  href={leader.href}
                  className="relative flex flex-col h-full items-center text-center rounded-3xl border border-border/50 bg-background p-7 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-primary/30 transition-all duration-300"
                >
                  <div className="relative mb-5">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-muted/30 group-hover:ring-primary/25 shadow-md transition-all duration-300">
                      <DefaultAvatar
                        gender={leader.gender}
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-semibold px-2.5 py-1 mb-3">
                    <leader.icon className="h-3 w-3" />
                    {leader.role}
                  </span>

                  <h3 className="font-bold text-foreground mb-2">{leader.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{leader.bio}</p>

                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    View Full Profile
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <DetailCTA
        heading="Want to talk with our leadership team?"
        description="For complex or high-stakes engagements, we're glad to bring the right leader directly into the conversation."
        ctaLabel="Connect With Us"
      />
    </div>
  );
}
