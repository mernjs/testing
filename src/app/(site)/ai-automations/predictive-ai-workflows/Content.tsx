"use client";

import {
  TrendingUp, Clock, Users, Layers, Headphones,
  Braces, Bot, Database, Gauge, Lock,
  Workflow, BarChart3, Plug, Zap, AlertCircle, GitBranch,
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
import { predictiveFaqs } from "./faqs";

export default function PredictiveAIWorkflowsContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="ai-automations"
        categoryLabel="AI & Automations"
        title="Predictive AI Workflows"
        subtitle="Act before problems surface."
        description="Embed predictive models directly into your operational triggers — automatically flagging at-risk accounts, forecasting resource needs, or pre-empting equipment failures before they happen."
        icon={TrendingUp}
        image="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="From reactive to proactive operations"
        paragraphs={[
          "Most business operations are fundamentally reactive — a customer churns, then you notice. A machine fails, then you respond. Inventory runs out, then you rush to reorder. Predictive AI Workflows change the operating model by embedding ML inference directly into your operational processes — so signals trigger actions before the negative outcome occurs.",
          "We design predictive systems that connect model inference to operational triggers: a churn risk score that automatically fires a retention workflow, a demand forecast that automatically adjusts reorder quantities, or an equipment sensor pattern that schedules preventive maintenance before a breakdown. The prediction and the response are connected in a single, automated system.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "6–10 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Fixed Scope or Dedicated Team", icon: Users },
          { label: "Team Composition", value: "ML Engineers + Integration + Data Engineers", icon: Layers },
          { label: "Post-Launch", value: "Model Monitoring & Retraining", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="Operational problems that predictive AI is specifically suited to address."
        items={[
          { title: "Customer Churn Caught Too Late", description: "By the time retention teams get involved, the customer has already made their decision. Early-warning signals go unnoticed without systematic monitoring." },
          { title: "Demand Forecasting Done in Spreadsheets", description: "Manual demand planning based on intuition and seasonal averages leads to systematic over- and under-stocking." },
          { title: "Equipment Failures That Were Predictable", description: "Sensor and maintenance data contains patterns that precede failures — but nobody has time to analyse it continuously." },
          { title: "Resource Allocation Based on Last Week's Data", description: "Staffing and capacity decisions are made on lagging signals — resulting in over-staffing during slow periods and under-staffing during spikes." },
          { title: "Risk Flags That Aren't Acted On Automatically", description: "Risk models may exist, but without workflow integration, risk flags require a human to notice and respond — and they often don't." },
          { title: "No Closed Loop Between Prediction and Action", description: "Forecast models produce outputs, but those outputs don't automatically trigger the operational response that makes them useful." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we connect ML predictions to operational actions in a closed loop."
        items={[
          { title: "Identify the Decision the Model Should Drive", description: "We design around a specific operational decision — when to intervene, what to reorder, who to contact — before selecting the model." },
          { title: "Feature Engineering From Your Operational Data", description: "We extract the most predictive signals from your existing data sources — transaction history, sensor readings, CRM activity — as model inputs." },
          { title: "Model Calibration for Operational Thresholds", description: "We calibrate confidence thresholds to your business's risk tolerance — how many false positives you can act on versus how many real events you can afford to miss." },
          { title: "Workflow Integration, Not Just a Score Output", description: "The model output connects directly to an action — an alert, a workflow trigger, an automated communication, a system update." },
          { title: "Model Monitoring for Drift", description: "Operational data changes over time, and model accuracy degrades. We include drift detection and retraining pipelines as standard." },
          { title: "Business Impact Measurement", description: "We instrument the system to measure whether predictions lead to better outcomes — so you can quantify the ROI of the predictive capability." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key capabilities"
        items={[
          { title: "Real-Time Inference Pipeline", description: "ML model scoring applied to live operational data as it arrives — not as a nightly batch." },
          { title: "Configurable Trigger Thresholds", description: "Business-defined thresholds that determine when a prediction triggers an action or alert." },
          { title: "Automated Workflow Integration", description: "Direct connection from model output to downstream workflows — no human reading of scores required." },
          { title: "Explainable Predictions", description: "Human-readable explanations of why a prediction was made — critical for customer-facing interventions and compliance." },
          { title: "Model Performance Dashboards", description: "Live visibility into model accuracy, drift metrics, and trigger rates — so you always know if the system is working." },
          { title: "Retraining Pipelines", description: "Automated or scheduled model retraining on updated data to maintain accuracy as business conditions evolve." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "Customer Churn Prediction & Retention Workflow", description: "ML model scoring churn risk, connected to automated retention outreach or CSM alert workflows." },
          { title: "Demand Forecasting & Inventory Automation", description: "Time-series forecasting connected to automated reorder triggers and inventory management system updates." },
          { title: "Predictive Maintenance System", description: "Sensor-based ML models detecting pre-failure patterns, connected to automated maintenance scheduling." },
          { title: "Credit & Payment Risk Scoring", description: "ML risk scoring for invoice payment, loan approval, or credit extension — integrated into operational approval workflows." },
          { title: "Lead Scoring & Prioritisation Workflow", description: "ML-ranked leads delivered to sales reps in priority order, with high-score leads triggering automated outreach." },
          { title: "Staffing & Capacity Demand Forecasting", description: "Predicted demand curves driving automated scheduling recommendations or capacity alerts." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "Python", category: "Core Language", icon: Braces },
          { name: "ML Frameworks", category: "Model Training", icon: Bot },
          { name: "Feature Stores", category: "Feature Engineering", icon: Database },
          { name: "Model Registry", category: "Model Management", icon: Layers },
          { name: "Real-Time Inference", category: "Scoring Engine", icon: Zap },
          { name: "Workflow Orchestrators", category: "Action Triggers", icon: GitBranch },
          { name: "Drift Detection", category: "Model Monitoring", icon: Gauge },
          { name: "Secure API Layer", category: "Integration", icon: Lock },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="From data analysis to a live predictive workflow system."
        modules={[
          { title: "Problem & Data Scoping", duration: "1 Week", topics: ["Target outcome definition", "Data availability audit", "Feature candidate analysis", "Business threshold setting"] },
          { title: "Feature Engineering & Model Development", duration: "2–3 Weeks", topics: ["Feature pipeline construction", "Model selection & training", "Cross-validation", "Threshold calibration"] },
          { title: "Inference Pipeline Build", duration: "1–2 Weeks", topics: ["Real-time scoring service", "Batch inference pipeline", "Score storage & routing", "API endpoint setup"] },
          { title: "Workflow Integration", duration: "1 Week", topics: ["Trigger logic implementation", "Downstream system connections", "Alert & notification routing", "Action logging"] },
          { title: "Testing & Business Validation", duration: "1 Week", topics: ["Shadow mode testing", "Threshold review", "Business stakeholder sign-off", "Impact baseline setting"] },
          { title: "Monitoring & Continuous Improvement", duration: "Ongoing", topics: ["Accuracy monitoring", "Drift detection", "Retraining schedules", "Impact measurement"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="The layers that connect a predictive model to an operational response."
        layers={[
          { name: "Data Layer", description: "Live operational data from CRM, ERP, sensors, or application databases — fed into the feature pipeline in real time or near-real time.", tech: "Data Pipeline / Feature Store", icon: Database },
          { name: "Inference Layer", description: "ML model scoring service that evaluates incoming data against trained model parameters and produces a prediction with confidence score.", tech: "Real-Time Inference Service", icon: Bot },
          { name: "Threshold & Routing Layer", description: "Business-defined rules that convert model scores into trigger decisions — which scores fire actions, at what thresholds.", tech: "Rules Engine", icon: AlertCircle },
          { name: "Action Layer", description: "Downstream workflow triggers — automated communications, system updates, CRM tasks, scheduling actions — fired by the threshold layer.", tech: "Workflow Orchestrator / APIs", icon: GitBranch },
          { name: "Monitoring Layer", description: "Real-time dashboards tracking model accuracy, trigger rates, drift signals, and business outcome metrics.", tech: "ML Monitoring Platform", icon: Gauge },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="Predictive AI workflows deployed across SaaS, retail, and industrial operations."
        projects={[
          { title: "SaaS Customer Churn Prevention", description: "An ML churn model scoring 15,000 accounts weekly and automatically queuing at-risk accounts for CSM outreach — reducing monthly churn rate by 22%.", skills: ["Churn ML Model", "CRM Integration", "CSM Alert Workflow"] },
          { title: "Retail Inventory Demand Forecasting", description: "A time-series forecasting model driving automated reorder triggers across 200 SKUs — reducing stockouts by 38% and over-stock carrying costs by 19%.", skills: ["Time-Series Forecasting", "ERP Integration", "Auto Reorder Trigger"] },
          { title: "Industrial Equipment Predictive Maintenance", description: "Vibration sensor data powering ML failure prediction — triggering maintenance scheduling 72 hours before predicted failure events.", skills: ["Sensor ML", "Maintenance API", "Alert Workflow"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "Shift from Reactive to Proactive Operations", desc: "Problems are flagged and addressed before they fully materialise — changing the operational posture fundamentally." },
              { name: "Quantifiable Improvement in Key Business Metrics", desc: "Churn rates, stockout incidents, unplanned downtime — predictive workflows drive measurable improvements in the metrics that matter." },
              { name: "Automated Response at Scale", desc: "The system acts on thousands of predictions simultaneously — without requiring human review of each score." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "Action-Connected ML Engineering", desc: "We don't just build models — we connect them to operational workflows so predictions lead to automatic responses." },
              { name: "Business-Context Model Design", desc: "Our models are calibrated around your specific business decision thresholds, not academic accuracy benchmarks." },
              { name: "Long-Term Model Health Built In", desc: "Drift detection and retraining pipelines are standard — so model accuracy is maintained as your data evolves." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Fixed-Scope Predictive Workflow", desc: "One ML model, connected to one operational workflow, delivered at a clear scope and price." },
              { name: "Dedicated ML + Integration Team", desc: "An ongoing team for a multi-model predictive operations programme across business units." },
              { name: "Predictive Capability Assessment", desc: "A structured sprint to identify where your operational data can support predictive ML — delivered as a prioritised roadmap." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical timelines by predictive workflow scope."
        bands={[
          { scope: "Single Predictive Model + Workflow", duration: "5–7 Weeks", fill: 30, description: "One ML model scoring one operational outcome and triggering one automated workflow." },
          { scope: "Multi-Model Predictive System", duration: "8–12 Weeks", fill: 65, description: "Several ML models covering related operational decisions with shared monitoring infrastructure." },
          { scope: "Enterprise Predictive Operations Platform", duration: "12+ Weeks", fill: 100, description: "Organisation-wide predictive capability across business units with unified model governance." },
        ]}
      />

      <FAQAccordion faqs={predictiveFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "AI-Powered Data Analytics", description: "Build the analytics foundation that feeds your predictive models with clean, unified data.", href: "/ai-automations/ai-powered-data-analytics", icon: BarChart3 },
          { title: "Intelligent Process Automation", description: "Connect predictive triggers to automated workflow execution automatically.", href: "/ai-automations/intelligent-process-automation", icon: Workflow },
          { title: "AI Integration Services", description: "Connect your predictive models to any system in your operational stack.", href: "/ai-automations/ai-integration-services", icon: Plug },
        ]}
      />

      <DetailCTA
        heading="Ready to build workflows that act before problems occur?"
        description="Tell us about the business outcome you want to predict and prevent — and we'll design an ML workflow system that turns your operational data into proactive intelligence."
        ctaLabel="Start a Conversation"
        checklist={["Free data & opportunity assessment", "Closed-loop prediction-to-action design", "Production model monitoring included"]}
      />
    </div>
  );
}
