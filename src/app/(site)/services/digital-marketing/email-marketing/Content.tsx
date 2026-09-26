"use client";

import {
  Mail, Clock, Users, Layers, Headphones,
  Send, Sparkles, Target, Zap, ShieldCheck, BarChart3, Settings,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import ArchitectureOverview from "@/components/sections/ArchitectureOverview";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import { emailMarketingFaqs } from "./faqs";

export default function EmailMarketingContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="digital-marketing"
        categoryLabel="Digital Marketing"
        title="Email Marketing Services"
        subtitle="Personalized campaigns that drive repeat revenue."
        description="Build meaningful customer relationships, nurture leads, and generate repeat revenue through personalized and automated email marketing campaigns."
        icon={Mail}
        image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Direct access to your customer's inbox"
        paragraphs={[
          "Email marketing remains one of the highest ROI marketing channels available. It allows you to speak directly to prospects and existing customers without algorithm restrictions.",
          "We build automated lifecycle email flows, conversion-focused newsletter campaigns, and customer segmentation rules that turn subscribers into repeat buyers.",
        ]}
        stats={[
          { label: "Average Open Rates", value: "25% - 40%+", icon: Mail },
          { label: "Automation setup", value: "Custom Workflows", icon: Zap },
          { label: "Deliverability", value: "99%+ Inbox Rate", icon: ShieldCheck },
          { label: "Reporting", value: "Revenue Attribution", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Email marketing services"
        description="End-to-end email strategies that grow list size, open rates, and revenue."
        items={[
          { title: "Automated Welcome Sequences", description: "Onboard new subscribers and turn cold leads into warm opportunities." },
          { title: "Abandoned Cart & Browse Recovery", description: "Recover lost e-commerce sales with targeted automated reminders." },
          { title: "Weekly & Monthly Newsletters", description: "Engaging promotional and educational campaign broadcasts." },
          { title: "Customer Re-engagement", description: "Win back inactive subscribers with tailored retention campaigns." },
          { title: "List Growth & Opt-in Strategy", description: "High-converting popups, quizzes, and lead capture forms." },
          { title: "Deliverability & DNS Setup", description: "SPF, DKIM, and DMARC domain warming and inbox optimization." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Email platforms & tools"
        items={[
          { name: "Klaviyo", category: "E-commerce Email", icon: Mail },
          { name: "Mailchimp", category: "Campaigns", icon: Send },
          { name: "ActiveCampaign", category: "Automation", icon: Settings },
          { name: "HubSpot", category: "CRM & Email", icon: Users },
          { name: "Brevo", category: "Transactional", icon: Zap },
          { name: "GlockApps", category: "Deliverability", icon: ShieldCheck },
        ]}
      />

      <CurriculumTimeline
        title="Email marketing launch plan"
        description="From account setup to revenue-generating automated flows."
        modules={[
          { title: "Audit & Domain Setup", duration: "Week 1", topics: ["Deliverability audit", "DNS authentication", "Platform configuration"] },
          { title: "Template & Form Design", duration: "Week 2", topics: ["Responsive template design", "Sign-up form creation", "Copywriting"] },
          { title: "Automated Flow Build", duration: "Week 3", topics: ["Welcome series", "Abandoned cart flow", "Post-purchase sequence"] },
          { title: "Campaign Execution & A/B Testing", duration: "Ongoing", topics: ["Broadcast campaigns", "Subject line testing", "Revenue tracking"] },
        ]}
      />

      <FAQAccordion faqs={emailMarketingFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Lead Generation", description: "Acquire targeted business leads to expand your email list.", href: "/services/digital-marketing/lead-generation", icon: Target },
          { title: "Content Marketing", description: "Feed your newsletters with high-value blog posts and guides.", href: "/services/digital-marketing/content-marketing", icon: Send },
        ]}
      />

      <DetailCTA
        heading="Ready to boost your email marketing revenue?"
        description="Let our email specialists build high-converting automation flows for your business."
        ctaLabel="Get Started with Email Marketing"
        category="digital-marketing"
        subService="email-marketing"
      />
    </div>
  );
}
