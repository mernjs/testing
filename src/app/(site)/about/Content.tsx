"use client";

import React from "react";
import { Users, Compass, Trophy, ShieldCheck, Target, Layers, Scale, ReceiptText, ShieldAlert } from "lucide-react";
import ListingHero from "@/components/sections/ListingHero";
import ListingCard from "@/components/sections/ListingCard";
import DetailCTA from "@/components/sections/DetailCTA";
import { brandify } from "@/lib/brand";

const items = [
  { title: "Our Mission", subtitle: "Why we exist, and where we're headed.", description: brandify("From our founding principles to the values that guide every engagement, learn what drives YashOrbit to keep raising the bar for our clients."), href: "/about/our-mission", icon: Target, image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop", highlights: ["Founded 2026", "Core Values", "Remote-first"] },
  { title: "What We Do", subtitle: "Driving digital transformation across industries.", description: "We build scalable, high-performance software solutions tailored to solve complex business challenges. From modern web applications to advanced AI systems, we bring your vision to life.", href: "/about/what-we-do", icon: Compass, image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop", highlights: ["Full-Stack Delivery", "AI-First Approach", "Senior-led Team"] },
  { title: "Technologies", subtitle: "The stack behind everything we build.", description: "From frontend frameworks to agentic AI, explore the full technology stack we reach for, and why, across every engagement.", href: "/about/technologies", icon: Layers, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop", highlights: ["14 Categories", "Production-tested", "AI-native"] },
  { title: "Success Stories", subtitle: "Real results for real businesses.", description: "Don't just take our word for it. Explore how we've helped companies across the globe scale their operations, increase revenue, and dominate their markets.", href: "/about/success-stories", icon: Trophy, image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop", highlights: ["12+ Projects", "Real Case Studies", "Early Momentum"] },
  { title: "Our Team", subtitle: "The minds behind the technology.", description: "We are a diverse group of engineers, designers, and strategists united by a passion for building exceptional digital experiences.", href: "/about/our-team", icon: Users, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop", highlights: ["8+ Specialists", "Senior-Led Team", "Remote-first"] },
  // Hidden from navigation/listing per request — page still lives at /about/co-founder-ceo.
  // { title: "Co-Founder & CEO", subtitle: brandify("Meet the leader behind YashOrbit."), description: "Get to know the vision, philosophy, and journey of our Co-Founder & CEO, and what drives our long-term strategy as a company.", href: "/about/co-founder-ceo", icon: Briefcase, image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop", highlights: ["Founder Insights", "Leadership Vision", "Direct Access"] },
  { title: "Privacy Policy", subtitle: "Your data, secured and respected.", description: "We take your privacy seriously. This policy outlines exactly how we collect, use, and protect your information in compliance with global standards.", href: "/about/privacy-policy", icon: ShieldCheck, image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=1200&auto=format&fit=crop", highlights: ["Transparent Policy", "Secure by Design", "GDPR Aware"] },
  { title: "Terms & Conditions", subtitle: "The ground rules for using our site.", description: "These Terms govern your access to and use of our website — eligibility, intellectual property, accounts, payment, warranties, and liability.", href: "/about/terms-and-conditions", icon: Scale, image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?q=80&w=1200&auto=format&fit=crop", highlights: ["Clear Terms", "IP Protected", "India-governed"] },
  { title: "Refund & Cancellation Policy", subtitle: "Fair terms if plans change.", description: "How and when you can cancel an engagement with us, and what refund, if any, applies — for development projects, training programs, and direct purchases.", href: "/about/refund-cancellation-policy", icon: ReceiptText, image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop", highlights: ["Milestone-based", "Pro-rata Refunds", "15-day Processing"] },
  { title: "Acceptable Use Policy", subtitle: "Keeping our systems safe for everyone.", description: "The rules for using our website and systems — prohibited activities, security responsibilities, and how to responsibly report a vulnerability.", href: "/about/acceptable-use-policy", icon: ShieldAlert, image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1200&auto=format&fit=crop", highlights: ["Fair Use", "Responsible Disclosure", "IT Act Aligned"] },
];

export default function AboutContent() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <ListingHero
        eyebrow="about portfolio"
        title="About YashOrbit"
        description="Discover our mission, our values, and the senior-led team building software that actually moves the needle for our clients."
        icon={Users}
        image="https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=1400&auto=format&fit=crop"
      />

      {/* Modern Listing Grid */}
      <section className="py-24 sm:py-32 bg-background relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item, i) => (
              <ListingCard
                key={item.href}
                index={i}
                icon={item.icon}
                badge="About"
                badgeIcon={Users}
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
        heading="Didn't find what you're looking for?"
        description="We specialize in custom enterprise solutions. Contact our technical team to discuss your specific requirements."
      />
    </div>
  );
}
