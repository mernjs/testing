"use client";

import {
  Layers, Code2, Server, Smartphone, BrainCircuit, Sparkles, Bot, Database,
  Cloud, Palette, ShoppingCart, CheckCircle2, BarChart3, Workflow, Rocket, HeartHandshake, Blocks,
  AppWindow, SquareTerminal,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import SectionHeader from "@/components/sections/SectionHeader";
import TechShowcase, { type TechCategory } from "@/components/sections/TechShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";
import { brandify } from "@/lib/brand";
import { technologiesFaqs } from "./faqs";

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
      { name: "Angular", blurb: "Enterprise-grade framework for large, structured SPAs." },
      { name: "Svelte / SvelteKit", blurb: "Compiler-first framework for lean, fast UI bundles." },
      { name: "TanStack Query", blurb: "Server-state fetching, caching, and sync made simple." },
      { name: "Storybook", blurb: "Isolated component development and visual documentation." },
      { name: "Astro", blurb: "Content-focused sites shipped with minimal client JavaScript." },
      { name: "Webpack / Turbopack", blurb: "Module bundling for complex, large-scale frontends." },
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
      { name: "Ruby on Rails", blurb: "Convention-driven framework for fast MVP delivery." },
      { name: ".NET / C#", blurb: "Enterprise services on Microsoft's mature runtime." },
      { name: "PHP / Laravel", blurb: "Pragmatic, widely-hosted web application framework." },
      { name: "gRPC", blurb: "High-performance RPC for service-to-service communication." },
      { name: "Message Queues (RabbitMQ / SQS)", blurb: "Reliable async processing and service decoupling." },
      { name: "WebSockets", blurb: "Real-time, bidirectional communication for live features." },
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
      { name: "Jetpack Compose", blurb: "Declarative native Android UI toolkit." },
      { name: "Ionic", blurb: "Cross-platform apps built with familiar web technologies." },
      { name: ".NET MAUI", blurb: "Cross-platform native apps on a single .NET codebase." },
      { name: "Firebase (Mobile)", blurb: "Auth, realtime data, and crash reporting out of the box." },
      { name: "Push Notifications (FCM / APNs)", blurb: "Reliable re-engagement across iOS and Android." },
      { name: "App Store & Play Store Deployment", blurb: "Release management and store compliance handled end to end." },
    ],
  },
  {
    id: "desktop",
    name: "Desktop Application Technologies",
    icon: AppWindow,
    description: "Software that earns a permanent spot on the desktop, framework chosen for your performance, distribution, and system-access needs, not habit.",
    expertise: ["Cross-platform desktop delivery", "Native system access", "Code-signed, auto-updating releases"],
    items: [
      { name: "Electron", blurb: "Cross-platform desktop apps built with familiar web technologies." },
      { name: "Tauri / Rust", blurb: "Lightweight, Rust-powered native runtime with a tiny footprint." },
      { name: "WPF (.NET)", blurb: "Native Windows desktop UI framework built on .NET." },
      { name: "Qt (C++)", blurb: "Cross-platform native UI framework for high-performance desktop apps." },
      { name: "JavaFX", blurb: "Java-based desktop UI toolkit for cross-platform business apps." },
      { name: "GTK", blurb: "Open-source toolkit for native Linux desktop applications." },
      { name: "SwiftUI for macOS", blurb: "Native macOS interfaces built with Apple's declarative framework." },
      { name: "Windows Forms", blurb: "Rapid, mature framework for internal Windows business tools." },
      { name: "Avalonia UI", blurb: "Modern, cross-platform XAML-based .NET desktop framework." },
      { name: "Win32 / Native C++", blurb: "Full native performance and system access where frameworks fall short." },
      { name: "Electron Builder / Squirrel.Windows", blurb: "Packaging, code-signing, and auto-update tooling for signed Windows releases." },
      { name: "Sparkle (macOS Auto-update)", blurb: "Auto-update framework for signed macOS desktop releases." },
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
      { name: "Keras", blurb: "High-level API for fast neural network prototyping." },
      { name: "XGBoost", blurb: "Gradient-boosted trees for high-accuracy tabular models." },
      { name: "OpenCV", blurb: "Classical and deep learning-based computer vision." },
      { name: "ONNX", blurb: "Portable model format for cross-framework deployment." },
      { name: "Weights & Biases", blurb: "Experiment tracking and model performance dashboards." },
      { name: "Apache Spark MLlib", blurb: "Distributed machine learning at big-data scale." },
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
      { name: "Google Gemini", blurb: "Multimodal models for text, image, and code tasks." },
      { name: "Mistral AI", blurb: "Efficient open-weight models for cost-sensitive workloads." },
      { name: "Fine-tuning & LoRA", blurb: "Adapting base models to your domain without full retraining." },
      { name: "Embedding Models", blurb: "Turning text and data into searchable vector representations." },
      { name: "Semantic Kernel", blurb: "Microsoft's SDK for orchestrating LLM-powered plugins." },
      { name: "Prompt Evaluation Frameworks", blurb: "Systematic testing of prompt quality and regressions." },
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
      { name: "AutoGen", blurb: "Framework for building conversable, collaborative agents." },
      { name: "Model Context Protocol (MCP)", blurb: "Standardized way for agents to connect to external tools and data." },
      { name: "Guardrails & Safety Layers", blurb: "Constraining agent actions to safe, approved boundaries." },
      { name: "Human-in-the-loop Review", blurb: "Escalation paths for decisions that need a person to sign off." },
      { name: "Agent Observability", blurb: "Tracing, logging, and cost monitoring for live agents." },
      { name: "Workflow Automation Agents", blurb: "Agents that execute multi-step business processes end to end." },
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
      { name: "SQLite", blurb: "Lightweight embedded database for local-first apps." },
      { name: "Cassandra", blurb: "Distributed, write-heavy database for massive scale." },
      { name: "Supabase", blurb: "Postgres-backed backend-as-a-service with realtime built in." },
      { name: "Firebase Firestore", blurb: "Managed NoSQL document store with live sync." },
      { name: "Neo4j", blurb: "Graph database for deeply connected, relationship-driven data." },
      { name: "ClickHouse", blurb: "Columnar database built for fast analytical queries." },
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
      { name: "Jenkins", blurb: "Self-hosted automation server for custom CI/CD pipelines." },
      { name: "Nginx", blurb: "Reverse proxy, load balancing, and static content serving." },
      { name: "Cloudflare", blurb: "Global CDN, DNS, and edge security in front of your app." },
      { name: "Prometheus & Grafana", blurb: "Metrics collection and real-time observability dashboards." },
      { name: "Ansible", blurb: "Agentless configuration management and provisioning." },
      { name: "Vercel / Netlify", blurb: "Edge-optimized hosting for modern frontend deployments." },
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
      { name: "Sketch", blurb: "Vector-based interface design for macOS-native workflows." },
      { name: "Framer (Design)", blurb: "High-fidelity, interactive prototypes that feel real." },
      { name: "Design Tokens", blurb: "Shared design values kept in sync across code and design." },
      { name: "Motion Design", blurb: "Purposeful animation that guides attention and feedback." },
      { name: "A/B Testing", blurb: "Validating design decisions against real user behavior." },
      { name: "Usability Heuristics", blurb: "Structured evaluation of interfaces against known UX principles." },
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
      { name: "Webflow", blurb: "Visual, production-grade website building and hosting." },
      { name: "BigCommerce", blurb: "Scalable, API-first e-commerce for growing catalogs." },
      { name: "Payload CMS", blurb: "Code-first, self-hosted headless CMS built on TypeScript." },
      { name: "Ghost", blurb: "Fast, focused publishing platform for content-led sites." },
      { name: "Magento (Adobe Commerce)", blurb: "Enterprise-grade e-commerce for complex catalogs." },
      { name: "Stripe Checkout Integration", blurb: "Secure, PCI-compliant payment flows built in." },
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
      { name: "Vitest", blurb: "Fast, Vite-native unit testing for modern frontends." },
      { name: "Testing Library", blurb: "Testing components the way users actually interact with them." },
      { name: "Appium", blurb: "Cross-platform automated testing for mobile apps." },
      { name: "k6", blurb: "Developer-friendly load and performance testing." },
      { name: "SonarQube", blurb: "Continuous code quality and security scanning." },
      { name: "Mocha / Chai", blurb: "Flexible test runner and assertion library for Node.js." },
    ],
  },
  {
    id: "ai-coding-tools",
    name: "AI Coding Tools",
    icon: SquareTerminal,
    description: "AI pair programmers and coding agents our engineers build alongside every day, used deliberately to move faster, not to skip review.",
    expertise: ["AI pair programming", "Agentic code generation", "Codebase-aware AI assistants"],
    items: [
      { name: "Cursor", blurb: "AI-native code editor built around pair-programming with an LLM." },
      { name: "GitHub Copilot", blurb: "AI pair programmer integrated directly into the editor." },
      { name: "OpenAI Codex", blurb: "AI coding agent for autonomous, task-level code changes." },
      { name: "Claude Code", blurb: "Agentic coding tool for terminal-based, multi-step development work." },
      { name: "Windsurf", blurb: "AI-native IDE built around agentic coding workflows." },
      { name: "Amazon Q Developer", blurb: "AWS's AI coding assistant, integrated across popular IDEs." },
      { name: "Tabnine", blurb: "AI code completion with enterprise privacy controls." },
      { name: "Replit Agent", blurb: "AI agent that builds and ships full apps inside Replit." },
      { name: "Sourcegraph Cody", blurb: "AI coding assistant with deep, codebase-aware context." },
      { name: "JetBrains AI Assistant", blurb: "AI coding help built directly into JetBrains IDEs." },
      { name: "Devin", blurb: "Autonomous AI software engineer for end-to-end coding tasks." },
      { name: "v0 by Vercel", blurb: "AI tool for generating UI components from a prompt." },
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
      { name: "Amazon Redshift", blurb: "Petabyte-scale data warehousing on AWS." },
      { name: "Databricks", blurb: "Unified platform for data engineering and ML at scale." },
      { name: "Fivetran", blurb: "Managed data pipelines from source systems to the warehouse." },
      { name: "Apache Flink", blurb: "Low-latency stream processing for real-time analytics." },
      { name: "Looker", blurb: "Governed BI and data modeling for consistent reporting." },
      { name: "Power BI", blurb: "Business intelligence dashboards for enterprise reporting." },
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
      { name: "UiPath", blurb: "Enterprise robotic process automation at scale." },
      { name: "Microsoft Power Automate", blurb: "Low-code automation across the Microsoft ecosystem." },
      { name: "Segment", blurb: "Unified customer data collection and routing." },
      { name: "Twilio", blurb: "Programmable SMS, voice, and messaging APIs." },
      { name: "SendGrid", blurb: "Reliable transactional and marketing email delivery." },
      { name: "Stripe API", blurb: "Programmatic payments, billing, and subscription logic." },
    ],
  },
  {
    id: "crm",
    name: "CRM Technologies",
    icon: HeartHandshake,
    description: "Customer relationship platforms that keep sales, marketing, and support working off the same data, configured and integrated, not just installed.",
    expertise: ["CRM implementation & migration", "Custom workflow automation", "Cross-system integrations"],
    items: [
      { name: "Salesforce", blurb: "The enterprise standard for sales, service, and marketing on one platform." },
      { name: "HubSpot CRM", blurb: "All-in-one CRM with strong inbound marketing and sales tooling." },
      { name: "Zoho CRM", blurb: "Affordable, feature-rich CRM for growing sales teams." },
      { name: "Microsoft Dynamics 365", blurb: "Deep CRM and ERP integration inside the Microsoft ecosystem." },
      { name: "Pipedrive", blurb: "Visual, pipeline-first CRM built for sales-led teams." },
      { name: "Freshsales (Freshworks CRM)", blurb: "AI-assisted lead scoring and sales pipeline management." },
      { name: "monday Sales CRM", blurb: "Customizable, no-code CRM built on a flexible work OS." },
      { name: "SugarCRM", blurb: "Self-hosted or cloud CRM with deep customization control." },
      { name: "Zendesk Sell", blurb: "Lightweight CRM paired tightly with Zendesk's support suite." },
      { name: "ActiveCampaign", blurb: "Marketing automation and CRM combined for lifecycle campaigns." },
      { name: "Salesforce Apex & Flow", blurb: "Custom logic and process automation built inside Salesforce." },
      { name: "CRM API Integrations", blurb: "Connecting your CRM to the rest of your stack, not leaving it siloed." },
    ],
  },
  {
    id: "no-code-low-code",
    name: "No-Code & Low-Code",
    icon: Blocks,
    description: "Visual builders and low-code platforms that get a working product in front of users fast, without giving up on real engineering once you outgrow them.",
    expertise: ["Rapid prototyping & MVPs", "Low-code to custom-code migration", "Internal tools & admin panels"],
    items: [
      { name: "Bubble", blurb: "Full-featured no-code platform for building web apps visually." },
      { name: "Airtable", blurb: "Spreadsheet-simple database with app-like views and automations." },
      { name: "Glide", blurb: "Turns a spreadsheet into a native-feel mobile app." },
      { name: "FlutterFlow", blurb: "Visual builder that generates real Flutter code, not a black box." },
      { name: "OutSystems", blurb: "Enterprise low-code platform for complex, governed applications." },
      { name: "Mendix", blurb: "Low-code platform built for large-scale enterprise app delivery." },
      { name: "Retool", blurb: "Low-code builder for fast, functional internal tools and admin panels." },
      { name: "SAP Build Apps (AppGyver)", blurb: "Low-code platform for cross-platform app development." },
      { name: "Adalo", blurb: "No-code builder for native mobile apps." },
      { name: "Microsoft Power Apps", blurb: "Low-code apps deeply integrated with the Microsoft ecosystem." },
      { name: "Xano", blurb: "No-code backend and API layer for no-code frontends." },
      { name: "Softr", blurb: "Turns Airtable or Google Sheets data into client-ready web apps." },
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
      { name: "Digital Twins", blurb: "Live virtual models of physical assets and processes." },
      { name: "Spatial Computing", blurb: "Interfaces that blend digital content into physical space." },
      { name: "MQTT", blurb: "Lightweight messaging protocol built for IoT devices." },
      { name: "Smart Contracts (Solidity)", blurb: "Self-executing logic deployed on blockchain networks." },
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
            heading="Eighteen categories, one deliberate stack."
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
        faqs={technologiesFaqs.map((f) => ({ question: brandify(f.question), answer: f.answer }))}
      />

      <DetailCTA
        heading="Have a stack in mind already?"
        description="Whether you know exactly what you want to build with, or need help deciding, let's talk through the options."
        ctaLabel="Get a Quote"
      />
    </div>
  );
}
