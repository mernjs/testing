"use client";

import {
  Eye, Clock, Users, Layers, Headphones,
  Braces, Camera, BrainCircuit, ScanFace, ImageIcon, Video, Package, Cloud,
  Network,
  Cpu, Bot, Glasses,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import TechStackGrid from "@/components/sections/TechStackGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import ArchitectureOverview from "@/components/sections/ArchitectureOverview";
import ProjectShowcase from "@/components/sections/ProjectShowcase";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import DeliveryTimeline from "@/components/sections/DeliveryTimeline";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";

export default function VisionIntelligenceContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="services"
        categoryLabel="services"
        title="Vision Intelligence"
        subtitle="Advanced image and video analysis."
        description="Give your software the ability to see. Our computer vision solutions can identify objects, track movement, and analyze visual data in real-time."
        icon={Eye}
        image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Give your software the ability to see what matters"
        paragraphs={[
          "A security camera that just records isn't intelligence, it's storage. Real value comes from a system that can tell you a shelf is empty, a part is defective, or a document says what it claims to say, automatically and in real time.",
          "We build computer vision systems tuned to your specific visual problem, whether that's counting foot traffic, inspecting products on a line, or extracting data from scanned paperwork, deployed where it needs to run: cloud, on-premise, or directly on edge hardware.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "5–8 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Team Composition", value: "CV Engineers + Data Annotators", icon: Layers },
          { label: "Support", value: "Model Monitoring & Retraining", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="Why manual visual review runs out of road as a business scales."
        items={[
          { title: "Manual Visual Inspection Doesn't Scale", description: "Human reviewers get slower and less consistent the longer a shift runs, and can't watch every camera feed at once." },
          { title: "Real-time Requirements at the Edge", description: "Many use cases need decisions in milliseconds, often on hardware without a reliable cloud connection." },
          { title: "Messy, Real-world Visual Data", description: "Production images and video look nothing like clean benchmark datasets — lighting, angle, and occlusion all vary." },
          { title: "High Cost of Manual Data Entry from Documents", description: "Teams spend hours manually retyping data from invoices, forms, and IDs." },
          { title: "False Positives Eroding Trust", description: "A detection system with too many false alarms quickly gets ignored by the team it's meant to help." },
          { title: "Scaling Across Many Camera Feeds or Locations", description: "A solution that works for one camera often doesn't scale cleanly to hundreds." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we build vision systems that hold up on real footage, not just demo clips."
        items={[
          { title: "Start From the Real Data", description: "We train and validate on your actual footage and images, not just clean public datasets." },
          { title: "Right Model for the Latency Budget", description: "Lightweight models for edge devices, larger models where cloud latency is acceptable." },
          { title: "Rigorous Annotation & Validation", description: "Careful labeling and validation sets so models learn the right signal, not noise." },
          { title: "Tuned for Precision, Not Just Accuracy", description: "We tune detection thresholds around your actual tolerance for false positives versus missed detections." },
          { title: "Edge-ready Deployment", description: "Models optimized and packaged to run directly on cameras or on-site hardware where needed." },
          { title: "Human-in-the-loop Feedback Loops", description: "Flagged edge cases feed back into retraining, so the system improves with real usage." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        items={[
          { title: "Real-time Object Detection", description: "Identify and track people, products, or equipment across live video streams." },
          { title: "Automated Visual Quality Inspection", description: "Catch defects on a production line faster and more consistently than manual review." },
          { title: "Document & Text Extraction (OCR)", description: "Pull structured data automatically from invoices, forms, and ID documents." },
          { title: "Multi-camera Analytics Dashboards", description: "A unified view across every connected camera feed or location." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "Surveillance & Security Analytics", description: "Intrusion detection, restricted-zone monitoring, and unusual activity alerts." },
          { title: "Manufacturing Quality Inspection", description: "Automated defect detection on production lines using camera-based inspection." },
          { title: "Retail & Foot Traffic Analytics", description: "Customer counting, dwell-time analysis, and shelf-stock monitoring." },
          { title: "Document Intelligence & OCR", description: "Automated data extraction from scanned documents and forms." },
          { title: "Video Analytics Pipelines", description: "Real-time processing pipelines for live or recorded video at scale." },
          { title: "Edge Deployment & Optimization", description: "Packaging and optimizing models to run directly on cameras or local hardware." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "Python", category: "Core Language", icon: Braces },
          { name: "OpenCV", category: "Image Processing", icon: Camera },
          { name: "PyTorch / TensorFlow", category: "Deep Learning", icon: BrainCircuit },
          { name: "Object Detection Models", category: "Detection", icon: ScanFace },
          { name: "OCR Engines", category: "Text Recognition", icon: ImageIcon },
          { name: "Video Streaming Pipelines", category: "Real-time Processing", icon: Video },
          { name: "ONNX / TensorRT", category: "Edge Optimization", icon: Package },
          { name: "AWS / GCP", category: "Cloud Infrastructure", icon: Cloud },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="How we take a vision system from raw footage to a monitored deployment."
        modules={[
          { title: "Discovery & Data Collection", duration: "3–5 Days", topics: ["Use case scoping", "Camera/hardware audit", "Sample data collection", "Success metrics"] },
          { title: "Data Annotation & Baseline", duration: "1–2 Weeks", topics: ["Data labeling", "Baseline model", "Validation set design"] },
          { title: "Model Development", duration: "2–3 Weeks", topics: ["Model training", "Threshold tuning", "Edge optimization", "Performance testing"] },
          { title: "Integration", duration: "1 Week", topics: ["Camera/feed integration", "Dashboard development", "Alerting setup"] },
          { title: "Pilot Deployment", duration: "3–5 Days", topics: ["Shadow-mode testing", "Stakeholder validation", "Phased rollout"] },
          { title: "Monitoring & Retraining", duration: "Ongoing", topics: ["Accuracy monitoring", "Edge case review", "Scheduled retraining", "Model iteration"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="A typical layered architecture for the vision systems we build."
        layers={[
          { name: "Capture Layer", description: "Camera or document input feeds, normalized and preprocessed for consistent model input.", tech: "OpenCV / Video Ingest", icon: Camera },
          { name: "Inference Layer", description: "Detection, classification, or OCR models running in real time, sized to your latency requirements.", tech: "PyTorch / ONNX", icon: BrainCircuit },
          { name: "Application Layer", description: "Business logic that turns raw detections into alerts, dashboards, or structured records.", tech: "Node.js / Python API", icon: Network },
          { name: "Deployment Layer", description: "Cloud, on-premise, or edge-device deployment depending on latency, bandwidth, and data-residency needs.", tech: "Cloud / Edge Hardware", icon: Package },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation capabilities"
        description="Where automation turns raw visual data into action without constant manual review."
        items={[
          { title: "Automated Anomaly & Defect Flagging", description: "Automatically surface unusual patterns or defects for human review instead of scanning everything manually." },
          { title: "Continuous Model Improvement", description: "Flagged false positives and misses feed back into scheduled retraining." },
          { title: "Automated Report Generation", description: "Scheduled summaries of detections, counts, and trends without manual compilation." },
          { title: "Smart Alert Prioritization", description: "Rank alerts by confidence and business impact so teams see what matters first." },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of vision systems we build across manufacturing, retail, and document processing."
        projects={[
          { title: "Production Line Defect Detection", description: "A camera-based inspection system flagging manufacturing defects in real time.", skills: ["Computer Vision", "OpenCV", "Edge Deployment"] },
          { title: "Retail Shelf Monitoring System", description: "A vision system tracking shelf-stock levels and customer foot traffic across store locations.", skills: ["Object Detection", "Analytics", "Multi-camera"] },
          { title: "Invoice Data Extraction Pipeline", description: "An OCR pipeline automatically extracting line-item data from vendor invoices.", skills: ["OCR", "Document AI", "Automation"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "Faster, More Consistent Inspection", desc: "Automated visual checks catch what tired eyes and long shifts eventually miss." },
              { name: "Lower Manual Data Entry Costs", desc: "Automated document extraction frees staff from repetitive retyping." },
              { name: "Real-time Operational Visibility", desc: "Dashboards give teams a live view across locations instead of after-the-fact reports." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "Real-world Data Experience", desc: "We train and validate on your actual footage and documents, not clean demo datasets." },
              { name: "Edge Deployment Expertise", desc: "We know how to get models running reliably on constrained, on-site hardware." },
              { name: "Tuned for Your Tolerance", desc: "Precision and recall tuned to what your business can actually act on, not a generic benchmark." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Dedicated Team", desc: "A committed CV engineering team for an evolving portfolio of vision systems." },
              { name: "Fixed Scope Project", desc: "A defined vision pipeline delivered against a clear timeline and price." },
              { name: "Staff Augmentation", desc: "Embed our computer vision engineers into your existing team for specific expertise." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical timelines by project scope, so you can plan around a realistic rollout."
        bands={[
          { scope: "Single-camera Pilot", duration: "3–4 Weeks", fill: 35, description: "A focused pilot on one camera or document type to validate accuracy and value." },
          { scope: "Multi-location Deployment", duration: "6–9 Weeks", fill: 70, description: "A full rollout across multiple cameras, sites, or document workflows." },
          { scope: "Enterprise Vision Platform", duration: "9+ Weeks", fill: 100, description: "A shared vision platform with centralized monitoring across many locations and use cases." },
        ]}
      />

      <FAQAccordion
        faqs={[
          { question: "Do you need our historical camera footage to build the model?", answer: "Yes, ideally — real footage or images from your environment produce far more reliable models than generic public datasets. We'll help you collect a suitable sample if you don't have enough yet." },
          { question: "Can this run without a reliable internet connection?", answer: "Yes, we regularly deploy optimized models directly to edge hardware or on-site servers for locations with limited connectivity." },
          { question: "How accurate will detection be?", answer: "It depends on your specific use case and data quality, but we validate against a held-out test set and share honest precision and recall numbers before rollout, not just an average accuracy figure." },
          { question: "Can you help extract data from scanned paper documents, not just digital images?", answer: "Yes, OCR pipelines for scanned or photographed documents are a core part of this service." },
          { question: "What happens if the model starts missing new types of defects or objects?", answer: "We set up monitoring and a retraining cadence so the model adapts as new patterns show up in the real world." },
        ]}
      />

      <RelatedServices
        tone="muted"
        services={[
          { title: "AI/ML Solutions", description: "Extend vision data into broader predictive and recommendation models.", href: "/services/ai-ml-solutions", icon: Cpu },
          { title: "AI Agent", description: "Trigger automated actions directly from vision system detections.", href: "/services/ai-agent", icon: Bot },
          { title: "AR/VR", description: "Combine vision intelligence with immersive AR overlays and experiences.", href: "/services/ar-vr", icon: Glasses },
        ]}
      />

      <DetailCTA
        heading="Ready to give your systems the ability to see?"
        description="Let's talk about your cameras, your documents, and how we can help you automate what's currently done by eye."
        ctaLabel="Get a Quote"
      />
    </div>
  );
}
