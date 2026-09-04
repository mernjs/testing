"use client";

import {
  ScanEye, Clock, Monitor, BarChart3, FolderGit2, Users, Calendar,
  Braces, Camera, BrainCircuit, Network, ScanFace, ImageIcon, Video, Package,
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
import { computerVisionInternshipFaqs } from "./faqs";

export default function ComputerVisionInternshipContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="internship-program"
        categoryLabel="internship"
        title="Computer Vision Internship"
        subtitle="Ship real detection and vision systems."
        description="An 8–12 week paid internship where you work on real image and video pipelines — detection, OCR, video analytics — deployed to production, under a practicing computer vision engineer."
        icon={ScanEye}
        image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Move from training notebooks to a deployed vision system"
        paragraphs={[
          "This is the internship that follows our Computer Vision training — you're placed on a real vision project, working on detection, OCR, or video analytics tied to an actual manufacturing, security, or document-processing requirement.",
          "You'll ramp up on the project's data and pipeline in week one, move into guided model and pipeline work, and by the second half of the internship, you'll be owning a vision feature end to end, from data through evaluation and deployment.",
        ]}
        stats={[
          { label: "Duration", value: "8–12 Weeks", icon: Clock },
          { label: "Format", value: "Online & Offline", icon: Monitor },
          { label: "Track", value: "Computer Vision", icon: BarChart3 },
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
        description="Real vision pipeline work, scoped to grow with your skill level."
        items={[
          { title: "Image Processing Pipeline Work", description: "Build and refine preprocessing steps for a real image or video dataset." },
          { title: "Model Training & Evaluation", description: "Train, evaluate, and tune a detection or classification model on real data." },
          { title: "Object Detection Features", description: "Build or extend detection and localization features for a live project." },
          { title: "OCR & Document Pipelines", description: "Work on structured data extraction from real scanned documents or images." },
          { title: "Code Review Participation", description: "Have your pull requests reviewed, and review others', as part of the team's workflow." },
          { title: "Model Optimization & Deployment", description: "Help optimize and deploy models to a real cloud or edge environment." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies you'll work with"
        items={[
          { name: "Python", category: "Core Language", icon: Braces },
          { name: "OpenCV", category: "Image Processing", icon: Camera },
          { name: "PyTorch / TensorFlow", category: "Deep Learning", icon: BrainCircuit },
          { name: "CNN Architectures", category: "Model Design", icon: Network },
          { name: "Object Detection Models", category: "Detection", icon: ScanFace },
          { name: "OCR Engines", category: "Text Recognition", icon: ImageIcon },
          { name: "Video Analytics", category: "Real-time Processing", icon: Video },
          { name: "ONNX & Edge Deployment", category: "Model Deployment", icon: Package },
        ]}
      />

      <CurriculumTimeline
        title="How the internship is structured"
        description="A four-phase structure that moves you from onboarding to owning a real vision feature."
        modules={[
          { title: "Onboarding & Project Ramp-up", duration: "Week 1", topics: ["Tooling and environment setup", "Data and pipeline walkthrough", "Meet your mentor and team", "First small, guided task"] },
          { title: "Guided Model & Pipeline Work", duration: "Weeks 2–6", topics: ["Paired work on real training and pipeline tickets", "Daily standups and sprint planning", "Code review on every pull request", "Mid-internship progress check-in"] },
          { title: "Independent Feature Ownership", duration: "Weeks 7–10", topics: ["Own a vision feature end-to-end with mentor support", "Run model evaluation and benchmarking", "Participate in deployment", "Document your work for the team"] },
          { title: "Final Presentation & Evaluation", duration: "Weeks 11–12", topics: ["Present your shipped work to the team", "Mentor evaluation and written feedback", "Certificate and LOR eligibility review", "Full-time opportunity discussion, if applicable"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="The kind of work interns actually ship"
        description="Real examples of feature scope Computer Vision interns take on."
        projects={[
          { title: "Defect Detection Model Tuning", description: "Improved detection accuracy on a live manufacturing defect classification model.", skills: ["CNNs", "OpenCV", "Transfer Learning"] },
          { title: "Attendance System Face Matching", description: "Added a face-matching improvement to a live automated attendance system.", skills: ["Object Detection", "OpenCV", "Python"] },
          { title: "Invoice Field Extraction", description: "Built a new field-extraction rule set for an OCR pipeline processing real invoices.", skills: ["OCR", "Preprocessing", "Python"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="What makes this internship real"
            features={[
              { name: "Real Datasets, Not Benchmarks", desc: "You work with messy, real-world image and video data, not clean benchmark datasets." },
              { name: "A Named Mentor", desc: "You're paired with one computer vision engineer for the full internship who reviews your work." },
              { name: "Deployment-focused Practice", desc: "You practice optimizing and shipping models, not just training them in a notebook." },
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
          { title: "OpenCV or PyTorch Exposure Helpful", description: "Prior exposure to OpenCV, PyTorch, or our Computer Vision training program is a plus, but not mandatory." },
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
          { title: "A Real Shipped Portfolio", description: "A deployed vision feature you can show and speak to in interviews." },
          { title: "Full-time Consideration", description: "Top performers are considered first when Computer Vision Engineer roles open." },
          { title: "A Direct Mentor Reference", description: "A working computer vision engineer who can speak to your work firsthand." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why intern with YashOrbit"
            features={[
              { name: "You Ship, Not Just Learn", desc: "Every intern's work goes into a real deployed vision feature, not a training notebook." },
              { name: "Mentors Who Are Still Building", desc: "You're reviewed by engineers actively shipping vision systems to clients." },
              { name: "A Clear Path to Full-time", desc: "Strong performance is the primary path to a full-time offer, evaluated transparently." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        faqs={computerVisionInternshipFaqs}
      />

      <DetailCTA
        heading="Ready to intern on real Computer Vision work?"
        description="Apply for the Computer Vision internship and start shipping vision systems that actually go live."
        ctaLabel="Apply Now"
        category="internship-program"
        subService="computer-vision"
      />
    </div>
  );
}
