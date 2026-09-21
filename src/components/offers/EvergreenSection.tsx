import Link from "next/link";
import { ArrowRight, Code2, Bot, GraduationCap, Users, Briefcase, Headset, PlayCircle, Gift, Wallet, MessageCircle, Phone } from "lucide-react";
import { getServiceHref } from "@/lib/offers/constants";
import { whatsapp, phone } from "@/lib/contact";
import type { CategorySlug } from "@/lib/categories";

const POPULAR: { slug: CategorySlug; icon: typeof Code2; title: string; blurb: string }[] = [
  { slug: "software-development", icon: Code2, title: "Web & Mobile Apps", blurb: "Custom web, mobile and SaaS products built end to end." },
  { slug: "ai-automations", icon: Bot, title: "AI & Automation", blurb: "AI agents, chatbots and workflow automation for your business." },
  { slug: "industrial-training", icon: GraduationCap, title: "Industry Training", blurb: "Mentor-led programs with live projects and placement support." },
  { slug: "resource-augmentation", icon: Users, title: "Hire Developers", blurb: "Pre-vetted developers — individual, dedicated team or project." },
  { slug: "internship-program", icon: Briefcase, title: "Internships", blurb: "Real project experience, mentorship and a certificate." },
];

// Always-available, real site features — no discount amounts are claimed here.
const PERKS = [
  { icon: Headset, title: "Free consultation", blurb: "Talk through your idea with an engineer before you commit to anything." },
  { icon: PlayCircle, title: "Live demos", blurb: "See working products and AI demos on our live-demos page." },
  { icon: Gift, title: "Refer & earn", blurb: "Share your link — you and your friend both earn YashOrbit Credits.", href: "/rewards" },
  { icon: Wallet, title: "Welcome credits", blurb: "Create a free portal account to start a wallet and earn credits as you go.", href: "/register" },
];

/** "While you wait" content shared by the no-campaign and upcoming states: popular services, always-on perks, direct lead CTAs. */
export default function EvergreenSection({ heading = "Popular right now" }: { heading?: string }) {
  return (
    <>
      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{heading}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Explore what we do while the next offers are prepared.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR.map((p) => (
              <Link key={p.slug} href={getServiceHref(p.slug, "all")} className="group flex flex-col rounded-3xl border border-border/50 bg-background/95 p-6 transition-transform hover:-translate-y-1">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary"><p.icon className="size-5 text-white" /></span>
                <h3 className="mt-4 text-lg font-bold text-foreground">{p.title}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{p.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Explore <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-muted/10 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Always on, no campaign needed</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map((p) => {
              const body = (
                <>
                  <p.icon className="size-6 text-primary" />
                  <h3 className="mt-3 font-bold text-foreground">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                </>
              );
              return p.href ? (
                <Link key={p.title} href={p.href} className="rounded-3xl border border-border/50 bg-background p-5 transition-colors hover:border-primary">{body}</Link>
              ) : (
                <div key={p.title} className="rounded-3xl border border-border/50 bg-background p-5">{body}</div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Need something specific? Ask for a custom offer.</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">Tell us what you&apos;re building or learning — we&apos;ll put together a package and price it for you.</p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">Request a custom quote <ArrowRight className="size-4" /></Link>
            <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border/60 px-6 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"><MessageCircle className="size-4" /> WhatsApp us</a>
            <a href={phone.href} className="inline-flex items-center gap-2 rounded-full border border-border/60 px-6 py-3 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"><Phone className="size-4" /> {phone.display}</a>
          </div>
        </div>
      </section>
    </>
  );
}
