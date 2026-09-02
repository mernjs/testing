"use client";

import {
  BarChart3, Clock, Users, Layers, Headphones,
  Braces, Bot, Database, Gauge, TrendingUp,
  Workflow, Plug, FileSearch, Eye, Zap, Lock,
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
import { analyticsFaqs } from "./faqs";

export default function AIPoweredDataAnalyticsContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="ai-automations"
        categoryLabel="AI & Automations"
        title="AI-Powered Data Analytics"
        subtitle="Turn data into actionable intelligence."
        description="Go beyond dashboards. Our ML-driven analytics pipelines detect anomalies, surface trends, and generate plain-language insights so your team acts on data instead of just reviewing it."
        icon={BarChart3}
        image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Analytics that tell you what to do, not just what happened"
        paragraphs={[
          "Most BI dashboards show you what happened last week. What businesses actually need is to know what's happening right now, what will happen next, and what they should do about it. That requires more than visualisation — it requires ML-driven pattern detection, anomaly alerting, and the ability to surface insights in language any team member can act on.",
          "We build analytics pipelines that connect to your existing data sources, apply ML models for pattern recognition and anomaly detection, and surface insights through dashboards or plain-language summaries — turning raw data into decisions your team can make with confidence.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "6–12 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Team Composition", value: "Data Engineers + ML Engineers + BI Specialists", icon: Layers },
          { label: "Post-Launch", value: "Model Monitoring & Retraining", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="The data problems that prompt businesses to invest in AI-driven analytics."
        items={[
          { title: "Dashboards No One Acts On", description: "Teams have access to data but struggle to translate it into specific decisions because the signal is buried in noise." },
          { title: "Anomalies Caught After the Damage Is Done", description: "Revenue drops, inventory issues, and operational failures surface days or weeks after they could have been caught." },
          { title: "Reports That Require Data Analysts to Interpret", description: "Business teams depend on data teams for every insight, creating a bottleneck that slows decision-making." },
          { title: "Fragmented Data Across Multiple Systems", description: "Customer, operational, and financial data lives in separate silos — preventing a unified view of business performance." },
          { title: "Manual Forecasting That's Often Wrong", description: "Spreadsheet-based forecasts based on human intuition perform poorly versus models trained on historical patterns." },
          { title: "No Early Warning System for Business Risk", description: "There's no systematic way to identify which customers are at risk of churning, or which processes are trending toward failure." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we turn raw data into intelligence that drives decisions."
        items={[
          { title: "Data Audit & Source Mapping First", description: "We assess what data you have, where it lives, its quality, and what questions it can realistically answer before designing solutions." },
          { title: "Unified Data Layer", description: "We build a clean, unified data foundation that connects sources and applies consistent definitions — before adding any ML on top." },
          { title: "ML for Pattern Detection, Not Just Aggregation", description: "We apply machine learning where it adds value over aggregation — anomaly detection, segmentation, trend forecasting, churn prediction." },
          { title: "Plain-Language Insight Generation", description: "Insights are surfaced in language any team member can understand — not just charts that require interpretation." },
          { title: "Actionable Alerts, Not Just Notifications", description: "Anomaly alerts are tied to recommended actions, not just flags — so teams know what to do, not just that something is wrong." },
          { title: "Model Monitoring & Drift Detection", description: "ML models degrade as data patterns change. We build monitoring pipelines that detect drift and trigger retraining." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key capabilities"
        items={[
          { title: "Real-Time Anomaly Detection", description: "ML models that identify statistical outliers in operational, financial, or customer data as they occur." },
          { title: "NL-Generated Insight Summaries", description: "Plain-language summaries of what the data shows and what it implies — generated automatically for decision-makers." },
          { title: "Predictive Trend Forecasting", description: "Time-series models that project demand, revenue, resource utilisation, or risk forward in time." },
          { title: "Customer Segmentation & Churn Prediction", description: "ML-driven customer grouping and at-risk identification — updated automatically as new data arrives." },
          { title: "Unified Multi-Source Dashboards", description: "Connected views across ERP, CRM, marketing, and operational data in a single analytics surface." },
          { title: "Self-Serve Query Interface", description: "Natural-language query capability so non-technical users can ask data questions without SQL." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "Business Intelligence Modernisation", description: "Upgrade from static spreadsheet reports to live, ML-augmented dashboards with automated insight generation." },
          { title: "Anomaly Detection & Alerting System", description: "Real-time monitoring of key metrics with ML-powered anomaly detection and actionable alerts." },
          { title: "Customer Analytics & Churn Prediction", description: "Segmentation, behaviour analysis, and churn risk scoring to inform retention and marketing decisions." },
          { title: "Sales & Revenue Forecasting", description: "ML-driven revenue and pipeline forecasts replacing manual spreadsheet projections." },
          { title: "Operational Performance Analytics", description: "Supply chain, inventory, and operational efficiency analytics with bottleneck detection and optimisation insights." },
          { title: "Data Pipeline & Warehouse Build", description: "A clean, unified data foundation connecting your source systems into a reliable analytics-ready layer." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "Python / PySpark", category: "Data Processing", icon: Braces },
          { name: "ML Frameworks", category: "Model Training", icon: Bot },
          { name: "Data Warehouses", category: "Analytics Storage", icon: Database },
          { name: "BI & Visualisation", category: "Dashboard Layer", icon: BarChart3 },
          { name: "LLM Summarisation", category: "NL Insights", icon: Eye },
          { name: "Real-Time Streaming", category: "Live Data", icon: Zap },
          { name: "ML Monitoring", category: "Model Ops", icon: Gauge },
          { name: "Data Access Controls", category: "Security", icon: Lock },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="How we go from a data audit to a live, ML-driven analytics system."
        modules={[
          { title: "Data Audit & Requirements", duration: "1 Week", topics: ["Source system inventory", "Data quality assessment", "KPI definition", "Stakeholder interviews"] },
          { title: "Data Pipeline & Warehouse Build", duration: "2–3 Weeks", topics: ["ETL / ELT pipeline design", "Schema modelling", "Data quality rules", "Source connectors"] },
          { title: "ML Model Development", duration: "2–4 Weeks", topics: ["Model selection & training", "Anomaly detection tuning", "Forecast model validation", "Feature engineering"] },
          { title: "Dashboard & Insight Layer", duration: "1–2 Weeks", topics: ["Dashboard design", "NL insight generation", "Alert configuration", "Self-serve query setup"] },
          { title: "UAT & Stakeholder Review", duration: "1 Week", topics: ["Accuracy validation", "Threshold calibration", "User acceptance testing", "Training sessions"] },
          { title: "Monitoring & Model Ops", duration: "Ongoing", topics: ["Model drift monitoring", "Data pipeline health", "Retraining schedules", "Dashboard evolution"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="The layered architecture behind AI-powered analytics platforms we build."
        layers={[
          { name: "Data Ingestion Layer", description: "Connectors that pull from operational systems — ERP, CRM, databases, APIs — into a central pipeline.", tech: "ETL / CDC Pipelines", icon: Database },
          { name: "Unified Data Layer", description: "A clean, consistent data warehouse or lakehouse that applies business definitions and resolves cross-system conflicts.", tech: "Data Warehouse / Lakehouse", icon: Layers },
          { name: "ML Analytics Layer", description: "Machine learning models for anomaly detection, forecasting, segmentation, and classification — running on clean, structured data.", tech: "ML Frameworks / Model Registry", icon: Bot },
          { name: "Insight & Presentation Layer", description: "Dashboards, LLM-generated insight summaries, and self-serve query interfaces surfacing findings to decision-makers.", tech: "BI Tools + LLM Summarisation", icon: Eye },
          { name: "Alerting & Action Layer", description: "Real-time alerts, automated reports, and workflow triggers fired when key thresholds or anomalies are detected.", tech: "Alert Engine + Workflow Triggers", icon: TrendingUp },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of AI analytics solutions we build across industries."
        projects={[
          { title: "Retail Inventory Anomaly Detection", description: "An ML monitoring system flagging inventory level anomalies across 40 SKUs and 12 warehouses — reducing stockout incidents by 31%.", skills: ["Time-Series ML", "ERP Integration", "Real-Time Alerting"] },
          { title: "SaaS Churn Prediction Engine", description: "A customer health scoring model identifying accounts at churn risk 60 days in advance — enabling targeted retention interventions.", skills: ["Feature Engineering", "Classification Model", "CRM Integration"] },
          { title: "Financial Performance Analytics Platform", description: "A unified analytics platform connecting ERP, bank feeds, and CRM for a CFO dashboard with NL-generated weekly business summaries.", skills: ["Data Warehouse", "LLM Insights", "BI Dashboard"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "Faster, Better-Informed Decisions", desc: "Leaders act on ML-surfaced signals rather than waiting for weekly reports or analyst interpretation." },
              { name: "Earlier Problem Detection", desc: "Anomalies and risk signals surface in real time — before they become costly business incidents." },
              { name: "Reduced Dependency on Data Analysts for Insights", desc: "Business teams self-serve answers to operational questions without submitting data requests." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "End-to-End Data + ML Expertise", desc: "We handle the full stack — data engineering, ML modelling, and BI — so you don't need three separate vendors." },
              { name: "Business-Context ML", desc: "Our models are designed around your specific business KPIs and decision workflows, not generic benchmark datasets." },
              { name: "Production-Grade ML Operations", desc: "We include model monitoring, drift detection, and retraining pipelines — so accuracy is maintained over time, not just at launch." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Analytics Platform Build", desc: "A full data foundation, ML layer, and dashboard system delivered as a complete project." },
              { name: "Dedicated Data + ML Team", desc: "An ongoing team for an evolving analytics roadmap across business units." },
              { name: "ML Model Development Sprint", desc: "A focused engagement to build and deploy a specific ML model — anomaly detection, forecasting, or churn prediction." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical timelines by analytics scope."
        bands={[
          { scope: "Single ML Model + Dashboard", duration: "5–7 Weeks", fill: 30, description: "One ML capability — anomaly detection or forecasting — with a connected dashboard." },
          { scope: "Multi-Capability Analytics Platform", duration: "8–14 Weeks", fill: 65, description: "Full data pipeline, multiple ML models, unified dashboard, and NL insights." },
          { scope: "Enterprise Analytics Modernisation", duration: "14+ Weeks", fill: 100, description: "Organisation-wide data warehouse, ML platform, and self-serve analytics for all business units." },
        ]}
      />

      <FAQAccordion faqs={analyticsFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Predictive AI Workflows", description: "Turn your analytics insights into operational triggers and automated actions.", href: "/ai-automations/predictive-ai-workflows", icon: TrendingUp },
          { title: "Intelligent Process Automation", description: "Automate the processes your analytics identifies as inefficient.", href: "/ai-automations/intelligent-process-automation", icon: Workflow },
          { title: "AI Integration Services", description: "Connect your analytics platform to the AI APIs that power insight generation.", href: "/ai-automations/ai-integration-services", icon: Plug },
        ]}
      />

      <DetailCTA
        heading="Ready to make your data actually useful?"
        description="Tell us what decisions you're trying to make faster — and we'll design an AI analytics system that surfaces the right signals from your existing data."
        ctaLabel="Start a Conversation"
        checklist={["Free data readiness assessment", "Business-context ML modelling", "End-to-end delivery"]}
      />
    </div>
  );
}
