"use client";

import {
  LineChart, Clock, Users, Layers, Headphones,
  Braces, Activity, BrainCircuit, Database, Workflow, Cloud, Gauge, TrendingUp,
  Cpu, Bot, ScanEye,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import ArchitectureOverview from "@/components/sections/ArchitectureOverview";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import DeliveryTimeline from "@/components/sections/DeliveryTimeline";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";

export default function PredictionForecastingContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="services"
        categoryLabel="services"
        title="Prediction & Forecasting"
        subtitle="Data-driven foresight for your business."
        description="Stop guessing and start knowing. Our predictive analytics solutions use historical data and advanced algorithms to forecast trends, demand, and user behavior."
        icon={LineChart}
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Turn historical data into decisions you can act on"
        paragraphs={[
          "Most businesses already have the data to forecast demand, revenue, or staffing needs accurately — it's just sitting in spreadsheets and disconnected systems instead of a model that can actually learn from it.",
          "We build forecasting systems that combine statistical time-series methods with modern machine learning, tuned to the seasonality, volatility, and business context specific to your data, not a generic off-the-shelf model.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "4–7 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Team Composition", value: "Data Scientists + Engineers", icon: Layers },
          { label: "Support", value: "Model Monitoring & Retraining", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="Why so many forecasting efforts stall out before they ever get used."
        items={[
          { title: "Reactive, Not Predictive Planning", description: "Teams make inventory, staffing, and budget decisions based on last month's numbers instead of what's coming next." },
          { title: "Messy, Inconsistent Historical Data", description: "Forecasting models are only as good as the data feeding them, and most historical data has gaps and inconsistencies." },
          { title: "Seasonality & Demand Volatility", description: "Simple trend lines break down around holidays, promotions, and other recurring but irregular patterns." },
          { title: "Forecasts Nobody Trusts", description: "A model that can't explain its predictions rarely gets adopted by the teams who'd need to act on it." },
          { title: "Siloed Forecasting Across Departments", description: "Sales, supply chain, and finance often run separate, disconnected forecasts that don't agree." },
          { title: "Models That Degrade Over Time", description: "A forecasting model tuned once and never revisited quietly becomes less accurate as your business changes." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we build forecasting systems teams actually trust and use."
        items={[
          { title: "Data Audit Before Modeling", description: "We assess data quality and fill gaps before a single model gets trained." },
          { title: "Hybrid Statistical & ML Modeling", description: "Classical time-series methods where they shine, gradient boosting or deep learning where patterns are more complex." },
          { title: "Explainable Forecasts", description: "Models built to show the key drivers behind a prediction, not just a number." },
          { title: "Unified Forecasting Pipeline", description: "One shared forecasting layer that sales, supply chain, and finance can all pull from consistently." },
          { title: "Continuous Model Monitoring", description: "Automated tracking of forecast accuracy so drift gets caught before it costs you." },
          { title: "Scheduled Retraining", description: "Models retrained on a cadence that matches how quickly your business actually changes." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        items={[
          { title: "Multi-horizon Forecasts", description: "Short-term operational forecasts alongside longer-term strategic projections from the same system." },
          { title: "Confidence Intervals, Not Just Point Estimates", description: "Forecasts that show a realistic range, not false precision." },
          { title: "Scenario & What-if Modeling", description: "Test how a promotion, price change, or supply disruption would likely affect your forecast." },
          { title: "Automated Alerting on Anomalies", description: "Get flagged automatically when actuals diverge meaningfully from forecast." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "Demand & Sales Forecasting", description: "Predict product or service demand at the SKU, region, or account level." },
          { title: "Staffing & Workforce Forecasting", description: "Forecast headcount and scheduling needs based on demand patterns." },
          { title: "Revenue & Financial Forecasting", description: "Data-driven revenue projections to support budgeting and planning." },
          { title: "Inventory & Supply Chain Forecasting", description: "Reduce stockouts and overstock with demand-aware inventory planning." },
          { title: "Churn & Retention Forecasting", description: "Predict which customers are at risk before they leave." },
          { title: "Custom Forecasting Dashboards", description: "A dedicated interface for your team to explore and interact with forecasts." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "Python", category: "Core Language", icon: Braces },
          { name: "Prophet / ARIMA", category: "Statistical Models", icon: Activity },
          { name: "XGBoost / LSTM", category: "ML Models", icon: BrainCircuit },
          { name: "Data Warehouse", category: "Data Layer", icon: Database },
          { name: "Airflow", category: "Pipeline Orchestration", icon: Workflow },
          { name: "AWS / GCP", category: "Cloud Infrastructure", icon: Cloud },
          { name: "MLflow", category: "Model Tracking", icon: Gauge },
          { name: "Grafana / Metabase", category: "Dashboards", icon: TrendingUp },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="How we take a forecasting system from raw data to a monitored production pipeline."
        modules={[
          { title: "Discovery & Data Audit", duration: "3–5 Days", topics: ["Business goal alignment", "Data source audit", "Data quality assessment", "Success metrics"] },
          { title: "Feature Engineering & Baseline", duration: "1 Week", topics: ["Feature engineering", "Baseline model", "Seasonality analysis", "Initial validation"] },
          { title: "Model Development", duration: "2–3 Weeks", topics: ["Model selection", "Hyperparameter tuning", "Backtesting", "Explainability layer"] },
          { title: "Pipeline & Integration", duration: "1 Week", topics: ["Data pipeline automation", "Dashboard integration", "API/export setup"] },
          { title: "Validation & Rollout", duration: "3–5 Days", topics: ["Stakeholder validation", "Shadow-mode testing", "Production rollout"] },
          { title: "Monitoring & Retraining", duration: "Ongoing", topics: ["Accuracy monitoring", "Drift detection", "Scheduled retraining", "Model iteration"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="A typical layered architecture for the forecasting systems we build."
        layers={[
          { name: "Data Ingestion Layer", description: "Automated pipelines that pull and clean historical data from your existing systems on a schedule.", tech: "Airflow / ETL", icon: Workflow },
          { name: "Modeling Layer", description: "Statistical and machine learning models trained and validated against your specific data patterns.", tech: "Prophet / XGBoost", icon: BrainCircuit },
          { name: "Serving & API Layer", description: "Forecasts exposed through APIs and scheduled jobs so other systems can consume them directly.", tech: "Python API / Node.js", icon: Database },
          { name: "Monitoring Layer", description: "Automated tracking of forecast accuracy and drift, with alerts before performance degrades meaningfully.", tech: "MLflow / Grafana", icon: Gauge },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation capabilities"
        description="Where automation keeps a forecasting system accurate without constant manual attention."
        items={[
          { title: "Automated Anomaly Detection", description: "Flag unusual patterns in incoming data automatically, before they corrupt a forecast." },
          { title: "Self-tuning Model Parameters", description: "Automated hyperparameter search that keeps models tuned without manual re-tuning." },
          { title: "Natural Language Forecast Summaries", description: "Plain-language explanations of what's driving a forecast change, generated automatically." },
          { title: "Automated Retraining Triggers", description: "Models retrain automatically when drift crosses a defined threshold, not on a fixed calendar." },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of forecasting systems we build across retail, workforce, and subscription businesses."
        projects={[
          { title: "Retail Demand Forecasting Engine", description: "SKU-level demand forecasts across hundreds of stores, accounting for promotions and seasonality.", skills: ["Time-series", "Retail", "Automation"] },
          { title: "Workforce Scheduling Forecast", description: "Staffing forecasts for a multi-location service business to reduce over- and under-staffing.", skills: ["ML", "Scheduling", "Dashboards"] },
          { title: "Subscription Churn Predictor", description: "A churn risk model flagging at-risk subscribers for proactive retention outreach.", skills: ["Classification", "CRM Integration", "Alerts"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "Reduced Stockouts & Overstock", desc: "Inventory that matches actual demand instead of guesswork, protecting both revenue and margin." },
              { name: "More Confident Planning Cycles", desc: "Budget and staffing decisions backed by a forecast your teams actually trust." },
              { name: "Earlier Warning on Risk", desc: "Anomaly detection and churn models surface problems while there's still time to act." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "Business-first Data Science", desc: "We start from your business question, not a model architecture looking for a use case." },
              { name: "Explainability Built In", desc: "Our forecasts come with the reasoning behind them, so your teams actually adopt them." },
              { name: "We Stay for the Retraining", desc: "Forecasting models need upkeep, and our support plans account for that reality." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Dedicated Team", desc: "A committed data science and engineering team for ongoing forecasting programs." },
              { name: "Fixed Scope Project", desc: "A defined forecasting model and pipeline delivered against a clear timeline and price." },
              { name: "Staff Augmentation", desc: "Embed our data scientists into your existing analytics team for specific expertise." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical timelines by project scope, so you can plan around a realistic rollout."
        bands={[
          { scope: "Single-metric Pilot", duration: "3–4 Weeks", fill: 35, description: "A forecasting model for one key metric to prove out accuracy and value." },
          { scope: "Multi-metric Production System", duration: "5–8 Weeks", fill: 70, description: "A full forecasting pipeline covering multiple metrics with dashboards and monitoring." },
          { scope: "Enterprise Forecasting Platform", duration: "8+ Weeks", fill: 100, description: "An organization-wide forecasting platform integrated across departments and systems." },
        ]}
      />

      <FAQAccordion
        faqs={[
          { question: "How much historical data do we need for accurate forecasts?", answer: "It varies by use case, but we typically look for at least one to two full seasonal cycles of historical data — we'll assess what you have during the data audit phase." },
          { question: "Can you forecast without perfectly clean data?", answer: "Yes, part of our process is auditing and handling data quality issues; we'll tell you upfront if gaps are severe enough to limit accuracy." },
          { question: "How accurate will our forecasts be?", answer: "Accuracy depends heavily on your data and business volatility — we validate models against historical holdout periods and share honest accuracy metrics before rollout, not just optimistic estimates." },
          { question: "Do forecasts need to be retrained over time?", answer: "Yes, we set up monitoring and a retraining cadence so your models stay accurate as your business and data evolve." },
          { question: "Can this integrate with our existing BI tools?", answer: "Yes, forecasts are typically exposed via API or database views so they plug into dashboards like Grafana, Metabase, or Power BI." },
        ]}
      />

      <RelatedServices
        tone="muted"
        services={[
          { title: "AI/ML Solutions", description: "Extend your forecasts with custom models and deeper predictive analytics.", href: "/services/ai-ml-solutions", icon: Cpu },
          { title: "AI Agent", description: "Add an AI agent that acts on forecasts automatically, not just reports them.", href: "/services/ai-agent", icon: Bot },
          { title: "Vision Intelligence", description: "Combine visual data with your forecasts for retail or operations use cases.", href: "/services/vision-intelligence", icon: ScanEye },
        ]}
      />

      <DetailCTA
        heading="Ready to forecast with confidence instead of guessing?"
        description="Let's talk about your data, your planning cycles, and how we can help you see further ahead."
        ctaLabel="Get a Quote"
      />
    </div>
  );
}
