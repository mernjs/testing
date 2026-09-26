"use client";

import {
  Share2, Clock, Users, Layers, Headphones,
  Globe, BarChart3, Video, FileText, Search, Target, MapPin,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import { socialMediaMarketingFaqs } from "./faqs";

export default function SocialMediaMarketingContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="digital-marketing"
        categoryLabel="Digital Marketing"
        title="Social Media Marketing Services"
        subtitle="Build a social presence people actually follow."
        description="Build a stronger social presence through strategic content, audience engagement, creative campaigns, and platform-specific marketing across Instagram, Facebook, LinkedIn, and YouTube."
        icon={Share2}
        image="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Social media that builds real brand equity"
        paragraphs={[
          "Social media is where your brand personality lives. Done well, it builds trust, grows your audience, and turns followers into customers. Done poorly, it's a drain of time and budget with nothing to show.",
          "We build platform-specific social strategies that align with your brand voice, target audience, and business goals — managing everything from content planning and creation to community engagement and performance analytics.",
        ]}
        stats={[
          { label: "Platforms Managed", value: "Instagram, Facebook, LinkedIn, YouTube", icon: Clock },
          { label: "Content Cadence", value: "3–5 Posts / Week", icon: Users },
          { label: "Deliverables", value: "Strategy + Content + Analytics", icon: Layers },
          { label: "Reporting", value: "Monthly Performance Reports", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="platforms"
        title="Platforms we manage"
        description="Platform-specific strategies built around how each audience discovers and engages with content."
        items={[
          { title: "Instagram", description: "Feed posts, Stories, Reels, and Highlights managed with a consistent visual identity and engagement strategy." },
          { title: "Facebook", description: "Page management, post strategy, group engagement, and Facebook-specific content formats." },
          { title: "LinkedIn", description: "B2B content, thought leadership, company page management, and professional audience engagement." },
          { title: "YouTube", description: "Video content strategy, channel management, descriptions, tags, and community tab engagement." },
          { title: "Google Business Profile", description: "Posts, Q&A management, photo updates, and review response to improve local visibility." },
        ]}
      />

      <ChecklistGrid
        id="services"
        tone="muted"
        title="Social media services we provide"
        description="End-to-end social media management from strategy to reporting."
        items={[
          { title: "Social Media Strategy", description: "Platform selection, audience personas, content pillars, and a 30/60/90-day growth roadmap." },
          { title: "Content Planning", description: "Monthly content calendars planned in advance and approved by you before scheduling." },
          { title: "Content Creation", description: "Professional copywriting, graphic design, and creative direction for all posts." },
          { title: "Image Content", description: "Branded static posts, carousels, and infographics designed to perform on each platform." },
          { title: "Video Content", description: "Short-form video scripts, production direction, and editing for social formats." },
          { title: "Reels & Short Videos", description: "Instagram Reels and YouTube Shorts created to maximise reach and discovery." },
          { title: "Social Media Campaigns", description: "Themed campaign planning and execution around product launches, events, and promotions." },
          { title: "Community Management", description: "Timely responses to comments, DMs, and mentions to build audience relationships." },
          { title: "Audience Engagement", description: "Proactive engagement with your target audience to grow reach and build community." },
          { title: "Hashtag Strategy", description: "Research-backed hashtag sets to maximise organic discovery on each platform." },
          { title: "Social Media Advertising", description: "Paid social campaigns on Instagram, Facebook, and LinkedIn to amplify reach and drive conversions." },
          { title: "Performance Tracking", description: "Monthly analytics reports covering reach, engagement, follower growth, and business impact." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Tools & platforms we use"
        items={[
          { name: "Instagram Business", category: "Platform", icon: Globe },
          { name: "Facebook Pages", category: "Platform", icon: Globe },
          { name: "LinkedIn Pages", category: "Platform", icon: Users },
          { name: "YouTube Studio", category: "Platform", icon: Video },
          { name: "Google Business Profile", category: "Local", icon: MapPin },
          { name: "Meta Business Suite", category: "Management", icon: BarChart3 },
          { name: "Canva / Adobe", category: "Design", icon: Video },
          { name: "Buffer / Hootsuite", category: "Scheduling", icon: FileText },
        ]}
      />

      <CurriculumTimeline
        title="Our social media process"
        description="How we build and execute your social media presence month over month."
        modules={[
          { title: "Onboarding & Audit", duration: "Week 1", topics: ["Account access", "Brand guidelines review", "Competitor audit", "Audience research"] },
          { title: "Strategy Development", duration: "Week 1–2", topics: ["Content pillars", "Platform strategy", "Tone of voice", "Hashtag research"] },
          { title: "Month 1 Content Calendar", duration: "Week 2–3", topics: ["Calendar creation", "Content production", "Review & approval", "Scheduling"] },
          { title: "Community Management", duration: "Ongoing", topics: ["Comment responses", "DM management", "Engagement outreach", "Community building"] },
          { title: "Monthly Content Cycle", duration: "Monthly", topics: ["Next month's calendar", "New content themes", "Campaign planning", "Creative refresh"] },
          { title: "Analytics & Reporting", duration: "Monthly", topics: ["Reach & engagement", "Follower growth", "Top content analysis", "Strategy adjustment"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Social media use cases"
        description="How we've helped different types of businesses build their social presence."
        projects={[
          { title: "B2C Brand Growth", description: "Growing a consumer brand's Instagram from 2,000 to 25,000 followers in 6 months through Reels and consistent engagement.", skills: ["Instagram", "Reels", "Community"] },
          { title: "B2B LinkedIn Presence", description: "Building a SaaS company's LinkedIn thought leadership to drive inbound sales conversations.", skills: ["LinkedIn", "Thought Leadership", "B2B"] },
          { title: "Product Launch Campaign", description: "A coordinated multi-platform launch campaign generating 500+ waitlist sign-ups through social content.", skills: ["Instagram", "Facebook", "Campaign"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our social media team"
            features={[
              { name: "Platform-Native Strategies", desc: "We build for how each platform's algorithm works, not a one-size-fits-all content plan." },
              { name: "Brand-Consistent Creative", desc: "Every piece of content feels unmistakably like your brand — visually and tonally." },
              { name: "Community-First Approach", desc: "We treat social as a two-way conversation, building genuine audience relationships that convert." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion faqs={socialMediaMarketingFaqs} />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Content Marketing", description: "Fuel your social channels with high-quality written content.", href: "/services/digital-marketing/content-marketing", icon: FileText },
          { title: "Performance Marketing", description: "Amplify your social reach with paid social advertising.", href: "/services/digital-marketing/performance-marketing", icon: BarChart3 },
          { title: "Influencer Marketing", description: "Extend your social reach through creator partnerships.", href: "/services/digital-marketing/influencer-marketing", icon: Users },
        ]}
      />

      <DetailCTA
        heading="Ready to build a social media presence that grows your business?"
        description="Let's create a social strategy that builds your brand, engages your audience, and drives real results."
        ctaLabel="Get a Social Strategy"
        category="digital-marketing"
        subService="social-media-marketing"
      />
    </div>
  );
}
