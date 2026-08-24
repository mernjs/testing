"use client";

import Link from "next/link";
import { Users2, ArrowRight, Calendar, Rocket, TrendingUp, Code2, ShieldCheck, HeartHandshake } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import DetailCTA from "@/components/sections/DetailCTA";
import { brandify } from "@/lib/brand";

// Temporary placeholder photos — swap for each leader's actual headshot when available.
const founders = [
  {
    name: "[NAME_OF_CEO]",
    role: "Co-Founder & CEO",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop",
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
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
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
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    bio: "Leads engineering strategy, architecture standards, and the company's applied AI roadmap across every client engagement.",
    icon: Code2,
    href: "/about/cto",
  },
  {
    name: "Shikha Singh",
    role: "Chief Financial Officer",
    photo: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=800&auto=format&fit=crop",
    bio: "Owns financial planning, statutory compliance, and pricing strategy across services, products, and training.",
    icon: ShieldCheck,
    href: "/about/cfo",
  },
  {
    name: "Pooja Singh",
    role: "Chief Human Resources Officer",
    photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=800&auto=format&fit=crop",
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

      <section className="py-20 sm:py-28 bg-background relative">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Main Founders</h2>
            <p className="text-lg leading-8 text-muted-foreground">The two co-founders who started YashOrbit and jointly set its direction.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {founders.map((founder) => (
              <div
                key={founder.name}
                className="flex flex-col rounded-3xl border border-border/50 bg-muted/20 overflow-hidden"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img src={founder.photo} alt={founder.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col flex-1 p-8 sm:p-10">
                  <h3 className="text-2xl font-bold text-foreground mb-1">{founder.name}</h3>
                  <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-6">{founder.role}</p>

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
                    className="mt-auto group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-all hover:scale-[1.02] active:scale-95"
                  >
                    View Full Profile
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32 bg-muted/10 pt-20 sm:pt-24 relative">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">Leadership Team</h2>
            <p className="text-lg leading-8 text-muted-foreground">The executives running technology, finance, and people alongside our founders.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {leadershipTeam.map((leader) => (
              <Link
                key={leader.name}
                href={leader.href}
                className="group flex flex-col rounded-3xl border border-border/50 bg-background overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col flex-1 p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <leader.icon className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">{leader.role}</p>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{leader.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{leader.bio}</p>

                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    View Full Profile
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
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
