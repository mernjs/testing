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
import { mernStackFaqs } from "./faqs";

export default function MernStackContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industrial-training"
        categoryLabel="training"
        title="MERN Stack Training"
        subtitle="Full-stack JavaScript, one project at a time."
        description="Learn to design, build, and ship complete web applications using MongoDB, Express, React, and Node.js — the same stack running production software at thousands of startups."
        icon={Code2}
        image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Go from JavaScript basics to a deployed full-stack app"
        paragraphs={[
          "The MERN stack — MongoDB, Express, React, and Node.js — lets you write your entire application in JavaScript, from the database to the browser. That consistency is exactly why it's one of the most in-demand stacks for startups and product teams building fast.",
          "This program is built around one idea: you learn by shipping. Every concept — routing, state management, schema design, authentication — is taught in the context of a real feature you're building, not an isolated exercise you'll forget in a week.",
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
        description="A practical curriculum that mirrors how full-stack teams actually build software."
        items={[
          { title: "RESTful API Design", description: "Build and secure APIs with Express and Node.js, from routing to error handling." },
          { title: "Modern React Development", description: "Build interactive UIs with components, hooks, and client-side routing." },
          { title: "MongoDB & Data Modeling", description: "Design schemas, write queries, and work with Mongoose in real projects." },
          { title: "State Management", description: "Manage complex UI state with Context API and Redux Toolkit." },
          { title: "Authentication & Authorization", description: "Implement JWT-based auth, password hashing, and role-based access." },
          { title: "Deployment & DevOps Basics", description: "Ship your apps to the cloud with CI/CD, environment configs, and monitoring." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools covered"
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
        title="Training roadmap"
        description="A structured, six-module path from fundamentals to a deployed capstone project."
        modules={[
          { title: "JavaScript & Web Fundamentals", duration: "2 Weeks", topics: ["ES6+ syntax", "Async/await & Promises", "DOM manipulation", "Git basics"] },
          { title: "React Frontend Development", duration: "3 Weeks", topics: ["Components & props", "Hooks", "Client-side routing", "State management"] },
          { title: "Node.js & Express APIs", duration: "2 Weeks", topics: ["REST API design", "Middleware", "Error handling", "File uploads"] },
          { title: "MongoDB & Data Modeling", duration: "2 Weeks", topics: ["Schema design", "Mongoose", "Aggregation", "Indexing"] },
          { title: "Authentication & Security", duration: "1 Week", topics: ["JWT auth", "Password hashing", "Role-based access", "Input validation"] },
          { title: "Deployment & Capstone Project", duration: "2 Weeks", topics: ["CI/CD basics", "Cloud hosting", "Performance tuning", "Final project demo"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Real-world projects you'll build"
        description="Every project mirrors a real product requirement, not a toy exercise."
        projects={[
          { title: "E-commerce Storefront", description: "A full shopping experience with cart, checkout, payments, and an admin dashboard for inventory.", skills: ["React", "Node.js", "MongoDB", "Stripe"] },
          { title: "Real-time Chat Application", description: "A messaging app with live updates, typing indicators, and persisted conversation history.", skills: ["Socket.io", "Express", "React"] },
          { title: "Job Board Platform", description: "A job listing platform with search, filters, saved listings, and role-based authentication.", skills: ["MERN", "JWT", "MongoDB Atlas"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Internship & industrial exposure"
            features={[
              { name: "Live Client-style Projects", desc: "Work on briefs modeled after real client requirements, not sandboxed tutorials." },
              { name: "Code Reviews from Mentors", desc: "Get direct feedback on your pull requests from working engineers." },
              { name: "Agile Team Workflow", desc: "Practice standups, sprints, and ticket-based work like a real dev team." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Learning methodology"
            features={[
              { name: "Project-first Learning", desc: "Every concept is introduced through the feature you're about to build." },
              { name: "1:1 Mentorship", desc: "Weekly check-ins with a mentor to unblock you and review your code." },
              { name: "Applied Assessments", desc: "Skill checks based on building, not multiple-choice quizzes." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="eligibility"
        title="Eligibility"
        items={[
          { title: "Any Educational Background", description: "Open to students, freshers, and career switchers — a CS degree isn't required." },
          { title: "Basic Computer Literacy", description: "Comfort using a computer and browser is enough to get started." },
          { title: "HTML/CSS Helps, Isn't Mandatory", description: "Prior exposure to web basics is useful but we cover fundamentals from scratch." },
          { title: "Consistent Time Commitment", description: "10–12 hours a week for coding practice and assignments." },
        ]}
      />

      <ChecklistGrid
        id="career"
        tone="muted"
        title="Career opportunities"
        items={[
          { title: "Full Stack Developer", description: "Own features across the frontend and backend of a product." },
          { title: "Frontend Developer (React)", description: "Specialize in building interactive, component-driven interfaces." },
          { title: "Backend Developer (Node.js)", description: "Focus on APIs, databases, and server-side architecture." },
          { title: "MERN Stack Engineer", description: "Work end-to-end on JavaScript-based product teams." },
          { title: "Software Engineer, Startups", description: "Join early-stage teams that value shipping fast." },
          { title: "Freelance Web Developer", description: "Take on client projects with a complete, marketable skill set." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit"
            features={[
              { name: "Industry-aligned Curriculum", desc: "Built and updated with input from practicing engineers." },
              { name: "Placement Assistance", desc: "Resume reviews, mock interviews, and referrals to hiring partners." },
              { name: "Real Deployment Experience", desc: "You'll ship every project to a live URL, not just localhost." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        tone="muted"
        faqs={mernStackFaqs}
      />

      <DetailCTA
        heading="Ready to start building with the MERN stack?"
        description="Join the next batch and go from fundamentals to a deployed full-stack portfolio."
        ctaLabel="Enroll Now"
        category="industrial-training"
        subService="mern-stack"
      />
    </div>
  );
}
