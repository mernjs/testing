"use client";

import {
  Cpu, Clock, Users, Layers, Headphones,
  Braces, BrainCircuit, Boxes, Database, Server, Cloud, Gauge, GitBranch,
  Bot, LineChart, ScanEye,
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

export default function AIMLSolutionsContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="services"
        categoryLabel="services"
        title="AI/ML Solutions"
        subtitle="Custom machine learning architecture."
        description="We design, train, and deploy bespoke machine learning models that solve highly specific problems, from natural language processing to complex recommendation engines."
        icon={Cpu}
        image="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Machine learning models built around your specific problem"
        paragraphs={[
          "Off-the-shelf AI tools solve generic problems. The interesting business value is usually in the specific one — the exact way your customers churn, the particular pattern in your fraud, the unique way your users search. That's what custom ML is for.",
          "We design, train, and deploy models tuned to your actual data and business context, then build the MLOps discipline around them — versioning, monitoring, retraining — so the model that works well at launch still works well a year later.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "5–9 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Team Composition", value: "ML Engineers + Data Scientists", icon: Layers },
          { label: "Support", value: "Model Monitoring & Retraining", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="Why so many AI initiatives stall before they ever reach production."
        items={[
          { title: "Generic Tools Don't Fit the Specific Problem", description: "Off-the-shelf AI APIs often can't capture the nuance of your specific data and use case." },
          { title: "Data That Isn't ML-ready", description: "Raw business data usually needs significant feature engineering before it's useful to a model." },
          { title: "Models That Work in Notebooks, Not Production", description: "A model that performs well in a notebook often breaks down under real production load and edge cases." },
          { title: "No Clear Path From Model to Business Value", description: "A trained model that never gets integrated into a real workflow delivers zero value." },
          { title: "Model Performance Degrading Silently", description: "Without monitoring, model accuracy quietly drifts as real-world data shifts." },
          { title: "Unclear ROI on AI Investment", description: "Without a measurable success metric defined upfront, AI projects are hard to justify or evaluate." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we get a model from a business question to a reliable production system."
        items={[
          { title: "Problem Framing Before Modeling", description: "We define the specific business metric a model needs to move before choosing an algorithm." },
          { title: "Rigorous Feature Engineering", description: "The unglamorous data work that determines most of a model's real-world performance." },
          { title: "Right-sized Model Selection", description: "From simple regression to deep learning, we pick the smallest model that solves the problem well." },
          { title: "Production-grade MLOps", description: "Versioning, CI/CD for models, and automated testing built in from the start, not bolted on later." },
          { title: "Continuous Monitoring & Retraining", description: "Automated drift detection and a retraining cadence that keeps performance from degrading unnoticed." },
          { title: "Metrics Tied to Business Outcomes", description: "Model KPIs mapped directly to the business result you're trying to move." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        items={[
          { title: "Custom Model Training", description: "Models architected and trained specifically for your data, not a generic pretrained default." },
          { title: "Natural Language Processing", description: "Extract meaning, sentiment, and structured data from unstructured text." },
          { title: "Recommendation Systems", description: "Personalized recommendations that increase engagement and conversion." },
          { title: "Automated Feature Pipelines", description: "Repeatable, versioned pipelines that keep training data consistent over time." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "Custom Predictive Models", description: "Classification and regression models tuned to your specific business problem." },
          { title: "NLP & Text Analytics", description: "Sentiment analysis, document classification, and information extraction from text." },
          { title: "Recommendation Engines", description: "Personalized product, content, or feature recommendations for your users." },
          { title: "Model Deployment & MLOps", description: "Production deployment, monitoring, and CI/CD pipelines for your ML models." },
          { title: "Model Audits & Optimization", description: "Performance and bias audits for models you already have in production." },
          { title: "Data Pipeline Engineering", description: "Feature stores and ETL pipelines that keep your models fed with clean, current data." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "Python", category: "Core Language", icon: Braces },
          { name: "PyTorch / TensorFlow", category: "Deep Learning", icon: BrainCircuit },
          { name: "Scikit-learn", category: "Classical ML", icon: Boxes },
          { name: "Feature Store", category: "Data Layer", icon: Database },
          { name: "FastAPI", category: "Model Serving", icon: Server },
          { name: "SageMaker / Vertex AI", category: "Cloud ML", icon: Cloud },
          { name: "MLflow", category: "Experiment Tracking", icon: Gauge },
          { name: "GitHub Actions", category: "CI/CD", icon: GitBranch },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="How we take a model from a business question to a monitored production system."
        modules={[
          { title: "Discovery & Problem Framing", duration: "3–5 Days", topics: ["Business goal alignment", "Success metrics", "Data audit", "Feasibility assessment"] },
          { title: "Data Preparation", duration: "1–2 Weeks", topics: ["Feature engineering", "Data cleaning", "Pipeline setup", "Baseline model"] },
          { title: "Model Development", duration: "2–3 Weeks", topics: ["Model selection", "Training & tuning", "Validation", "Bias & fairness review"] },
          { title: "Deployment & Integration", duration: "1 Week", topics: ["Model serving setup", "API integration", "Load testing", "Rollout plan"] },
          { title: "Validation & Rollout", duration: "3–5 Days", topics: ["Shadow-mode testing", "Stakeholder sign-off", "Production rollout"] },
          { title: "Monitoring & Retraining", duration: "Ongoing", topics: ["Drift monitoring", "Scheduled retraining", "Performance reporting", "Model iteration"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="A typical layered architecture for the ML systems we build."
        layers={[
          { name: "Data & Feature Layer", description: "Pipelines that transform raw business data into clean, versioned features ready for training.", tech: "ETL / Feature Store", icon: Database },
          { name: "Model Training Layer", description: "Experiment tracking and training infrastructure used to develop and validate the right model for your problem.", tech: "PyTorch / MLflow", icon: BrainCircuit },
          { name: "Serving Layer", description: "A production API layer that serves model predictions with the latency your application requires.", tech: "FastAPI / Cloud ML", icon: Server },
          { name: "Monitoring Layer", description: "Automated tracking of model accuracy and data drift, with alerts before performance degrades meaningfully.", tech: "MLflow / Grafana", icon: Gauge },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation capabilities"
        description="Where automation keeps ML systems accurate with less manual data science effort."
        items={[
          { title: "Automated Retraining Pipelines", description: "Models retrain automatically on a schedule or when drift is detected." },
          { title: "Automated Feature Engineering", description: "Pipelines that generate and test candidate features with less manual data science effort." },
          { title: "Explainability Dashboards", description: "Automated reports showing which features are driving each model's predictions." },
          { title: "AI-assisted Model Selection", description: "Automated benchmarking across candidate architectures to speed up model selection." },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of custom ML systems we build across content, support, and risk."
        projects={[
          { title: "Personalized Recommendation Engine", description: "A recommendation system increasing engagement for a content platform's homepage.", skills: ["Recommendation Systems", "Python", "MLOps"] },
          { title: "Support Ticket Classifier", description: "An NLP model that automatically routes and prioritizes incoming support tickets.", skills: ["NLP", "Classification", "APIs"] },
          { title: "Fraud Risk Scoring Model", description: "A real-time model scoring transactions for fraud risk with sub-second latency.", skills: ["Real-time ML", "Feature Engineering", "Monitoring"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "Higher Engagement & Conversion", desc: "Personalized experiences driven by real models outperform static, one-size-fits-all logic." },
              { name: "Automated, Consistent Decisions", desc: "Models apply the same criteria every time, removing manual inconsistency at scale." },
              { name: "Faster Time to Insight", desc: "Automated pipelines get new data working for you instead of sitting unused." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "Full-lifecycle ML Expertise", desc: "We handle everything from data engineering through production monitoring, not just model training." },
              { name: "Business Outcomes Over Model Metrics", desc: "We optimize for the business result you need, not just an accuracy score in isolation." },
              { name: "MLOps Discipline From Day One", desc: "Versioning, monitoring, and retraining are part of the plan from the start, not an afterthought." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Dedicated Team", desc: "A committed ML team for an evolving portfolio of models." },
              { name: "Fixed Scope Project", desc: "A defined model and deployment delivered against a clear timeline and price." },
              { name: "Staff Augmentation", desc: "Embed our ML engineers into your existing data team for specific expertise." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical timelines by project scope, so you can plan around a realistic rollout."
        bands={[
          { scope: "Proof of Concept", duration: "3–4 Weeks", fill: 35, description: "A validated model prototype proving feasibility on your real data." },
          { scope: "Production Model Deployment", duration: "6–9 Weeks", fill: 70, description: "A fully deployed, monitored model integrated into your product or workflow." },
          { scope: "Enterprise ML Platform", duration: "9+ Weeks", fill: 100, description: "A shared ML platform supporting multiple models and teams across the organization." },
        ]}
      />

      <FAQAccordion
        faqs={[
          { question: "Do we need a large dataset to build a custom model?", answer: "It depends on the problem, but we'll assess your data during discovery and recommend techniques like transfer learning if your dataset is smaller than ideal." },
          { question: "How do you make sure the model keeps working after launch?", answer: "We set up drift monitoring and a retraining cadence so accuracy issues get caught and addressed before they affect your business." },
          { question: "Can you take over a model we already built?", answer: "Yes, we regularly audit and take over existing models, including performance and bias reviews before proposing changes." },
          { question: "How do you handle bias and fairness in models?", answer: "We include bias and fairness review as a standard step in model validation, not an optional add-on, especially for models affecting individual users." },
          { question: "What's the difference between this and the AI Agent service?", answer: "AI/ML Solutions focuses on the predictive or generative models themselves; AI Agent focuses on autonomous systems that take multi-step actions, often using models like these as one component." },
        ]}
      />

      <RelatedServices
        tone="muted"
        services={[
          { title: "AI Agent", description: "Turn your models into autonomous agents that take real action.", href: "/services/ai-agent", icon: Bot },
          { title: "Prediction & Forecasting", description: "Apply custom modeling specifically to time-series forecasting problems.", href: "/services/prediction-and-forecasting", icon: LineChart },
          { title: "Vision Intelligence", description: "Extend your ML capabilities into image and video analysis.", href: "/services/vision-intelligence", icon: ScanEye },
        ]}
      />

      <DetailCTA
        heading="Ready to build a model tuned to your exact problem?"
        description="Let's talk about your data, your goals, and how we can help you turn it into a working model."
        ctaLabel="Get a Quote"
      />
    </div>
  );
}
