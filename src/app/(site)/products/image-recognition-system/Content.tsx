"use client";

import {
  Camera, Users2, Cloud, Sparkles,
  Code2, Server, Cpu, Database, BrainCircuit, Package, Lock,
  Bell, Layers,
  HardHat, TrendingUp, ShieldAlert,
} from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CourseOverview from "@/components/sections/CourseOverview";
import ChecklistGrid from "@/components/sections/ChecklistGrid";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import TechStackGrid from "@/components/sections/TechStackGrid";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import ProductGallery from "@/components/sections/ProductGallery";
import CaseStudyShowcase from "@/components/sections/CaseStudyShowcase";
import FAQAccordion from "@/components/sections/FAQAccordion";
import RelatedServices from "@/components/sections/RelatedServices";
import DetailCTA from "@/components/sections/DetailCTA";
import { imageRecognitionSystemFaqs } from "./faqs";

export default function ImageRecognitionSystemContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="products"
        categoryLabel="products"
        title="Image Recognition System"
        subtitle="Serverless image intelligence, running across an entire device fleet."
        description="A serverless computer vision system that processes over a million images across 800+ devices, automatically detecting blank or failed captures and alerting admins in real time."
        icon={Camera}
        image="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop"
      />

      <div className="py-8 bg-background border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-wrap gap-2">
          {["Computer Vision", "Serverless", "Fleet Monitoring", "Real-Time Alerts"].map((tag) => (
            <span key={tag} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <CourseOverview
        title="A blank camera feed shouldn't take a support ticket to notice"
        paragraphs={[
          "The Image Recognition System processes every image coming off a large device fleet, automatically flagging blank or failed captures so a hardware or positioning issue gets caught before it turns into days of missing data.",
          "It's built for teams running large fleets of connected cameras or capture devices who need image quality monitored at scale, without a person manually reviewing feeds device by device.",
        ]}
        stats={[
          { label: "Built For", value: "Device Fleet & Field Operations Teams", icon: Users2 },
          { label: "Primary Use Case", value: "Automated Image Quality Monitoring", icon: Camera },
          { label: "Deployment", value: "Serverless, Cloud", icon: Cloud },
          { label: "Category", value: "Computer Vision Platform", icon: Sparkles },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        description="Built to monitor image quality across hundreds of devices without manual review."
        items={[
          { title: "Blank & Defect Detection", description: "Automatically flag blank, obstructed, or malformed captures as they're processed." },
          { title: "Serverless Auto-Scaling Pipeline", description: "Processing scales automatically with image volume, from a handful of devices to hundreds." },
          { title: "Device Fleet Monitoring", description: "Track capture health across every connected device from a single dashboard." },
          { title: "Real-Time Admin Alerts", description: "Admins are notified the moment a device starts producing bad captures, not after a batch review." },
          { title: "Processing Queue Dashboard", description: "See image throughput and processing status across the fleet in real time." },
          { title: "Historical Audit Trail", description: "Every processed image and flagged issue is logged for later review." },
        ]}
      />

      <ChecklistGrid
        id="modules"
        tone="muted"
        title="Core modules"
        items={[
          { title: "Ingestion Pipeline", description: "Serverless functions that receive and queue incoming images from every device." },
          { title: "Vision Processing Engine", description: "OpenCV-based analysis that detects blank, obstructed, or defective captures." },
          { title: "Fleet Dashboard", description: "Device-level view of capture health and processing status." },
          { title: "Alerting", description: "Real-time notifications routed to the right admin when an issue is detected." },
          { title: "Audit Log", description: "Historical record of processed images and flagged issues." },
          { title: "Settings & Access", description: "Role-based access for fleet operators and administrators." },
        ]}
      />

      <CurriculumTimeline
        title="Product workflow"
        description="How a device fleet goes from raw image capture to monitored, alertable data."
        modules={[
          { title: "Sign Up", duration: "Step 1", topics: ["Create an account", "Register device fleet"] },
          { title: "Setup", duration: "Step 2", topics: ["Connect devices to the ingestion pipeline", "Configure capture sources"] },
          { title: "Configure", duration: "Step 3", topics: ["Set detection thresholds", "Define alert recipients"] },
          { title: "Use Features", duration: "Step 4", topics: ["Process incoming images automatically", "Review flagged captures"] },
          { title: "Generate Reports", duration: "Step 5", topics: ["Review fleet-wide processing reports"] },
          { title: "Monitor Progress", duration: "Step 6", topics: ["Track device health over time", "Respond to real-time alerts"] },
          { title: "Scale Operations", duration: "Step 7", topics: ["Add devices to the fleet", "Expand processing capacity"] },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technology stack"
        items={[
          { name: "Python", category: "Processing Engine", icon: Code2 },
          { name: "AWS Lambda", category: "Serverless Compute", icon: Cpu },
          { name: "Amazon SQS", category: "Message Queue", icon: Layers },
          { name: "OpenCV", category: "AI/ML", icon: BrainCircuit },
          { name: "AWS S3", category: "Image Storage", icon: Database },
          { name: "AWS", category: "Cloud", icon: Cloud },
          { name: "Infrastructure as Code", category: "DevOps", icon: Package },
          { name: "IAM Role-Based Access", category: "Security", icon: Lock },
        ]}
      />

      <ChecklistGrid
        id="ai-capabilities"
        tone="muted"
        title="AI capabilities"
        items={[
          { title: "Computer Vision", description: "OpenCV-based models detect blank, obstructed, or low-quality captures automatically." },
          { title: "Anomaly Detection", description: "Devices producing unusual capture patterns are flagged before the problem compounds." },
          { title: "Automation", description: "Detection and alerting run automatically on every image, with no manual review step." },
        ]}
      />

      <TechStackGrid
        title="Integrations"
        description="Connect the Image Recognition System to the fleet infrastructure it monitors."
        items={[
          { name: "AWS S3", category: "Image Storage", icon: Database },
          { name: "Amazon SQS", category: "Event Queue", icon: Layers },
          { name: "Slack", category: "Alert Notifications", icon: Bell },
          { name: "REST APIs", category: "Custom Integration", icon: Server },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits"
            features={[
              { name: "Faster Issue Detection", desc: "Blank or failed captures are flagged the moment they happen, not discovered days later." },
              { name: "No Manual Feed Review", desc: "Serverless processing checks every image automatically, at any fleet size." },
              { name: "Elastic, Cost-Efficient Scale", desc: "Serverless compute scales with actual image volume instead of running fixed infrastructure." },
            ]}
          />
        </div>
      </section>

      <ChecklistGrid
        id="industries"
        tone="muted"
        title="Industries using the Image Recognition System"
        columns={2}
        items={[
          { title: "Agriculture", description: "Monitor field camera and sensor devices for capture quality at scale.", href: "/industries/agriculture" },
          { title: "Construction", description: "Catch failed job-site camera captures before they create a reporting gap.", href: "/industries/construction" },
        ]}
      />

      <ProductGallery
        title="Product gallery"
        description="A closer look at the Image Recognition System dashboard."
        images={[
          { src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop", caption: "Vision Processing View" },
          { src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop", caption: "Fleet Monitoring Dashboard" },
          { src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop", caption: "Real-Time Alerts" },
        ]}
      />

      <CaseStudyShowcase
        tone="muted"
        title="Case study"
        caseStudies={[
          {
            segment: "Device Fleet Operations",
            title: "Catching blank captures across an 800-device fleet before they became a data gap",
            challenge: "A field operations team relying on 800+ connected capture devices had no automated way to know when a device started producing blank or obstructed images, often losing days of data before the issue was noticed.",
            solution: "We built a serverless image recognition pipeline processing over a million images across the fleet, automatically detecting blank captures and alerting admins the moment a device needed attention.",
            metric: "1M+",
            metricLabel: "Images processed across 800+ devices",
          },
        ]}
      />

      <FAQAccordion
        faqs={imageRecognitionSystemFaqs}
      />

      <RelatedServices
        tone="muted"
        title="Related products"
        services={[
          { title: "AI Construction Platform", description: "Pair job-site camera monitoring with project document intelligence.", href: "/products/ai-construction-platform", icon: HardHat },
          { title: "Predictive Analytics Engine", description: "Forecast device maintenance needs alongside capture quality trends.", href: "/products/predictive-analytics-engine", icon: TrendingUp },
          { title: "Smart Spam Filter", description: "Apply the same real-time anomaly detection approach to inbound calls.", href: "/products/smart-spam-filter", icon: ShieldAlert },
        ]}
      />

      <DetailCTA
        heading="Ready to catch device issues before they cost you data?"
        description="See how the Image Recognition System can monitor image quality across your entire fleet."
        ctaLabel="Request a Demo"
      />
    </div>
  );
}
