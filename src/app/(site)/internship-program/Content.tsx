"use client";

import { Briefcase, Code2, Database, Sparkles, Bot, MessageSquare, ScanEye } from "lucide-react";
import ListingHero from "@/components/sections/ListingHero";
import FeaturedListingCard from "@/components/sections/FeaturedListingCard";
import ListingCard from "@/components/sections/ListingCard";
import DetailCTA from "@/components/sections/DetailCTA";

const items = [
  { title: "MERN Stack Internship", subtitle: "Ship full-stack JavaScript features.", description: "Work on real MongoDB, Express, React, and Node.js features for live engagements, under a mentor who's shipping the same stack to clients.", href: "/internship-program/mern-stack", icon: Code2, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop", highlights: ["8–12 Weeks", "Paid Internship", "Live Codebase"] },
  { title: "MEAN Stack Internship", subtitle: "Build enterprise-grade Angular features.", description: "Work inside a real, modular Angular codebase alongside engineers building structured, enterprise-style applications.", href: "/internship-program/mean-stack", icon: Database, image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop", highlights: ["8–12 Weeks", "Paid Internship", "Enterprise Codebase"] },
  { title: "Generative AI Internship", subtitle: "Ship real LLM-powered features.", description: "Build and deploy prompt pipelines, RAG systems, and LLM-backed features for real, client-adjacent product briefs.", href: "/internship-program/generative-ai", icon: Sparkles, image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop", highlights: ["8–12 Weeks", "Paid Internship", "Applied LLM Work"] },
  { title: "Agentic AI Internship", subtitle: "Build autonomous agent systems.", description: "Design and ship goal-driven, tool-using AI agents for real automation problems, reviewed by practicing AI engineers.", href: "/internship-program/agentic-ai", icon: Bot, image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop", highlights: ["8–12 Weeks", "Paid Internship", "Real Automation Work"] },
  { title: "Conversational AI Internship", subtitle: "Ship chatbots and voice assistants.", description: "Design and deploy real conversational experiences across chat and voice channels for actual business use cases.", href: "/internship-program/conversational-ai", icon: MessageSquare, image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop", highlights: ["8–12 Weeks", "Paid Internship", "Real Deployments"] },
  { title: "Computer Vision Internship", subtitle: "Ship real detection & vision systems.", description: "Work on real image and video pipelines — detection, OCR, video analytics — deployed to production, not left in a notebook.", href: "/internship-program/computer-vision", icon: ScanEye, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop", highlights: ["8–12 Weeks", "Paid Internship", "Deployed Models"] },
];

const [featured, ...rest] = items;

export default function InternshipProgramContent() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">

      <ListingHero
        eyebrow="internship program"
        title="Intern on Real Work"
        description="Paid, mentor-led internships across six specializations — you work on real, client-adjacent builds from week one, not a sandboxed training project."
        icon={Briefcase}
        image="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1400&auto=format&fit=crop"
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mb-16 lg:mb-20">
            <FeaturedListingCard
              icon={featured.icon}
              badge="Internship"
              badgeIcon={Briefcase}
              title={featured.title}
              subtitle={featured.subtitle}
              description={featured.description}
              highlights={featured.highlights}
              href={featured.href}
              image={featured.image}
              ctaLabel="Learn More"
            />
          </div>

          <div className="flex items-center gap-3 mb-10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">More Tracks</h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {rest.map((item, i) => (
              <ListingCard
                key={item.href}
                index={i}
                icon={item.icon}
                badge="Internship"
                badgeIcon={Briefcase}
                title={item.title}
                subtitle={item.subtitle}
                description={item.description}
                highlights={item.highlights}
                href={item.href}
                image={item.image}
                ctaLabel="Learn More"
              />
            ))}
          </div>
        </div>
      </section>

      <DetailCTA
        heading="Not sure which track fits you?"
        description="Talk to our internship team and we'll help you pick the right track based on your background and goals."
        ctaLabel="Apply Now"
        category="internship-program"
      />
    </div>
  );
}
