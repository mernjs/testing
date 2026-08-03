"use client";

import {
  Layers, Code2, Server, Smartphone, BrainCircuit, Sparkles, Bot, Database,
  Cloud, Palette, ShoppingCart, CheckCircle2, BarChart3, Workflow, Rocket,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import SectionHeader from "@/components/sections/SectionHeader";
import TechShowcase, { type TechCategory } from "@/components/sections/TechShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";
import { brandify } from "@/lib/brand";

const categories: TechCategory[] = [
  {
    id: "frontend",
    name: "Frontend Technologies",
    icon: Code2,
    description: "Fast, accessible interfaces built with modern component-based frameworks and a disciplined design-system approach.",
    expertise: ["Component-driven architecture", "Core Web Vitals", "WCAG accessibility"],
    items: [
      { name: "React", blurb: "Component-based UI library for building interactive interfaces." },
      { name: "Next.js", blurb: "Full-stack React framework with server rendering built in." },
      { name: "TypeScript", blurb: "Type-safe JavaScript for fewer runtime surprises." },
      { name: "Tailwind CSS", blurb: "Utility-first styling for fast, consistent UI work." },
      { name: "Vue.js", blurb: "Progressive framework for approachable, reactive UIs." },
      { name: "Redux / Zustand", blurb: "Predictable state management for complex apps." },
      { name: "Framer Motion", blurb: "Production-grade motion and interaction design." },
      { name: "Vite", blurb: "Next-generation build tooling for instant dev feedback." },
    ],
  },
  {
    id: "backend",
    name: "Backend Technologies",
    icon: Server,
    description: "Scalable, secure server-side systems built on battle-tested runtimes and frameworks, chosen for the problem, not the trend.",
    expertise: ["API-first architecture", "Microservices & monoliths", "High-throughput pipelines"],
    items: [
      { name: "Node.js / Express", blurb: "JavaScript everywhere, from UI to API layer." },
      { name: "NestJS", blurb: "Structured, opinionated Node.js for larger systems." },
      { name: "Python (Django / FastAPI)", blurb: "Rapid, readable backend development." },
      { name: "Java (Spring Boot)", blurb: "Enterprise-grade services at scale." },
      { name: "Go", blurb: "High-performance services where speed matters most." },
      { name: "GraphQL", blurb: "Flexible, typed API layer for complex data needs." },
      { name: "REST APIs", blurb: "Standard, well-understood API design." },
    ],
  },
  {
    id: "mobile",
    name: "Mobile App Development",
    icon: Smartphone,
    description: "Native-feel mobile experiences across iOS and Android, built cross-platform or fully native depending on your performance needs.",
    expertise: ["Cross-platform delivery", "Native performance tuning", "Offline-first architecture"],
    items: [
      { name: "React Native", blurb: "One codebase, native iOS and Android apps." },
      { name: "Flutter", blurb: "Pixel-perfect cross-platform UI from a single codebase." },
      { name: "Swift", blurb: "Native iOS development for maximum performance." },
      { name: "Kotlin", blurb: "Native Android development, modern and concise." },
      { name: "Expo", blurb: "Rapid React Native tooling and over-the-air updates." },
      { name: "SwiftUI", blurb: "Declarative native iOS interfaces." },
    ],
  },
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    icon: BrainCircuit,
    description: "Production machine learning, from data pipeline to deployed model, monitored and retrained as your data evolves.",
    expertise: ["Model training & tuning", "MLOps & monitoring", "Bias & fairness review"],
    items: [
      { name: "PyTorch", blurb: "Flexible deep learning framework for research and production." },
      { name: "TensorFlow", blurb: "End-to-end platform for production ML systems." },
      { name: "Scikit-learn", blurb: "Classical ML for structured, tabular data." },
      { name: "Hugging Face", blurb: "Pretrained models and fine-tuning tooling." },
      { name: "MLflow", blurb: "Experiment tracking and model lifecycle management." },
      { name: "Pandas / NumPy", blurb: "The core toolkit for data manipulation." },
    ],
  },
  {
    id: "genai",
    name: "Generative AI & LLMs",
    icon: Sparkles,
    description: "Applied generative AI grounded in your own data, not a generic chatbot wrapper.",
    expertise: ["Prompt engineering", "Retrieval-augmented generation", "Fine-tuning & evaluation"],
    items: [
      { name: "OpenAI GPT", blurb: "General-purpose language models for text and reasoning." },
      { name: "Anthropic Claude", blurb: "Long-context, reliability-focused language models." },
      { name: "LangChain", blurb: "Orchestration framework for LLM-powered applications." },
      { name: "LlamaIndex", blurb: "Data framework for connecting LLMs to your own data." },
      { name: "RAG Pipelines", blurb: "Grounding model output in your proprietary knowledge." },
      { name: "Vector Databases", blurb: "Semantic search and retrieval at scale." },
    ],
  },
  {
    id: "agentic-ai",
    name: "AI Agents & Agentic AI",
    icon: Bot,
    description: "Autonomous agents that plan, use tools, and coordinate to complete real business workflows, with guardrails built in.",
    expertise: ["Multi-agent orchestration", "Tool use & function calling", "Shadow-mode testing"],
    items: [
      { name: "LangGraph", blurb: "Stateful, controllable multi-step agent workflows." },
      { name: "CrewAI", blurb: "Coordinating multiple agents toward a shared goal." },
      { name: "Function Calling", blurb: "Letting models take real, structured actions." },
      { name: "Multi-agent Orchestration", blurb: "Coordinated agents covering broader workflows." },
      { name: "Tool Use & Planning", blurb: "Agents that reason about which tool to use, and when." },
      { name: "Memory & State", blurb: "Context and memory design for coherent agent behavior." },
    ],
  },
  {
    id: "databases",
    name: "Databases",
    icon: Database,
    description: "The right storage engine for the shape of your data, relational, document, or in-memory, chosen deliberately.",
    expertise: ["Schema & query design", "Caching strategy", "High-availability replication"],
    items: [
      { name: "PostgreSQL", blurb: "Reliable, feature-rich relational database." },
      { name: "MongoDB", blurb: "Flexible document storage for evolving schemas." },
      { name: "MySQL", blurb: "Proven relational database for standard workloads." },
      { name: "Redis", blurb: "In-memory store for caching and real-time data." },
      { name: "Elasticsearch", blurb: "Full-text search and log analytics at scale." },
      { name: "DynamoDB", blurb: "Managed, serverless NoSQL for high-scale apps." },
    ],
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps",
    icon: Cloud,
    description: "Infrastructure that scales with usage, deployed through pipelines that catch problems before your users do.",
    expertise: ["Infrastructure as code", "CI/CD automation", "Auto-scaling & observability"],
    items: [
      { name: "AWS", blurb: "The broadest cloud platform for production workloads." },
      { name: "Google Cloud", blurb: "Strong data, ML, and Kubernetes-native tooling." },
      { name: "Microsoft Azure", blurb: "Deep enterprise and Microsoft-ecosystem integration." },
      { name: "Docker", blurb: "Consistent, portable application containers." },
      { name: "Kubernetes", blurb: "Container orchestration for resilient systems." },
      { name: "GitHub Actions", blurb: "CI/CD pipelines built into your repository." },
      { name: "Terraform", blurb: "Infrastructure as code across cloud providers." },
    ],
  },
  {
    id: "design",
    name: "UI/UX & Design",
    icon: Palette,
    description: "Interfaces designed around real user research and validated with prototypes before a line of code is written.",
    expertise: ["Design systems", "Usability testing", "Accessibility-first design"],
    items: [
      { name: "Figma", blurb: "Collaborative interface design and prototyping." },
      { name: "Adobe XD", blurb: "UI/UX design and interactive prototyping." },
      { name: "Design Systems", blurb: "Reusable components for consistent products." },
      { name: "Prototyping", blurb: "Validating flows before committing engineering time." },
      { name: "User Research", blurb: "Grounding design decisions in real user behavior." },
      { name: "WCAG Accessibility", blurb: "Interfaces usable by everyone, by default." },
    ],
  },
  {
    id: "cms-ecommerce",
    name: "CMS & E-commerce",
    icon: ShoppingCart,
    description: "Content and commerce platforms your team can actually manage, without an engineering ticket for every update.",
    expertise: ["Headless CMS architecture", "Checkout & payments", "Content modeling"],
    items: [
      { name: "WordPress", blurb: "The web's most widely supported CMS." },
      { name: "Shopify", blurb: "Full-featured, hosted e-commerce platform." },
      { name: "Sanity", blurb: "Structured, headless content as a real-time API." },
      { name: "Contentful", blurb: "Headless CMS for omnichannel content delivery." },
      { name: "Strapi", blurb: "Open-source, self-hosted headless CMS." },
      { name: "WooCommerce", blurb: "Flexible e-commerce on top of WordPress." },
    ],
  },
  {
    id: "testing-qa",
    name: "Testing & QA",
    icon: CheckCircle2,
    description: "Automated and manual testing built into delivery, not bolted on before a launch deadline.",
    expertise: ["Unit & integration testing", "End-to-end automation", "Load & performance testing"],
    items: [
      { name: "Jest", blurb: "Unit and integration testing for JavaScript." },
      { name: "Cypress", blurb: "Fast, reliable end-to-end browser testing." },
      { name: "Playwright", blurb: "Cross-browser end-to-end testing and automation." },
      { name: "Selenium", blurb: "Battle-tested browser automation framework." },
      { name: "Postman", blurb: "API testing, mocking, and documentation." },
      { name: "JUnit", blurb: "The standard for testing Java applications." },
    ],
  },
  {
    id: "data-engineering",
    name: "Data Engineering & Analytics",
    icon: BarChart3,
    description: "Reliable data pipelines that turn raw, messy data into something your team can actually query and trust.",
    expertise: ["ETL / ELT pipeline design", "Data warehousing", "Real-time streaming"],
    items: [
      { name: "Apache Airflow", blurb: "Orchestrating complex data workflows reliably." },
      { name: "Apache Spark", blurb: "Large-scale data processing and analytics." },
      { name: "dbt", blurb: "Transforming data in the warehouse, version-controlled." },
      { name: "Snowflake", blurb: "Managed cloud data warehouse at scale." },
      { name: "BigQuery", blurb: "Serverless analytics on massive datasets." },
      { name: "Apache Kafka", blurb: "Real-time event streaming between systems." },
    ],
  },
  {
    id: "automation",
    name: "Automation & Integration",
    icon: Workflow,
    description: "Connecting the tools your business already runs on, so work moves without manual handoffs.",
    expertise: ["Workflow automation", "Third-party API integration", "Robotic process automation"],
    items: [
      { name: "Zapier", blurb: "No-code automation across thousands of apps." },
      { name: "n8n", blurb: "Self-hosted, extensible workflow automation." },
      { name: "Make (Integromat)", blurb: "Visual, complex multi-step automations." },
      { name: "Webhooks", blurb: "Real-time event delivery between systems." },
      { name: "REST / GraphQL Integrations", blurb: "Custom integrations with your existing stack." },
      { name: "RPA Tools", blurb: "Automating repetitive, rules-based processes." },
    ],
  },
  {
    id: "emerging",
    name: "Emerging Technologies",
    icon: Rocket,
    description: "We track where the industry is heading and bring emerging tech into production only once it's genuinely ready.",
    expertise: ["Applied R&D", "Proof-of-concept validation", "Production-readiness review"],
    items: [
      { name: "AR / VR (WebXR)", blurb: "Immersive experiences across web and headset." },
      { name: "Blockchain / Web3", blurb: "Decentralized applications and smart contracts." },
      { name: "IoT", blurb: "Connected devices and real-time telemetry." },
      { name: "Edge Computing", blurb: "Processing data closer to where it's generated." },
      { name: "WebAssembly", blurb: "Near-native performance in the browser." },
      { name: "Voice Interfaces", blurb: "Natural, hands-free product interactions." },
    ],
  },
];

export default function TechnologiesContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="about"
        categoryLabel="about"
        title="Our Technology Stack"
        subtitle="The tools behind every product we ship."
        description={brandify("From frontend frameworks to agentic AI, this is the technology YashOrbit reaches for, and why, across every engagement.")}
        icon={Layers}
        image="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            category="Technology Stack"
            icon={Layers}
            heading="Fourteen categories, one deliberate stack."
            description="We don't chase every new framework. Each category below reflects tools we've used in production, chosen for the problem at hand rather than the hype cycle. Search for a tool, or expand a category to explore it."
          />
          <TechShowcase categories={categories} />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why our stack looks like this"
            features={[
              { name: "Chosen for the Problem, Not the Trend", desc: "Every technology here earned its place on a real engagement, not a slide deck." },
              { name: "Senior Engineers, Deep in Each Tool", desc: "Our team has shipped production systems with these tools, not just tutorials." },
              { name: "Reviewed as the Landscape Shifts", desc: "We retire and add tools deliberately as the ecosystem, and your needs, evolve." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={[
          { question: "Do you only work with the technologies listed here?", answer: "This is our core, proven stack, but we regularly work within a client's existing technology choices when we're extending or maintaining an established product." },
          { question: "How do you decide which technology to use for a project?", answer: "We scope around your requirements, team, and constraints first, then match technology to that, not the other way around." },
          { question: "Can you work with a legacy stack that isn't on this list?", answer: "Yes, we regularly take over and modernize codebases built on older or less common stacks, starting with a technical audit." },
          { question: "Do you help us choose between competing technologies?", answer: "Yes, that's part of a typical discovery phase, including tradeoffs, migration cost, and long-term maintainability." },
          { question: brandify("How current does YashOrbit stay with new AI tooling?"), answer: "We maintain a dedicated applied-AI practice and internal R&D time to evaluate new models and frameworks as part of how we operate, not as a side project." },
        ]}
      />

      <DetailCTA
        heading="Have a stack in mind already?"
        description="Whether you know exactly what you want to build with, or need help deciding, let's talk through the options."
        ctaLabel="Get a Quote"
      />
    </div>
  );
}
