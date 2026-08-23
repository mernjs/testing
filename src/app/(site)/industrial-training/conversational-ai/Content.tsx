"use client";

import {
  MessageSquare, Clock, Monitor, BarChart3, FolderGit2, Users, Calendar,
  Braces, Workflow, Puzzle, Mic, Network, Sparkles, Gauge,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import TrainingMeta from "@/components/sections/TrainingMeta";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";
import { conversationalAiFaqs } from "./faqs";

export default function ConversationalAiContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industrial-training"
        categoryLabel="training"
        title="Conversational AI Training"
        subtitle="Chatbots and voice assistants people actually enjoy using."
        description="Learn to design and build task-oriented conversational experiences — from understanding user intent to managing multi-turn dialogue — and deploy them across chat and voice channels for real businesses."
        icon={MessageSquare}
        image="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Design conversations, not just canned replies"
        paragraphs={[
          "A good conversational experience isn't a decision tree of canned replies — it understands what the user means, keeps track of context across turns, and knows when to hand off to a human. That's a distinct discipline combining NLU, dialogue design, and increasingly, LLMs.",
          "This program covers the full path: intent and entity recognition, dialogue management, voice interfaces, and integrating your bot into real channels like WhatsApp and web widgets — with a strong focus on conversation design, not just the underlying models.",
        ]}
        stats={[
          { label: "Duration", value: "10 Weeks", icon: Clock },
          { label: "Format", value: "Online & Offline", icon: Monitor },
          { label: "Level", value: "Beginner to Job-Ready", icon: BarChart3 },
          { label: "Projects", value: "3 Applied Builds", icon: FolderGit2 },
        ]}
      />

      <TrainingMeta
        items={[
          { icon: Monitor, label: "Mode", value: "Online / Offline" },
          { icon: Clock, label: "Duration", value: "10 Weeks" },
          { icon: Users, label: "Batch Size", value: "15–20 Learners" },
          { icon: Calendar, label: "Schedule", value: "Weekday & Weekend" },
        ]}
      />

      <ChecklistGrid
        id="learn"
        title="What you will learn"
        description="The design and engineering skills behind conversational experiences that don't frustrate users."
        items={[
          { title: "Conversation Design Principles", description: "Map user journeys, design fallback paths, and write dialogue that feels natural." },
          { title: "Intent & Entity Recognition", description: "Classify what users want and extract the details needed to act on it." },
          { title: "Dialogue Management", description: "Track context and state across multi-turn conversations reliably." },
          { title: "Voice Interfaces", description: "Work with speech-to-text and text-to-speech to build voice-first experiences." },
          { title: "Channel Integration", description: "Deploy bots to WhatsApp, web widgets, and other messaging channels." },
          { title: "Testing & Analytics", description: "Test conversation flows and use analytics to find and fix drop-off points." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools covered"
        items={[
          { name: "Python", category: "Core Language", icon: Braces },
          { name: "NLU Frameworks", category: "Intent Recognition", icon: Workflow },
          { name: "Entity Extraction", category: "Slot Filling", icon: Puzzle },
          { name: "Speech-to-Text / TTS", category: "Voice Interfaces", icon: Mic },
          { name: "Messaging APIs", category: "Channel Integration", icon: Network },
          { name: "LLM APIs", category: "Dialogue Generation", icon: Sparkles },
          { name: "Webhooks", category: "Backend Integration", icon: MessageSquare },
          { name: "Conversation Analytics", category: "Observability", icon: Gauge },
        ]}
      />

      <CurriculumTimeline
        title="Training roadmap"
        description="From conversation design fundamentals to a deployed, multi-channel assistant."
        modules={[
          { title: "Conversational Design Foundations", duration: "2 Weeks", topics: ["Conversation flows", "User journey mapping", "Intents & entities", "Fallback handling"] },
          { title: "Natural Language Understanding", duration: "2 Weeks", topics: ["Intent classification", "Entity extraction", "Slot filling", "Multi-turn context"] },
          { title: "Dialogue Management", duration: "2 Weeks", topics: ["State & context tracking", "Dialogue policies", "LLM-assisted responses", "Personalization"] },
          { title: "Voice Interfaces", duration: "1 Week", topics: ["Speech-to-text", "Text-to-speech", "Voice UX considerations"] },
          { title: "Channel Integration & Backend Hooks", duration: "2 Weeks", topics: ["WhatsApp & web widgets", "Webhooks", "API integration", "Auth handoff"] },
          { title: "Testing, Analytics & Capstone", duration: "1 Week", topics: ["Conversation testing", "Drop-off analytics", "Final project demo"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Real-world projects you'll build"
        description="Assistants modeled on the kind of support and sales bots real businesses run."
        projects={[
          { title: "E-commerce Support Chatbot", description: "A chatbot that handles order status, returns, and common FAQs end to end.", skills: ["NLU", "Webhooks", "LLM APIs"] },
          { title: "Voice-enabled Appointment Assistant", description: "A voice assistant that books and reschedules appointments through natural conversation.", skills: ["Speech-to-Text", "Dialogue Management", "APIs"] },
          { title: "Multi-channel Lead Qualification Bot", description: "A bot that qualifies inbound leads consistently across web chat and WhatsApp.", skills: ["Messaging APIs", "NLU", "Analytics"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Internship & industrial exposure"
            features={[
              { name: "Real Business Use Cases", desc: "Work on chatbot briefs modeled after real support and sales requirements." },
              { name: "Mentor Reviews on Conversation Flows", desc: "Get direct feedback on dialogue design from practicing conversational AI builders." },
              { name: "Iterative Testing Practice", desc: "Practice the test-refine-redeploy loop real conversational AI teams use." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Learning methodology"
            features={[
              { name: "Design-then-build Workflow", desc: "Every bot starts with a conversation design pass before any code is written." },
              { name: "1:1 Mentorship", desc: "Weekly sessions with a mentor to review your flows and unblock you." },
              { name: "Applied Assessments", desc: "Evaluated on working conversation flows, not theory quizzes." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="eligibility"
        title="Eligibility"
        items={[
          { title: "Any Educational Background", description: "Open to students, developers, and career switchers interested in conversational products." },
          { title: "Basic Python Helpful", description: "Some familiarity with Python speeds up the technical modules, but isn't mandatory to start." },
          { title: "No Prior NLU Experience Required", description: "We teach intent and entity recognition concepts from scratch." },
          { title: "Consistent Time Commitment", description: "8–10 hours a week for design practice and building." },
        ]}
      />

      <ChecklistGrid
        id="career"
        tone="muted"
        title="Career opportunities"
        items={[
          { title: "Conversational AI Developer", description: "Build and maintain chatbot and voice assistant products." },
          { title: "Chatbot Engineer", description: "Focus on the technical implementation of NLU and dialogue systems." },
          { title: "Voice AI Developer", description: "Specialize in speech-driven interfaces and voice UX." },
          { title: "Conversation Designer", description: "Own the dialogue design and user journey for AI assistants." },
          { title: "NLU Engineer", description: "Build and tune intent and entity recognition models." },
          { title: "Freelance Chatbot Developer", description: "Deliver custom conversational assistants for clients." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit"
            features={[
              { name: "Design-first Curriculum", desc: "Conversation design is taught as a core skill, not an afterthought to the tech." },
              { name: "Placement Assistance", desc: "Resume reviews, mock interviews, and referrals to hiring partners." },
              { name: "Real Deployment Experience", desc: "Every bot is deployed to a real channel, not just a local test console." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        tone="muted"
        faqs={conversationalAiFaqs}
      />

      <DetailCTA
        heading="Ready to design conversations people actually enjoy?"
        description="Join the next batch and build deployed chatbot and voice assistant experiences from scratch."
        ctaLabel="Enroll Now"
      />
    </div>
  );
}
