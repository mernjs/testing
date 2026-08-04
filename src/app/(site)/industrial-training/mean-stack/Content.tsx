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
import { meanStackFaqs } from "./faqs";

export default function MeanStackContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industrial-training"
        categoryLabel="industrial training"
        title="MEAN Stack Training"
        subtitle="Structured, enterprise-grade single-page apps."
        description="Learn MongoDB, Express, Angular, and Node.js — a fully TypeScript, opinionated stack designed for large codebases, strict typing, and teams that need structure over improvisation."
        icon={Database}
        image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Master Angular's architecture, not just its syntax"
        paragraphs={[
          "Angular takes a different approach from most frontend frameworks: it's opinionated, TypeScript-first, and built around dependency injection and modules. That structure is exactly why large engineering teams choose it for long-lived, enterprise applications.",
          "This program teaches Angular the way enterprise teams actually use it — services, reactive forms, RxJS observables, and NgRx state management — paired with Express and Node.js on the backend and MongoDB for storage.",
        ]}
        stats={[
          { label: "Duration", value: "12 Weeks", icon: Clock },
          { label: "Format", value: "Online & Offline", icon: Monitor },
          { label: "Level", value: "Beginner to Job-Ready", icon: BarChart3 },
          { label: "Projects", value: "4 Live Builds", icon: FolderGit2 },
        ]}
      />

      <TrainingMeta
        items={[
          { icon: Monitor, label: "Mode", value: "Online / Offline" },
          { icon: Clock, label: "Duration", value: "12 Weeks" },
          { icon: Users, label: "Batch Size", value: "15–20 Learners" },
          { icon: Calendar, label: "Schedule", value: "Weekday & Weekend" },
        ]}
      />

      <ChecklistGrid
        id="learn"
        title="What you will learn"
        description="The structured, framework-driven skill set enterprise Angular teams expect."
        items={[
          { title: "TypeScript for Angular", description: "Write strongly-typed components, services, and interfaces from day one." },
          { title: "Component Architecture", description: "Build modular UIs with Angular components, modules, and the Angular CLI." },
          { title: "Dependency Injection & Services", description: "Structure business logic into reusable, testable Angular services." },
          { title: "RxJS & Observables", description: "Handle async data streams the reactive way Angular is built around." },
          { title: "Reactive Forms & Validation", description: "Build robust forms with validation using Angular's reactive forms API." },
          { title: "REST APIs with Express & Node", description: "Build and secure the backend services your Angular app consumes." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools covered"
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
        title="Training roadmap"
        description="A structured path through Angular's architecture before layering on the backend."
        modules={[
          { title: "TypeScript & Angular Fundamentals", duration: "2 Weeks", topics: ["Types & interfaces", "Components & modules", "Directives & pipes", "Angular CLI workflow"] },
          { title: "Angular Architecture & Routing", duration: "3 Weeks", topics: ["Services & DI", "Routing & guards", "Reactive forms", "HttpClient"] },
          { title: "State Management with RxJS & NgRx", duration: "2 Weeks", topics: ["Observables & Subjects", "NgRx store", "Actions & reducers", "Effects"] },
          { title: "Node.js & Express APIs", duration: "2 Weeks", topics: ["REST API design", "Middleware", "Validation", "Error handling"] },
          { title: "MongoDB & Data Modeling", duration: "1 Week", topics: ["Schema design", "Mongoose", "Aggregation pipelines"] },
          { title: "Testing, Deployment & Capstone", duration: "2 Weeks", topics: ["Unit testing", "CI/CD basics", "Cloud hosting", "Final project demo"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Real-world projects you'll build"
        description="Projects modeled on the kind of internal tools enterprise teams build every day."
        projects={[
          { title: "Enterprise Admin Dashboard", description: "A role-based admin panel with data tables, charts, and permission-gated views.", skills: ["Angular", "NgRx", "Node.js"] },
          { title: "Inventory Management System", description: "A CRUD-heavy system with reactive forms and real-time stock level updates.", skills: ["MEAN", "RxJS", "MongoDB"] },
          { title: "Employee Portal with Auth", description: "A secure employee portal with JWT authentication, route guards, and profile management.", skills: ["Angular", "Express", "JWT"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Internship & industrial exposure"
            features={[
              { name: "Enterprise Codebase Exposure", desc: "Work inside larger, modular codebases structured the way real teams organize Angular apps." },
              { name: "Mentor Code Reviews", desc: "Get direct feedback on architecture and code quality from working engineers." },
              { name: "Sprint-based Delivery", desc: "Deliver features on a sprint cadence with tickets, standups, and demos." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Learning methodology"
            features={[
              { name: "Structure-first Teaching", desc: "Learn Angular's conventions and architecture before adding features on top." },
              { name: "1:1 Mentorship", desc: "Weekly sessions with a mentor to review your code and unblock you." },
              { name: "Applied Assessments", desc: "Skill checks based on shipping features, not theory quizzes." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="eligibility"
        title="Eligibility"
        items={[
          { title: "Any Educational Background", description: "Open to students, freshers, and career switchers." },
          { title: "Basic Computer Literacy", description: "Comfort using a computer and browser is enough to get started." },
          { title: "JavaScript Basics Helpful", description: "Prior exposure to JavaScript speeds up the TypeScript ramp-up, but isn't required." },
          { title: "Consistent Time Commitment", description: "10–12 hours a week for coding practice and assignments." },
        ]}
      />

      <ChecklistGrid
        id="career"
        tone="muted"
        title="Career opportunities"
        items={[
          { title: "Angular Developer", description: "Specialize in building and maintaining large-scale Angular applications." },
          { title: "Full Stack Developer (MEAN)", description: "Own features across Angular frontends and Node.js backends." },
          { title: "Frontend Engineer, Enterprise Apps", description: "Work on internal tools and dashboards for enterprise product teams." },
          { title: "Backend Developer (Node.js)", description: "Focus on APIs, services, and data modeling." },
          { title: "Software Engineer, Enterprise Teams", description: "Join teams that prioritize structure, typing, and maintainability." },
          { title: "Freelance Angular Developer", description: "Take on enterprise client projects with a complete, in-demand skill set." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit"
            features={[
              { name: "Enterprise-aligned Curriculum", desc: "Built around the patterns enterprise Angular teams actually use." },
              { name: "Placement Assistance", desc: "Resume reviews, mock interviews, and referrals to hiring partners." },
              { name: "Real Deployment Experience", desc: "Ship every project to a live environment, not just localhost." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        tone="muted"
        faqs={meanStackFaqs}
      />

      <DetailCTA
        heading="Ready to master enterprise-grade Angular development?"
        description="Join the next batch and build a portfolio of structured, production-style MEAN applications."
        ctaLabel="Enroll Now"
      />
    </div>
  );
}
