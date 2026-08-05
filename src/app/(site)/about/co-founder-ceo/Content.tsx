"use client";

import {
  Briefcase, Calendar, Rocket, Code2, Sparkles, Users2,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import MessageQuote from "@/components/sections/MessageQuote";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import StatsBand from "@/components/sections/StatsBand";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";
import { brandify } from "@/lib/brand";
import { coFounderCeoFaqs } from "./faqs";

export default function CoFounderCeoContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="about"
        categoryLabel="about"
        title="Aditya Rao"
        subtitle={brandify("Co-Founder & CEO, YashOrbit")}
        description={brandify("Leading YashOrbit's mission to bring senior-level engineering and applied AI expertise to businesses that need more than advice — they need something built.")}
        icon={Briefcase}
        image="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop"
      />

      <section className="py-20 sm:py-24 bg-background relative">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-[#ff8e75] flex items-center justify-center text-white font-bold text-3xl shadow-xl mb-6">
            AR
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Aditya Rao</h2>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-6">Co-Founder & CEO</p>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {brandify("Engineer turned founder, still writing architecture reviews himself — Aditya leads YashOrbit's strategy while staying closer to the technical work than most CEOs do.")}
          </p>
        </div>
      </section>

      <CourseOverview
        title="Professional biography"
        paragraphs={[
          brandify("Aditya started his career as a backend engineer, spending over a decade shipping infrastructure at two mid-sized software companies before founding YashOrbit in 2026 with a simple frustration: too many good businesses were getting mediocre software because they couldn't access senior engineering talent."),
          "Today he splits his time between company strategy and staying close to the technical work itself, reviewing architecture decisions on major client engagements and personally shaping the applied AI practice's technical direction alongside the Head of AI.",
        ]}
        stats={[
          { label: "Years in Tech", value: "14+", icon: Calendar },
          { label: "Companies Founded", value: "1", icon: Rocket },
          { label: "Background", value: "Backend Engineering → Founder", icon: Code2 },
          { label: "Focus", value: "Product Strategy & AI", icon: Sparkles },
        ]}
      />

      <ChecklistGrid
        id="philosophy"
        tone="muted"
        title="Leadership philosophy"
        description="How Aditya approaches leading a technical team."
        items={[
          { title: "Lead From the Technical Details", description: "\"I still review architecture decisions on our biggest engagements — you lose the ability to make good calls the moment you're too far from the actual work.\"" },
          { title: "Default to Trust, Verify With Data", description: "\"I'd rather give someone real ownership and check outcomes than approve every decision along the way.\"" },
          { title: "Say the Hard Thing Early", description: "\"Most project failures I've seen were visible six weeks before they became a crisis — nobody wanted to say it out loud.\"" },
          { title: "Hire for Judgment, Not Just Skill", description: "\"Technical skill is teachable. Knowing when to push back on a bad requirement usually isn't.\"" },
        ]}
      />

      <section className="pb-24 sm:pb-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-muted/20 border border-border/50">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">Vision for the company</h2>
            <p className="text-lg leading-8 text-muted-foreground">
              {brandify("I want YashOrbit to be the team a founder or CTO calls before anyone else, not because we're the cheapest option, but because working with us removes a category of worry from their job entirely. That means staying senior-heavy as we grow, saying no to work that doesn't fit our strengths, and treating AI as a core engineering discipline rather than a marketing bullet point.")}
            </p>
          </div>
        </div>
      </section>

      <MessageQuote
        eyebrow="A message from our co-founder"
        message="Every business we work with is trusting us with something that matters to them — their product, their customers, their reputation. That's not a responsibility I take lightly, and it's the same standard I hold our entire team to, on every engagement, regardless of size."
        name="Aditya Rao"
        role={brandify("Co-Founder & CEO, YashOrbit")}
        initials="AR"
        color="from-primary to-[#ff8e75]"
        tone="muted"
      />

      <CurriculumTimeline
        title="Professional journey"
        description="From backend engineer to founder, and the early days of building something new."
        modules={[
          { title: "Backend Engineer, Early Career", duration: "2012–2025", topics: ["Shipped infrastructure at two mid-sized software companies", "Learned the cost of poor architecture decisions firsthand"] },
          { title: brandify("Founded YashOrbit"), duration: "2026", topics: ["Assembled the founding engineering team", "First client projects delivered"] },
          { title: "Building the Applied AI Practice", duration: "2026", topics: ["Hired the first AI specialists", "Delivered first production ML engagement"] },
          { title: "Launching Industrial Training", duration: "2026", topics: ["Built an early talent pipeline through cohort-based programs"] },
          { title: "Leading the Team Today", duration: "2026", topics: ["Overseeing the founding team", "Personally involved in every client architecture review"] },
        ]}
      />

      <StatsBand
        tone="muted"
        title="Career milestones"
        description="A quick look at the numbers behind the journey."
        stats={[
          { value: 14, suffix: "+", label: "Years in Tech", icon: Calendar },
          { value: 4, suffix: "+", label: "Industries Served", icon: Rocket },
          { value: 12, suffix: "+", label: "Projects Overseen", icon: Briefcase },
          { value: 8, suffix: "+", label: "Team Members Hired", icon: Users2 },
        ]}
      />

      <ChecklistGrid
        id="expertise"
        title="Experience & expertise"
        items={[
          { title: "Backend & Systems Architecture", description: "14+ years designing systems that hold up under real production load, not just a demo." },
          { title: "Applied AI Strategy", description: "Guiding where AI genuinely creates business value versus where it's just a trend to chase." },
          { title: "Startup Operations, From Scratch", description: "Hands-on experience standing up a services company from the ground up, now building out the founding team." },
          { title: "Client Relationship Leadership", description: "Personally involved in scoping and overseeing the company's most complex engagements." },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Key achievements"
        description={brandify("A few of the milestones Aditya has led YashOrbit through.")}
        projects={[
          { title: brandify("Built the YashOrbit Founding Team"), description: "Assembled a small, senior founding team to deliver on day-one client commitments.", skills: ["Team Building", "Operations"] },
          { title: "Launched the Applied AI Practice", description: "Took the company from zero AI experience to an early practice delivering production ML and generative AI systems.", skills: ["AI Strategy", "MLOps"] },
          { title: "Built the Industrial Training Program", description: "Created a cohort-based training initiative to build an early talent pipeline for the company.", skills: ["Talent Development", "Program Design"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Innovation & technology leadership"
            features={[
              { name: "Personally Reviews AI Architecture", desc: "Stays hands-on with major AI implementation decisions rather than delegating strategy entirely." },
              { name: "Champions Internal R&D Time", desc: "Pushed to carve out dedicated prototyping time for engineers outside of billable client work." },
              { name: "Early Adopter, Careful Shipper", desc: "Evaluates emerging tools quickly but insists on production-readiness before client-facing use." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="strategy"
        tone="muted"
        title="Business growth & strategy"
        items={[
          { title: "Senior-heavy Hiring, By Design", description: "Is prioritizing experienced hires over rapid headcount growth from day one, even when it means slower early expansion." },
          { title: "Diversifying Beyond Project Work", description: "Led the move into Industrial Training as a second, complementary revenue line from the start." },
          { title: "Disciplined Client Selection", description: "Has already turned down work that didn't fit the company's strengths, even when it was lucrative." },
          { title: "Long-term Relationships Over Short-term Margin", description: "Prioritizes long-term client and employee relationships over maximizing any single quarter." },
        ]}
      />

      <ChecklistGrid
        id="values"
        title="Core values"
        description={brandify("The personal operating principles behind how Aditya leads, distinct from YashOrbit's company-wide values.")}
        items={[
          { title: "Do the Unscalable Thing First", description: "Personally involved in early client conversations and major technical decisions, even now." },
          { title: "Numbers Don't Replace Judgment", description: "Uses data to inform decisions, not as a substitute for actually thinking them through." },
          { title: "Reputation Compounds", description: "Treats every engagement as something that will be remembered, good or bad, long after it ends." },
          { title: "Stay a Practitioner", description: "Still writes and reviews code personally, refusing to become purely a business-side executive." },
        ]}
      />

      <ChecklistGrid
        id="community"
        title="Community & social impact"
        items={[
          { title: "Mentoring Early-stage Founders", description: "Regularly advises early-stage technical founders navigating their first engineering hires." },
          { title: "Supporting Local Tech Education", description: brandify("Contributes to community coding workshops in the regions where YashOrbit's team is based.") },
          { title: "Diversity in Engineering Hiring", description: "Champions hiring pipelines that reach beyond traditional, well-networked candidate pools." },
          { title: "Pro-bono Project Support", description: "Occasionally allocates team time to nonprofit and community-organization projects." },
        ]}
      />

      <ChecklistGrid
        id="personal"
        tone="muted"
        title="Personal insights"
        items={[
          { title: "On Work-life Balance", description: "\"I've learned the hard way that a tired team makes worse decisions than a well-rested one — sustainable pace isn't a nice-to-have.\"" },
          { title: "On Continuous Learning", description: "\"I still spend a few hours most weeks reading code and papers outside of anything we're actively building — staying sharp isn't optional in this industry.\"" },
          { title: "Outside of Work", description: "Spends time mentoring, reading widely outside of tech, and staying involved in local community initiatives." },
          { title: "Advice to Aspiring Founders", description: "\"Get uncomfortably close to the actual work for longer than feels necessary before you delegate it away.\"" },
        ]}
      />

      <FAQAccordion
        faqs={coFounderCeoFaqs.map((f) => ({ question: brandify(f.question), answer: brandify(f.answer) }))}
      />

      <DetailCTA
        heading="Want to talk with our leadership team?"
        description="For complex or high-stakes engagements, we're glad to bring Aditya directly into the conversation."
        ctaLabel="Connect With Us"
      />
    </div>
  );
}
