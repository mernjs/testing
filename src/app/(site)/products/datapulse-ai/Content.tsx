"use client";

import {
  Activity, Users2, Cloud, Sparkles,
  Code2, Server, Smartphone, Database, BrainCircuit, Package, Lock,
  Globe2, CreditCard, Bell,
  Lightbulb, FolderSearch,
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

export default function DataPulseAIContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="products"
        categoryLabel="products"
        title="DataPulse AI"
        subtitle="Real-time business intelligence."
        description="A centralized dashboard that connects to all your data sources, providing real-time visualizations and AI-generated insights into your business health."
        icon={Activity}
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
      />

      <div className="py-8 bg-background border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap gap-2">
          {["Real-Time Dashboards", "AI Powered", "Data Connectors", "Anomaly Alerts"].map((tag) => (
            <span key={tag} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <CourseOverview
        title="Know what's happening in your business right now"
        paragraphs={[
          "DataPulse AI connects to the systems you already use — your CRM, your database, your spreadsheets — and turns them into live dashboards, instead of a weekly report that's already out of date by the time someone reads it.",
          "It's built for operations and executive teams who need a current, trustworthy view of business performance, without waiting on an analyst to manually assemble numbers from five different tools.",
        ]}
        stats={[
          { label: "Built For", value: "Operations & Executive Teams", icon: Users2 },
          { label: "Primary Use Case", value: "Business Intelligence & Analytics", icon: Activity },
          { label: "Deployment", value: "Cloud, SaaS", icon: Cloud },
          { label: "Category", value: "AI-Powered BI Platform", icon: Sparkles },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        description="Built to keep leadership working from the current numbers, not last week's."
        items={[
          { title: "Unified Data Connectors", description: "Pull data from CRMs, spreadsheets, and databases into one dashboard, ending manual exports." },
          { title: "Real-Time Visualizations", description: "Dashboards update live as new data arrives, so decisions are based on current numbers, not last week's export." },
          { title: "AI-Generated Insights", description: "Automatic narrative summaries highlight what changed and why, saving analysts hours of manual reporting." },
          { title: "Anomaly Detection Alerts", description: "Get notified the moment a metric moves outside its normal range, before it becomes a bigger problem." },
          { title: "Custom Dashboard Builder", description: "Build role-specific dashboards for execs, ops, and finance without engineering support." },
          { title: "Scheduled Reports", description: "Automatically deliver key metrics to stakeholders' inboxes on a set schedule." },
        ]}
      />

      <ChecklistGrid
        id="modules"
        tone="muted"
        title="Core modules"
        items={[
          { title: "Data Connector Hub", description: "Pre-built connectors for common CRMs, databases, and spreadsheets." },
          { title: "Dashboard Builder", description: "Drag-and-drop canvas for building custom visualizations." },
          { title: "Insights Engine", description: "AI-generated summaries and trend explanations for key metrics." },
          { title: "Alerting", description: "Threshold and anomaly-based alerts routed to the right team." },
          { title: "Reporting", description: "Scheduled report generation and distribution." },
          { title: "Settings & Access", description: "Workspace roles, data source permissions, and API keys." },
        ]}
      />

      <CurriculumTimeline
        title="Product workflow"
        description="How a team goes from disconnected data to live, shared visibility."
        modules={[
          { title: "Sign Up", duration: "Step 1", topics: ["Create workspace", "Invite your team"] },
          { title: "Setup", duration: "Step 2", topics: ["Connect data sources", "Import historical data"] },
          { title: "Configure", duration: "Step 3", topics: ["Build dashboards", "Set alert thresholds"] },
          { title: "Use Features", duration: "Step 4", topics: ["Monitor live dashboards", "Review AI-generated insights"] },
          { title: "Generate Reports", duration: "Step 5", topics: ["Schedule stakeholder reports"] },
          { title: "Monitor Progress", duration: "Step 6", topics: ["Track anomaly alerts", "Review metric trends"] },
          { title: "Scale Operations", duration: "Step 7", topics: ["Add data sources", "Expand to new teams"] },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        items={[
          { name: "React", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "React Native", category: "Mobile", icon: Smartphone },
          { name: "ClickHouse", category: "Database", icon: Database },
          { name: "Anomaly Detection Models", category: "AI/ML", icon: BrainCircuit },
          { name: "AWS", category: "Cloud", icon: Cloud },
          { name: "Docker", category: "DevOps", icon: Package },
          { name: "SOC 2 Controls", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-capabilities"
        tone="muted"
        title="AI capabilities"
        items={[
          { title: "Predictive Analytics", description: "Forecast key metrics forward based on historical trends, not just report what already happened." },
          { title: "Anomaly Detection", description: "Automatically flag metric shifts that fall outside expected patterns." },
          { title: "Automation", description: "Reports and alerts generate and route themselves on a schedule you define." },
          { title: "Intelligent Search", description: "Ask questions about your data in plain language and get an instant chart or number back." },
        ]}
      />

      <TechStackGrid
        title="Integrations"
        description="Connect DataPulse AI to the systems already generating your data."
        items={[
          { name: "Salesforce", category: "CRM Sync", icon: Users2 },
          { name: "Google Analytics", category: "Web Analytics", icon: Globe2 },
          { name: "Stripe", category: "Revenue Data", icon: CreditCard },
          { name: "Slack", category: "Alert Notifications", icon: Bell },
          { name: "Snowflake", category: "Data Warehouse", icon: Database },
          { name: "REST APIs", category: "Custom Integration", icon: Server },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits"
            features={[
              { name: "Faster Decision Making", desc: "Live dashboards replace static, outdated reports with the current state of the business." },
              { name: "Reduced Reporting Overhead", desc: "Automated insights and scheduled reports cut hours of manual analyst work each week." },
              { name: "Earlier Risk Detection", desc: "Anomaly alerts surface problems while there's still time to act." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="industries"
        tone="muted"
        title="Industries using DataPulse AI"
        columns={2}
        items={[
          { title: "Finance", description: "Monitor transaction volumes and risk metrics in real time.", href: "/industries/finance" },
          { title: "Real Estate", description: "Track occupancy, revenue, and portfolio performance across properties.", href: "/industries/real-estate" },
        ]}
      />

      <ProductGallery
        title="Product gallery"
        description="A closer look at the DataPulse AI dashboard."
        images={[
          { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop", caption: "Live Analytics Dashboard" },
          { src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop", caption: "Executive Overview" },
          { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop", caption: "Trend Insights" },
        ]}
      />

      <CaseStudyShowcase
        tone="muted"
        title="Case study"
        caseStudies={[
          {
            segment: "Multi-location Retail",
            title: "Replacing weekly spreadsheet reports with live dashboards for a retail chain",
            challenge: "A 40-location retail chain's leadership relied on a weekly manually-assembled spreadsheet to understand sales performance, often a week out of date by the time it was reviewed.",
            solution: "We connected DataPulse AI to their POS and inventory systems, giving leadership a live, always-current view of performance across every location.",
            metric: "100%",
            metricLabel: "Real-time visibility across locations",
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          { question: "How many data sources can we connect?", answer: "There's no hard limit — most customers connect between 3 and 10 sources depending on their tech stack." },
          { question: "Do we need a data engineer to set this up?", answer: "No, most common data sources connect through pre-built connectors that business teams can configure themselves." },
          { question: "How current is the data on the dashboards?", answer: "Dashboards update in near real time as new data arrives from connected sources, typically within minutes." },
          { question: "Can different teams see different dashboards?", answer: "Yes, role-based dashboards let executives, operations, and finance each see the metrics relevant to them." },
          { question: "What happens when an anomaly is detected?", answer: "You get an alert through your configured channel — email, Slack, or SMS — as soon as a metric moves outside its expected range." },
        ]}
      />

      <RelatedServices
        tone="muted"
        title="Related products"
        services={[
          { title: "GeoVista AI", description: "Add location-based analytics to your business intelligence stack.", href: "/products/geovista-ai", icon: Globe2 },
          { title: "Illumate", description: "Feed facility energy data into your broader analytics dashboards.", href: "/products/illumate", icon: Lightbulb },
          { title: "AI Powered Smart DMS", description: "Turn document metadata into another data source for your dashboards.", href: "/products/ai-powered-smart-dms", icon: FolderSearch },
        ]}
      />

      <DetailCTA
        heading="Ready to see your business in real time?"
        description="See how DataPulse AI can replace static reports with live, AI-driven insight."
        ctaLabel="Request a Demo"
      />
    </div>
  );
}
