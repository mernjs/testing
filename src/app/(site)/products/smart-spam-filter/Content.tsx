"use client";

import {
  ShieldAlert, Users2, Cloud, Sparkles,
  Code2, Server, Smartphone, Database, BrainCircuit, Package, Lock,
  Bell, PhoneOff, ListFilter,
  Bot, LineChart, Briefcase,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import TechStackGrid from "@/components/sections/TechStackGrid";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import ProductGallery from "@/components/sections/ProductGallery";
import CaseStudyShowcase from "@/components/sections/CaseStudyShowcase";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import { smartSpamFilterFaqs } from "./faqs";

export default function SmartSpamFilterContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="products"
        categoryLabel="products"
        title="Smart Spam Filter"
        subtitle="Stop spam calls before they ever ring through."
        description="A progressive web app that smartly filters spam calls using dynamic spam scoring and intelligent routing logic, so real calls get through and the rest don't."
        icon={ShieldAlert}
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop"
      />

      <div className="py-8 bg-background border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap gap-2">
          {["PWA", "Dynamic Spam Scoring", "Intelligent Routing", "Real-Time Filtering"].map((tag) => (
            <span key={tag} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <CourseOverview
        title="Not every unknown number deserves to ring"
        paragraphs={[
          "Smart Spam Filter scores every inbound call in real time and routes it accordingly — straight through, to voicemail, or blocked outright — instead of relying on a static blocklist that's always a step behind.",
          "It's built for businesses and call teams fielding high volumes of inbound calls who need to cut through robocalls and spoofed numbers without risking a legitimate customer call getting silently dropped.",
        ]}
        stats={[
          { label: "Built For", value: "Businesses & Inbound Call Teams", icon: Users2 },
          { label: "Primary Use Case", value: "Spam Call Detection & Routing", icon: ShieldAlert },
          { label: "Deployment", value: "Progressive Web App, Cloud", icon: Cloud },
          { label: "Category", value: "AI-Powered Call Filtering", icon: Sparkles },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        description="Built around the reality that spam scoring isn't a one-time decision."
        items={[
          { title: "Dynamic Spam Scoring", description: "Every call is scored in real time using calling patterns and signal data, not a fixed static list." },
          { title: "Intelligent Call Routing", description: "Route calls to ring through, voicemail, or block automatically based on their live spam score." },
          { title: "Real-Time Call Analysis", description: "Analyze call metadata as it arrives, catching spoofed and high-risk numbers before they connect." },
          { title: "Custom Allow & Block Lists", description: "Override automatic scoring for specific numbers your team always wants through or blocked." },
          { title: "Call Analytics Dashboard", description: "See blocked volume, false-positive reports, and scoring trends at a glance." },
          { title: "Offline-Capable PWA", description: "Installable as a progressive web app, so filtering rules keep working even with a spotty connection." },
        ]}
      />

      <ChecklistGrid
        id="modules"
        tone="muted"
        title="Core modules"
        items={[
          { title: "Spam Scoring Engine", description: "Real-time model that assigns a dynamic risk score to every inbound call." },
          { title: "Call Routing Engine", description: "Applies routing rules — allow, voicemail, or block — based on score and account settings." },
          { title: "Allow / Block List Manager", description: "Manual overrides that always take priority over the automatic score." },
          { title: "Analytics Dashboard", description: "Reporting on call volume, block rates, and scoring accuracy over time." },
          { title: "Notification Center", description: "Alerts for high-risk call spikes or unusual calling patterns." },
          { title: "Settings & Access", description: "Account-level configuration for routing thresholds and team permissions." },
        ]}
      />

      <CurriculumTimeline
        title="Product workflow"
        description="How a team goes from an unfiltered line to fully automated spam routing."
        modules={[
          { title: "Sign Up", duration: "Step 1", topics: ["Create an account", "Install the PWA"] },
          { title: "Setup", duration: "Step 2", topics: ["Connect your phone line", "Set initial routing thresholds"] },
          { title: "Configure", duration: "Step 3", topics: ["Add allow/block list entries", "Tune scoring sensitivity"] },
          { title: "Use Features", duration: "Step 4", topics: ["Let calls route automatically", "Review flagged calls"] },
          { title: "Generate Reports", duration: "Step 5", topics: ["Review call analytics"] },
          { title: "Monitor Progress", duration: "Step 6", topics: ["Track block rate & false positives", "Adjust thresholds as needed"] },
          { title: "Scale Operations", duration: "Step 7", topics: ["Add additional lines", "Roll out to more team members"] },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        items={[
          { name: "Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "Progressive Web App", category: "Mobile", icon: Smartphone },
          { name: "MongoDB", category: "Database", icon: Database },
          { name: "Spam Scoring Models", category: "AI/ML", icon: BrainCircuit },
          { name: "Twilio", category: "Voice Infrastructure", icon: PhoneOff },
          { name: "Docker", category: "DevOps", icon: Package },
          { name: "Call Data Encryption", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-capabilities"
        tone="muted"
        title="AI capabilities"
        items={[
          { title: "Predictive Analytics", description: "Spam scores are calculated dynamically from live calling patterns, not a fixed rule set." },
          { title: "Automation", description: "Routing decisions apply themselves the instant a call comes in, with no manual review needed." },
          { title: "Anomaly Detection", description: "Unusual spikes in high-risk call volume are flagged automatically for review." },
        ]}
      />

      <TechStackGrid
        title="Integrations"
        description="Connect Smart Spam Filter to the voice infrastructure you already run on."
        items={[
          { name: "Twilio", category: "Voice & SMS", icon: PhoneOff },
          { name: "Carrier Caller-ID APIs", category: "Number Verification", icon: ListFilter },
          { name: "Slack", category: "Alert Notifications", icon: Bell },
          { name: "REST APIs", category: "Custom Integration", icon: Server },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits"
            features={[
              { name: "Fewer Spam Calls Getting Through", desc: "Dynamic scoring adapts to new spam patterns instead of relying on a list that's always out of date." },
              { name: "Less Time Screening Calls", desc: "Automated routing means staff aren't manually vetting every unknown number." },
              { name: "Lower Risk of Missed Real Calls", desc: "Allow-list overrides and score transparency reduce false positives on legitimate callers." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="industries"
        tone="muted"
        title="Industries using Smart Spam Filter"
        columns={2}
        items={[
          { title: "Finance", description: "Reduce robocall and spoofed-number risk on customer-facing support lines.", href: "/industries/finance" },
          { title: "Insurance", description: "Filter high call volumes on claims and support lines without losing real customers.", href: "/industries/insurance" },
        ]}
      />

      <ProductGallery
        title="Product gallery"
        description="A closer look at the Smart Spam Filter app."
        images={[
          { src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop", caption: "Call Scoring View" },
          { src: "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=800&auto=format&fit=crop", caption: "Analytics Dashboard" },
          { src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop", caption: "Mobile PWA View" },
        ]}
      />

      <CaseStudyShowcase
        tone="muted"
        title="Case study"
        caseStudies={[
          {
            segment: "Customer Support Line",
            title: "Cutting spam volume on a high-traffic support line",
            challenge: "A support team's main phone line was regularly flooded with robocalls and spoofed numbers, burying real customer calls in the queue.",
            solution: "We deployed Smart Spam Filter's dynamic scoring and intelligent routing, automatically diverting high-risk calls while letting legitimate customers through without added wait time.",
            metric: "-74%",
            metricLabel: "Spam calls reaching agents",
          },
        ]}
      />

      <FAQAccordion
        faqs={smartSpamFilterFaqs}
      />

      <RelatedServices
        tone="muted"
        title="Related products"
        services={[
          { title: "AI Voice Assistant", description: "Pair call filtering with a human-like AI voice agent for the calls that do get through.", href: "/products/ai-voice-assistant", icon: Bot },
          { title: "Predictive Analytics Engine", description: "Forecast call volume trends alongside spam scoring data.", href: "/products/predictive-analytics-engine", icon: LineChart },
          { title: "AI Job Board Portal", description: "Apply the same call-screening logic to high-volume recruiting lines.", href: "/products/ai-job-board-portal", icon: Briefcase },
        ]}
      />

      <DetailCTA
        heading="Ready to stop spam calls at the door?"
        description="See how Smart Spam Filter can cut robocall volume on your busiest lines."
        ctaLabel="Request a Demo"
      />
    </div>
  );
}
