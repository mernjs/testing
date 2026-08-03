"use client";

import {
  Target, Calendar, Sparkles, Globe2, Users2, Rocket, Award,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import StatsBand from "@/components/sections/StatsBand";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";
import { brandify } from "@/lib/brand";

export default function OurMissionContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="about"
        categoryLabel="about"
        title="Our Mission"
        subtitle="Why we exist, and where we're headed."
        description={brandify("YashOrbit was founded on a simple belief: great technology should be a competitive advantage, not a constant headache. Everything we do traces back to that idea.")}
        icon={Target}
        image="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Our mission"
        paragraphs={[
          "Our mission is to give growing businesses access to the same caliber of engineering, AI expertise, and product thinking that only the largest tech companies could historically afford, without the overhead, bureaucracy, or multi-year timelines.",
          "We measure success the same way our clients do: not by lines of code shipped, but by the business outcomes those lines of code actually produce — faster processes, happier customers, and teams freed up to focus on what only humans can do.",
        ]}
        stats={[
          { label: "Founded", value: "2026", icon: Calendar },
          { label: "Focus", value: "Web, Mobile & AI", icon: Sparkles },
          { label: "Reach", value: "3+ Countries", icon: Globe2 },
          { label: "Team", value: "8+ Specialists", icon: Users2 },
        ]}
      />

      <section className="pb-24 sm:pb-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-muted/20 border border-border/50">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">Our vision</h2>
            <p className="text-lg leading-8 text-muted-foreground">
              We want to be the team businesses call before they call anyone else, the partner they trust with the systems their company actually runs on. That means building a company where senior engineers want a long career, not just a project, and where clients see us as an extension of their own team rather than an outside vendor.
            </p>
          </div>
        </div>
      </section>

      <ChecklistGrid
        id="values"
        title="Our core values"
        description="The principles that shape how we work, not just what we say we believe."
        items={[
          { title: "Client Obsession", description: "We treat every client's business goals as our own success metric, not just a spec to satisfy." },
          { title: "Engineering Craftsmanship", description: "We hold our own code to the same bar we'd want to inherit from someone else." },
          { title: "Radical Transparency", description: "Clear timelines, honest tradeoffs, and no surprises — you always know where a project stands." },
          { title: "Bias Toward Action", description: "We prototype and validate quickly rather than debating hypotheticals for weeks." },
          { title: "Continuous Learning", description: "The tools change fast; we invest real time keeping our team's skills ahead of the curve." },
          { title: "Long-term Partnership", description: "We build relationships meant to outlast a single project, not just close a deal." },
        ]}
      />

      <CurriculumTimeline
        tone="muted"
        title="Our journey"
        description="From a small founding team to our first client engagements, all within our first year."
        modules={[
          { title: "Founded with a Simple Idea", duration: "Early 2026", topics: ["Small founding team", "Web & mobile focus", "First client conversations"] },
          { title: "First Client Projects", duration: "2026", topics: ["First production launches", "Early web & mobile engagements"] },
          { title: "Building the Applied AI Practice", duration: "2026", topics: ["First ML engagements", "Early AI specialist hires"] },
          { title: "Launching Industrial Training", duration: "2026", topics: ["Cohort-based tech training", "Talent pipeline partnerships"] },
          { title: "Today & Beyond", duration: "2026", topics: ["8+ specialists", "Remote-first across time zones", "Continued AI R&D investment"] },
        ]}
      />

      <ChecklistGrid
        id="commitment"
        title="Our commitment to clients"
        description="What working with us actually looks like, day to day."
        items={[
          { title: "Dedicated Points of Contact", description: "You always know exactly who to reach, not a rotating support queue." },
          { title: "Honest Scoping", description: "We tell you when something will take longer or cost more before it becomes a surprise, not after." },
          { title: "Post-launch Accountability", description: "SLA-backed support means we stay responsible for what we build after go-live." },
          { title: "Knowledge Transfer, Always", description: "Documentation and walkthroughs so your team is never locked out of your own product." },
          { title: "Security & Compliance by Default", description: "We treat data protection as a baseline requirement, not a paid add-on." },
          { title: "Flexible Engagement Models", description: "Dedicated teams, fixed-scope projects, or staff augmentation, whichever fits how you work." },
        ]}
      />

      <ChecklistGrid
        id="innovation"
        tone="muted"
        title="Innovation & technology"
        description="How we make sure our default toolkit doesn't quietly go stale."
        items={[
          { title: "Continuous Technology Scouting", description: "We evaluate emerging frameworks and AI models before they become mainstream, not after." },
          { title: "Internal R&D Time", description: "Our engineers get dedicated time to prototype ideas outside of active client work." },
          { title: "Open-source Contribution", description: "We contribute back to the tools and libraries our own work depends on." },
          { title: "Cross-team Knowledge Sharing", description: "Lessons learned on one project get documented and shared across every team." },
        ]}
      />

      <StatsBand
        title="Our impact so far"
        description="A snapshot of the reach our work has had in our first year."
        stats={[
          { value: 12, suffix: "+", label: "Projects Delivered", icon: Rocket },
          { value: 3, suffix: "+", label: "Countries Served", icon: Globe2 },
          { value: 8, suffix: "+", label: "Team Members", icon: Users2 },
          { value: 4, suffix: "+", label: "Industries Served", icon: Award },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose us"
            features={[
              { name: "Outcome-driven Partnership", desc: "We're judged on your business results, not just delivered tickets." },
              { name: "Senior-led Teams", desc: "Experienced engineers guide every engagement, not just junior hours billed at a discount." },
              { name: "Built to Scale With You", desc: "Architecture decisions account for where your business is headed, not just where it is today." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={[
          { question: brandify("How long has YashOrbit been in business?"), answer: "We were founded in 2026 — we're a young, senior-led team building our early track record with our first clients, backed by our founders' combined 14+ years in the industry." },
          { question: "What industries do you typically work with?", answer: "We work across EdTech, FinTech, Real Estate Tech, and general SaaS/enterprise software, with deep expertise concentrated in AI-driven products." },
          { question: "Do you only work with large enterprises?", answer: "No, we work with early-stage startups through to established enterprises, adjusting our engagement model to fit the size and stage of your team." },
          { question: "How do you stay current with fast-moving AI technology?", answer: "We dedicate internal R&D time, maintain an active applied-AI practice, and continuously evaluate new models and frameworks as part of how we operate, not as a side project." },
          { question: brandify("What makes YashOrbit different from other dev agencies?"), answer: "Our combination of senior-led delivery, transparent communication, and genuine AI depth. Most agencies are strong in one of those; we've built our culture around all three." },
        ]}
      />

      <DetailCTA
        heading="Want to build something that matters?"
        description="Let's talk about your goals and how our mission lines up with yours."
        ctaLabel="Get in Touch"
      />
    </div>
  );
}
