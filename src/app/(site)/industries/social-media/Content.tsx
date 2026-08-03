"use client";

import {
  Share2, Clock, Users, ShieldCheck, Headphones,
  Code2, Server, Database, Cloud, MessageSquare, Bell, ScanLine, Radar,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import CaseStudyShowcase from "@/components/sections/CaseStudyShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";

export default function SocialMediaContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industries"
        categoryLabel="industries"
        title="Social Media"
        subtitle="Feeds, communities, and moderation at scale."
        description="We build social platforms, community apps, and content moderation systems engineered to handle real-time feeds, viral spikes, and the moderation load that comes with scale."
        icon={Share2}
        image="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Software built for feeds that never stop moving"
        paragraphs={[
          "Social platforms live or die on two things most products never have to fully solve at once: real-time performance at scale, and content moderation that protects users without killing engagement.",
          "We build feed architectures, real-time messaging, and moderation pipelines designed around viral spikes and community growth, not just the steady, predictable traffic most software is architected for.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "5–10 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Trust & Safety", value: "Moderation Pipeline Ready", icon: ShieldCheck },
          { label: "Support", value: "24/7 Platform SLA", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Industry challenges"
        description="What breaks social platforms once they move past a small, predictable user base."
        items={[
          { title: "Real-time Feed Performance", description: "Feeds that lag or feel stale under load quickly lose user attention and engagement." },
          { title: "Unpredictable Viral Spikes", description: "A single trending post can send traffic up 50x with almost no warning." },
          { title: "Content Moderation at Scale", description: "Harmful content needs to be caught fast, but over-moderation drives away real users." },
          { title: "Notification Fatigue", description: "Poorly tuned notification systems either miss important moments or overwhelm users into disabling them." },
          { title: "Fake Accounts & Bots", description: "Bot networks and fake engagement quietly distort metrics and degrade community trust." },
          { title: "Data Privacy Expectations", description: "Users expect meaningful control over their data and visibility, not buried settings menus." },
        ]}
      />

      <ChecklistGrid
        id="solutions"
        tone="muted"
        title="Our solutions"
        description="How we design around the unpredictability that defines social products."
        items={[
          { title: "Real-time Feed Infrastructure", description: "Event-driven architecture and caching layers built to keep feeds fast under sudden load." },
          { title: "Elastic, Auto-scaling Backend", description: "Infrastructure that absorbs traffic spikes automatically instead of paging an engineer at 2am." },
          { title: "AI-assisted Content Moderation", description: "Automated flagging combined with human review queues that scale with content volume." },
          { title: "Smart Notification Delivery", description: "Relevance-ranked, frequency-capped notifications tuned to keep users engaged, not annoyed." },
          { title: "Bot & Fake Account Detection", description: "Behavioral signals that flag inauthentic accounts before they distort your community." },
          { title: "Granular Privacy Controls", description: "Clear, accessible settings that give users real control over their visibility and data." },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Services we offer for Social Media"
        description="The parts of our service catalog most relevant to social and community platforms."
        items={[
          { title: "Web App Development", description: "Real-time web platforms and creator dashboards.", href: "/services/web-app-development" },
          { title: "Mobile App Development", description: "Native social and community apps for iOS and Android.", href: "/services/mobile-app-development" },
          { title: "AI/ML Solutions", description: "Feed ranking and personalization models.", href: "/services/ai-ml-solutions" },
          { title: "Vision Intelligence", description: "Automated image and video content moderation.", href: "/services/vision-intelligence" },
          { title: "AI Agent", description: "Automated moderation triage and support assistants.", href: "/services/ai-agent" },
          { title: "Prediction & Forecasting", description: "Engagement and virality trend forecasting.", href: "/services/prediction-and-forecasting" },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        description="The stack we typically reach for on social and community platforms."
        items={[
          { name: "React / Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js / Go", category: "Backend", icon: Server },
          { name: "WebSockets / Pub-Sub", category: "Real-time Messaging", icon: MessageSquare },
          { name: "PostgreSQL / Redis", category: "Data & Caching", icon: Database },
          { name: "AWS / GCP / CDN", category: "Cloud Infrastructure", icon: Cloud },
          { name: "Content Moderation APIs", category: "Trust & Safety", icon: ScanLine },
          { name: "Push Notification Services", category: "Engagement", icon: Bell },
          { name: "Anomaly Detection Models", category: "Bot Detection", icon: Radar },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation opportunities"
        description="Where AI creates the most leverage across feeds, moderation, and community health."
        items={[
          { title: "Personalized Feed Ranking", description: "Surface the content each user is most likely to engage with, not just what's newest." },
          { title: "Automated Content Moderation", description: "Flag policy violations in text, image, and video content before human review." },
          { title: "Bot & Fake Engagement Detection", description: "Identify inauthentic accounts and engagement patterns in real time." },
          { title: "Trend & Virality Prediction", description: "Spot content likely to spike early, so infrastructure and moderation can prepare." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Business benefits"
            features={[
              { name: "Higher User Engagement", desc: "Fast, personalized feeds keep users coming back instead of bouncing to a competitor." },
              { name: "Safer Community Experience", desc: "Faster moderation response protects users and brand reputation at once." },
              { name: "Resilient Under Viral Load", desc: "Auto-scaling infrastructure keeps the platform up during your biggest traffic moments." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="features"
        tone="muted"
        title="Key features"
        items={[
          { title: "Real-time Feed & Messaging", description: "Live updates and messaging that stay fast even under heavy concurrent load." },
          { title: "AI-assisted Moderation Queue", description: "Prioritized review queues combining automated flags and human judgment." },
          { title: "Creator & Community Tools", description: "Analytics, monetization, and engagement tools built for creators and community leads." },
          { title: "Granular Privacy & Visibility Controls", description: "User-level control over who sees what, without a confusing settings maze." },
        ]}
      />

      <CurriculumTimeline
        title="Our development process"
        description="How we take a social platform from concept to a stable, scaling community."
        modules={[
          { title: "Discovery & Trust Model Design", duration: "3–5 Days", topics: ["Stakeholder workshops", "Community guidelines mapping", "Moderation policy design", "Success metrics"] },
          { title: "UX & Architecture", duration: "1 Week", topics: ["Wireframes", "Real-time architecture", "Feed ranking design", "Data model"] },
          { title: "Core Platform Build", duration: "3–5 Weeks", topics: ["Feed engine", "Messaging", "Profiles & communities", "Notification system"] },
          { title: "Trust & Safety Layer", duration: "1–2 Weeks", topics: ["Moderation pipeline", "Bot detection", "Reporting tools", "Review queues"] },
          { title: "Load Testing & Launch Prep", duration: "3–5 Days", topics: ["Viral-spike simulation", "Performance tuning", "Security review"] },
          { title: "Launch & Iteration", duration: "Ongoing", topics: ["Phased rollout", "Community monitoring", "Engagement tuning", "Continuous improvement"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of social and community products we build across consumer and niche platforms."
        projects={[
          { title: "Real-time Community Platform", description: "A feed, messaging, and group platform built to hold performance under sudden traffic spikes.", skills: ["Real-time", "Scaling", "Messaging"] },
          { title: "Creator Monetization App", description: "A creator-focused app with subscriptions, tipping, and analytics dashboards.", skills: ["Payments", "Analytics", "Mobile"] },
          { title: "Content Moderation Pipeline", description: "An AI-assisted moderation system combining automated flagging with human review workflows.", skills: ["AI/ML", "Trust & Safety", "Workflow"] },
        ]}
      />

      <CaseStudyShowcase
        title="Success stories"
        description="Two examples of the kind of outcomes our social platforms drive."
        caseStudies={[
          {
            segment: "Community Platform",
            title: "Surviving a viral traffic spike without downtime",
            challenge: "A community platform's infrastructure crashed during an unexpected viral moment, taking the app offline for hours at its highest-traffic point.",
            solution: "We re-architected their backend with auto-scaling infrastructure and event-driven feed delivery built to absorb sudden spikes.",
            metric: "40x",
            metricLabel: "Traffic spike absorbed with zero downtime",
          },
          {
            segment: "Niche Social App",
            title: "Cutting harmful content response time for a niche social app",
            challenge: "A growing social app relied entirely on manual moderation, leaving harmful content live for hours at a time.",
            solution: "We deployed an AI-assisted moderation pipeline that flags likely violations instantly for prioritized human review.",
            metric: "-76%",
            metricLabel: "Reduction in average moderation response time",
          },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit for Social Media"
            features={[
              { name: "Built for Unpredictable Scale", desc: "Our architecture choices assume viral spikes, not steady, predictable traffic." },
              { name: "Trust & Safety Expertise", desc: "We treat moderation as core infrastructure, not an afterthought bolted on post-launch." },
              { name: "Engagement-minded Engineering", desc: "We build feed and notification systems with retention in mind, not just feature checklists." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={[
          { question: "Can your infrastructure handle a sudden viral spike?", answer: "Yes, we design social platforms with auto-scaling, event-driven architecture specifically so traffic surges don't take the platform down." },
          { question: "How do you approach content moderation?", answer: "We combine automated AI-based flagging with human review queues, so harmful content gets caught fast without over-moderating legitimate posts." },
          { question: "Can you help detect bots and fake engagement?", answer: "Yes, we build behavioral detection models that flag inauthentic accounts and engagement patterns for review or automatic action." },
          { question: "Do you build real-time messaging and notifications?", answer: "Yes, real-time messaging and relevance-ranked notifications are a core part of most social platforms we build." },
          { question: "Do you offer ongoing support after launch?", answer: "Yes, we offer SLA-backed support and continue tuning feed ranking, moderation, and performance based on real usage data." },
        ]}
      />

      <DetailCTA
        heading="Ready to build a platform that scales with your community?"
        description="Let's talk about your users, your content, and how we can help you grow without breaking under your own success."
        ctaLabel="Get a Free Consultation"
      />
    </div>
  );
}
