"use client";

import {
  Tractor, Clock, Users, ShieldCheck, Headphones,
  Code2, Server, Database, Cloud, Satellite, CloudRain, Sprout, Wifi,
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
import { agricultureFaqs } from "./faqs";

export default function AgricultureContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industries"
        categoryLabel="industries"
        title="Agriculture"
        subtitle="Precision farming, powered by data."
        description="We build farm management platforms, IoT sensor networks, and yield-prediction tools that turn field data into decisions farmers can act on before it's too late."
        icon={Tractor}
        image="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Software built for fields, not just dashboards"
        paragraphs={[
          "Agriculture technology lives or dies in conditions most software never has to handle: patchy connectivity, harsh weather, and decisions that can't wait for a support ticket to be answered.",
          "We build farm management platforms, IoT sensor integrations, and predictive models that turn soil, weather, and equipment data into decisions farmers can act on in the field, not just a dashboard back at the office.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "5–9 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Reliability", value: "Offline-first Field Access", icon: ShieldCheck },
          { label: "Support", value: "Seasonal Priority SLA", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Industry challenges"
        description="What makes agriculture software genuinely harder to build than most product categories."
        items={[
          { title: "Unreliable Field Connectivity", description: "Rural and remote fields often have limited or no internet, breaking apps built assuming constant connectivity." },
          { title: "Fragmented Farm Data", description: "Soil sensors, equipment telemetry, and weather data usually live in disconnected, incompatible systems." },
          { title: "Unpredictable Weather Risk", description: "Yield and resource decisions must account for weather volatility that's hard to model accurately." },
          { title: "Equipment & IoT Integration", description: "Connecting modern software to a wide range of legacy farm equipment and sensor hardware is a constant challenge." },
          { title: "Resource Waste", description: "Over- or under-application of water, fertilizer, and pesticide directly erodes both yield and margin." },
          { title: "Low Digital Adoption in the Field", description: "Tools that don't work with gloves on, in bright sun, or offline simply don't get used." },
        ]}
      />

      <ChecklistGrid
        id="solutions"
        tone="muted"
        title="Our solutions"
        description="How we design around the realities of working software in the field."
        items={[
          { title: "Offline-first Mobile Architecture", description: "Apps that keep working in the field and sync automatically once connectivity returns." },
          { title: "Unified Farm Data Platform", description: "Sensor, equipment, and weather data combined into one consistent source of truth." },
          { title: "Weather-integrated Risk Models", description: "Forecasting that factors in real-time weather data alongside historical yield patterns." },
          { title: "IoT & Equipment Integration Layer", description: "Middleware that connects to a broad range of sensor and equipment telemetry standards." },
          { title: "Precision Resource Recommendations", description: "Data-driven guidance on irrigation, fertilizer, and pesticide application, field by field." },
          { title: "Rugged, Field-tested UX", description: "Interfaces designed for gloved hands, bright sunlight, and unreliable signal." },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Services we offer for Agriculture"
        description="The parts of our service catalog most relevant to agriculture and agtech platforms."
        items={[
          { title: "Web App Development", description: "Farm management dashboards and cooperative reporting tools.", href: "/services/web-app-development" },
          { title: "Mobile App Development", description: "Offline-first field apps for scouting and equipment data.", href: "/services/mobile-app-development" },
          { title: "AI/ML Solutions", description: "Yield prediction and crop health scoring models.", href: "/services/ai-ml-solutions" },
          { title: "Vision Intelligence", description: "Drone and satellite imagery analysis for crop monitoring.", href: "/services/vision-intelligence" },
          { title: "Prediction & Forecasting", description: "Weather-adjusted yield and resource demand forecasting.", href: "/services/prediction-and-forecasting" },
          { title: "AI Agent", description: "Field advisory assistants for irrigation and treatment timing.", href: "/services/ai-agent" },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        description="The stack we typically reach for on agriculture platforms."
        items={[
          { name: "React / Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js / Python", category: "Backend", icon: Server },
          { name: "IoT Sensor Protocols", category: "Field Data", icon: Wifi },
          { name: "PostgreSQL / TimescaleDB", category: "Time-series Data", icon: Database },
          { name: "AWS / GCP", category: "Cloud Infrastructure", icon: Cloud },
          { name: "Satellite / Drone Imagery APIs", category: "Remote Sensing", icon: Satellite },
          { name: "Weather Data APIs", category: "Climate Data", icon: CloudRain },
          { name: "Offline-sync Mobile Frameworks", category: "Field Apps", icon: Sprout },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation opportunities"
        description="Where AI creates the most leverage across planting, growing, and harvest decisions."
        items={[
          { title: "Yield Prediction Models", description: "Forecast harvest volumes using historical yield, soil, and weather data together." },
          { title: "Crop Health Monitoring", description: "Detect disease and stress early from drone or satellite imagery, before it spreads." },
          { title: "Irrigation & Fertilizer Optimization", description: "Recommend precise application timing and volume to reduce waste and boost yield." },
          { title: "Equipment Predictive Maintenance", description: "Flag machinery likely to fail before it breaks down mid-season." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Business benefits"
            features={[
              { name: "Higher Yield per Acre", desc: "Data-driven decisions on irrigation and treatment translate directly into better harvests." },
              { name: "Lower Input Costs", desc: "Precision application reduces waste on water, fertilizer, and pesticide spend." },
              { name: "Fewer Surprises at Harvest", desc: "Early visibility into crop stress and equipment issues means fewer season-ending surprises." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="features"
        tone="muted"
        title="Key features"
        items={[
          { title: "Offline Field Data Capture", description: "Scouting, equipment logs, and observations that sync once back in range." },
          { title: "Unified Farm Dashboard", description: "Sensor, weather, and equipment data in one consistent view across every field." },
          { title: "Crop Health Imagery Analysis", description: "Automated flagging of stress or disease from drone and satellite imagery." },
          { title: "Resource Application Planning", description: "Field-by-field recommendations for irrigation, fertilizer, and pesticide timing." },
        ]}
      />

      <CurriculumTimeline
        title="Our development process"
        description="How we take an agriculture platform from concept to a field-tested, production-grade product."
        modules={[
          { title: "Discovery & Field Audit", duration: "3–5 Days", topics: ["Stakeholder workshops", "Field connectivity audit", "Equipment inventory", "Success metrics"] },
          { title: "UX & Architecture", duration: "1 Week", topics: ["Offline-first design", "System architecture", "IoT integration planning", "Data model"] },
          { title: "Core Platform Build", duration: "3–4 Weeks", topics: ["Farm dashboard", "Field app", "Sensor integration", "Sync engine"] },
          { title: "AI & Imagery Layer", duration: "1–2 Weeks", topics: ["Yield models", "Crop health scoring", "Weather integration"] },
          { title: "Field Testing", duration: "1 Week", topics: ["On-farm pilot testing", "Connectivity stress testing", "Usability review with growers"] },
          { title: "Launch & Iteration", duration: "Ongoing", topics: ["Phased rollout", "Grower onboarding", "Seasonal monitoring", "Continuous improvement"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of agriculture products we build across row crops, orchards, and livestock operations."
        projects={[
          { title: "Farm Management Platform", description: "A unified dashboard combining field sensor data, weather, and equipment telemetry for whole-operation visibility.", skills: ["IoT", "Analytics", "Offline Sync"] },
          { title: "Crop Health Monitoring App", description: "A drone and satellite imagery platform that flags disease and stress before it spreads across a field.", skills: ["Computer Vision", "AI/ML", "Mobile"] },
          { title: "Yield Prediction Engine", description: "A forecasting tool combining historical yield, soil, and weather data to project harvest outcomes.", skills: ["Prediction", "Data Engineering", "APIs"] },
        ]}
      />

      <CaseStudyShowcase
        title="Success stories"
        description="Two examples of the kind of outcomes our agriculture platforms drive."
        caseStudies={[
          {
            segment: "Row Crop Operation",
            title: "Reducing irrigation costs for a multi-thousand-acre operation",
            challenge: "A large row-crop operation was over-irrigating significant portions of its fields due to a lack of field-level data.",
            solution: "We built a precision irrigation platform combining soil moisture sensors and weather data into field-specific recommendations.",
            metric: "-22%",
            metricLabel: "Reduction in water usage",
          },
          {
            segment: "Orchard Management",
            title: "Catching crop disease earlier for an orchard network",
            challenge: "An orchard network relied on manual scouting that often caught disease outbreaks too late to prevent significant loss.",
            solution: "We deployed a drone imagery pipeline with AI-based stress detection, flagging affected areas within days instead of weeks.",
            metric: "+18%",
            metricLabel: "Improvement in season yield",
          },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit for Agriculture"
            features={[
              { name: "Field-tested Engineering", desc: "We design for patchy connectivity and rugged use, not ideal office conditions." },
              { name: "IoT & Hardware Fluency", desc: "We integrate with real sensor and equipment ecosystems, not just clean API demos." },
              { name: "Seasonal Delivery Discipline", desc: "We understand planting and harvest windows don't move for a software release schedule." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={agricultureFaqs}
      />

      <DetailCTA
        heading="Ready to turn field data into decisions?"
        description="Let's talk about your operation, your fields, and how we can help you farm with more certainty."
        ctaLabel="Get a Free Consultation"
      />
    </div>
  );
}
