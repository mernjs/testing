"use client";

import {
  Database, Clock, Monitor, BarChart3, FolderGit2, Users, Calendar,
  Boxes, Send, Braces, Workflow, Palette, Server,
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
import { meanInternshipFaqs } from "./faqs";

export default function MeanInternshipContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="internship-program"
        categoryLabel="internship"
        title="MEAN Stack Internship"
        subtitle="Work inside a real enterprise-grade codebase."
        description="An 8–12 week paid internship where you work inside a live MongoDB, Express, Angular, and Node.js codebase — structured the way enterprise teams actually build, under a mentor shipping the same stack."
        icon={Database}
        image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Learn Angular's discipline by working inside it"
        paragraphs={[
          "This is the internship that follows our MEAN Stack training — you're placed on a team maintaining a real, modular Angular application, working from the same ticket board and code review process as our full-time engineers.",
          "You'll ramp up on the codebase's architecture in week one, move into guided ticket work, and by the second half of the internship, you'll be owning small Angular features and services end to end.",
        ]}
        stats={[
          { label: "Duration", value: "8–12 Weeks", icon: Clock },
          { label: "Format", value: "Online & Offline", icon: Monitor },
          { label: "Track", value: "MEAN Stack", icon: BarChart3 },
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
        description="Real feature work across the MEAN stack, scoped to grow with your skill level."
        items={[
          { title: "Angular Component Development", description: "Build and ship UI components and modules used in enterprise-style applications." },
          { title: "Service & State Management", description: "Work with Angular services, RxJS, and NgRx on real application state." },
          { title: "Node.js & Express APIs", description: "Build and extend backend endpoints consumed by the Angular frontend." },
          { title: "Bug Fixes on Live Code", description: "Diagnose and resolve real reported issues in an active, structured codebase." },
          { title: "Code Review Participation", description: "Have your pull requests reviewed, and review others', as part of the team's normal workflow." },
          { title: "Testing & Deployment", description: "Write unit tests and take features through staging and deployment." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies you'll work with"
        items={[
          { name: "MongoDB", category: "Database", icon: Boxes },
          { name: "Express.js", category: "Server Framework", icon: Send },
          { name: "Angular", category: "Frontend Framework", icon: Braces },
          { name: "Node.js", category: "Runtime", icon: Server },
          { name: "TypeScript", category: "Language", icon: Braces },
          { name: "RxJS", category: "Reactive Programming", icon: Workflow },
          { name: "NgRx", category: "State Management", icon: Boxes },
          { name: "Angular Material", category: "UI Components", icon: Palette },
        ]}
      />

      <CurriculumTimeline
        title="How the internship is structured"
        description="A four-phase structure that moves you from onboarding to owning real Angular feature work."
        modules={[
          { title: "Onboarding & Codebase Ramp-up", duration: "Week 1", topics: ["Repo, tooling, and environment setup", "Angular architecture walkthrough", "Meet your mentor and feature team", "First small, guided ticket"] },
          { title: "Guided Feature Work", duration: "Weeks 2–6", topics: ["Paired work on real Angular and Node.js tickets", "Daily standups and sprint planning", "Code review on every pull request", "Mid-internship progress check-in"] },
          { title: "Independent Feature Ownership", duration: "Weeks 7–10", topics: ["Own a feature end-to-end with mentor support", "Write and maintain unit tests", "Participate in QA and deployment", "Document your work for the team"] },
          { title: "Final Presentation & Evaluation", duration: "Weeks 11–12", topics: ["Present your shipped work to the team", "Mentor evaluation and written feedback", "Certificate and LOR eligibility review", "Full-time opportunity discussion, if applicable"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="The kind of work interns actually ship"
        description="Real examples of feature scope MEAN interns take on."
        projects={[
          { title: "Admin Dashboard Data Table", description: "Built a sortable, filterable data table feature for an enterprise admin panel.", skills: ["Angular", "NgRx", "Node.js"] },
          { title: "Reactive Form Workflow", description: "Shipped a multi-step reactive form with validation for an internal tool.", skills: ["Angular", "RxJS", "TypeScript"] },
          { title: "Role-based Route Guards", description: "Implemented route guards and permission checks for a secure employee portal.", skills: ["Angular", "Express", "JWT"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="What makes this internship real"
            features={[
              { name: "Real Tickets, Not Sandboxes", desc: "You work from the same ticket board and codebase as our engineering team, on features that ship." },
              { name: "A Named Mentor", desc: "You're paired with one Angular engineer for the full internship who reviews your code and tracks your growth." },
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
          { title: "TypeScript & JavaScript Fundamentals", description: "Comfortable with core JavaScript and basic TypeScript typing." },
          { title: "Angular Exposure Helpful", description: "Prior coursework or a personal project using Angular is a plus, but not mandatory." },
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
          { title: "Full-time Consideration", description: "Top performers are considered first when Angular or MEAN Stack roles open." },
          { title: "A Direct Mentor Reference", description: "A working Angular engineer who can speak to your work firsthand." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why intern with YashOrbit"
            features={[
              { name: "You Ship, Not Just Learn", desc: "Every intern's work goes into a real deployed feature, not a personal sandbox project." },
              { name: "Mentors Who Are Still Building", desc: "You're reviewed by engineers actively shipping Angular code to clients, not dedicated training staff." },
              { name: "A Clear Path to Full-time", desc: "Strong performance is the primary path to a full-time offer, evaluated transparently." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={meanInternshipFaqs}
      />

      <DetailCTA
        heading="Ready to intern on real MEAN Stack work?"
        description="Apply for the MEAN Stack internship and start shipping enterprise-grade Angular features that actually go live."
        ctaLabel="Apply Now"
      />
    </div>
  );
}
