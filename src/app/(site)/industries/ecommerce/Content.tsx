"use client";

import {
  ShoppingCart, Clock, Users, ShieldCheck, Headphones,
  Code2, Server, Database, Cloud, CreditCard, PackageSearch, Boxes, Search,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import CaseStudyShowcase from "@/components/sections/CaseStudyShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";

export default function EcommerceContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industries"
        categoryLabel="industries"
        title="Ecommerce"
        subtitle="Storefronts built to convert, not just load."
        description="We build high-performance storefronts, headless commerce platforms, and checkout flows engineered to turn traffic into revenue at every stage of the funnel."
        icon={ShoppingCart}
        image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Software that treats conversion as an engineering problem"
        paragraphs={[
          "Every extra second of load time and every extra step in checkout costs revenue. Ecommerce is one of the few product categories where you can draw a straight line from engineering decisions to the bottom line.",
          "We build storefronts, headless commerce backends, and checkout systems designed around speed, mobile conversion, and peak-traffic reliability — not just a product catalog with a cart bolted on.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "4–8 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Compliance", value: "PCI-DSS Checkout Ready", icon: ShieldCheck },
          { label: "Support", value: "Peak-season SLA Coverage", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Industry challenges"
        description="What slows ecommerce teams down once traffic and catalog size grow past the early stage."
        items={[
          { title: "Cart Abandonment", description: "Slow or confusing checkout flows push a large share of ready-to-buy shoppers away at the last step." },
          { title: "Peak-traffic Instability", description: "Sales events and seasonal spikes routinely crash infrastructure sized only for average-day traffic." },
          { title: "Fragmented Inventory Data", description: "Stock levels drift out of sync across storefront, warehouse, and marketplace channels." },
          { title: "Slow Page Performance", description: "Every extra second of load time measurably reduces conversion and search ranking." },
          { title: "Rigid Platform Limitations", description: "Off-the-shelf platforms often can't support custom pricing, bundling, or catalog logic without hacks." },
          { title: "Fraud & Chargebacks", description: "Payment fraud and disputed transactions quietly erode margin on every order." },
        ]}
      />

      <ChecklistGrid
        id="solutions"
        tone="muted"
        title="Our solutions"
        description="How we design around the constraints that make ecommerce different."
        items={[
          { title: "One-page, Low-friction Checkout", description: "Streamlined checkout flows with saved payment methods and guest options that cut abandonment." },
          { title: "Auto-scaling Commerce Infrastructure", description: "Architecture built to absorb Black Friday-level traffic without manual intervention." },
          { title: "Unified Inventory Layer", description: "Real-time stock sync across storefront, warehouse, and marketplace channels." },
          { title: "Performance-first Frontend Engineering", description: "Sub-second page loads through aggressive caching, image optimization, and edge rendering." },
          { title: "Headless, Composable Commerce", description: "Decoupled architecture that lets you customize pricing, promotions, and catalog logic freely." },
          { title: "Real-time Fraud Screening", description: "Transaction-level risk scoring that blocks fraud without adding checkout friction." },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Services we offer for Ecommerce"
        description="The parts of our service catalog most relevant to commerce platforms."
        items={[
          { title: "Web App Development", description: "High-performance storefronts and headless commerce frontends.", href: "/services/web-app-development" },
          { title: "Mobile App Development", description: "Native shopping apps with push-driven re-engagement.", href: "/services/mobile-app-development" },
          { title: "AI/ML Solutions", description: "Personalized recommendations and dynamic pricing models.", href: "/services/ai-ml-solutions" },
          { title: "AI Agent", description: "Shopping assistants and automated customer support.", href: "/services/ai-agent" },
          { title: "Prediction & Forecasting", description: "Demand forecasting and inventory planning.", href: "/services/prediction-and-forecasting" },
          { title: "Vision Intelligence", description: "Visual search and automated product tagging.", href: "/services/vision-intelligence" },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        description="The stack we typically reach for on ecommerce platforms."
        items={[
          { name: "React / Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "Headless Commerce APIs", category: "Commerce Layer", icon: Boxes },
          { name: "PostgreSQL / Redis", category: "Data & Caching", icon: Database },
          { name: "AWS / GCP / CDN", category: "Cloud Infrastructure", icon: Cloud },
          { name: "Payment Gateway APIs", category: "Payments", icon: CreditCard },
          { name: "Elasticsearch / Algolia", category: "Product Search", icon: Search },
          { name: "Inventory & OMS APIs", category: "Fulfillment", icon: PackageSearch },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation opportunities"
        description="Where AI meaningfully lifts conversion and reduces operational overhead."
        items={[
          { title: "Personalized Product Recommendations", description: "Surface the products each shopper is most likely to buy, based on real behavior." },
          { title: "Dynamic Pricing & Promotions", description: "Adjust pricing and offers in real time based on demand, inventory, and competitor signals." },
          { title: "Visual Search", description: "Let shoppers search with a photo instead of guessing the right keywords." },
          { title: "Automated Support & Returns", description: "AI agents that handle order status, returns, and common questions instantly." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Business benefits"
            features={[
              { name: "Higher Conversion Rates", desc: "Faster pages and simpler checkout turn more visits into completed orders." },
              { name: "Resilient Peak-season Performance", desc: "Auto-scaling infrastructure protects revenue during your highest-traffic days." },
              { name: "Lower Cart Abandonment", desc: "Streamlined flows and transparent pricing keep shoppers moving toward checkout." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="features"
        tone="muted"
        title="Key features"
        items={[
          { title: "One-page Checkout", description: "Guest checkout, saved payment methods, and minimal form friction." },
          { title: "Real-time Inventory Sync", description: "Stock levels stay consistent across storefront, warehouse, and marketplaces." },
          { title: "Personalized Storefronts", description: "Dynamic homepage and product recommendations tailored per shopper." },
          { title: "Order & Fulfillment Dashboard", description: "A single view for order status, shipping, and returns across channels." },
        ]}
      />

      <CurriculumTimeline
        title="Our development process"
        description="How we take a commerce platform from concept to a scaling, revenue-generating product."
        modules={[
          { title: "Discovery & Funnel Audit", duration: "3–5 Days", topics: ["Stakeholder workshops", "Conversion funnel audit", "Catalog & pricing model", "Success metrics"] },
          { title: "UX & Architecture", duration: "1 Week", topics: ["Wireframes", "Headless architecture", "Checkout flow design", "Performance budget"] },
          { title: "Core Platform Build", duration: "2–4 Weeks", topics: ["Storefront", "Checkout & payments", "Inventory sync", "Admin tooling"] },
          { title: "Personalization & AI Layer", duration: "1–2 Weeks", topics: ["Recommendation engine", "Search & discovery", "Fraud screening"] },
          { title: "Load Testing & Launch Prep", duration: "3–5 Days", topics: ["Peak-traffic simulation", "Performance tuning", "Security review", "Payment testing"] },
          { title: "Launch & Iteration", duration: "Ongoing", topics: ["Phased rollout", "A/B testing", "Conversion monitoring", "Continuous optimization"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of commerce products we build across D2C, marketplace, and B2B."
        projects={[
          { title: "Headless D2C Storefront", description: "A composable storefront decoupled from the backend, enabling rapid campaign and catalog changes.", skills: ["Headless", "Performance", "CMS"] },
          { title: "Multi-vendor Marketplace", description: "A marketplace platform with vendor onboarding, commission handling, and unified order management.", skills: ["Marketplace", "Payments", "Multi-tenant"] },
          { title: "B2B Ordering Portal", description: "A wholesale ordering platform with custom pricing tiers, bulk ordering, and account-based catalogs.", skills: ["B2B", "Pricing Logic", "Integrations"] },
        ]}
      />

      <CaseStudyShowcase
        title="Success stories"
        description="Two examples of the kind of outcomes our commerce platforms drive."
        caseStudies={[
          {
            segment: "D2C Retail",
            title: "Cutting checkout abandonment for a fast-growing D2C brand",
            challenge: "A D2C retailer's multi-step checkout was losing over 70% of carts, with mobile shoppers dropping off at the highest rate.",
            solution: "We rebuilt checkout as a single streamlined page with saved payment methods and a mobile-first layout.",
            metric: "-29%",
            metricLabel: "Reduction in cart abandonment",
          },
          {
            segment: "Marketplace",
            title: "Surviving a 20x traffic spike during a flash sale",
            challenge: "A marketplace platform's infrastructure crashed during a major promotional event, causing hours of downtime and lost sales.",
            solution: "We re-architected their commerce backend with auto-scaling infrastructure and load-tested it against simulated peak traffic.",
            metric: "99.98%",
            metricLabel: "Uptime during the following flash sale",
          },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit for Ecommerce"
            features={[
              { name: "Conversion-focused Engineering", desc: "We treat page speed and checkout friction as revenue metrics, not just technical ones." },
              { name: "Built for Peak Traffic", desc: "Our architecture choices assume sales-event spikes, not steady-state browsing." },
              { name: "Composable, Not Locked-in", desc: "Headless architecture keeps you free to swap tools instead of being boxed into one platform." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={[
          { question: "Can you migrate us from our current commerce platform?", answer: "Yes, we regularly migrate stores from platforms like Shopify, Magento, and WooCommerce to custom or headless architectures without disrupting live sales." },
          { question: "How do you handle payment security and PCI compliance?", answer: "We minimize direct handling of card data through tokenization and PCI-compliant payment processors, and design checkout flows with PCI-DSS requirements in mind." },
          { question: "Can the platform handle a major traffic spike, like a flash sale?", answer: "Yes, we load-test against simulated peak traffic and build on auto-scaling infrastructure specifically to hold up during sales events." },
          { question: "Do you integrate with our existing inventory or ERP system?", answer: "Yes, we build integration layers that sync with most common inventory, ERP, and fulfillment systems rather than requiring a full replacement." },
          { question: "Do you offer ongoing support after launch?", answer: "Yes, we offer SLA-backed support plans, including extended coverage around major sales events and peak seasons." },
        ]}
      />

      <DetailCTA
        heading="Ready to turn more traffic into revenue?"
        description="Let's talk about your funnel, your catalog, and how we can help you convert more of the traffic you already have."
        ctaLabel="Get a Free Consultation"
      />
    </div>
  );
}
