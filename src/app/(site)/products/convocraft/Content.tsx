"use client";

import {
  MessageSquare, Users2, Cloud, Sparkles,
  Code2, Server, Smartphone, Database, BrainCircuit, Package, Lock,
  Phone, Workflow, Bell,
  UserCog, FolderSearch, Activity,
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

export default function ConvoCraftContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="products"
        categoryLabel="products"
        title="ConvoCraft"
        subtitle="The next-generation conversational AI platform."
        description="Build, deploy, and manage highly intelligent chatbots and voice assistants without writing a single line of code. ConvoCraft makes AI accessible to everyone."
        icon={MessageSquare}
        image="https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=1200&auto=format&fit=crop"
      />

      <div className="py-8 bg-background border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap gap-2">
          {["No-Code Builder", "NLU Engine", "Multi-Channel", "Voice + Chat"].map((tag) => (
            <span key={tag} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <CourseOverview
        title="Conversations your customers actually enjoy, built without a dev team"
        paragraphs={[
          "ConvoCraft is a no-code platform for building chatbots and voice assistants that businesses can design, launch, and iterate on themselves — support and marketing teams shouldn't need an engineering sprint to update a greeting message.",
          "It's built for support, sales, and success teams handling high volumes of repetitive conversations across web chat, WhatsApp, and voice, who need to automate the predictable questions without losing the ability to hand off to a human when it matters.",
        ]}
        stats={[
          { label: "Built For", value: "Support & Sales Teams", icon: Users2 },
          { label: "Primary Use Case", value: "Customer Engagement", icon: MessageSquare },
          { label: "Deployment", value: "Cloud & On-Premise", icon: Cloud },
          { label: "Category", value: "Conversational AI Platform", icon: Sparkles },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        description="What makes ConvoCraft usable by non-technical teams from day one."
        items={[
          { title: "Visual Flow Builder", description: "Design conversation logic by dragging and connecting nodes — no engineering team required to launch or update a flow." },
          { title: "Multi-Channel Deployment", description: "Publish the same bot to web chat, WhatsApp, and voice channels from a single flow, cutting channel-specific rework." },
          { title: "Built-in NLU Training", description: "Train intent recognition directly in the platform, so accuracy improves without a data science hire." },
          { title: "Live Handoff to Humans", description: "Route complex conversations to a human agent mid-session, keeping the customer experience seamless." },
          { title: "Analytics Dashboard", description: "See containment rate, drop-off points, and top intents at a glance, so teams know exactly what to improve." },
          { title: "Version History & Rollback", description: "Safely test changes and roll back instantly if a new flow underperforms." },
        ]}
      />

      <ChecklistGrid
        id="modules"
        tone="muted"
        title="Core modules"
        items={[
          { title: "Flow Builder", description: "The visual canvas where conversation logic, branching, and fallback paths are designed." },
          { title: "Intent Library", description: "A reusable library of trained intents and entities shared across every bot in your workspace." },
          { title: "Channel Manager", description: "Connect and configure each deployment channel — web widget, WhatsApp, voice — independently." },
          { title: "Analytics & Reporting", description: "Conversation-level and aggregate reporting on performance and user satisfaction." },
          { title: "Live Agent Handoff", description: "Queue management and context handoff for escalations to human support." },
          { title: "Settings & Permissions", description: "Workspace-level roles, API keys, and integration credentials." },
        ]}
      />

      <CurriculumTimeline
        title="Product workflow"
        description="How a team goes from signing up to running ConvoCraft at scale."
        modules={[
          { title: "Sign Up", duration: "Step 1", topics: ["Create your workspace", "Invite team members"] },
          { title: "Setup", duration: "Step 2", topics: ["Connect a channel", "Import or create your first flow"] },
          { title: "Configure", duration: "Step 3", topics: ["Train intents & entities", "Set fallback & handoff rules"] },
          { title: "Use Features", duration: "Step 4", topics: ["Publish the bot live", "Monitor conversations in real time"] },
          { title: "Generate Reports", duration: "Step 5", topics: ["Review containment & satisfaction metrics"] },
          { title: "Monitor Progress", duration: "Step 6", topics: ["Track drop-off points", "Iterate on underperforming flows"] },
          { title: "Scale Operations", duration: "Step 7", topics: ["Add new channels", "Expand to new languages and teams"] },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        items={[
          { name: "React", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "React Native", category: "Mobile", icon: Smartphone },
          { name: "PostgreSQL", category: "Database", icon: Database },
          { name: "NLU Models", category: "AI/ML", icon: BrainCircuit },
          { name: "AWS", category: "Cloud", icon: Cloud },
          { name: "Docker", category: "DevOps", icon: Package },
          { name: "OAuth2", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-capabilities"
        tone="muted"
        title="AI capabilities"
        items={[
          { title: "Conversational AI", description: "Natural language understanding powers every conversation flow, not just keyword matching." },
          { title: "Intelligent Search", description: "Bots can search your knowledge base semantically to answer open-ended questions." },
          { title: "Automation", description: "Trigger downstream workflows, like tickets or CRM updates, automatically based on conversation outcomes." },
          { title: "RAG Integration", description: "Ground bot responses in your own documentation to reduce hallucinated answers." },
        ]}
      />

      <TechStackGrid
        title="Integrations"
        description="Connect ConvoCraft to the tools your team already uses."
        items={[
          { name: "WhatsApp Business API", category: "Messaging", icon: MessageSquare },
          { name: "Twilio", category: "Voice & SMS", icon: Phone },
          { name: "Zapier", category: "Workflow Automation", icon: Workflow },
          { name: "REST APIs", category: "Custom Integration", icon: Server },
          { name: "Slack", category: "Team Notifications", icon: Bell },
          { name: "OpenAI", category: "LLM Provider", icon: Sparkles },
          { name: "Google Calendar", category: "Scheduling", icon: Cloud },
          { name: "Salesforce", category: "CRM Sync", icon: Users2 },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits"
            features={[
              { name: "Faster Customer Response", desc: "Instant answers around the clock reduce wait times and support backlog." },
              { name: "Lower Support Costs", desc: "Automating common questions frees agents to focus on complex, high-value conversations." },
              { name: "Better Customer Experience", desc: "Consistent, on-brand responses across every channel your customers use." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="industries"
        tone="muted"
        title="Industries using ConvoCraft"
        columns={3}
        items={[
          { title: "Education", description: "Automate admissions FAQs and student support inquiries.", href: "/industries/education" },
          { title: "Finance", description: "Handle account questions and transaction status securely at scale.", href: "/industries/finance" },
          { title: "Real Estate", description: "Qualify property inquiries and schedule viewings automatically.", href: "/industries/real-estate" },
        ]}
      />

      <ProductGallery
        title="Product gallery"
        description="A closer look at the ConvoCraft workspace."
        images={[
          { src: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=800&auto=format&fit=crop", caption: "Flow Builder Canvas" },
          { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop", caption: "Analytics Dashboard" },
          { src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop", caption: "Mobile Chat View" },
        ]}
      />

      <CaseStudyShowcase
        tone="muted"
        title="Case study"
        caseStudies={[
          {
            segment: "Retail Support",
            title: "Cutting first-response time for an online retailer's support team",
            challenge: "A growing e-commerce brand's support inbox was overwhelmed with repetitive order-status and return questions, pushing first-response time past six hours.",
            solution: "We deployed a ConvoCraft bot trained on their order and returns policies, handling common questions instantly and escalating only edge cases to human agents.",
            metric: "-83%",
            metricLabel: "First-response time",
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          { question: "Do I need coding experience to build a bot?", answer: "No, ConvoCraft's visual flow builder is designed for non-technical teams — most bots are built and launched without any code." },
          { question: "Which channels does ConvoCraft support?", answer: "Web chat, WhatsApp, and voice are supported out of the box, with more channels added regularly." },
          { question: "Can it hand off to a human agent?", answer: "Yes, live handoff with full conversation context is built in, so agents don't have to ask customers to repeat themselves." },
          { question: "How does ConvoCraft handle multiple languages?", answer: "Intents and flows can be trained and published in multiple languages within the same workspace." },
          { question: "Is my conversation data secure?", answer: "Yes, data is encrypted in transit and at rest, with workspace-level access controls for your team." },
        ]}
      />

      <RelatedServices
        tone="muted"
        title="Related products"
        services={[
          { title: "AI HR Assistant", description: "Automate candidate screening and onboarding conversations.", href: "/products/ai-hr-assistant", icon: UserCog },
          { title: "AI Powered Smart DMS", description: "Pair conversational AI with intelligent document search.", href: "/products/ai-powered-smart-dms", icon: FolderSearch },
          { title: "DataPulse AI", description: "Turn conversation data into real-time business insights.", href: "/products/datapulse-ai", icon: Activity },
        ]}
      />

      <DetailCTA
        heading="Ready to launch your own AI conversation?"
        description="See ConvoCraft in action and find out how fast your team can go live."
        ctaLabel="Request a Demo"
      />
    </div>
  );
}
