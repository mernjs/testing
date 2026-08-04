"use client";

import {
  Trophy,
  Code2, Server, Smartphone, Database, Cloud, BrainCircuit, Camera, Sparkles,
  Rocket, Handshake, Building2, Headphones,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CaseStudyShowcase from "@/components/sections/CaseStudyShowcase";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import TechStackGrid from "@/components/sections/TechStackGrid";
import ClientTestimonials from "@/components/sections/ClientTestimonials";
import StatsBand from "@/components/sections/StatsBand";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";
import { successStoriesFaqs } from "./faqs";

export default function SuccessStoriesContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="about"
        categoryLabel="about"
        title="Success Stories"
        subtitle="Real results for real businesses."
        description="Don't just take our word for it. Explore how we've helped companies across the globe scale their operations, increase revenue, and dominate their markets."
        icon={Trophy}
        image="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop"
      />

      <CaseStudyShowcase
        title="Featured case studies"
        description="Two deep dives into the kind of problems we're brought in to solve."
        caseStudies={[
          {
            segment: "B2B SaaS",
            title: "Scaling an analytics platform through 10x user growth",
            challenge: "A B2B analytics startup's infrastructure started buckling under the weight of a sudden viral growth spurt, with dashboard load times climbing past 8 seconds during peak hours.",
            solution: "We re-architected their data pipeline and caching layer, then migrated their infrastructure to auto-scale ahead of demand instead of reacting to it.",
            metric: "10x",
            metricLabel: "User growth handled without downtime",
          },
          {
            segment: "Marketplace",
            title: "Launching a two-sided marketplace from zero to 10,000 users",
            challenge: "A logistics marketplace startup needed to launch a fully functional two-sided platform in time for a key industry trade show, with no existing engineering team.",
            solution: "We assembled a dedicated team and delivered an MVP covering listings, matching, and payments in under 10 weeks.",
            metric: "10,000+",
            metricLabel: "Users in the first quarter post-launch",
          },
        ]}
      />

      <ChecklistGrid
        id="client-stories"
        tone="muted"
        title="Client success stories"
        description="A few of the specific wins behind the numbers."
        items={[
          { title: "Nexora Health", description: "Modernized a legacy patient portal, cutting average page load time from 6 seconds to under 1." },
          { title: "Bloomly", description: "Took an idea from whiteboard to a fully polished MVP in under eight weeks." },
          { title: "Vertex Logistics", description: "Automated manual ops triage with AI, saving the team an estimated 20 hours per week." },
          { title: "Arclight Finance", description: "Delivered a PCI-DSS-ready payments platform that passed its first compliance audit without a single finding." },
          { title: "Wavecrest Media", description: "Rebuilt a content platform's recommendation engine, lifting average session time by 34%." },
          { title: "Northgate Retail", description: "Deployed a computer vision system that cut manual inventory counts by 90% across 40 stores." },
        ]}
      />

      <ProjectShowcase
        title="Project highlights"
        description="A closer look at a few of the builds behind these results."
        projects={[
          { title: "Real-time Analytics Dashboard", description: "A rebuilt dashboard product serving 10x more concurrent users without added latency.", skills: ["Next.js", "Caching", "Scaling"] },
          { title: "Two-sided Logistics Marketplace", description: "A marketplace MVP covering listings, matching, and payments built in under 10 weeks.", skills: ["Marketplace", "Payments", "MVP"] },
          { title: "AI-powered Inventory System", description: "A vision-based inventory counting system deployed across 40 retail locations.", skills: ["Computer Vision", "Retail", "Edge Deployment"] },
        ]}
      />

      <ChecklistGrid
        id="challenges-solutions"
        tone="muted"
        title="Challenges & solutions"
        description="The recurring patterns behind most of the problems clients bring us."
        items={[
          { title: "Legacy Systems Holding Growth Back", description: "We modernize incrementally, replacing the riskiest bottlenecks first instead of a disruptive full rewrite." },
          { title: "Sudden, Unplanned Scale", description: "We build infrastructure with headroom and auto-scaling baked in, not added after the first outage." },
          { title: "Manual Processes Eating Team Capacity", description: "We identify and automate the highest-cost repetitive workflows first for the fastest payback." },
          { title: "Fragmented Data Across Systems", description: "We build integration layers that give teams one consistent view instead of five conflicting ones." },
          { title: "Slow, Risk-averse Decision Cycles", description: "We ship working prototypes early so stakeholders can react to something real, not a slide deck." },
          { title: "Compliance Requirements Blocking Launch", description: "We build compliance into the architecture from day one instead of retrofitting it before an audit." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Business outcomes"
            features={[
              { name: "Faster Time to Market", desc: "Clients regularly go from concept to launched product in weeks, not quarters." },
              { name: "Measurable Cost Savings", desc: "Automation and modernization projects consistently pay back their cost within the first year." },
              { name: "Sustained Growth Capacity", desc: "Infrastructure built to handle the next stage of growth, not just the current one." },
            ]}
          />
        </div>
      </section>

      <TechStackGrid
        tone="muted"
        title="Technologies used"
        description="A snapshot of the stack behind the projects above."
        items={[
          { name: "React / Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js / Python", category: "Backend", icon: Server },
          { name: "React Native / Flutter", category: "Mobile", icon: Smartphone },
          { name: "PostgreSQL / MongoDB", category: "Data", icon: Database },
          { name: "AWS / GCP", category: "Cloud", icon: Cloud },
          { name: "PyTorch / TensorFlow", category: "AI/ML", icon: BrainCircuit },
          { name: "OpenCV", category: "Computer Vision", icon: Camera },
          { name: "LLM APIs", category: "Generative AI", icon: Sparkles },
        ]}
      />

      <ChecklistGrid
        id="industries-served"
        title="Industries served"
        columns={3}
        items={[
          { title: "Education", description: "Learning platforms and virtual classroom infrastructure.", href: "/industries/education" },
          { title: "Finance", description: "Compliant, secure financial products.", href: "/industries/finance" },
          { title: "Real Estate", description: "Property management and virtual tour platforms.", href: "/industries/real-estate" },
        ]}
      />

      <ClientTestimonials />

      <StatsBand
        tone="muted"
        title="Project statistics"
        description="The numbers behind the work we've delivered so far."
        stats={[
          { value: 12, suffix: "+", label: "Projects Shipped", icon: Rocket },
          { value: 100, suffix: "%", label: "Client Satisfaction", icon: Handshake },
          { value: 4, suffix: "+", label: "Industries Served", icon: Building2 },
          { value: 24, suffix: "/7", label: "Support Availability", icon: Headphones },
        ]}
      />

      <FAQAccordion
        faqs={successStoriesFaqs}
      />

      <DetailCTA
        heading="Ready to become our next success story?"
        description="Let's talk about your goals and how we can help you get there."
        ctaLabel="Get in Touch"
      />
    </div>
  );
}
