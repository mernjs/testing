"use client";

import {
  Compass, Calendar, Users, Sparkles, Globe2,
  Code2, Server, Smartphone, Database, Cloud, BrainCircuit, Package, GitBranch,
  ShieldCheck, Headphones,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import ArchitectureOverview from "@/components/sections/ArchitectureOverview";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";
import { brandify } from "@/lib/brand";

export default function WhatWeDoContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="about"
        categoryLabel="about"
        title="What We Do"
        subtitle="Driving digital transformation across industries."
        description="We build scalable, high-performance software solutions tailored to solve complex business challenges. From modern web applications to advanced AI systems, we bring your vision to life."
        icon={Compass}
        image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="A technology partner that ships, not just advises"
        paragraphs={[
          brandify("YashOrbit is a product engineering company — we design, build, and operate software for clients who need more than advice. When you work with us, you get a team that writes the code, deploys it, and stays around to keep it running."),
          "We work across the full stack: web, mobile, desktop, and increasingly AI-native products, applying whichever mix of technology actually solves your business problem rather than pushing a single default stack.",
        ]}
        stats={[
          { label: "Founded", value: "2026", icon: Calendar },
          { label: "Delivery Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Core Focus", value: "Web, Mobile & AI Products", icon: Sparkles },
          { label: "Reach", value: "3+ Countries", icon: Globe2 },
        ]}
      />

      <ChecklistGrid
        id="expertise"
        title="Our expertise"
        description="What we actually spend our engineering time on, day to day."
        items={[
          { title: "Full-stack Product Engineering", description: "From database schema to pixel-perfect UI, we own the whole stack when you need us to." },
          { title: "Applied AI & Machine Learning", description: "Production-grade ML models and LLM-powered features, not just proof-of-concept notebooks." },
          { title: "Cloud Architecture & DevOps", description: "Infrastructure that scales predictably and doesn't page your team at 2am." },
          { title: "Product & UX Strategy", description: "We push back on scope that doesn't serve the user, not just execute a spec blindly." },
          { title: "Data Engineering & Analytics", description: "Pipelines and dashboards that turn raw data into decisions your team can act on." },
          { title: "Legacy System Modernization", description: "Incremental paths off aging systems that don't require betting the business on a big-bang rewrite." },
        ]}
      />

      <ChecklistGrid
        id="core-services"
        tone="muted"
        title="Core services"
        items={[
          { title: "Web App Development", description: "Custom web platforms built for performance and scale.", href: "/services/web-app-development" },
          { title: "Mobile App Development", description: "Native and cross-platform apps for iOS and Android.", href: "/services/mobile-app-development" },
          { title: "AI/ML Solutions", description: "Custom models tuned to your specific business problem.", href: "/services/ai-ml-solutions" },
          { title: "AI Agent", description: "Autonomous agents that take real action in your systems.", href: "/services/ai-agent" },
          { title: "Prediction & Forecasting", description: "Data-driven forecasting for demand, revenue, and risk.", href: "/services/prediction-and-forecasting" },
          { title: "Vision Intelligence", description: "Computer vision for inspection, security, and document data.", href: "/services/vision-intelligence" },
        ]}
      />

      <ChecklistGrid
        id="industries"
        title="Industries we serve"
        columns={3}
        items={[
          { title: "Education", description: "Learning platforms, virtual classrooms, and adaptive learning tools.", href: "/industries/education" },
          { title: "Finance", description: "Secure, compliant financial software built for scale.", href: "/industries/finance" },
          { title: "Real Estate", description: "Property management and immersive virtual tour platforms.", href: "/industries/real-estate" },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies we work with"
        items={[
          { name: "React / Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js / Python", category: "Backend", icon: Server },
          { name: "React Native / Flutter", category: "Mobile", icon: Smartphone },
          { name: "PostgreSQL / MongoDB", category: "Data", icon: Database },
          { name: "AWS / GCP / Azure", category: "Cloud", icon: Cloud },
          { name: "PyTorch / TensorFlow", category: "AI/ML", icon: BrainCircuit },
          { name: "Docker / Kubernetes", category: "DevOps", icon: Package },
          { name: "GitHub Actions", category: "CI/CD", icon: GitBranch },
        ]}
      />

      <ChecklistGrid
        id="ai-transformation"
        title="AI & digital transformation"
        description="How we help businesses adopt AI in ways that actually stick."
        items={[
          { title: "Process Automation Audits", description: "Identify the manual workflows in your business most worth automating first." },
          { title: "Generative AI Integration", description: "Embed LLM-powered features into existing products, not just standalone chatbots." },
          { title: "Legacy-to-AI Modernization", description: "Layer intelligent features onto systems that were never built with AI in mind." },
          { title: "Data Readiness Consulting", description: "Get your data infrastructure into shape before investing in advanced AI initiatives." },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Product engineering"
        description="How we structure the disciplines behind every product we build."
        layers={[
          { name: "Product Strategy", description: "Defining the right problem to solve before committing engineering time to a solution.", tech: "Discovery & Roadmapping", icon: Compass },
          { name: "Engineering", description: "Building the product itself: frontend, backend, mobile, and everything connecting them.", tech: "Full-stack Development", icon: Code2 },
          { name: "Quality & Reliability", description: "Automated testing, code review, and performance budgets built into delivery, not bolted on.", tech: "QA & DevOps", icon: ShieldCheck },
          { name: "Ongoing Support", description: "Monitoring, incident response, and continued iteration once your product is live.", tech: "SLA-backed Maintenance", icon: Headphones },
        ]}
      />

      <CurriculumTimeline
        title="End-to-end development process"
        description="The same disciplined process behind every engagement, regardless of size."
        modules={[
          { title: "Discovery & Strategy", duration: "3–5 Days", topics: ["Stakeholder workshops", "Requirements definition", "Technical feasibility", "Success metrics"] },
          { title: "Design", duration: "1 Week", topics: ["UX research", "Wireframes & prototypes", "Design system"] },
          { title: "Development", duration: "3–7 Weeks", topics: ["Sprint-based build", "Regular demos", "Continuous integration"] },
          { title: "Quality Assurance", duration: "1 Week", topics: ["Automated & manual testing", "Performance testing", "Security review"] },
          { title: "Deployment", duration: "2–3 Days", topics: ["CI/CD rollout", "Staging validation", "Production launch"] },
          { title: "Support & Growth", duration: "Ongoing", topics: ["Monitoring", "Feature iteration", "SLA-backed maintenance"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why businesses choose us"
            features={[
              { name: "Senior-led Delivery", desc: "Experienced engineers lead every engagement, not just junior hours at a discount." },
              { name: "Transparent Communication", desc: "Regular demos and honest status updates, no surprises at the end of a sprint." },
              { name: "Genuine AI Depth", desc: "Our AI work is production-grade, not a marketing layer on top of a generic chatbot API." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={[
          { question: "Do you work on the entire product, or specific pieces?", answer: "Both — we take on full end-to-end builds and also plug into specific gaps, like adding an AI feature to a product your existing team already owns." },
          { question: "What size of company do you typically work with?", answer: "We work with early-stage startups through to established enterprises, adapting our engagement model to the size and pace of your team." },
          { question: "Can you work alongside our in-house engineering team?", answer: "Yes, staff augmentation and dedicated-team models are both built specifically for working alongside an existing team." },
          { question: "How do you decide which technologies to use for a project?", answer: "Based on your specific requirements, existing systems, and team's skill set, not a single default stack we push on every client." },
          { question: "Do you offer ongoing support after a project launches?", answer: "Yes, SLA-backed support plans are a standard part of how we deliver, not a separate add-on service." },
        ]}
      />

      <DetailCTA
        heading="Ready to see what we can build together?"
        description="Let's talk about your product, your team, and how we can help you move faster."
        ctaLabel="Get in Touch"
      />
    </div>
  );
}
