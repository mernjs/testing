"use client";

import {
  Video, Users2, Cloud, Sparkles,
  Code2, Server, Database, Package, Lock, Layers,
  Mic, Wand2, Share2,
  Bot, Camera, Briefcase,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import TechStackGrid from "@/components/sections/TechStackGrid";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import ProductGallery from "@/components/sections/ProductGallery";
import CaseStudyShowcase from "@/components/sections/CaseStudyShowcase";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import LiveDemoSection from "@/components/sections/LiveDemoSection";
import { socialMediaAiReelsGeneratorFaqs } from "./faqs";

const DEMO_URL = "http://ai-reel-generator.yashorbit.com";

export default function SocialMediaAiReelsGeneratorContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="live-demos"
        categoryLabel="live demos"
        title="Social Media AI Reels Generator"
        subtitle="Upload a photo. Get a scroll-stopping AI video in minutes."
        description="Turn a single image into a high-quality, voice-narrated short-form video for Instagram Reels, YouTube Shorts, and TikTok — using your real voice or a natural AI-generated one."
        icon={Video}
        image="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop"
      />

      <div className="py-8 bg-background border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap gap-2">
          {["AI Video Generation", "Voice Cloning", "Social Media", "Short-Form Content"].map((tag) => (
            <span key={tag} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <CourseOverview
        title="From one photo to a finished reel"
        paragraphs={[
          "Social Media AI Reels Generator turns a single uploaded image into a polished, voice-narrated short-form video — no filming, no editing timeline, no video team required.",
          "It's built for creators, marketers, and social media teams who need to publish consistently across Reels, Shorts, and TikTok without the production overhead of a full video shoot.",
        ]}
        stats={[
          { label: "Built For", value: "Creators & Social Media Teams", icon: Users2 },
          { label: "Primary Use Case", value: "AI-Generated Short-Form Video", icon: Video },
          { label: "Deployment", value: "Web App, Cloud", icon: Cloud },
          { label: "Category", value: "In-House Live Demo Project", icon: Sparkles },
        ]}
      />

      <LiveDemoSection
        demoUrl={DEMO_URL}
        heading="Try it yourself, right now"
        description="Upload a photo, pick a voice, and generate a real reel in minutes — no sign-up walls, no sales call required."
        previewImage="https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1200&auto=format&fit=crop"
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        description="Built around a single upload, not a full production pipeline."
        items={[
          { title: "Image-to-Video Generation", description: "Upload a single photo and generate a full talking, animated video reel from it." },
          { title: "Real Voice or AI Voice", description: "Narrate with your own recorded voice or generate a natural AI voice from a script." },
          { title: "Vertical, Platform-Ready Output", description: "Reels render pre-formatted for Instagram Reels, YouTube Shorts, and TikTok." },
          { title: "Script-to-Speech Narration", description: "Type a script and have it spoken back in a natural-sounding voice automatically." },
          { title: "Fast Turnaround Rendering", description: "Most reels render in minutes, not hours, so teams can iterate quickly." },
          { title: "Brand-Consistent Styling", description: "Apply consistent captions, framing, and pacing across every reel you generate." },
        ]}
      />

      <ChecklistGrid
        id="modules"
        tone="muted"
        title="Core modules"
        items={[
          { title: "Image Processing Engine", description: "Analyzes and prepares the uploaded photo for realistic animation and lip-sync." },
          { title: "Voice Engine", description: "Handles both voice cloning from a real recording and AI voice generation from text." },
          { title: "Video Rendering Pipeline", description: "Combines animated visuals and narration into a finished, platform-ready reel." },
          { title: "Script Editor", description: "Write or paste narration scripts directly in the app before generating." },
          { title: "Media Library", description: "Stores uploaded images, scripts, and generated reels for reuse." },
          { title: "Export & Delivery", description: "Download reels directly or deliver them via API into your publishing workflow." },
        ]}
      />

      <CurriculumTimeline
        title="Product workflow"
        description="How a single photo becomes a finished, narrated reel."
        modules={[
          { title: "Upload", duration: "Step 1", topics: ["Upload a source image", "Review image quality"] },
          { title: "Script", duration: "Step 2", topics: ["Write or paste a narration script", "Or upload a recorded voice track"] },
          { title: "Choose Voice", duration: "Step 3", topics: ["Select your own voice or an AI-generated voice"] },
          { title: "Generate", duration: "Step 4", topics: ["Render the animated, narrated reel"] },
          { title: "Review", duration: "Step 5", topics: ["Preview the finished reel before export"] },
          { title: "Export", duration: "Step 6", topics: ["Download or deliver via API to your publishing tools"] },
          { title: "Scale", duration: "Step 7", topics: ["Generate reels in bulk across campaigns"] },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        items={[
          { name: "Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "MongoDB", category: "Database", icon: Database },
          { name: "Redis", category: "Job Queue", icon: Layers },
          { name: "React", category: "Web Frontend", icon: Code2 },
          { name: "AWS S3", category: "Media Storage", icon: Cloud },
          { name: "Docker", category: "DevOps", icon: Package },
          { name: "OAuth2", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-capabilities"
        tone="muted"
        title="AI capabilities"
        items={[
          { title: "Voice Synthesis", description: "ElevenLabs-powered voice generation produces natural, human-sounding narration from text or a cloned voice." },
          { title: "Image Animation", description: "AI models animate the uploaded photo into realistic, expressive, lip-synced video." },
          { title: "Automation", description: "Script, voice, and visuals are combined into a finished reel automatically, without manual editing." },
        ]}
      />

      <TechStackGrid
        title="Integrations"
        description="Connect Social Media AI Reels Generator to the voice, video, and delivery infrastructure behind it."
        items={[
          { name: "ElevenLabs", category: "Voice Synthesis & Cloning", icon: Mic },
          { name: "Image-to-Video AI", category: "Photo Animation & Lip-Sync", icon: Wand2 },
          { name: "AWS S3 / CloudFront", category: "Media Storage & Delivery", icon: Cloud },
          { name: "Social Publishing APIs", category: "Reels, Shorts & TikTok Delivery", icon: Share2 },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits"
            features={[
              { name: "No Video Team Required", desc: "Produce publish-ready reels without a camera, studio, or editor on staff." },
              { name: "Consistent Publishing Cadence", desc: "Generate enough reels to post daily without daily production overhead." },
              { name: "Lower Cost Per Video", desc: "A fraction of the cost of traditional video production, at a fraction of the time." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="industries"
        tone="muted"
        title="Where Social Media AI Reels Generator fits"
        columns={2}
        items={[
          { title: "Social Media", description: "Give social teams a way to publish short-form video at the pace platforms reward.", href: "/industries/social-media" },
          { title: "Ecommerce", description: "Turn product photos into scroll-stopping reels without booking a photoshoot.", href: "/industries/ecommerce" },
        ]}
      />

      <ProductGallery
        title="Product gallery"
        description="A closer look at the Social Media AI Reels Generator app."
        images={[
          { src: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800&auto=format&fit=crop", caption: "Upload & Script Editor" },
          { src: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop", caption: "Voice Selection" },
          { src: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=800&auto=format&fit=crop", caption: "Generated Reel Preview" },
        ]}
      />

      <CaseStudyShowcase
        tone="muted"
        title="Case study"
        caseStudies={[
          {
            segment: "D2C Brand",
            title: "Cutting content production time for a social-first D2C brand",
            challenge: "A direct-to-consumer brand needed a steady stream of short-form video for Instagram and TikTok but couldn't justify a full-time video production team for the volume required.",
            solution: "We rolled out Social Media AI Reels Generator so their marketing team could turn product photos into narrated reels in minutes, without booking a shoot for every post.",
            metric: "-85%",
            metricLabel: "Time from photo to published reel",
          },
        ]}
      />

      <FAQAccordion
        faqs={socialMediaAiReelsGeneratorFaqs}
      />

      <RelatedServices
        tone="muted"
        title="Related products"
        services={[
          { title: "AI Voice Assistant", description: "See another application of the same voice AI technology.", href: "/products/ai-voice-assistant", icon: Bot },
          { title: "Image Recognition System", description: "Explore more of our computer vision and image AI work.", href: "/products/image-recognition-system", icon: Camera },
          { title: "AI Job Board Portal", description: "See how we apply AI automation across a different product.", href: "/products/ai-job-board-portal", icon: Briefcase },
        ]}
      />

      <DetailCTA
        heading="Ready to turn your photos into reels?"
        description="Try the live demo yourself, or talk to us about bringing it into your content workflow."
        ctaLabel="Talk to Our Team"
      />
    </div>
  );
}
