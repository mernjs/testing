"use client";

import React from "react";
import { Globe, HeartPulse, ShoppingCart, Umbrella, Tractor, GraduationCap, Building2, Share2, Plane, HardHat, Hotel, Landmark } from "lucide-react";
import ListingHero from "@/components/sections/ListingHero";
import ListingCard from "@/components/sections/ListingCard";
import DetailCTA from "@/components/sections/DetailCTA";

const items = [
  { title: "Healthcare", subtitle: "Digital health, built for patients and providers.", description: "We build patient portals, telehealth platforms, and clinical workflow tools engineered for HIPAA compliance, EHR interoperability, and real clinical usability.", href: "/industries/healthcare", icon: HeartPulse, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop", highlights: ["HIPAA Compliant", "Telehealth Platforms", "EHR Integration"] },
  { title: "Ecommerce", subtitle: "Storefronts built to convert, not just load.", description: "We build high-performance storefronts, headless commerce platforms, and checkout flows engineered to turn traffic into revenue at every stage of the funnel.", href: "/industries/ecommerce", icon: ShoppingCart, image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop", highlights: ["Headless Commerce", "One-page Checkout", "Peak-traffic Ready"] },
  { title: "Insurance", subtitle: "Underwriting and claims, modernized.", description: "We build policy management systems, automated underwriting engines, and claims platforms that cut processing time without cutting corners on risk assessment.", href: "/industries/insurance", icon: Umbrella, image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=1200&auto=format&fit=crop", highlights: ["Automated Underwriting", "Digital Claims", "Fraud Detection"] },
  { title: "Agriculture", subtitle: "Precision farming, powered by data.", description: "We build farm management platforms, IoT sensor networks, and yield-prediction tools that turn field data into decisions farmers can act on before it's too late.", href: "/industries/agriculture", icon: Tractor, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop", highlights: ["Offline-first Field Apps", "IoT Sensors", "Yield Prediction"] },
  { title: "Education", subtitle: "Transforming modern education.", description: "We build intuitive learning management systems, virtual classrooms, and educational games that make learning accessible, engaging, and effective for students worldwide.", href: "/industries/education", icon: GraduationCap, image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop", highlights: ["LMS Platforms", "Live Classrooms", "Adaptive Learning"] },
  { title: "Real Estate", subtitle: "Modernizing property management.", description: "From immersive 3D virtual tours to automated property management software, we provide the tools real estate professionals need to close deals faster and manage assets efficiently.", href: "/industries/real-estate", icon: Building2, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop", highlights: ["3D Virtual Tours", "Property CRM", "Automated Leasing"] },
  { title: "Social Media", subtitle: "Feeds, communities, and moderation at scale.", description: "We build social platforms, community apps, and content moderation systems engineered to handle real-time feeds, viral spikes, and the moderation load that comes with scale.", href: "/industries/social-media", icon: Share2, image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop", highlights: ["Real-time Feeds", "AI Moderation", "Auto-scaling"] },
  { title: "Travel", subtitle: "Booking flows that survive real-world chaos.", description: "We build booking engines, itinerary platforms, and travel management tools that stay reliable through fare changes, cancellations, and the messiness of real travel.", href: "/industries/travel", icon: Plane, image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop", highlights: ["Multi-supplier Booking", "Disruption Handling", "Unified Itineraries"] },
  { title: "Construction", subtitle: "Job site visibility, from breaking ground to handover.", description: "We build project management platforms, field reporting apps, and site monitoring tools that keep budgets, schedules, and safety visible across every job site.", href: "/industries/construction", icon: HardHat, image: "https://images.unsplash.com/photo-1571624436279-b272aff752b5?q=80&w=1200&auto=format&fit=crop", highlights: ["Offline Field Apps", "Live Budget Tracking", "Safety Reporting"] },
  { title: "Hotels", subtitle: "Guest experience, from booking to checkout.", description: "We build reservation systems, property management platforms, and guest experience apps that keep every room, rate, and request in sync across every channel.", href: "/industries/hotels", icon: Hotel, image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=1200&auto=format&fit=crop", highlights: ["Channel Manager", "Direct Booking Engine", "Guest Experience Apps"] },
  { title: "Finance", subtitle: "Secure financial technology.", description: "We engineer highly secure, compliant, and lightning-fast financial applications. From payment gateways to blockchain integration, we build the future of finance.", href: "/industries/finance", icon: Landmark, image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop", highlights: ["PCI-DSS Compliant", "Fraud Detection", "Real-Time Payments"] },
];

export default function IndustriesContent() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <ListingHero
        eyebrow="industries portfolio"
        title="Industries We Serve"
        description="We provide tailored technology solutions across a diverse range of sectors. See how our deep industry expertise translates into measurable results for your business."
        icon={Globe}
        image="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1400&auto=format&fit=crop"
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
                badge="Industry"
                badgeIcon={Globe}
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
