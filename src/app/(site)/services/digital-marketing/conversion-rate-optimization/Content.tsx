"use client";

import {
  TrendingUp, Clock, Users, Layers, Headphones,
  Zap, BarChart3, Search, CheckCircle2, ShieldCheck, Eye, Sparkles,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import { croFaqs } from "./faqs";

export default function CroContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="digital-marketing"
        categoryLabel="Digital Marketing"
        title="Conversion Rate Optimization"
        subtitle="Turn more visitors into paying customers."
        description="Turn more website visitors into customers by identifying conversion barriers and continuously optimizing the user journey through A/B testing, heatmaps, and funnel analysis."
        icon={TrendingUp}
        image="https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Extract maximum value from your existing traffic"
        paragraphs={[
          "Driving traffic to your website is only half the battle. If your conversion funnel has friction points, confusing copy, or poor checkout UX, you're wasting ad spend.",
          "Our CRO services combine data analytics, user behavior recording, and A/B split testing to systematically convert a higher percentage of visitors into leads and customers.",
        ]}
        stats={[
          { label: "Methodology", value: "Data & UX Driven", icon: Eye },
          { label: "Testing", value: "A/B & Multivariate", icon: BarChart3 },
          { label: "Focus", value: "Revenue Growth", icon: TrendingUp },
          { label: "Reporting", value: "Monthly Insights", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="CRO services & capabilities"
        description="Comprehensive testing and optimization services to maximize revenue."
        items={[
          { title: "UX & Heuristic Audits", description: "Identifying usability issues, friction points, and visual distractions across devices." },
          { title: "Heatmap & Session Analysis", description: "Analyzing click maps, scroll behavior, and user video recordings." },
          { title: "A/B & Split Testing", description: "Designing, launching, and evaluating hypothesis-driven page variations." },
          { title: "Form & Checkout Optimization", description: "Streamlining lead forms and cart checkouts to minimize drop-offs." },
          { title: "Copywriting & CTA Enhancement", description: "Optimizing headlines, value propositions, and call-to-action buttons." },
        ]}
      />

      <FAQAccordion faqs={croFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Performance Marketing", description: "Maximize ROI on paid ad campaigns.", href: "/services/digital-marketing/performance-marketing", icon: BarChart3 },
          { title: "SEO Services", description: "Drive high-converting organic search traffic.", href: "/services/digital-marketing/seo", icon: Search },
        ]}
      />

      <DetailCTA
        heading="Ready to increase your website conversion rate?"
        description="Let our CRO team audit your conversion funnel and identify immediate revenue opportunities."
        ctaLabel="Request a CRO Audit"
        category="digital-marketing"
        subService="conversion-rate-optimization"
      />
    </div>
  );
}
