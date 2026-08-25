"use client";

import {
  Code2, Clock, Monitor, BarChart3, FolderGit2, Users, Calendar,
  GitBranch, Boxes, Palette, KeyRound, Send,
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
import { mernInternshipFaqs } from "./faqs";

export default function MernInternshipContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="internship-program"
        categoryLabel="internship"
        title="MERN Stack Internship"
        subtitle="Ship real full-stack features, not tutorials."
        description="An 8–12 week paid internship where you work inside a live MongoDB, Express, React, and Node.js codebase — building features for real, client-adjacent work under a mentor who ships the same stack."
        icon={Code2}
        image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Work on the same codebase our engineers ship to clients"
        paragraphs={[
          "This isn't the MERN Stack training program — it's the internship that follows it. You're placed directly on a feature team, working from the same ticket board, the same pull request process, and the same code review standards as our full-time engineers.",
          "You'll spend the first week ramping up on the codebase, then move into guided feature work, and by the second half of the internship, you'll be owning small features end to end — from ticket to deployed pull request.",
        ]}
        stats={[
          { label: "Duration", value: "8–12 Weeks", icon: Clock },
          { label: "Format", value: "Online & Offline", icon: Monitor },
          { label: "Track", value: "MERN Stack", icon: BarChart3 },
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
        description="Real feature work across the MERN stack, scoped to grow with your skill level."
        items={[
          { title: "React Feature Development", description: "Build and ship UI features and components used in live client-facing applications." },
          { title: "REST API Development", description: "Build and extend Express and Node.js endpoints for real product features." },
          { title: "MongoDB Schema Work", description: "Design and evolve schemas and queries alongside senior engineers." },
          { title: "Bug Fixes on Live Code", description: "Diagnose and resolve real reported issues in an active production codebase." },
          { title: "Code Review Participation", description: "Have your pull requests reviewed, and review others', as part of the team's normal workflow." },
          { title: "Deployment & QA", description: "Take features through staging, QA, and deployment as part of the delivery process." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies you'll work with"
        items={[
          { name: "MongoDB", category: "Database", icon: Boxes },
          { name: "Express.js", category: "Server Framework", icon: Send },
          { name: "React", category: "Frontend Library", icon: Code2 },
          { name: "Node.js", category: "Runtime", icon: BarChart3 },
          { name: "Redux Toolkit", category: "State Management", icon: Boxes },
          { name: "JWT & bcrypt", category: "Authentication", icon: KeyRound },
          { name: "Git & GitHub", category: "Version Control", icon: GitBranch },
          { name: "Tailwind CSS", category: "Styling", icon: Palette },
        ]}
      />

      <CurriculumTimeline
        title="How the internship is structured"
        description="A four-phase structure that moves you from onboarding to owning real feature work."
        modules={[
          { title: "Onboarding & Codebase Ramp-up", duration: "Week 1", topics: ["Repo, tooling, and environment setup", "Codebase and architecture walkthrough", "Meet your mentor and feature team", "First small, guided ticket"] },
          { title: "Guided Feature Work", duration: "Weeks 2–6", topics: ["Paired work on real React and Node.js tickets", "Daily standups and sprint planning", "Code review on every pull request", "Mid-internship progress check-in"] },
          { title: "Independent Feature Ownership", duration: "Weeks 7–10", topics: ["Own a feature end-to-end with mentor support", "Write and maintain tests for your code", "Participate in QA and deployment", "Document your work for the team"] },
          { title: "Final Presentation & Evaluation", duration: "Weeks 11–12", topics: ["Present your shipped work to the team", "Mentor evaluation and written feedback", "Certificate and LOR eligibility review", "Full-time opportunity discussion, if applicable"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="The kind of work interns actually ship"
        description="Real examples of feature scope MERN interns take on."
        projects={[
          { title: "Order Tracking Dashboard Feature", description: "Built a real-time order status view for an active e-commerce client engagement.", skills: ["React", "Node.js", "MongoDB"] },
          { title: "Admin Role Management Module", description: "Shipped a role-based access control feature for an internal admin panel.", skills: ["Express", "JWT", "MongoDB"] },
          { title: "Notification System Integration", description: "Added real-time in-app notifications to an existing product using Socket.io.", skills: ["Socket.io", "React", "Node.js"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="What makes this internship real"
            features={[
              { name: "Real Tickets, Not Sandboxes", desc: "You work from the same ticket board and codebase as our engineering team, on features that ship." },
              { name: "A Named Mentor", desc: "You're paired with one MERN engineer for the full internship who reviews your code and tracks your growth." },
              { name: "Agile Team Workflow", desc: "Standups, sprint planning, and retros — you experience how a real product team actually runs." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="eligibility"
        tone="muted"
        title="Eligibility"
        items={[
          { title: "JavaScript Fundamentals", description: "Comfortable with core JavaScript — functions, async/await, and array methods." },
          { title: "At Least One React or Node.js Project", description: "A personal or coursework project using React or Node.js, even a small one." },
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
          { title: "A Real Shipped Portfolio", description: "Merged pull requests on a live codebase you can show in interviews." },
          { title: "Full-time Consideration", description: "Top performers are considered first when MERN Stack Developer roles open." },
          { title: "A Direct Mentor Reference", description: "A working MERN engineer who can speak to your work firsthand." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why intern with YashOrbit"
            features={[
              { name: "You Ship, Not Just Learn", desc: "Every intern's work goes into a real deployed feature, not a personal sandbox project." },
              { name: "Mentors Who Are Still Building", desc: "You're reviewed by engineers actively shipping MERN code to clients, not dedicated training staff." },
              { name: "A Clear Path to Full-time", desc: "Strong performance is the primary path to a full-time offer, evaluated transparently." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={mernInternshipFaqs}
      />

      <DetailCTA
        heading="Ready to intern on real MERN Stack work?"
        description="Apply for the MERN Stack internship and start shipping features that actually go live."
        ctaLabel="Apply Now"
      />
    </div>
  );
}
