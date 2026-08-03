"use client";

import {
  Lightbulb, Users2, Cloud, Zap,
  Code2, Server, Smartphone, Database, BrainCircuit, Package, Lock,
  MessageSquare, Wifi, Building2, Bell,
  Activity, Globe2, FolderSearch,
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

export default function IllumateContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="products"
        categoryLabel="products"
        title="Illumate"
        subtitle="Intelligent illumination controls."
        description="The ultimate IoT platform for smart lighting. Illumate provides granular control, scheduling, and energy optimization for commercial and residential properties."
        icon={Lightbulb}
        image="https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200&auto=format&fit=crop"
      />

      <div className="py-8 bg-background border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap gap-2">
          {["IoT Enabled", "Energy Analytics", "Smart Scheduling", "Remote Control"].map((tag) => (
            <span key={tag} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <CourseOverview
        title="Lighting that responds to how a building is actually used"
        paragraphs={[
          "Illumate is an IoT platform for smart lighting that gives facility teams granular, zone-level control instead of a handful of fixed schedules that ignore actual occupancy and daylight patterns.",
          "It's built for facility and property managers running commercial or residential portfolios who need to cut energy waste and catch fixture failures early, without hiring extra maintenance staff to walk every floor.",
        ]}
        stats={[
          { label: "Built For", value: "Facility & Property Managers", icon: Users2 },
          { label: "Primary Use Case", value: "Smart Lighting Control", icon: Lightbulb },
          { label: "Deployment", value: "Cloud + On-Site Gateway", icon: Cloud },
          { label: "Category", value: "IoT Lighting Platform", icon: Zap },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        description="Built for facility teams managing lighting across real, occupied buildings."
        items={[
          { title: "Granular Zone Control", description: "Control individual fixtures or entire zones from one dashboard, eliminating manual switch panels." },
          { title: "Adaptive Scheduling", description: "Set schedules that adjust automatically for daylight and occupancy patterns, cutting wasted energy." },
          { title: "Energy Usage Analytics", description: "See consumption by zone and fixture, so facility teams can target the biggest savings first." },
          { title: "Remote Access & Control", description: "Adjust lighting from anywhere via mobile app, reducing on-site maintenance visits." },
          { title: "Fault Detection Alerts", description: "Get notified automatically when a fixture fails, before a tenant has to report it." },
          { title: "Multi-Property Management", description: "Manage lighting across multiple sites from a single account." },
        ]}
      />

      <ChecklistGrid
        id="modules"
        tone="muted"
        title="Core modules"
        items={[
          { title: "Device Manager", description: "Provision, group, and monitor every connected fixture and sensor." },
          { title: "Scheduling Engine", description: "Time- and sensor-based rules that control lighting automatically." },
          { title: "Energy Analytics", description: "Consumption dashboards and historical usage trends." },
          { title: "Alerts & Notifications", description: "Fault detection and maintenance alerts routed to the right team." },
          { title: "Multi-Site Console", description: "A unified view across every property in a portfolio." },
          { title: "Settings & Access", description: "Role-based permissions for facility staff and property managers." },
        ]}
      />

      <CurriculumTimeline
        title="Product workflow"
        description="How a property team goes from installation to portfolio-wide automation."
        modules={[
          { title: "Sign Up", duration: "Step 1", topics: ["Create account", "Register your property"] },
          { title: "Setup", duration: "Step 2", topics: ["Install IoT gateway", "Connect fixtures"] },
          { title: "Configure", duration: "Step 3", topics: ["Group fixtures into zones", "Set schedules & sensors"] },
          { title: "Use Features", duration: "Step 4", topics: ["Control lighting remotely", "Automate daily schedules"] },
          { title: "Generate Reports", duration: "Step 5", topics: ["Review energy usage reports"] },
          { title: "Monitor Progress", duration: "Step 6", topics: ["Track fault alerts", "Monitor zone-level consumption"] },
          { title: "Scale Operations", duration: "Step 7", topics: ["Add new properties", "Expand zones & fixtures"] },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        items={[
          { name: "React", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "React Native", category: "Mobile", icon: Smartphone },
          { name: "TimescaleDB", category: "Database", icon: Database },
          { name: "Predictive Energy Models", category: "AI/ML", icon: BrainCircuit },
          { name: "AWS IoT Core", category: "Cloud", icon: Cloud },
          { name: "Docker", category: "DevOps", icon: Package },
          { name: "TLS Device Auth", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-capabilities"
        tone="muted"
        title="AI capabilities"
        items={[
          { title: "Predictive Analytics", description: "Forecast energy usage patterns to recommend schedule adjustments before waste occurs." },
          { title: "Automation", description: "Sensor-driven automation adapts lighting to occupancy and daylight without manual rules." },
          { title: "Anomaly Detection", description: "Flag unusual consumption spikes that often indicate a fixture or wiring issue." },
        ]}
      />

      <TechStackGrid
        title="Integrations"
        description="Connect Illumate to the systems your facility already runs on."
        items={[
          { name: "Google Home", category: "Voice Assistants", icon: MessageSquare },
          { name: "Amazon Alexa", category: "Voice Assistants", icon: MessageSquare },
          { name: "Zigbee / Z-Wave", category: "Device Protocol", icon: Wifi },
          { name: "REST APIs", category: "Custom Integration", icon: Server },
          { name: "Building Management Systems", category: "Facility Software", icon: Building2 },
          { name: "Slack", category: "Alert Notifications", icon: Bell },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits"
            features={[
              { name: "Lower Energy Costs", desc: "Adaptive scheduling and analytics routinely cut lighting energy spend across a portfolio." },
              { name: "Reduced Maintenance Costs", desc: "Fault alerts catch failures early, before they turn into larger repairs or tenant complaints." },
              { name: "Scalability", desc: "Manage one building or fifty from the same platform without added overhead." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="industries"
        tone="muted"
        title="Industries using Illumate"
        columns={2}
        items={[
          { title: "Real Estate", description: "Automate lighting across commercial and residential property portfolios.", href: "/industries/real-estate" },
          { title: "Education", description: "Reduce energy costs across school and campus facilities.", href: "/industries/education" },
        ]}
      />

      <ProductGallery
        title="Product gallery"
        description="A closer look at the Illumate control platform."
        images={[
          { src: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop", caption: "Zone Control Dashboard" },
          { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop", caption: "Property Overview Map" },
          { src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop", caption: "Energy Analytics" },
        ]}
      />

      <CaseStudyShowcase
        tone="muted"
        title="Case study"
        caseStudies={[
          {
            segment: "Commercial Real Estate",
            title: "Cutting energy spend across a multi-building office portfolio",
            challenge: "A commercial property manager was paying for lighting running on fixed schedules regardless of actual occupancy across 12 office buildings.",
            solution: "We deployed Illumate with occupancy-based scheduling and portfolio-wide energy analytics, letting facility teams spot and fix waste in real time.",
            metric: "-31%",
            metricLabel: "Lighting energy costs",
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          { question: "Do we need to replace our existing light fixtures?", answer: "In most cases no — Illumate integrates with common smart fixtures and retrofit controllers, so a full fixture replacement usually isn't required." },
          { question: "Can Illumate manage multiple properties from one account?", answer: "Yes, the multi-site console lets you manage and compare energy usage across every property in your portfolio." },
          { question: "How does the platform detect fixture faults?", answer: "Connected fixtures report status continuously, so failures trigger an alert automatically instead of waiting for a tenant complaint." },
          { question: "Does it work with voice assistants?", answer: "Yes, Illumate integrates with Google Home and Amazon Alexa for voice-based control where appropriate." },
          { question: "Is there a mobile app?", answer: "Yes, facility teams can monitor and control lighting remotely from the Illumate mobile app." },
        ]}
      />

      <RelatedServices
        tone="muted"
        title="Related products"
        services={[
          { title: "DataPulse AI", description: "Combine energy data with broader business intelligence dashboards.", href: "/products/datapulse-ai", icon: Activity },
          { title: "GeoVista AI", description: "Map energy usage patterns across property locations.", href: "/products/geovista-ai", icon: Globe2 },
          { title: "AI Powered Smart DMS", description: "Manage facility documentation and compliance records.", href: "/products/ai-powered-smart-dms", icon: FolderSearch },
        ]}
      />

      <DetailCTA
        heading="Ready to take control of your lighting costs?"
        description="See how Illumate can cut energy waste across your properties."
        ctaLabel="Request a Demo"
      />
    </div>
  );
}
