"use client";

import {
  TrendingUp, Users2, Cloud, Sparkles,
  Code2, Server, Smartphone, Database, BrainCircuit, Package, Lock,
  ShoppingCart, Bell, Workflow,
  HardHat, Camera, ShieldAlert,
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
import { predictiveAnalyticsEngineFaqs } from "./faqs";

export default function PredictiveAnalyticsEngineContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="products"
        categoryLabel="products"
        title="Predictive Analytics Engine"
        subtitle="Know what's coming before it happens."
        description="A predictive analytics engine that forecasts orders, sales, and labor needs using machine learning, so planning is based on what's likely to happen next, not just what already did."
        icon={TrendingUp}
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
      />

      <div className="py-8 bg-background border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap gap-2">
          {["Machine Learning", "Demand Forecasting", "Labor Planning", "API-First"].map((tag) => (
            <span key={tag} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <CourseOverview
        title="Plan staffing and inventory around what's actually coming"
        paragraphs={[
          "The Predictive Analytics Engine forecasts order volume, sales, and labor needs from historical patterns, so operations teams can plan ahead instead of reacting once a rush or a slow period has already started.",
          "It's built for operations and workforce planning teams who need forecasts they can plug directly into existing tools via API, without standing up a data science team to build and maintain their own models.",
        ]}
        stats={[
          { label: "Built For", value: "Operations & Workforce Planning Teams", icon: Users2 },
          { label: "Primary Use Case", value: "Demand, Sales & Labor Forecasting", icon: TrendingUp },
          { label: "Deployment", value: "Cloud API, SaaS", icon: Cloud },
          { label: "Category", value: "Machine Learning Forecasting Engine", icon: Sparkles },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        description="Forecasts built to plug directly into how a team already plans staffing and inventory."
        items={[
          { title: "Order Volume Forecasting", description: "Predict upcoming order volume from historical patterns, so purchasing and staffing can plan ahead." },
          { title: "Sales Trend Prediction", description: "Forecast sales trends by product, location, or channel to guide inventory decisions." },
          { title: "Labor Demand Planning", description: "Forecast staffing needs by shift or location, reducing both overstaffing and last-minute scrambles." },
          { title: "Seasonal Pattern Detection", description: "Automatically account for seasonality and recurring trends instead of relying on manual adjustments." },
          { title: "Forecast Accuracy Dashboards", description: "Track predicted vs. actual results over time to see how much to trust each forecast." },
          { title: "API-First Forecasting", description: "Pull forecasts directly into existing planning tools via a documented REST API." },
        ]}
      />

      <ChecklistGrid
        id="modules"
        tone="muted"
        title="Core modules"
        items={[
          { title: "Forecasting Engine", description: "Prophet ML-based models generating order, sales, and labor forecasts." },
          { title: "Data Ingestion", description: "Pipelines for importing historical order, sales, and staffing data." },
          { title: "Accuracy Tracking", description: "Compares forecasts against actuals to surface model performance over time." },
          { title: "API Gateway", description: "FastAPI-based endpoints for pulling forecasts into other systems." },
          { title: "Dashboards", description: "Visualizations of forecasted trends by product, location, or shift." },
          { title: "Settings & Access", description: "Workspace roles and API key management." },
        ]}
      />

      <CurriculumTimeline
        title="Product workflow"
        description="How a team goes from historical data to trusted, ongoing forecasts."
        modules={[
          { title: "Sign Up", duration: "Step 1", topics: ["Create workspace", "Invite planning team"] },
          { title: "Setup", duration: "Step 2", topics: ["Import historical order & sales data", "Connect data sources"] },
          { title: "Configure", duration: "Step 3", topics: ["Select forecast horizons", "Set location & product groupings"] },
          { title: "Use Features", duration: "Step 4", topics: ["Generate forecasts", "Pull forecasts via API"] },
          { title: "Generate Reports", duration: "Step 5", topics: ["Review forecast accuracy dashboards"] },
          { title: "Monitor Progress", duration: "Step 6", topics: ["Track predicted vs. actual results", "Retrain on new data"] },
          { title: "Scale Operations", duration: "Step 7", topics: ["Add new locations or product lines", "Expand forecast horizons"] },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        items={[
          { name: "Python", category: "Core Engine", icon: Code2 },
          { name: "FastAPI", category: "Backend API", icon: Server },
          { name: "Next.js", category: "Dashboard Frontend", icon: Smartphone },
          { name: "PostgreSQL", category: "Database", icon: Database },
          { name: "Prophet ML", category: "AI/ML", icon: BrainCircuit },
          { name: "AWS", category: "Cloud", icon: Cloud },
          { name: "Docker", category: "DevOps", icon: Package },
          { name: "API Key Auth", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-capabilities"
        tone="muted"
        title="AI capabilities"
        items={[
          { title: "Predictive Analytics", description: "Prophet ML models forecast order volume, sales, and labor demand from historical trends." },
          { title: "Seasonality Detection", description: "Recurring seasonal and weekly patterns are identified and factored in automatically." },
          { title: "Automation", description: "Forecasts refresh on a schedule as new data comes in, without manual re-running." },
        ]}
      />

      <TechStackGrid
        title="Integrations"
        description="Pull forecasts into the systems your team already plans around."
        items={[
          { name: "REST APIs", category: "Custom Integration", icon: Server },
          { name: "POS Systems", category: "Sales Data", icon: ShoppingCart },
          { name: "Inventory & ERP Systems", category: "Order Data", icon: Workflow },
          { name: "Slack", category: "Forecast Alerts", icon: Bell },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits"
            features={[
              { name: "Better Staffing Decisions", desc: "Labor forecasts cut both overstaffing costs and last-minute scheduling scrambles." },
              { name: "Fewer Stockouts & Overstocks", desc: "Order and sales forecasts help purchasing stay ahead of demand instead of reacting to it." },
              { name: "Faster Planning Cycles", desc: "API-delivered forecasts plug directly into existing tools, skipping manual spreadsheet work." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="industries"
        tone="muted"
        title="Industries using the Predictive Analytics Engine"
        columns={2}
        items={[
          { title: "Ecommerce", description: "Forecast order volume and sales trends across products and channels.", href: "/industries/ecommerce" },
          { title: "Hotels", description: "Plan staffing and demand around forecasted occupancy patterns.", href: "/industries/hotels" },
        ]}
      />

      <ProductGallery
        title="Product gallery"
        description="A closer look at the Predictive Analytics Engine dashboard."
        images={[
          { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop", caption: "Forecast Dashboard" },
          { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop", caption: "Trend Insights" },
          { src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop", caption: "Accuracy Tracking" },
        ]}
      />

      <CaseStudyShowcase
        tone="muted"
        title="Case study"
        caseStudies={[
          {
            segment: "Multi-Location Retail",
            title: "Cutting overstaffing costs for a multi-location retail chain",
            challenge: "A retail chain was scheduling staff off gut feel and last year's calendar, leading to overstaffed slow days and understaffed rushes across its locations.",
            solution: "We deployed the Predictive Analytics Engine to forecast order volume and labor needs by location and shift, feeding predictions directly into their existing scheduling tool via API.",
            metric: "-22%",
            metricLabel: "Labor scheduling costs",
          },
        ]}
      />

      <FAQAccordion
        faqs={predictiveAnalyticsEngineFaqs}
      />

      <RelatedServices
        tone="muted"
        title="Related products"
        services={[
          { title: "AI Construction Platform", description: "Forecast labor and material needs alongside project documentation.", href: "/products/ai-construction-platform", icon: HardHat },
          { title: "Image Recognition System", description: "Pair demand forecasts with real-time visual monitoring data.", href: "/products/image-recognition-system", icon: Camera },
          { title: "Smart Spam Filter", description: "Forecast inbound call volume alongside spam scoring trends.", href: "/products/smart-spam-filter", icon: ShieldAlert },
        ]}
      />

      <DetailCTA
        heading="Ready to plan ahead of demand instead of behind it?"
        description="See how the Predictive Analytics Engine can sharpen your order, sales, and labor forecasts."
        ctaLabel="Request a Demo"
      />
    </div>
  );
}
