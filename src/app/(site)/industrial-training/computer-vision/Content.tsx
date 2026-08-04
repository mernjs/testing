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
import { computerVisionFaqs } from "./faqs";

export default function ComputerVisionContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="industrial-training"
        categoryLabel="industrial training"
        title="Computer Vision Training"
        subtitle="Teach machines to see, read, and track."
        description="Learn to build systems that classify images, detect objects, read documents, and analyze video in real time — using OpenCV, convolutional neural networks, and modern deep learning frameworks."
        icon={ScanEye}
        image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="From pixels to production-ready vision systems"
        paragraphs={[
          "Computer vision powers everything from quality inspection on a factory line to automated attendance systems and document processing. The gap between a research notebook and a working system is exactly what this program is designed to close.",
          "You'll work through image processing fundamentals, convolutional neural networks and transfer learning, object detection, OCR, and video analytics — building toward projects that run on real images and video, not toy datasets.",
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
          { icon: Users, label: "Batch Size", value: "12–15 Learners" },
          { icon: Calendar, label: "Schedule", value: "Weekday & Weekend" },
        ]}
      />

      <ChecklistGrid
        id="learn"
        title="What you will learn"
        description="A practical path from image basics to deployed detection and recognition systems."
        items={[
          { title: "Image Processing with OpenCV", description: "Work with color spaces, filters, and transformations to prepare images for analysis." },
          { title: "Convolutional Neural Networks", description: "Understand CNN architectures and apply transfer learning to real datasets." },
          { title: "Object Detection", description: "Detect and localize objects in images and video using modern detection models." },
          { title: "OCR & Document Intelligence", description: "Extract structured text and data from scanned documents and images." },
          { title: "Video Analytics", description: "Track objects, detect motion, and process real-time video streams." },
          { title: "Model Optimization & Deployment", description: "Optimize models for speed and deploy them to cloud or edge environments." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools covered"
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
        title="Training roadmap"
        description="From core image processing to real-time detection, OCR, and deployed video pipelines."
        modules={[
          { title: "Image Processing Foundations", duration: "2 Weeks", topics: ["Color spaces", "OpenCV fundamentals", "Filtering & transforms", "Feature extraction"] },
          { title: "Convolutional Neural Networks", duration: "2 Weeks", topics: ["CNN architecture", "Transfer learning", "Data augmentation", "Model evaluation"] },
          { title: "Object Detection", duration: "2 Weeks", topics: ["Detection architectures", "Bounding boxes & IoU", "Annotation workflows", "Real-time inference"] },
          { title: "OCR & Document Intelligence", duration: "1 Week", topics: ["Text detection", "Preprocessing for OCR", "Structured data extraction"] },
          { title: "Video Analytics", duration: "2 Weeks", topics: ["Object tracking", "Motion detection", "Frame sampling", "Real-time pipelines"] },
          { title: "Model Deployment & Capstone", duration: "1 Week", topics: ["Model optimization", "Edge & cloud deployment", "Final project demo"] },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Real-world projects you'll build"
        description="Vision systems modeled on real manufacturing, security, and document workflows."
        projects={[
          { title: "Defect Detection System", description: "An image classification system that flags manufacturing defects for quality inspection.", skills: ["CNNs", "OpenCV", "Transfer Learning"] },
          { title: "Smart Attendance System", description: "A face detection and recognition system for automated check-in.", skills: ["Object Detection", "OpenCV", "Python"] },
          { title: "Document Data Extraction Tool", description: "An OCR pipeline that extracts structured data from invoices and ID documents.", skills: ["OCR", "Preprocessing", "Python"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Internship & industrial exposure"
            features={[
              { name: "Real Dataset Challenges", desc: "Work with messy, real-world image and video data instead of clean benchmark datasets." },
              { name: "Mentor Reviews on Model Design", desc: "Get feedback on architecture choices and training decisions from practicing engineers." },
              { name: "Deployment-focused Practice", desc: "Practice optimizing and shipping models, not just training them in a notebook." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Learning methodology"
            features={[
              { name: "Build-and-benchmark Cycles", desc: "Every model is trained, evaluated, and compared against a baseline before moving on." },
              { name: "1:1 Mentorship", desc: "Weekly sessions with a mentor experienced in applied computer vision." },
              { name: "Applied Assessments", desc: "Evaluated on working detection and recognition pipelines, not theory quizzes." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="eligibility"
        title="Eligibility"
        items={[
          { title: "Basic Python Knowledge", description: "Comfort reading and writing basic Python is expected; deep learning libraries are taught from scratch." },
          { title: "Basic Math Helpful", description: "Familiarity with basic linear algebra and statistics helps but isn't mandatory." },
          { title: "Any Educational Background", description: "Open to students, developers, and career switchers curious about vision systems." },
          { title: "Consistent Time Commitment", description: "8–10 hours a week for hands-on practice and project work." },
        ]}
      />

      <ChecklistGrid
        id="career"
        tone="muted"
        title="Career opportunities"
        items={[
          { title: "Computer Vision Engineer", description: "Build and maintain vision models for real products and pipelines." },
          { title: "Deep Learning Engineer (Vision)", description: "Focus on training and optimizing CNN-based models." },
          { title: "Image Processing Developer", description: "Specialize in preprocessing, filtering, and feature extraction pipelines." },
          { title: "AI Engineer, Vision Systems", description: "Work on end-to-end vision products across detection and recognition." },
          { title: "Video Analytics Engineer", description: "Build real-time tracking and monitoring systems from video streams." },
          { title: "Freelance Computer Vision Developer", description: "Deliver custom vision solutions for manufacturing, security, and retail clients." },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose YashOrbit"
            features={[
              { name: "Applied, Deployment-focused Curriculum", desc: "Built around shipping working vision systems, not just training accurate models." },
              { name: "Placement Assistance", desc: "Resume reviews, mock interviews, and referrals to hiring partners." },
              { name: "Real Deployment Experience", desc: "Every project is optimized and deployed, not left in a training notebook." },
            ]}
          />
        </div>
      </section>

      <FAQAccordion
        tone="muted"
        faqs={computerVisionFaqs}
      />

      <DetailCTA
        heading="Ready to build systems that see and understand images?"
        description="Join the next batch and go from image basics to deployed detection, OCR, and video analytics projects."
        ctaLabel="Enroll Now"
      />
    </div>
  );
}
