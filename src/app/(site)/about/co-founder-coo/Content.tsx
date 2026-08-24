"use client";

import { Briefcase, Calendar, Rocket, Users2, TrendingUp } from "lucide-react";
import ExecutiveProfile from "@/components/sections/ExecutiveProfile";
import { brandify } from "@/lib/brand";

// Temporary placeholder photo — swap for Priyanka's actual headshot when available.
const PHOTO = "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1200&auto=format&fit=crop";

export default function CoFounderCooContent() {
  return (
    <ExecutiveProfile
      name="Priyanka Singh"
      role="Co-Founder & COO"
      tagline={brandify("Co-Founder & COO, YashOrbit")}
      heroDescription={brandify("Turning YashOrbit's strategy into a company that actually delivers — the delivery processes, hiring pipeline, and cross-team coordination that let every engagement ship on time, every time.")}
      heroIcon={Briefcase}
      photo={PHOTO}
      bioParagraphs={[
        "Priyanka spent years in program and operations management roles at services and technology companies, learning how to keep complex, multi-team delivery on schedule without sacrificing quality.",
        brandify("She co-founded YashOrbit in 2026 alongside [NAME_OF_CEO], taking on the COO role from day one — designing the company's delivery workflows, hiring process, and the operating rhythms that keep engineering, AI, and training teams coordinated as the company grows."),
      ]}
      bioStats={[
        { label: "Years in Operations", value: "9+", icon: Calendar },
        { label: "Companies Co-Founded", value: "1", icon: Rocket },
        { label: "Teams Coordinated Daily", value: "4", icon: Users2 },
        { label: "Focus", value: "Delivery Operations & Scaling", icon: TrendingUp },
      ]}
      overviewTitle="Leadership overview"
      overviewDescription="How Priyanka approaches running the company day to day."
      overviewItems={[
        { title: "Process Should Be Invisible to the Client", description: "\"If a client can feel our internal process, it's probably slowing them down instead of helping them.\"" },
        { title: "Escalate Early, Fix Once", description: "\"A delivery issue caught in week one is a conversation. The same issue caught in week six is a crisis.\"" },
        { title: "Measure What Actually Matters", description: "\"I track delivery timelines and utilization closely, but I never let a dashboard replace an honest conversation with a team lead.\"" },
        { title: "Systems Over Heroics", description: "\"If a project only succeeds because someone worked all weekend, that's a process failure, not a win.\"" },
      ]}
      expertiseItems={[
        { title: "Delivery Operations & Program Management", description: "Designing and running the workflows that keep multi-team engagements on schedule from kickoff to handoff." },
        { title: "Hiring & Onboarding Process Design", description: "Building repeatable, scalable hiring pipelines and onboarding processes as the team grows." },
        { title: "Cross-team Coordination", description: "Keeping engineering, AI, design, and training teams aligned on priorities and timelines across concurrent engagements." },
        { title: "Operational Metrics & Reporting", description: "Tracking delivery timelines, utilization, and engagement health to catch issues before they become client-facing." },
      ]}
      responsibilityItems={[
        { title: "Delivery Operations", description: "Owns the end-to-end operating workflow for every active client engagement, from kickoff through handoff." },
        { title: "Hiring & Onboarding", description: "Runs the hiring pipeline and onboarding process for new team members across engineering, AI, and training." },
        { title: "Cross-team Coordination", description: "Keeps engineering, AI, design, and training teams aligned on shared priorities and timelines." },
        { title: "Operational Reporting", description: "Reports delivery health, utilization, and engagement risk to the leadership team on a weekly cadence." },
      ]}
      achievementsDescription={brandify("A few of the milestones Priyanka has led YashOrbit through.")}
      achievements={[
        { title: brandify("Built YashOrbit's Delivery Operating System"), description: "Designed the end-to-end delivery workflow used across every client engagement, from kickoff to handoff.", skills: ["Process Design", "Program Management"] },
        { title: "Stood Up the Hiring Pipeline", description: "Built the company's hiring and onboarding process from scratch, scaling it as headcount grew across engineering and AI roles.", skills: ["Talent Operations", "Onboarding"] },
        { title: "Established Cross-team Coordination Rhythms", description: "Created the recurring syncs and reporting cadence that keep engineering, AI, and training teams aligned on shared priorities.", skills: ["Cross-functional Leadership", "Operational Reporting"] },
      ]}
      visionStatement={brandify("I want YashOrbit to be a company where growth never comes at the cost of delivery quality. That means investing in operational systems before we need them, not after something breaks — clear hiring pipelines, repeatable delivery playbooks, and cross-team coordination that scales past the point where everyone can just talk to everyone.")}
      visionQuote="Clients don't experience our strategy or our tech stack directly — they experience whether we show up on time, communicate clearly, and deliver what we promised. That's operations, and making sure that happens on every engagement is the job I signed up for."
      ctaHeading="Want to talk with our leadership team?"
      ctaDescription="For engagements with complex delivery or coordination needs, we're glad to bring Priyanka directly into the conversation."
    />
  );
}
