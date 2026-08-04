"use client";

import {
  Plane, Clock, Users, ShieldCheck, Headphones,
  Code2, Server, Database, Cloud, MapPinned, CalendarClock, CreditCard, Route,
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

export const travelFaqs: { question: string; answer: string }[] = [
  { question: "Can you integrate with our existing suppliers or GDS?", answer: "Yes, we regularly integrate with GDS, OTA, and direct-supplier APIs, aggregating pricing and availability into a single booking experience." },
  { question: "How do you handle cancellations and rebooking?", answer: "We build automated disruption workflows that detect cancellations or delays and offer rebooking or refund options immediately, reducing support load." },
  { question: "Can the platform handle seasonal traffic spikes?", answer: "Yes, we design booking infrastructure to auto-scale for holiday and flash-sale traffic, and load-test against simulated peak demand." },
  { question: "Do you support multi-currency and international payments?", answer: "Yes, our checkout flows are typically built to handle multi-currency pricing, localized payment methods, and region-specific cancellation policies." },
  { question: "Do you offer ongoing support after launch?", answer: "Yes, we offer SLA-backed support with extended coverage during peak travel periods and major disruption events." },
];

export default function TravelContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industries"
        categoryLabel="industries"
        title="Travel"
        subtitle="Booking flows that survive real-world chaos."
        description="We build booking engines, itinerary platforms, and travel management tools that stay reliable through fare changes, cancellations, and the messiness of real travel."
        icon={Plane}
        image="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Software that plans for the itinerary changing"
        paragraphs={[
          "Travel software has to work under conditions most industries never see: real-time pricing across dozens of suppliers, last-minute cancellations, and a customer expectation of instant rebooking when plans fall apart.",
          "We build booking engines, dynamic itinerary tools, and travel management platforms designed around supplier integration and disruption handling, not just a clean search-and-book happy path.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "5–9 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Reliability", value: "Multi-supplier Failover Ready", icon: ShieldCheck },
          { label: "Support", value: "24/7 Travel-day SLA", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Industry challenges"
        description="What makes travel software harder to get right than a typical booking app."
        items={[
          { title: "Multi-supplier Price Complexity", description: "Aggregating live pricing and availability across airlines, hotels, and operators is a constant integration challenge." },
          { title: "Last-minute Disruptions", description: "Cancellations, delays, and rebookings need to be handled instantly, not through a support queue." },
          { title: "Fragmented Itinerary Data", description: "Flights, hotels, and activities booked separately rarely come together into one coherent trip view." },
          { title: "Seasonal Traffic Spikes", description: "Booking platforms see massive, unpredictable surges around holidays and flash sales." },
          { title: "Payment & Currency Complexity", description: "Multi-currency pricing, deposits, and cancellation policies add real transaction complexity." },
          { title: "Trust in a High-cost Purchase", description: "Travelers hesitate on big-ticket bookings without clear pricing, policies, and support." },
        ]}
      />

      <ChecklistGrid
        id="solutions"
        tone="muted"
        title="Our solutions"
        description="How we design around the unpredictability that defines travel."
        items={[
          { title: "Unified Supplier Aggregation Layer", description: "A single integration layer that normalizes pricing and availability across multiple suppliers." },
          { title: "Automated Disruption Handling", description: "Rebooking and refund workflows triggered automatically when a cancellation or delay occurs." },
          { title: "Unified Itinerary View", description: "Flights, stays, and activities pulled into one connected trip timeline for the traveler." },
          { title: "Auto-scaling Booking Infrastructure", description: "Architecture built to absorb seasonal and flash-sale traffic without manual intervention." },
          { title: "Transparent Multi-currency Checkout", description: "Clear pricing, fees, and cancellation terms shown upfront, in the traveler's currency." },
          { title: "Proactive Traveler Communication", description: "Real-time status updates that build confidence before, during, and after the trip." },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Services we offer for Travel"
        description="The parts of our service catalog most relevant to travel and hospitality platforms."
        items={[
          { title: "Web App Development", description: "Booking engines and itinerary management platforms.", href: "/services/web-app-development" },
          { title: "Mobile App Development", description: "Trip companion apps with real-time status updates.", href: "/services/mobile-app-development" },
          { title: "AI/ML Solutions", description: "Dynamic pricing and personalized recommendation models.", href: "/services/ai-ml-solutions" },
          { title: "AI Agent", description: "Booking assistants and automated rebooking support.", href: "/services/ai-agent" },
          { title: "Prediction & Forecasting", description: "Demand forecasting for pricing and inventory planning.", href: "/services/prediction-and-forecasting" },
          { title: "AR/VR", description: "Immersive previews of destinations and accommodations.", href: "/services/ar-vr" },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        description="The stack we typically reach for on travel platforms."
        items={[
          { name: "React / Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "GDS / OTA Supplier APIs", category: "Inventory Aggregation", icon: Route },
          { name: "PostgreSQL / Redis", category: "Data & Caching", icon: Database },
          { name: "AWS / GCP / CDN", category: "Cloud Infrastructure", icon: Cloud },
          { name: "Payment Gateway APIs", category: "Multi-currency Payments", icon: CreditCard },
          { name: "Mapping & Geo APIs", category: "Location Services", icon: MapPinned },
          { name: "Scheduling & Calendar APIs", category: "Itinerary Management", icon: CalendarClock },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation opportunities"
        description="Where AI meaningfully improves booking, pricing, and traveler experience."
        items={[
          { title: "Dynamic Pricing Models", description: "Adjust pricing in real time based on demand, seasonality, and supplier availability." },
          { title: "Personalized Trip Recommendations", description: "Suggest destinations and add-ons based on a traveler's real preferences and history." },
          { title: "Automated Rebooking Assistants", description: "Handle cancellations and rebooking instantly, without a call center queue." },
          { title: "Demand Forecasting", description: "Predict booking volume by route and season to guide inventory and pricing strategy." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Business benefits"
            features={[
              { name: "Higher Booking Conversion", desc: "Transparent pricing and a smooth checkout turn more searches into completed bookings." },
              { name: "Fewer Support Escalations", desc: "Automated disruption handling resolves issues before they reach a support queue." },
              { name: "Stronger Traveler Trust", desc: "Clear communication and reliable rebooking keep travelers coming back for their next trip." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="features"
        tone="muted"
        title="Key features"
        items={[
          { title: "Multi-supplier Search & Booking", description: "Aggregated pricing and availability across airlines, hotels, and operators." },
          { title: "Unified Trip Itinerary", description: "One connected view of flights, stays, and activities per traveler." },
          { title: "Automated Disruption Alerts", description: "Real-time notifications and rebooking options when plans change." },
          { title: "Multi-currency, Transparent Checkout", description: "Clear pricing and cancellation terms shown upfront in the traveler's currency." },
        ]}
      />

      <CurriculumTimeline
        title="Our development process"
        description="How we take a travel platform from concept to a live, supplier-connected product."
        modules={[
          { title: "Discovery & Supplier Mapping", duration: "3–5 Days", topics: ["Stakeholder workshops", "Supplier/API audit", "Booking flow mapping", "Success metrics"] },
          { title: "UX & Architecture", duration: "1 Week", topics: ["Wireframes", "Aggregation architecture", "Payment flow design", "Data model"] },
          { title: "Core Platform Build", duration: "3–4 Weeks", topics: ["Search & booking engine", "Itinerary view", "Payment integration", "Admin tooling"] },
          { title: "AI & Personalization Layer", duration: "1–2 Weeks", topics: ["Dynamic pricing", "Recommendations", "Demand forecasting"] },
          { title: "Load Testing & Launch Prep", duration: "3–5 Days", topics: ["Peak-season simulation", "Failover testing", "Security review"] },
          { title: "Launch & Iteration", duration: "Ongoing", topics: ["Phased rollout", "Support playbooks", "Conversion monitoring", "Continuous optimization"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of travel products we build across OTAs, tour operators, and corporate travel."
        projects={[
          { title: "Multi-supplier Booking Engine", description: "A search and booking platform aggregating live pricing across airlines, hotels, and activity operators.", skills: ["APIs", "Aggregation", "Payments"] },
          { title: "Trip Companion App", description: "A mobile app giving travelers a unified itinerary with real-time disruption alerts and rebooking.", skills: ["Mobile", "Notifications", "Real-time"] },
          { title: "Corporate Travel Management Platform", description: "A booking and expense platform for enterprise travel programs with policy enforcement built in.", skills: ["B2B", "Policy Engine", "Reporting"] },
        ]}
      />

      <CaseStudyShowcase
        title="Success stories"
        description="Two examples of the kind of outcomes our travel platforms drive."
        caseStudies={[
          {
            segment: "Online Travel Agency",
            title: "Lifting booking conversion for a multi-supplier OTA",
            challenge: "An OTA's fragmented, multi-step checkout was losing travelers to competitors with clearer, faster booking flows.",
            solution: "We rebuilt search-to-checkout as a streamlined flow with transparent pricing and a unified itinerary view.",
            metric: "+31%",
            metricLabel: "Increase in booking conversion rate",
          },
          {
            segment: "Tour Operator",
            title: "Cutting support load during peak disruption events",
            challenge: "A tour operator's support team was overwhelmed by manual rebooking requests during a major weather disruption event.",
            solution: "We deployed automated disruption handling that offered instant rebooking options directly to affected travelers.",
            metric: "-58%",
            metricLabel: "Reduction in disruption-related support tickets",
          },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit for Travel"
            features={[
              { name: "Supplier Integration Depth", desc: "We've built against GDS, OTA, and direct-supplier APIs, not just a single booking source." },
              { name: "Built for Disruption", desc: "Our architecture assumes cancellations and last-minute changes are normal, not exceptions." },
              { name: "Conversion-focused UX", desc: "We treat trust and transparency in checkout as core to conversion, not a legal afterthought." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={travelFaqs}
      />

      <DetailCTA
        heading="Ready to build a booking experience travelers trust?"
        description="Let's talk about your suppliers, your travelers, and how we can help you convert more searches into booked trips."
        ctaLabel="Get a Free Consultation"
      />
    </div>
  );
}
