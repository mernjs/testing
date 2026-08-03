"use client";

import { Users, Users2, Globe2, Award, Handshake } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import TeamGrid from "@/components/sections/TeamGrid";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";
import { brandify } from "@/lib/brand";

export default function OurTeamContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="about"
        categoryLabel="about"
        title="Our Team"
        subtitle="The minds behind the technology."
        description="We are a diverse group of engineers, designers, and strategists united by a passion for building exceptional digital experiences."
        icon={Users}
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="The people building your product"
        paragraphs={[
          "Software is built by people, not just processes, and we've deliberately kept our team senior-heavy so every engagement is led by engineers who've shipped production systems before, not people learning on your budget.",
          "We're a distributed team spanning multiple timezones, which means your project keeps moving outside a single 9-to-5 window, without sacrificing the tight collaboration of a co-located team.",
        ]}
        stats={[
          { label: "Team Size", value: "8+ Specialists", icon: Users2 },
          { label: "Locations", value: "Distributed, Multi-timezone", icon: Globe2 },
          { label: "Avg. Experience", value: "8+ Years (Senior Engineers)", icon: Award },
          { label: "Culture", value: "Hands-on, Senior-led", icon: Handshake },
        ]}
      />

      <TeamGrid
        title="Leadership team"
        description="The people setting direction across product, engineering, and AI."
        members={[
          { name: "Aditya Rao", role: "Co-Founder & CEO", bio: "Sets the long-term product and business vision, and still reviews architecture decisions on major engagements.", initials: "AR", color: "from-primary to-[#ff8e75]" },
          { name: "Simone Carter", role: "Chief Technology Officer", bio: "Owns technical strategy across every engagement, from cloud architecture to AI implementation standards.", initials: "SC", color: "from-secondary to-primary" },
          { name: "Devraj Malhotra", role: "VP of Engineering", bio: "Leads delivery across client teams, keeping quality and timelines consistent as we scale.", initials: "DM", color: "from-[#ff8e75] to-secondary" },
          { name: "Elena Popescu", role: "Head of AI", bio: "Directs our applied AI practice, from model development through production MLOps.", initials: "EP", color: "from-primary to-secondary" },
        ]}
      />

      <ChecklistGrid
        id="engineering"
        tone="muted"
        title="Engineering team"
        description="The disciplines behind everything we ship."
        items={[
          { title: "Frontend Engineering", description: "React, Next.js, and mobile specialists focused on fast, accessible interfaces." },
          { title: "Backend Engineering", description: "API design, data modeling, and systems architecture across Node.js, Python, and beyond." },
          { title: "Mobile Engineering", description: "Native iOS/Android and cross-platform specialists building for real device constraints." },
          { title: "DevOps & Platform", description: "Cloud infrastructure, CI/CD, and reliability engineering keeping every product running." },
        ]}
      />

      <ChecklistGrid
        id="design"
        title="Design team"
        items={[
          { title: "Product Design", description: "End-to-end UX from wireframes to polished, production-ready interfaces." },
          { title: "User Research", description: "Usability testing and research that keeps design decisions grounded in real user behavior." },
          { title: "Design Systems", description: "Reusable component libraries that keep products consistent as they grow." },
          { title: "Motion & Interaction Design", description: "The animations and micro-interactions that make an interface feel alive." },
        ]}
      />

      <ChecklistGrid
        id="ai-data"
        tone="muted"
        title="AI & data team"
        items={[
          { title: "Machine Learning Engineering", description: "Model development, training, and optimization for production use cases." },
          { title: "Data Science", description: "Statistical analysis and experimentation that turns raw data into business insight." },
          { title: "MLOps", description: "Deployment, monitoring, and retraining pipelines that keep models accurate over time." },
          { title: "Applied AI Research", description: "Evaluating and adapting emerging techniques like agentic systems and RAG for real products." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Company culture"
            features={[
              { name: "Ownership Over Oversight", desc: "Engineers are trusted to make real decisions, not just execute tickets." },
              { name: "Direct, Honest Feedback", desc: "We'd rather have an uncomfortable conversation early than a project failure later." },
              { name: "Craft Over Shortcuts", desc: "We take pride in code quality even when nobody outside the team would notice the difference." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="life"
        tone="muted"
        title="Life at our company"
        items={[
          { title: "Remote-first, Flexible Hours", description: "Work from where you're most productive, coordinated around overlapping core hours." },
          { title: "Regular Team Syncs & Demos", description: "Everyone sees what shipped this week, not just their own project." },
          { title: "Dedicated Learning Time", description: "Paid time specifically set aside for courses, conferences, and skill-building." },
          { title: "Cross-project Rotation", description: "Engineers get exposure to different industries and tech stacks over time, not just one client forever." },
        ]}
      />

      <ChecklistGrid
        id="careers"
        title="Hiring & careers"
        items={[
          { title: "Senior Engineering Roles", description: "We hire primarily experienced engineers across frontend, backend, and mobile." },
          { title: "Applied AI & ML Roles", description: "A growing team focus on machine learning engineers and applied AI researchers." },
          { title: "Design & Product Roles", description: "Product designers and researchers who care about outcomes, not just deliverables." },
          { title: "Open to Remote, Global Candidates", description: "Our distributed model means location is rarely the deciding factor." },
        ]}
      />

      <ChecklistGrid
        id="benefits"
        tone="muted"
        title="Employee benefits"
        items={[
          { title: "Competitive Compensation", description: "Pay benchmarked against market rates for senior technical talent." },
          { title: "Flexible Time Off", description: "A flexible PTO policy built on trust rather than rigid day-counting." },
          { title: "Learning & Development Budget", description: "An annual budget for courses, books, and conferences." },
          { title: "Health & Wellness Support", description: "Benefits supporting physical and mental health, adapted to each team member's location." },
        ]}
      />

      <FAQAccordion
        faqs={[
          { question: brandify("Is YashOrbit fully remote, or do you have offices?"), answer: "We operate as a distributed, remote-first team spanning multiple timezones, with occasional in-person gatherings for team collaboration." },
          { question: "Do you hire engineers outside of your current locations?", answer: "Yes, our remote-first model means we regularly hire strong candidates regardless of location, as long as there's reasonable timezone overlap with their team." },
          { question: "What does the interview process look like?", answer: "It typically includes a technical conversation, a practical exercise relevant to real work, and a culture/values conversation, without unnecessary whiteboard trivia." },
          { question: "Do you offer internships or entry-level roles?", answer: "Our hiring is primarily focused on experienced engineers, though we do offer select opportunities through our Industrial Training programs for emerging talent." },
          { question: "How do you support ongoing learning for the team?", answer: "Every team member has a dedicated learning budget and time set aside specifically for skill development, not just whatever's left over after project work." },
        ]}
      />

      <DetailCTA
        heading="Want to build with us?"
        description="We're always interested in hearing from strong engineers, designers, and AI specialists."
        ctaLabel="Join Our Team"
      />
    </div>
  );
}
