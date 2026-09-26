"use client";

import {
  MapPin, Clock, Users, Layers, Headphones,
  Search, Star, Phone, Globe, CheckCircle2,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import { localDigitalMarketingFaqs } from "./faqs";

export default function LocalDigitalMarketingContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="digital-marketing"
        categoryLabel="Digital Marketing"
        title="Local Digital Marketing"
        subtitle="Dominate local search & attract nearby customers."
        description="Increase visibility among customers in your target locations and help your business attract more local searches, calls, visits, and enquiries."
        icon={MapPin}
        image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Be the top choice in your local market"
        paragraphs={[
          "Over 46% of all Google searches have local intent. When nearby prospects search for your services, appearing in Google's Map Pack is critical to capturing those phone calls and site visits.",
          "We optimize your Google Business Profile, build consistent local directory citations, and implement geo-targeted SEO to position your brand as the leading local authority.",
        ]}
        stats={[
          { label: "Google Maps", value: "3-Pack Target", icon: MapPin },
          { label: "Reviews", value: "Reputation Boost", icon: Star },
          { label: "Leads", value: "Calls & Visits", icon: Phone },
          { label: "Reporting", value: "Monthly Insights", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Local marketing services"
        description="End-to-end local SEO and location-based digital marketing solutions."
        items={[
          { title: "Google Business Profile Optimization", description: "Complete setup, category tuning, photo updates, and weekly posts." },
          { title: "Local Citation & Directory Building", description: "Consistent NAP (Name, Address, Phone) distribution across trusted local directories." },
          { title: "Geo-Targeted Content & Landing Pages", description: "Location-specific landing pages optimized for city and regional searches." },
          { title: "Local Review Management", description: "Automated review acquisition strategy to build local trust and social proof." },
        ]}
      />

      <FAQAccordion faqs={localDigitalMarketingFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "SEO Services", description: "Expand national and global search rankings.", href: "/services/digital-marketing/seo", icon: Search },
          { title: "Online Reputation Management", description: "Manage customer reviews and online perception.", href: "/services/digital-marketing/online-reputation-management", icon: Star },
        ]}
      />

      <DetailCTA
        heading="Ready to dominate your local search market?"
        description="Partner with our local SEO experts to rank #1 in your city or region."
        ctaLabel="Get Local SEO Audit"
        category="digital-marketing"
        subService="local-digital-marketing"
      />
    </div>
  );
}
