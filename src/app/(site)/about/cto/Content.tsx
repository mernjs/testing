"use client";

import { Cpu, Calendar, Code2, Layers, TrendingUp } from "lucide-react";
import ExecutiveProfile from "@/components/sections/ExecutiveProfile";
import { brandify } from "@/lib/brand";

// Temporary placeholder photo — swap for Tej Pratap's actual headshot when available.
const PHOTO = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop";

export default function CtoContent() {
  return (
    <ExecutiveProfile
      name="Tej Pratap Singh"
      role="Chief Technology Officer"
      tagline={brandify("Chief Technology Officer, YashOrbit")}
      heroDescription={brandify("Owning the technical bar every YashOrbit engagement is held to — architecture standards, engineering practice, and where the company places its bets on applied AI.")}
      heroIcon={Cpu}
      photo={PHOTO}
      bioParagraphs={[
        "Tej Pratap spent over a decade as a senior engineer and technical architect across product and services companies, working on systems that had to hold up under real production load rather than a demo environment. He led engineering teams through several periods of rapid scaling before moving into a dedicated technology leadership role.",
        brandify("He joined YashOrbit as Chief Technology Officer, where he sets engineering and architecture standards across every client engagement, and directs the technical roadmap for the company's applied AI practice."),
      ]}
      bioStats={[
        { label: "Years in Engineering", value: "13+", icon: Calendar },
        { label: "Engineering Domains Led", value: "4", icon: Layers },
        { label: "Background", value: "Senior Architect → CTO", icon: Code2 },
        { label: "Focus", value: "Architecture & Applied AI", icon: TrendingUp },
      ]}
      overviewTitle="Leadership overview"
      overviewDescription="How Tej Pratap approaches leading engineering."
      overviewItems={[
        { title: "Architecture Reviews Are Non-negotiable", description: "\"Every engagement above a certain size gets an architecture review before a line of production code is written — it's cheaper to catch a bad decision on a whiteboard.\"" },
        { title: "Boring Technology, Used Well", description: "\"I'd rather ship a proven stack executed cleanly than a trendy one executed carelessly. Novelty isn't a client requirement.\"" },
        { title: "Engineers Should Own Outcomes, Not Just Tickets", description: "\"I want every engineer to understand why a feature matters to the client, not just what the ticket says to build.\"" },
        { title: "AI Gets the Same Rigor as Everything Else", description: "\"A model in production carries the same reliability bar as any other system we ship — enthusiasm for AI doesn't lower that bar.\"" },
      ]}
      expertiseItems={[
        { title: "Technical Architecture & Systems Design", description: "Reviewing and shaping architecture decisions across web, mobile, and AI/ML engagements for reliability at scale." },
        { title: "Engineering Team Leadership", description: "Building and directing engineering teams across frontend, backend, mobile, and DevOps disciplines." },
        { title: "Applied AI Strategy", description: "Setting technical direction for the company's AI practice, from model selection to production MLOps standards." },
        { title: "Technical Hiring & Standards", description: "Owning the technical bar for engineering hires and the coding, review, and security standards teams work against." },
      ]}
      responsibilityItems={[
        { title: "Engineering Strategy & Standards", description: "Sets architecture, code quality, and technical standards applied across every client engagement." },
        { title: "Applied AI Roadmap", description: "Directs technical decisions for the company's AI practice, from model development through production deployment." },
        { title: "Engineering Team Leadership", description: "Leads and grows the engineering organization across frontend, backend, mobile, and DevOps." },
        { title: "Technical Risk & Security Oversight", description: "Owns technical risk review and security standards across infrastructure and client-facing systems." },
      ]}
      achievementsDescription={brandify("A few of the milestones Tej Pratap has led at YashOrbit.")}
      achievements={[
        { title: "Established Company-wide Architecture Standards", description: "Built the architecture review process now applied to every engagement above a defined complexity threshold.", skills: ["Systems Architecture", "Technical Governance"] },
        { title: brandify("Directed YashOrbit's Applied AI Technical Roadmap"), description: "Set the technical direction connecting the company's generative AI, agentic AI, and computer vision work into a coherent engineering practice.", skills: ["Applied AI", "Technical Strategy"] },
        { title: "Built the Engineering Hiring Bar", description: "Designed the technical interview process and standards used to hire across every engineering discipline.", skills: ["Technical Hiring", "Team Building"] },
      ]}
      visionStatement={brandify("I want YashOrbit's engineering reputation to rest on reliability first — code that holds up under real production conditions, architecture that scales past the first version, and AI systems held to the same bar as everything else we ship. Being early on new technology only matters if what we build with it actually works.")}
      visionQuote="A client should never be able to tell which parts of a system were built under deadline pressure. If our architecture and review process are doing their job, the engineering just quietly works."
      ctaHeading="Want to talk with our technical leadership?"
      ctaDescription="For engagements with complex architecture or AI requirements, we're glad to bring Tej Pratap directly into the conversation."
    />
  );
}
