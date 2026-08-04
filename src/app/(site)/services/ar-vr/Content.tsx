"use client";

import {
  Glasses, Clock, Users, Layers, Headphones,
  Code2, Cpu, Wifi, Smartphone, Boxes, Package, Network, Gauge,
  Eye, Globe,
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

export const arVrFaqs: { question: string; answer: string }[] = [
  { question: "Which platform should we build for: headset, mobile AR, or web?", answer: "It depends on your audience and use case — we'll walk through the tradeoffs in hardware reach, fidelity, and cost during discovery and recommend the right fit." },
  { question: "How do you prevent motion sickness in VR experiences?", answer: "We follow established comfort guidelines around camera movement, frame rate, and locomotion design, and validate with real user testing before full production." },
  { question: "How expensive is 3D asset production?", answer: "It varies with fidelity and scope, but we set a performance and art budget upfront and use an optimized pipeline to keep costs predictable." },
  { question: "Can the experience run without downloading an app?", answer: "Yes, WebXR experiences run directly in a compatible browser, which is a good fit for marketing and lower-friction use cases." },
  { question: "Do you provide support after launch?", answer: "Yes, we offer ongoing support for content updates, platform SDK changes, and performance tuning as new devices ship." },
];

export default function ARVRContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="services"
        categoryLabel="services"
        title="AR/VR"
        subtitle="Immersive virtual experiences."
        description="Transport your users to new worlds. We build augmented and virtual reality applications for training simulations, virtual showrooms, and interactive marketing."
        icon={Glasses}
        image="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Immersive experiences built for real headsets and real hardware limits"
        paragraphs={[
          "AR and VR live or die on performance — a showroom that stutters or a training simulation that lags breaks the immersion it's supposed to create. We build with the hardware's actual rendering budget in mind from day one, not as an afterthought optimization pass.",
          "Whether it's a mobile AR product visualizer, a WebXR experience that runs in a browser, or a full VR training simulation for a headset, we choose the platform and engine based on your audience's hardware and your content's complexity.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "5–9 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Team Composition", value: "3D Artists + Engine Developers", icon: Layers },
          { label: "Support", value: "Performance & Device Updates", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="What separates a genuinely immersive experience from an expensive tech demo."
        items={[
          { title: "Motion Sickness & Poor Comfort Design", description: "Badly designed camera movement and frame drops make VR experiences physically uncomfortable for users." },
          { title: "Performance Budgets on Mobile & Standalone Hardware", description: "Mobile AR and standalone headsets have a fraction of the rendering power of a gaming PC." },
          { title: "High Cost of 3D Asset Production", description: "Photorealistic 3D models and environments are expensive and slow to produce without a disciplined pipeline." },
          { title: "Fragmented Hardware & Platform Support", description: "Headsets, mobile AR, and WebXR each have different capabilities and constraints to design around." },
          { title: "Unclear ROI on Immersive Experiences", description: "Without a defined use case, AR/VR projects easily become expensive novelty demos." },
          { title: "Content That Gets Outdated Fast", description: "Product visualizations and training content need to stay current as real-world products and processes change." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we build immersive experiences that stay comfortable and performant at scale."
        items={[
          { title: "Comfort-first Interaction Design", description: "Camera movement, frame rate, and interaction patterns designed around known comfort guidelines from day one." },
          { title: "Performance Budget Set Upfront", description: "Polygon counts, draw calls, and asset sizes scoped to the target device before art production begins." },
          { title: "Optimized 3D Asset Pipeline", description: "A repeatable pipeline for creating and optimizing 3D assets at production quality without production cost." },
          { title: "Platform-appropriate Engine Choice", description: "Unity, Unreal, or WebXR chosen based on your target hardware and content complexity." },
          { title: "Use Case Validated Early", description: "A working prototype tested with real users before investing in full content production." },
          { title: "Content Pipelines Built for Updates", description: "Asset and scene structures designed so content can be refreshed without a full rebuild." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        items={[
          { title: "Interactive 3D Environments", description: "Fully explorable, interactive 3D spaces for showrooms, training, or product visualization." },
          { title: "Cross-platform Deployment", description: "Experiences built to run across headsets, mobile AR, and web where appropriate." },
          { title: "Hand Tracking & Natural Interaction", description: "Intuitive, controller-free interaction for supported headsets." },
          { title: "Analytics & Session Tracking", description: "Understand how users actually move through and interact with your experience." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "Virtual Showrooms & Product Visualization", description: "Immersive 3D product experiences for sales and marketing." },
          { title: "VR Training Simulations", description: "Safe, repeatable simulated environments for hands-on training scenarios." },
          { title: "AR Product Visualization (Mobile)", description: "Try-before-you-buy style AR experiences for mobile devices." },
          { title: "WebXR Experiences", description: "Browser-based immersive experiences with no app download required." },
          { title: "Interactive Marketing Experiences", description: "Branded AR/VR activations for events, campaigns, and installations." },
          { title: "3D Asset Production & Pipeline Setup", description: "Production and optimization of 3D models and environments." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "Unity", category: "Real-time Engine", icon: Code2 },
          { name: "Unreal Engine", category: "High-fidelity Rendering", icon: Cpu },
          { name: "WebXR / Three.js", category: "Browser-based XR", icon: Wifi },
          { name: "ARKit / ARCore", category: "Mobile AR", icon: Smartphone },
          { name: "Blender / Maya", category: "3D Asset Creation", icon: Boxes },
          { name: "Meta Quest SDK", category: "Standalone VR", icon: Package },
          { name: "Photon / Netcode", category: "Multiplayer XR", icon: Network },
          { name: "Unity Profiler", category: "Performance Tuning", icon: Gauge },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="How we take an immersive experience from concept to a launched, supported release."
        modules={[
          { title: "Discovery & Platform Selection", duration: "3–5 Days", topics: ["Use case scoping", "Hardware/platform decision", "Performance budget", "Technical scoping"] },
          { title: "Prototype & Comfort Testing", duration: "1 Week", topics: ["Interaction prototype", "Comfort testing", "Early user feedback"] },
          { title: "3D Asset Production", duration: "2–3 Weeks", topics: ["Environment modeling", "Asset optimization", "Texturing & lighting"] },
          { title: "Core Development", duration: "2–3 Weeks", topics: ["Interaction development", "Feature implementation", "Multiplayer/networking if needed"] },
          { title: "QA & Device Testing", duration: "1 Week", topics: ["Real-device testing", "Performance profiling", "Comfort validation"] },
          { title: "Launch & Content Updates", duration: "Ongoing", topics: ["Store/platform submission", "Usage analytics", "Content refreshes"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="A typical layered architecture for the immersive experiences we build."
        layers={[
          { name: "Rendering Layer", description: "Real-time 3D rendering tuned to the target device's performance budget, from mobile AR to standalone headsets.", tech: "Unity / Unreal", icon: Code2 },
          { name: "Interaction Layer", description: "Hand tracking, controller input, or touch-based interaction designed around comfort and intuitiveness.", tech: "XR Interaction Toolkits", icon: Layers },
          { name: "Content & Asset Layer", description: "Optimized 3D models, environments, and animations built through a repeatable production pipeline.", tech: "Blender / Maya", icon: Boxes },
          { name: "Platform & Deployment Layer", description: "Packaging and distribution for headset app stores, mobile AR, or WebXR browser deployment.", tech: "Meta Quest SDK / WebXR", icon: Package },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation capabilities"
        description="Where AI speeds up content creation and makes simulations more realistic."
        items={[
          { title: "AI-assisted 3D Asset Generation", description: "Generative tools that speed up early-stage environment and prop creation." },
          { title: "Procedural Content Generation", description: "Rule-based generation of variations in environments or scenarios, reducing manual content work." },
          { title: "AI-driven NPCs & Training Scenarios", description: "More realistic, adaptive non-player characters for training simulations." },
          { title: "Automated Performance Profiling", description: "Automated flagging of performance bottlenecks across target devices during development." },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of immersive experiences we build across retail, training, and marketing."
        projects={[
          { title: "Virtual Product Showroom", description: "An interactive 3D showroom letting customers configure and explore a product before purchase.", skills: ["Unity", "3D Visualization", "WebXR"] },
          { title: "Equipment Training Simulator", description: "A VR simulation for safely training staff on hazardous equipment procedures.", skills: ["VR", "Unreal Engine", "Training"] },
          { title: "Mobile AR Try-before-you-buy", description: "A mobile AR experience letting customers preview furniture or products in their own space.", skills: ["ARKit/ARCore", "Mobile", "3D Assets"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "Higher Engagement & Recall", desc: "Immersive experiences are remembered and shared far more than a static webpage or video." },
              { name: "Safer, Cheaper Training", desc: "Simulated training reduces risk and cost compared to hands-on training with real equipment." },
              { name: "Reduced Returns Through Better Visualization", desc: "Customers who preview a product in AR make more confident purchase decisions." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "Performance-first Engineering", desc: "We design around comfort and frame-rate targets from day one, not as a late optimization scramble." },
              { name: "Cross-platform Engine Expertise", desc: "Unity, Unreal, and WebXR experience means we pick the right tool, not the only tool we know." },
              { name: "Production Pipeline Discipline", desc: "A repeatable 3D asset pipeline that keeps content costs predictable as scope grows." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Dedicated Team", desc: "A committed XR team for an evolving portfolio of immersive experiences." },
              { name: "Fixed Scope Project", desc: "A defined experience, platform, and timeline delivered at a clear price." },
              { name: "Staff Augmentation", desc: "Embed our XR engineers or 3D artists into your existing team for specific expertise." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical timelines by project scope, so you can plan around a realistic launch date."
        bands={[
          { scope: "Prototype / Proof of Concept", duration: "3–4 Weeks", fill: 35, description: "A playable prototype validating the core experience and comfort on target hardware." },
          { scope: "Full Experience Launch", duration: "6–10 Weeks", fill: 70, description: "A polished, fully produced experience ready for headset store or public release." },
          { scope: "Enterprise XR Program", duration: "10+ Weeks", fill: 100, description: "Multiple experiences or an ongoing content pipeline for training or marketing at scale." },
        ]}
      />

      <FAQAccordion
        faqs={arVrFaqs}
      />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Vision Intelligence", description: "Add computer vision capabilities like object recognition to your AR experiences.", href: "/services/vision-intelligence", icon: Eye },
          { title: "Mobile App Development", description: "Package your AR experience inside a full-featured mobile app.", href: "/services/mobile-app-development", icon: Smartphone },
          { title: "Web App Development", description: "Pair your WebXR experience with a supporting web platform.", href: "/services/web-app-development", icon: Globe },
        ]}
      />

      <DetailCTA
        heading="Ready to build an experience people remember?"
        description="Let's talk about your audience, your hardware target, and how we can help you build something truly immersive."
        ctaLabel="Get a Quote"
      />
    </div>
  );
}
