"use client";

import {
  ShoppingCart, Clock, Users, Layers, Headphones,
  BarChart3, Target, Zap, ArrowRight, CheckCircle2,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import { ecommerceMarketingFaqs } from "./faqs";

export default function EcommerceMarketingContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="digital-marketing"
        categoryLabel="Digital Marketing"
        title="E-commerce Marketing"
        subtitle="More store traffic, sales & customer lifetime value."
        description="Increase product visibility, traffic, conversions, and repeat purchases with a complete digital marketing strategy built specifically for online stores."
        icon={ShoppingCart}
        image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Scale your online store revenue predictably"
        paragraphs={[
          "E-commerce marketing requires synchronization across Google Shopping feed management, high-converting social ads, marketplace optimization, and customer retention flows.",
          "We build multi-channel sales engines that attract high-intent buyers, lower customer acquisition costs (CAC), and maximize Customer Lifetime Value (LTV)."
        ]}
        stats={[
          { label: "Target ROAS", value: "3.5x - 8x+", icon: BarChart3 },
          { label: "Feed Management", value: "Google & Meta", icon: Target },
          { label: "Retention", value: "Email & SMS Flows", icon: Zap },
          { label: "Reporting", value: "Real-time Metrics", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="E-commerce growth solutions"
        description="Comprehensive marketing services designed for online storefronts."
        items={[
          { title: "Google Shopping & Performance Max", description: "Feed optimization, bidding strategies, and catalog ads to capture product searches." },
          { title: "Meta Dynamic Product Ads", description: "Retarget store visitors with exact products they viewed or added to cart." },
          { title: "E-commerce SEO", description: "Optimizing product descriptions, category structure, and schema markup for search engines." },
          { title: "Cart Abandonment & Retention Flows", description: "Automated email/SMS sequences that recover abandoned carts and drive reorders." },
        ]}
      />

      <FAQAccordion faqs={ecommerceMarketingFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Performance Marketing", description: "Drive paid user acquisition via ads.", href: "/services/digital-marketing/performance-marketing", icon: BarChart3 },
          { title: "Email Marketing", description: "Turn one-time buyers into loyal repeat customers.", href: "/services/digital-marketing/email-marketing", icon: Zap },
        ]}
      />

      <DetailCTA
        heading="Ready to scale your e-commerce store?"
        description="Let our e-commerce specialists grow your traffic, conversions, and sales."
        ctaLabel="Get Store Growth Audit"
        category="digital-marketing"
        subService="ecommerce-marketing"
      />
    </div>
  );
}
