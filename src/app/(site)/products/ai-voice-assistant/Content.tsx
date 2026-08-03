"use client";

import {
  Bot, Users2, Cloud, Sparkles,
  Code2, Server, Smartphone, Database, BrainCircuit, Package, Lock,
  Mic, PhoneCall, Bell,
  ShieldAlert, Briefcase, HardHat,
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

export default function AIVoiceAssistantContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="products"
        categoryLabel="products"
        title="AI Voice Assistant"
        subtitle="A human-like AI agent, one phone call away."
        description="A sports-focused hybrid app that lets fans call in and talk with a human-like AI voice agent, getting live updates and answers through natural conversation instead of scrolling a feed."
        icon={Bot}
        image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop"
      />

      <div className="py-8 bg-background border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap gap-2">
          {["Voice AI", "Hybrid App", "Human-Like Agent", "Sports"].map((tag) => (
            <span key={tag} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <CourseOverview
        title="Sports updates you can actually talk to"
        paragraphs={[
          "AI Voice Assistant lets sports fans place a call and speak naturally with an AI agent that sounds human, asking about scores, standings, or a favorite team without opening an app and tapping through menus.",
          "It's built for sports media and fan engagement teams who want a voice-first way to keep fans informed and engaged between games, without staffing a live call center to handle the volume.",
        ]}
        stats={[
          { label: "Built For", value: "Sports Media & Fan Engagement Teams", icon: Users2 },
          { label: "Primary Use Case", value: "Conversational Voice AI for Fans", icon: Bot },
          { label: "Deployment", value: "Hybrid Mobile App, Cloud", icon: Cloud },
          { label: "Category", value: "AI Voice Assistant Platform", icon: Sparkles },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        description="Built around a real phone conversation, not a scripted IVR menu."
        items={[
          { title: "Human-Like Voice Conversations", description: "Natural-sounding voice synthesis makes calls feel like talking to a person, not a robot menu." },
          { title: "Live Sports Q&A", description: "Fans ask about scores, standings, or schedules and get an immediate spoken answer." },
          { title: "Personalized Fan Updates", description: "Follow specific teams or players to get updates tailored to what a fan actually cares about." },
          { title: "In-App Voice Calling", description: "Start a voice conversation with the AI agent directly from the hybrid mobile app." },
          { title: "Multi-Sport Coverage", description: "Support for multiple sports and leagues within the same voice assistant." },
          { title: "Conversation History", description: "Fans can revisit past conversations and updates from within the app." },
        ]}
      />

      <ChecklistGrid
        id="modules"
        tone="muted"
        title="Core modules"
        items={[
          { title: "Voice Agent Engine", description: "Handles real-time speech synthesis and conversation flow for every call." },
          { title: "Sports Data Feed", description: "Live scores, standings, and schedule data powering the agent's answers." },
          { title: "Call Session Manager", description: "Manages call setup, routing, and session state for in-app voice calls." },
          { title: "Fan Preferences", description: "Stores followed teams and players to personalize responses." },
          { title: "History & Transcripts", description: "Stores past conversations for fans to revisit." },
          { title: "Settings & Access", description: "Account-level preferences and notification controls." },
        ]}
      />

      <CurriculumTimeline
        title="Product workflow"
        description="How a fan goes from installing the app to having a live voice conversation."
        modules={[
          { title: "Sign Up", duration: "Step 1", topics: ["Create an account", "Install the hybrid app"] },
          { title: "Setup", duration: "Step 2", topics: ["Follow favorite teams", "Grant call permissions"] },
          { title: "Configure", duration: "Step 3", topics: ["Set update preferences", "Choose notification settings"] },
          { title: "Use Features", duration: "Step 4", topics: ["Start a voice call with the AI agent", "Ask live sports questions"] },
          { title: "Generate Reports", duration: "Step 5", topics: ["Review conversation history"] },
          { title: "Monitor Progress", duration: "Step 6", topics: ["Track engagement with followed teams"] },
          { title: "Scale Operations", duration: "Step 7", topics: ["Add more sports & leagues", "Expand to new fan segments"] },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        items={[
          { name: "React Native", category: "Mobile", icon: Smartphone },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "React", category: "Web Frontend", icon: Code2 },
          { name: "PostgreSQL", category: "Database", icon: Database },
          { name: "Conversational AI Models", category: "AI/ML", icon: BrainCircuit },
          { name: "AWS", category: "Cloud", icon: Cloud },
          { name: "Docker", category: "DevOps", icon: Package },
          { name: "OAuth2", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-capabilities"
        tone="muted"
        title="AI capabilities"
        items={[
          { title: "Conversational AI", description: "Natural language understanding drives every voice interaction, not a fixed decision tree." },
          { title: "Voice Synthesis", description: "ElevenLabs-powered voice generation gives the agent a natural, human-like speaking voice." },
          { title: "Automation", description: "Live sports data is fetched and spoken back automatically as part of the conversation." },
        ]}
      />

      <TechStackGrid
        title="Integrations"
        description="Connect AI Voice Assistant to the calling and data infrastructure behind it."
        items={[
          { name: "ElevenLabs", category: "Voice Synthesis", icon: Mic },
          { name: "Twilio / WebRTC", category: "Voice Calling", icon: PhoneCall },
          { name: "Sports Data Providers", category: "Live Scores & Stats", icon: Server },
          { name: "Push Notifications", category: "Fan Alerts", icon: Bell },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits"
            features={[
              { name: "Higher Fan Engagement", desc: "A natural voice conversation keeps fans coming back between games, not just during them." },
              { name: "No Call Center Overhead", desc: "The AI agent handles conversation volume that would otherwise need live staff." },
              { name: "Always-On Availability", desc: "Fans can call in for updates any time, without waiting on business hours." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="industries"
        tone="muted"
        title="Where AI Voice Assistant fits"
        columns={2}
        items={[
          { title: "Social Media", description: "Extend fan engagement beyond feeds into live voice conversations.", href: "/industries/social-media" },
          { title: "Hotels", description: "Give guests at sports-focused venues a voice-first way to get live updates.", href: "/industries/hotels" },
        ]}
      />

      <ProductGallery
        title="Product gallery"
        description="A closer look at the AI Voice Assistant app."
        images={[
          { src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop", caption: "Mobile App Home" },
          { src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop", caption: "In-Call Voice View" },
          { src: "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=800&auto=format&fit=crop", caption: "Followed Teams" },
        ]}
      />

      <CaseStudyShowcase
        tone="muted"
        title="Case study"
        caseStudies={[
          {
            segment: "Sports Media",
            title: "Driving daily engagement for a sports fan app between live games",
            challenge: "A sports media app saw a sharp drop in daily engagement on non-game days, with fans having little reason to open the app between matches.",
            solution: "We launched the AI Voice Assistant so fans could call in anytime for live scores, standings, and updates on followed teams through a natural conversation.",
            metric: "+3.1x",
            metricLabel: "Non-game-day engagement",
          },
        ]}
      />

      <FAQAccordion
        faqs={[
          { question: "Does the AI voice really sound human?", answer: "The agent uses natural-sounding voice synthesis designed to feel like a real conversation, not a robotic IVR menu." },
          { question: "Which sports and leagues are supported?", answer: "Multiple sports and leagues are supported, with data sourced from live sports data providers." },
          { question: "Can fans call in from outside the app?", answer: "Voice conversations are initiated from within the hybrid app, keeping the experience consistent across devices." },
          { question: "How does the assistant personalize responses?", answer: "Fans follow specific teams and players, and the assistant tailors updates and answers to those preferences." },
          { question: "Is there a record of past conversations?", answer: "Yes, conversation history is saved so fans can revisit past updates from within the app." },
        ]}
      />

      <RelatedServices
        tone="muted"
        title="Related products"
        services={[
          { title: "Smart Spam Filter", description: "Keep spam calls off the same voice infrastructure powering fan conversations.", href: "/products/smart-spam-filter", icon: ShieldAlert },
          { title: "AI Job Board Portal", description: "Apply the same conversational AI approach to candidate screening calls.", href: "/products/ai-job-board-portal", icon: Briefcase },
          { title: "AI Construction Platform", description: "See a different application of RAG-based conversational AI in the field.", href: "/products/ai-construction-platform", icon: HardHat },
        ]}
      />

      <DetailCTA
        heading="Ready to give your fans someone to talk to?"
        description="See how AI Voice Assistant can turn a phone call into an engaging fan experience."
        ctaLabel="Request a Demo"
      />
    </div>
  );
}
