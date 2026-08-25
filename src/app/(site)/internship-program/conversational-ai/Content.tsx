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
import { conversationalAiInternshipFaqs } from "./faqs";

export default function ConversationalAiInternshipContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="internship-program"
        categoryLabel="internship"
        title="Conversational AI Internship"
        subtitle="Ship chatbots and voice assistants people use."
        description="An 8–12 week paid internship where you design and deploy real conversational experiences across chat and voice channels for actual business use cases, under a practicing conversational AI builder."
        icon={MessageSquare}
        image="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Move from conversation design theory to a deployed assistant"
        paragraphs={[
          "This is the internship that follows our Conversational AI training — you're placed on a real chatbot or voice assistant project, working on conversation flows, NLU components, or channel integrations tied to an actual business need.",
          "You'll ramp up on the project's conversation design and codebase in week one, move into guided flow-building work, and by the second half of the internship, you'll be owning a conversational feature end to end, from design through testing and deployment.",
        ]}
        stats={[
          { label: "Duration", value: "8–12 Weeks", icon: Clock },
          { label: "Format", value: "Online & Offline", icon: Monitor },
          { label: "Track", value: "Conversational AI", icon: BarChart3 },
          { label: "Stipend", value: "Performance-based", icon: FolderGit2 },
        ]}
      />

      <TrainingMeta
        items={[
          { icon: Monitor, label: "Mode", value: "Online / Offline" },
          { icon: Clock, label: "Duration", value: "8–12 Weeks" },
          { icon: Users, label: "Cohort Size", value: "4–6 Interns" },
          { icon: Calendar, label: "Schedule", value: "Full-time, Weekdays" },
        ]}
      />

      <ChecklistGrid
        id="work"
        title="What you'll work on"
        description="Real conversational product work, scoped to grow with your skill level."
        items={[
          { title: "Conversation Flow Design", description: "Map and build real dialogue flows for an actual chatbot or voice assistant." },
          { title: "Intent & Entity Work", description: "Build and tune intent classification and entity extraction for real user inputs." },
          { title: "Dialogue Management", description: "Implement and refine state and context tracking across multi-turn conversations." },
          { title: "Channel Integration", description: "Connect a bot to a real channel such as WhatsApp or a web widget." },
          { title: "Code Review Participation", description: "Have your pull requests reviewed, and review others', as part of the team's workflow." },
          { title: "Testing & Analytics Review", description: "Test conversation flows and use analytics to find and fix real drop-off points." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies you'll work with"
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
        title="How the internship is structured"
        description="A four-phase structure that moves you from onboarding to owning a real conversational feature."
        modules={[
          { title: "Onboarding & Project Ramp-up", duration: "Week 1", topics: ["Tooling and environment setup", "Conversation design and codebase walkthrough", "Meet your mentor and team", "First small, guided task"] },
          { title: "Guided Flow-building Work", duration: "Weeks 2–6", topics: ["Paired work on real dialogue and NLU tickets", "Daily standups and sprint planning", "Code review on every pull request", "Mid-internship progress check-in"] },
          { title: "Independent Feature Ownership", duration: "Weeks 7–10", topics: ["Own a conversational feature end-to-end with mentor support", "Run conversation testing", "Participate in deployment", "Document your work for the team"] },
          { title: "Final Presentation & Evaluation", duration: "Weeks 11–12", topics: ["Present your shipped work to the team", "Mentor evaluation and written feedback", "Certificate and LOR eligibility review", "Full-time opportunity discussion, if applicable"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="The kind of work interns actually ship"
        description="Real examples of feature scope Conversational AI interns take on."
        projects={[
          { title: "Order Status Intent Flow", description: "Built a new intent and dialogue flow for an active e-commerce support chatbot.", skills: ["NLU", "Webhooks", "LLM APIs"] },
          { title: "Voice Appointment Rescheduling", description: "Added a rescheduling flow to a live voice-enabled appointment assistant.", skills: ["Speech-to-Text", "Dialogue Management", "APIs"] },
          { title: "WhatsApp Lead Qualification Flow", description: "Shipped a lead qualification flow for a multi-channel bot on WhatsApp.", skills: ["Messaging APIs", "NLU", "Analytics"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="What makes this internship real"
            features={[
              { name: "Real Business Use Cases, Not Demos", desc: "You work on chatbot or voice features tied to actual support or sales needs." },
              { name: "A Named Mentor", desc: "You're paired with one conversational AI builder for the full internship who reviews your work." },
              { name: "Iterative Testing Practice", desc: "You practice the test-refine-redeploy loop real conversational AI teams use." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="eligibility"
        tone="muted"
        title="Eligibility"
        items={[
          { title: "Basic Python Knowledge", description: "Comfortable reading and writing basic Python is expected." },
          { title: "NLU Exposure Helpful", description: "Prior exposure to NLU concepts or our Conversational AI training program is a plus, but not mandatory." },
          { title: "Full-time Availability", description: "Able to commit to a full-time, weekday schedule for the internship's duration." },
          { title: "A GitHub Profile", description: "Any prior project work or coursework repos you can share with your application." },
        ]}
      />

      <ChecklistGrid
        id="benefits"
        title="What you walk away with"
        items={[
          { title: "Performance-based Stipend", description: "A paid internship, with stipend tied to your track and prior experience." },
          { title: "Certificate of Completion", description: "Awarded to every intern who completes the program's full evaluation." },
          { title: "Letter of Recommendation", description: "Issued to strong performers based on their mentor's written evaluation." },
          { title: "A Real Shipped Portfolio", description: "A deployed conversational feature you can show and speak to in interviews." },
          { title: "Full-time Consideration", description: "Top performers are considered first when Conversational AI roles open." },
          { title: "A Direct Mentor Reference", description: "A working conversational AI builder who can speak to your work firsthand." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why intern with YashOrbit"
            features={[
              { name: "You Ship, Not Just Learn", desc: "Every intern's work goes into a real deployed conversational feature, not a demo bot." },
              { name: "Mentors Who Are Still Building", desc: "You're reviewed by builders actively shipping conversational AI products to clients." },
              { name: "A Clear Path to Full-time", desc: "Strong performance is the primary path to a full-time offer, evaluated transparently." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={conversationalAiInternshipFaqs}
      />

      <DetailCTA
        heading="Ready to intern on real Conversational AI work?"
        description="Apply for the Conversational AI internship and start shipping assistants that actually go live."
        ctaLabel="Apply Now"
      />
    </div>
  );
}
