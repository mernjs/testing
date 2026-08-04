"use client";

import {
  Hotel, Clock, Users, ShieldCheck, Headphones,
  Code2, Server, Database, Cloud, BedDouble, ConciergeBell, CreditCard, CalendarClock,
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

export const hotelsFaqs: { question: string; answer: string }[] = [
  { question: "Can you integrate with our existing PMS or channel manager?", answer: "Yes, we build integration layers that connect to most common PMS and channel manager systems, so you don't need a full replacement to modernize." },
  { question: "How do you prevent overbooking across channels?", answer: "We build a centralized inventory engine that syncs availability in real time across every connected channel, removing the lag that causes double bookings." },
  { question: "Can guests check in and access their room without the front desk?", answer: "Yes, mobile check-in and digital key integration are common additions we build into guest experience apps." },
  { question: "Can the platform support multiple properties under one group?", answer: "Yes, we build multi-property architectures with consolidated reporting from the start for hotel groups and portfolios." },
  { question: "Do you offer ongoing support after launch?", answer: "Yes, we offer SLA-backed support with front-desk-hours coverage and continue refining the platform based on real booking data." },
];

export default function HotelsContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industries"
        categoryLabel="industries"
        title="Hotels"
        subtitle="Guest experience, from booking to checkout."
        description="We build reservation systems, property management platforms, and guest experience apps that keep every room, rate, and request in sync across every channel."
        icon={Hotel}
        image="https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Software that treats every guest touchpoint as one system"
        paragraphs={[
          "Hospitality software has to keep dozens of channels in sync at once: direct bookings, OTAs, front desk, housekeeping, and guest requests, all touching the same inventory in real time.",
          "We build reservation engines, property management systems, and guest experience apps that unify these channels into one connected view, so overbooking, mismatched rates, and slow service stop being the cost of doing business.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "5–9 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Reliability", value: "Multi-channel Rate Sync", icon: ShieldCheck },
          { label: "Support", value: "24/7 Front-desk SLA", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Industry challenges"
        description="What slows hotel groups down once they manage more than a single property."
        items={[
          { title: "Channel & Rate Fragmentation", description: "Direct bookings, OTAs, and travel agents often show inconsistent rates and availability." },
          { title: "Overbooking Risk", description: "Poorly synced inventory across channels leads to double-booked rooms and guest frustration." },
          { title: "Disconnected Front & Back Office", description: "Front desk, housekeeping, and management often work from different, outdated information." },
          { title: "Slow Guest Request Fulfillment", description: "Requests routed through phone calls and radios add delay and inconsistency to guest service." },
          { title: "Limited Personalization", description: "Most systems don't retain guest preferences across stays, so every visit starts from zero." },
          { title: "Multi-property Reporting Gaps", description: "Groups managing several properties struggle to get a consistent, real-time performance view." },
        ]}
      />

      <ChecklistGrid
        id="solutions"
        tone="muted"
        title="Our solutions"
        description="How we turn fragmented hotel operations into one connected system."
        items={[
          { title: "Unified Channel Manager", description: "Real-time rate and availability sync across direct, OTA, and agent booking channels." },
          { title: "Centralized Inventory Engine", description: "One source of truth for room availability that eliminates overbooking across channels." },
          { title: "Connected Property Management System", description: "Front desk, housekeeping, and management working from the same live data." },
          { title: "Digital Guest Request Routing", description: "Requests routed instantly to the right staff member, with status tracking built in." },
          { title: "Guest Profile & Preference Engine", description: "Preferences and history retained across stays for a personalized experience every time." },
          { title: "Multi-property Performance Dashboard", description: "Consistent, real-time reporting across every property in a portfolio." },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Services we offer for Hotels"
        description="The parts of our service catalog most relevant to hospitality platforms."
        items={[
          { title: "Web App Development", description: "Reservation engines and property management dashboards.", href: "/services/web-app-development" },
          { title: "Mobile App Development", description: "Guest apps for mobile check-in, requests, and digital keys.", href: "/services/mobile-app-development" },
          { title: "AI/ML Solutions", description: "Dynamic rate optimization and demand prediction models.", href: "/services/ai-ml-solutions" },
          { title: "AI Agent", description: "Guest service chatbots and automated concierge assistants.", href: "/services/ai-agent" },
          { title: "Prediction & Forecasting", description: "Occupancy and revenue forecasting by season and event.", href: "/services/prediction-and-forecasting" },
          { title: "AR/VR", description: "Virtual property tours and room previews for direct bookings.", href: "/services/ar-vr" },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        description="The stack we typically reach for on hotel and hospitality platforms."
        items={[
          { name: "React / Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "Channel Manager / OTA APIs", category: "Distribution", icon: ConciergeBell },
          { name: "PostgreSQL / Redis", category: "Data & Caching", icon: Database },
          { name: "AWS / GCP", category: "Cloud Infrastructure", icon: Cloud },
          { name: "Payment Gateway APIs", category: "Payments & Deposits", icon: CreditCard },
          { name: "PMS Integration Layer", category: "Property Management", icon: BedDouble },
          { name: "Booking & Scheduling APIs", category: "Reservations", icon: CalendarClock },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation opportunities"
        description="Where AI creates the most leverage across bookings, pricing, and guest service."
        items={[
          { title: "Dynamic Rate Optimization", description: "Adjust room rates in real time based on demand, seasonality, and local events." },
          { title: "Occupancy Forecasting", description: "Predict demand by property and date range to guide staffing and pricing decisions." },
          { title: "AI Concierge & Guest Support", description: "Handle common guest questions and requests instantly, any time of day." },
          { title: "Personalized Guest Offers", description: "Recommend upgrades and add-ons based on a guest's stay history and preferences." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Business benefits"
            features={[
              { name: "Higher Direct Bookings", desc: "A fast, trustworthy booking experience shifts revenue away from costly OTA commissions." },
              { name: "Fewer Overbooking Incidents", desc: "Real-time inventory sync removes the guesswork from managing rooms across channels." },
              { name: "Stronger Guest Loyalty", desc: "Personalized service and faster request handling turn one-time guests into repeat bookings." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="features"
        tone="muted"
        title="Key features"
        items={[
          { title: "Real-time Channel Sync", description: "Rates and availability updated instantly across every booking channel." },
          { title: "Mobile Check-in & Digital Keys", description: "A frictionless arrival experience guests increasingly expect." },
          { title: "Guest Request Dashboard", description: "Requests routed and tracked from submission through fulfillment." },
          { title: "Multi-property Reporting", description: "Consistent performance data across every property in a portfolio." },
        ]}
      />

      <CurriculumTimeline
        title="Our development process"
        description="How we take a hospitality platform from concept to a live, guest-ready product."
        modules={[
          { title: "Discovery & Operations Audit", duration: "3–5 Days", topics: ["Stakeholder workshops", "Channel & PMS audit", "Guest journey mapping", "Success metrics"] },
          { title: "UX & Architecture", duration: "1 Week", topics: ["Wireframes", "Channel manager architecture", "PMS integration planning", "Data model"] },
          { title: "Core Platform Build", duration: "3–4 Weeks", topics: ["Reservation engine", "PMS dashboard", "Guest app", "Payment integration"] },
          { title: "AI & Personalization Layer", duration: "1–2 Weeks", topics: ["Rate optimization", "Occupancy forecasting", "Guest preference engine"] },
          { title: "Testing & Launch Prep", duration: "3–5 Days", topics: ["Peak-season simulation", "Overbooking stress tests", "Staff usability review"] },
          { title: "Launch & Iteration", duration: "Ongoing", topics: ["Phased rollout", "Staff onboarding", "Booking monitoring", "Continuous improvement"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of hospitality products we build across independent hotels, boutique groups, and multi-property portfolios."
        projects={[
          { title: "Direct Booking Engine", description: "A commission-free reservation platform designed to shift bookings away from OTAs.", skills: ["Booking", "Payments", "Conversion"] },
          { title: "Property Management System", description: "A connected front-desk, housekeeping, and inventory platform for a multi-property group.", skills: ["PMS", "Real-time Sync", "Reporting"] },
          { title: "Guest Experience App", description: "A mobile app for check-in, digital keys, and service requests across a hotel portfolio.", skills: ["Mobile", "Personalization", "Notifications"] },
        ]}
      />

      <CaseStudyShowcase
        title="Success stories"
        description="Two examples of the kind of outcomes our hospitality platforms drive."
        caseStudies={[
          {
            segment: "Boutique Hotel Group",
            title: "Shifting bookings away from OTA commissions",
            challenge: "A boutique hotel group relied on OTAs for the majority of bookings, paying significant commission on revenue they could have captured directly.",
            solution: "We built a fast, trustworthy direct booking engine with rate parity guarantees and a streamlined checkout.",
            metric: "+38%",
            metricLabel: "Increase in direct booking share",
          },
          {
            segment: "Multi-property Portfolio",
            title: "Eliminating overbooking across a 9-property portfolio",
            challenge: "A hotel portfolio's disconnected channel management led to frequent overbooking incidents and guest walk-offs during peak season.",
            solution: "We deployed a centralized inventory engine with real-time sync across every booking channel and property.",
            metric: "-93%",
            metricLabel: "Reduction in overbooking incidents",
          },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit for Hotels"
            features={[
              { name: "Hospitality Operations Fluency", desc: "We understand channel management, PMS workflows, and guest service, not just generic booking apps." },
              { name: "Built for Multi-property Scale", desc: "Our architecture is designed for portfolios, not just a single property from day one." },
              { name: "Guest Experience Focused", desc: "We treat guest personalization and service speed as core product features, not add-ons." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={hotelsFaqs}
      />

      <DetailCTA
        heading="Ready to unify booking, front desk, and guest service?"
        description="Let's talk about your properties, your guests, and how we can help you run every channel from one system."
        ctaLabel="Get a Free Consultation"
      />
    </div>
  );
}
