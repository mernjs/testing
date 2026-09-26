"use client";

import React from "react";
import {
  Megaphone, Search, BarChart3, Share2, FileText, Mail,
  Target, TrendingUp, Star, MapPin, ShoppingCart, Users, AreaChart,
} from "lucide-react";
import ListingHero from "@/components/sections/ListingHero";
import FeaturedListingCard from "@/components/sections/FeaturedListingCard";
import ListingCard from "@/components/sections/ListingCard";
import DetailCTA from "@/components/sections/DetailCTA";

const items = [
  {
    title: "SEO Services",
    subtitle: "Rank higher, attract qualified organic traffic.",
    description: "Improve your search visibility, attract qualified organic traffic, and build long-term online growth with a comprehensive SEO strategy covering technical, on-page, off-page, local, and e-commerce SEO.",
    href: "/services/digital-marketing/seo",
    icon: Search,
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Technical SEO", "Link Building", "Keyword Research"],
  },
  {
    title: "Performance Marketing",
    subtitle: "Results-driven advertising across all major platforms.",
    description: "Drive measurable business results through targeted advertising campaigns optimized for traffic, leads, conversions, and revenue across Google Ads, Meta Ads, LinkedIn, and YouTube.",
    href: "/services/digital-marketing/performance-marketing",
    icon: BarChart3,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Google Ads", "Meta Ads", "ROAS Optimization"],
  },
  {
    title: "Social Media Marketing",
    subtitle: "Build a strong, engaged social presence.",
    description: "Build a stronger social presence through strategic content, audience engagement, creative campaigns, and platform-specific marketing across Instagram, Facebook, LinkedIn, and YouTube.",
    href: "/services/digital-marketing/social-media-marketing",
    icon: Share2,
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Content Creation", "Reels & Videos", "Community Management"],
  },
  {
    title: "Content Marketing",
    subtitle: "Authority-building content that converts.",
    description: "Create valuable, search-friendly, and conversion-focused content that builds authority, attracts your target audience, and supports long-term growth through blogs, guides, and landing pages.",
    href: "/services/digital-marketing/content-marketing",
    icon: FileText,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop",
    highlights: ["SEO Content", "Blog Writing", "Content Strategy"],
  },
  {
    title: "Email Marketing",
    subtitle: "Personalized campaigns that drive repeat engagement.",
    description: "Build meaningful customer relationships and generate repeat engagement through targeted, personalized, and conversion-focused email campaigns including newsletters, drip sequences, and lead nurturing.",
    href: "/services/digital-marketing/email-marketing",
    icon: Mail,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Drip Campaigns", "Lead Nurturing", "Email Automation"],
  },
  {
    title: "Lead Generation",
    subtitle: "Qualified business opportunities at scale.",
    description: "Generate qualified business opportunities through targeted campaigns, optimized landing experiences, and data-driven lead acquisition strategies for B2B and B2C markets.",
    href: "/services/digital-marketing/lead-generation",
    icon: Target,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    highlights: ["B2B & B2C", "Landing Pages", "Lead Tracking"],
  },
  {
    title: "Conversion Rate Optimization",
    subtitle: "Turn more visitors into paying customers.",
    description: "Turn more website visitors into customers by identifying conversion barriers and continuously optimizing the user journey through A/B testing, heatmaps, and funnel analysis.",
    href: "/services/digital-marketing/conversion-rate-optimization",
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=1200&auto=format&fit=crop",
    highlights: ["A/B Testing", "Funnel Optimization", "CTA Optimization"],
  },
  {
    title: "Online Reputation Management",
    subtitle: "Protect and strengthen your digital reputation.",
    description: "Protect and strengthen your digital reputation by monitoring online presence, managing customer feedback, and improving brand perception across review platforms and search results.",
    href: "/services/digital-marketing/online-reputation-management",
    icon: Star,
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Review Management", "Brand Monitoring", "Sentiment Analysis"],
  },
  {
    title: "Local Digital Marketing",
    subtitle: "Dominate local search and attract nearby customers.",
    description: "Increase visibility among customers in your target locations and help your business attract more local searches, calls, visits, and enquiries through local SEO and Google Business Profile.",
    href: "/services/digital-marketing/local-digital-marketing",
    icon: MapPin,
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Local SEO", "Google Business", "Local Citations"],
  },
  {
    title: "E-commerce Marketing",
    subtitle: "More traffic, conversions, and repeat purchases.",
    description: "Increase product visibility, traffic, conversions, and repeat purchases with a complete digital marketing strategy built for online businesses including Google Shopping, Meta campaigns, and remarketing.",
    href: "/services/digital-marketing/ecommerce-marketing",
    icon: ShoppingCart,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Google Shopping", "Remarketing", "Cart Recovery"],
  },
  {
    title: "Influencer Marketing",
    subtitle: "Amplify your brand through trusted creators.",
    description: "Connect your brand with relevant creators and communities to increase awareness, engagement, trust, and customer acquisition through sponsored content, UGC campaigns, and creator partnerships.",
    href: "/services/digital-marketing/influencer-marketing",
    icon: Users,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop",
    highlights: ["Influencer Discovery", "UGC Campaigns", "Creator Partnerships"],
  },
  {
    title: "Marketing Analytics & Reporting",
    subtitle: "Turn data into actionable growth insights.",
    description: "Turn marketing data into actionable insights with centralized performance tracking across campaigns, channels, audiences, and conversions — from traffic analysis to custom dashboards and ROI reporting.",
    href: "/services/digital-marketing/marketing-analytics",
    icon: AreaChart,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    highlights: ["ROI Analysis", "Custom Dashboards", "Channel Performance"],
  },
];

const [featured, ...rest] = items;

export default function DigitalMarketingContent() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <ListingHero
        eyebrow="digital marketing"
        title="Digital Marketing Services"
        description="Build a stronger digital presence with end-to-end digital marketing services designed to attract the right audience, increase visibility, generate qualified leads, and drive measurable business growth."
        icon={Megaphone}
        image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1400&auto=format&fit=crop"
      />

      {/* Modern Listing Grid */}
      <section className="py-24 sm:py-32 bg-background relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="mb-16 lg:mb-20">
            <FeaturedListingCard
              icon={featured.icon}
              badge="Digital Marketing"
              badgeIcon={Megaphone}
              title={featured.title}
              subtitle={featured.subtitle}
              description={featured.description}
              highlights={featured.highlights}
              href={featured.href}
              image={featured.image}
            />
          </div>

          <div className="flex items-center gap-3 mb-10">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">More Offerings</h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {rest.map((item, i) => (
              <ListingCard
                key={item.href}
                index={i}
                icon={item.icon}
                badge="Digital Marketing"
                badgeIcon={Megaphone}
                title={item.title}
                subtitle={item.subtitle}
                description={item.description}
                highlights={item.highlights}
                href={item.href}
                image={item.image}
              />
            ))}
          </div>
        </div>
      </section>

      <DetailCTA
        heading="Ready to grow your business with digital marketing?"
        description="Our digital marketing team is ready to build a strategy tailored to your business goals and audience."
        category="digital-marketing"
      />
    </div>
  );
}
