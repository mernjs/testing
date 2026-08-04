"use client";

import {
  GraduationCap, Clock, Users, ShieldCheck, Headphones,
  Code2, Server, Video, Database, Cloud, Zap, Blocks, KeyRound,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import CaseStudyShowcase from "@/components/sections/CaseStudyShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import FAQAccordion from "@/components/sections/FAQAccordion";
import DetailCTA from "@/components/sections/DetailCTA";
import { educationFaqs } from "./faqs";

export default function EducationContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industries"
        categoryLabel="industries"
        title="Education"
        subtitle="Transforming modern education."
        description="We build intuitive learning management systems, virtual classrooms, and educational games that make learning accessible, engaging, and effective for students worldwide."
        icon={GraduationCap}
        image="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Built for how students actually learn today"
        paragraphs={[
          "Education has moved past the single classroom. Institutions now run hybrid programs, live virtual classes, and self-paced modules side by side — and students expect all of it to feel like one connected experience, not three disconnected tools.",
          "We build full-stack education platforms — LMS cores, live classrooms, gamified learning, and progress analytics — designed around the realities of education: enrollment spikes, accessibility requirements, and the need to keep students engaged past week one.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "4–8 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Compliance", value: "FERPA & COPPA Ready", icon: ShieldCheck },
          { label: "Support", value: "24/7 Platform SLA", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Industry challenges"
        description="The problems education platforms run into once they leave the pilot phase."
        items={[
          { title: "Falling Engagement & Dropout Rates", description: "Online courses often see completion rates as low as 15% without frequent feedback and real motivation loops." },
          { title: "Fragmented Learning Tools", description: "Institutions juggle separate systems for video, grading, and content, creating a disjointed student experience." },
          { title: "Scaling Live Classrooms Reliably", description: "Video infrastructure that works for 30 students often breaks down at 3,000 during peak enrollment." },
          { title: "Academic Integrity at Scale", description: "Remote assessments open the door to cheating without proper proctoring and identity verification." },
          { title: "Accessibility Gaps", description: "Many platforms fail learners with disabilities or unreliable internet, excluding a large share of potential users." },
          { title: "Data Silos Across Stakeholders", description: "Teachers, parents, and administrators rarely see the same real-time picture of student progress." },
        ]}
      />

      <ChecklistGrid
        id="solutions"
        tone="muted"
        title="Our solutions"
        description="How we translate these challenges into platform decisions."
        items={[
          { title: "Adaptive Learning Paths", description: "Systems that adjust content difficulty and pacing based on real-time student performance." },
          { title: "Unified LMS Architecture", description: "One platform for content, grading, communication, and analytics instead of stitched-together tools." },
          { title: "Scalable Live-Class Infrastructure", description: "CDN-backed WebRTC video architecture built to handle classroom-to-webinar scale without degrading quality." },
          { title: "AI-Assisted Proctoring", description: "Identity verification and behavior monitoring that protects academic integrity without being invasive." },
          { title: "Accessibility-First Design", description: "WCAG-compliant interfaces, offline-friendly content, and low-bandwidth modes built in from day one." },
          { title: "Unified Reporting Dashboards", description: "A single source of truth for progress data shared across teachers, parents, and administrators." },
        ]}
      />

      <ChecklistGrid
        id="services"
        title="Services we offer for Education"
        description="The parts of our service catalog most relevant to education platforms."
        items={[
          { title: "Web App Development", description: "Custom LMS and learning portals built for scale.", href: "/services/web-app-development" },
          { title: "Mobile App Development", description: "iOS and Android learning apps for studying on the go.", href: "/services/mobile-app-development" },
          { title: "AI/ML Solutions", description: "Adaptive learning engines and performance prediction models.", href: "/services/ai-ml-solutions" },
          { title: "AI Agent", description: "24/7 student support chatbots and tutoring assistants.", href: "/services/ai-agent" },
          { title: "Prediction & Forecasting", description: "Early dropout-risk detection using engagement analytics.", href: "/services/prediction-and-forecasting" },
          { title: "AR/VR", description: "Immersive simulations for STEM and vocational training.", href: "/services/ar-vr" },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        description="The stack we typically reach for on education platforms."
        items={[
          { name: "React / Next.js", category: "Frontend", icon: Code2 },
          { name: "Node.js", category: "Backend", icon: Server },
          { name: "WebRTC", category: "Live Video", icon: Video },
          { name: "PostgreSQL / MongoDB", category: "Data Layer", icon: Database },
          { name: "AWS / GCP", category: "Cloud Infrastructure", icon: Cloud },
          { name: "Redis", category: "Caching & Realtime", icon: Zap },
          { name: "LTI / SCORM", category: "Interoperability", icon: Blocks },
          { name: "OAuth / SSO", category: "Identity & Access", icon: KeyRound },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation opportunities"
        description="Where AI creates the most leverage in an education platform."
        items={[
          { title: "Dropout Risk Scoring", description: "Predictive models that flag disengaged students before they drop off, so advisors can step in early." },
          { title: "Automated Grading Assistance", description: "AI-assisted grading for short-answer and essay responses to reduce instructor workload." },
          { title: "Personalized Content Recommendations", description: "Suggest the next lesson or resource based on a student's actual performance and pace." },
          { title: "AI Tutoring Assistants", description: "Always-available chat-based tutors that answer common questions outside class hours." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Business benefits"
            features={[
              { name: "Higher Student Retention", desc: "Engagement-driven design keeps students enrolled and progressing, protecting tuition revenue." },
              { name: "Lower Operational Overhead", desc: "A unified platform reduces the licensing and support cost of juggling multiple point tools." },
              { name: "Faster Time to Market", desc: "Reusable platform components let new programs launch in weeks, not semesters." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="features"
        tone="muted"
        title="Key features"
        items={[
          { title: "Live & On-demand Classrooms", description: "Host live sessions and automatically archive them as on-demand content." },
          { title: "Gamified Progress Tracking", description: "Badges, streaks, and leaderboards that keep learners coming back." },
          { title: "Multi-role Dashboards", description: "Tailored views for students, teachers, parents, and administrators." },
          { title: "Automated Assessments", description: "Auto-graded quizzes with configurable question banks and randomization." },
        ]}
      />

      <CurriculumTimeline
        title="Our development process"
        description="How we take an education platform from concept to a stable, scaling product."
        modules={[
          { title: "Discovery & Learning Design", duration: "3–5 Days", topics: ["Stakeholder workshops", "Curriculum mapping", "Learner personas", "Success metrics"] },
          { title: "UX & Architecture", duration: "1 Week", topics: ["Wireframes", "Accessibility audit", "System architecture", "Content model"] },
          { title: "Core Platform Build", duration: "2–3 Weeks", topics: ["LMS core", "Live classroom integration", "Assessment engine", "Progress tracking"] },
          { title: "AI & Analytics Layer", duration: "1–2 Weeks", topics: ["Adaptive learning logic", "Engagement analytics", "Dropout risk scoring"] },
          { title: "Testing & Compliance", duration: "3–5 Days", topics: ["Accessibility testing", "Load testing", "FERPA/COPPA review", "Security audit"] },
          { title: "Launch & Iteration", duration: "Ongoing", topics: ["Phased rollout", "Teacher onboarding", "Usage monitoring", "Continuous improvement"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of education products we build across K-12, higher ed, and corporate training."
        projects={[
          { title: "Virtual K-12 Classroom Suite", description: "A full virtual classroom with breakout rooms, live polls, and attendance tracking for a multi-campus school network.", skills: ["Live Video", "Attendance", "Analytics"] },
          { title: "Corporate Upskilling Portal", description: "A gamified LMS helping enterprises train employees with certifications and progress leaderboards.", skills: ["Gamification", "SCORM", "Reporting"] },
          { title: "Adaptive Test Prep Platform", description: "An assessment engine that adjusts question difficulty in real time based on student performance.", skills: ["Adaptive Engine", "AI/ML", "Analytics"] },
        ]}
      />

      <CaseStudyShowcase
        title="Success stories"
        description="Two examples of the kind of outcomes our education platforms drive."
        caseStudies={[
          {
            segment: "Higher Education",
            title: "Boosting course completion for a hybrid university program",
            challenge: "A university's hybrid degree program had a 42% course completion rate, with students citing disengagement and lack of progress visibility as top reasons for dropping out.",
            solution: "We rebuilt their LMS with adaptive pacing, weekly progress nudges, and a unified dashboard shared between students and advisors.",
            metric: "+58%",
            metricLabel: "Increase in course completion rate",
          },
          {
            segment: "K-12 Network",
            title: "Scaling live classrooms across 40 campuses",
            challenge: "A K-12 network's video infrastructure repeatedly crashed during peak enrollment periods, disrupting classes for thousands of students.",
            solution: "We re-architected their live classroom stack on a CDN-backed WebRTC pipeline built to autoscale with enrollment spikes.",
            metric: "99.95%",
            metricLabel: "Platform uptime during peak terms",
          },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit for Education"
            features={[
              { name: "Education-specific Expertise", desc: "We understand FERPA, COPPA, and the realities of classroom adoption, not just generic software delivery." },
              { name: "Built for Scale from Day One", desc: "Our architecture choices assume enrollment spikes and peak-term traffic, not steady-state usage." },
              { name: "Long-term Platform Partnership", desc: "We stay involved post-launch, iterating on engagement data rather than disappearing after go-live." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={educationFaqs}
      />

      <DetailCTA
        heading="Ready to modernize your education platform?"
        description="Let's talk about your students, your challenges, and how we can help you build a platform they'll actually want to use."
        ctaLabel="Get a Free Consultation"
      />
    </div>
  );
}
