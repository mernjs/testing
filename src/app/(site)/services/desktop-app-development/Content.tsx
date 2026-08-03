"use client";

import {
  Monitor, Clock, Users, Layers, Headphones,
  Code2, Cpu, Terminal, Database, RefreshCw, Lock, HardDrive, GitBranch,
  Globe, ScanEye,
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

export default function DesktopAppDevelopmentContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="services"
        categoryLabel="services"
        title="Desktop App Development"
        subtitle="Powerful applications for macOS and Windows."
        description="When web browsers aren't enough, we build robust desktop software using frameworks like Electron and Tauri to deliver raw performance and deep system access."
        icon={Monitor}
        image="https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Software that earns a permanent spot on the desktop"
        paragraphs={[
          "Desktop software gets held to a different standard than a website tab — it's expected to launch instantly, work offline, and integrate deeply with the operating system it's installed on. We build to that standard, not a wrapped web page.",
          "From internal tools running on company hardware to commercial software distributed to thousands of machines, we choose between Electron, Tauri, and fully native frameworks based on your performance, distribution, and system-access requirements.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "5–8 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Team Composition", value: "Desktop + Platform Specialists", icon: Layers },
          { label: "Support", value: "Auto-update & Patch Management", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="What makes desktop software genuinely different to get right."
        items={[
          { title: "Cross-platform Consistency", description: "An app needs to feel native and behave correctly on Windows, macOS, and Linux without three separate codebases." },
          { title: "Slow Startup & Bloated Installers", description: "Electron apps built without care often launch slowly and ship oversized installers." },
          { title: "Deep System Integration Needs", description: "File system access, hardware peripherals, and OS-level notifications require more than a browser sandbox allows." },
          { title: "Distributing Updates Reliably", description: "Getting patches and new versions onto thousands of installed machines without breaking workflows is a real engineering problem." },
          { title: "Enterprise Security Requirements", description: "IT departments often require code signing, sandboxing, and controlled installation for company-wide software." },
          { title: "Legacy Desktop Software Modernization", description: "Aging Windows Forms or MFC applications become increasingly expensive to maintain and hire for." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we design around the constraints of shipping and maintaining installed software."
        items={[
          { title: "Framework Selection Based on Requirements", description: "We choose Electron, Tauri, or native frameworks based on your actual performance and system-access needs, not habit." },
          { title: "Startup & Bundle Size Optimization", description: "Lazy loading, native modules, and careful dependency management keep launch times and installer size in check." },
          { title: "Native Module Integration", description: "Direct access to file systems, peripherals, and OS APIs where the platform genuinely requires it." },
          { title: "Robust Auto-update Pipelines", description: "Staged rollouts and rollback-safe update mechanisms that don't interrupt your users' workflow." },
          { title: "Code Signing & Sandboxing", description: "Builds signed and packaged to satisfy enterprise IT and OS-level security requirements." },
          { title: "Incremental Legacy Migration", description: "Modernizing legacy desktop apps feature by feature instead of a risky full rewrite." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        items={[
          { title: "Native OS Integration", description: "System tray, notifications, file associations, and OS-level menus that feel native to each platform." },
          { title: "Offline-first Operation", description: "Full functionality without an internet connection, syncing when connectivity returns." },
          { title: "Auto-updating Releases", description: "Background updates that keep every installation current without manual reinstalls." },
          { title: "Hardware & Peripheral Access", description: "Direct integration with printers, scanners, USB devices, and other connected hardware." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "Cross-platform Desktop Apps", description: "Single-codebase apps built with Electron or Tauri for Windows, macOS, and Linux." },
          { title: "Native Windows/macOS Applications", description: "Fully native builds for maximum performance and platform-specific capability." },
          { title: "Legacy Application Modernization", description: "Migrating aging desktop software to a modern, maintainable framework." },
          { title: "Enterprise Deployment Packaging", description: "MSI, pkg, and silent-install packaging built for IT-managed rollouts." },
          { title: "Offline-capable Business Tools", description: "Internal tools designed to keep teams productive without reliable connectivity." },
          { title: "Post-release Maintenance & Support", description: "Ongoing patches, OS compatibility updates, and feature work after launch." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "Electron", category: "Cross-platform Framework", icon: Code2 },
          { name: "Tauri / Rust", category: "Lightweight Native Runtime", icon: Cpu },
          { name: "C# / .NET", category: "Windows Native", icon: Terminal },
          { name: "SQLite", category: "Local Storage", icon: Database },
          { name: "Squirrel / Sparkle", category: "Auto-update", icon: RefreshCw },
          { name: "Code Signing", category: "Security", icon: Lock },
          { name: "Native Node Modules", category: "Hardware Access", icon: HardDrive },
          { name: "GitHub Actions", category: "CI/CD", icon: GitBranch },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="How we take a desktop application from architecture to a signed, distributed release."
        modules={[
          { title: "Discovery & Framework Selection", duration: "3–5 Days", topics: ["Requirements workshops", "Framework evaluation", "System access mapping", "Technical scoping"] },
          { title: "UI/UX Design", duration: "1 Week", topics: ["Design system", "Platform-specific patterns", "Prototype review"] },
          { title: "Core Development", duration: "3–4 Weeks", topics: ["Feature development", "Native module integration", "Offline data layer", "IPC architecture"] },
          { title: "QA & Platform Testing", duration: "1 Week", topics: ["Cross-OS testing", "Performance profiling", "Security testing", "Accessibility testing"] },
          { title: "Packaging & Signing", duration: "2–3 Days", topics: ["Code signing", "Installer packaging", "Auto-updater setup", "Distribution channel setup"] },
          { title: "Post-release Support", duration: "Ongoing", topics: ["Patch releases", "OS compatibility updates", "Crash monitoring", "Feature iteration"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="A typical layered architecture for the desktop applications we build."
        layers={[
          { name: "Presentation Layer", description: "Native-feeling UI rendered in a lightweight webview or fully native toolkit, tuned for fast startup.", tech: "Electron / Tauri / WPF", icon: Code2 },
          { name: "Application Core", description: "Business logic and state management shared across platforms, isolated from platform-specific code.", tech: "Node.js / Rust", icon: Cpu },
          { name: "System Integration Layer", description: "Native modules bridging to the file system, hardware, and OS-level APIs each platform exposes.", tech: "Native Modules / IPC", icon: HardDrive },
          { name: "Update & Distribution Layer", description: "Signed, staged auto-update pipeline that keeps every installed copy current safely.", tech: "Code Signing / Auto-updater", icon: RefreshCw },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation capabilities"
        description="Where AI adds value inside installed, often offline-first software."
        items={[
          { title: "Local AI Inference", description: "Run lightweight ML models directly on-device for privacy-sensitive or offline AI features." },
          { title: "Automated Crash & Log Analysis", description: "AI-assisted triage of crash reports and logs collected from installed copies in the field." },
          { title: "Smart Auto-update Scheduling", description: "Roll out updates at times least likely to interrupt a user's active session." },
          { title: "In-app AI Assistants", description: "Embedded help or automation features that work directly within the desktop app." },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of desktop software we build across retail, engineering, and enterprise IT."
        projects={[
          { title: "Point-of-sale Desktop System", description: "An offline-capable POS application for retail with local receipt printing and hardware integration.", skills: ["Offline-first", "Hardware I/O", "Electron"] },
          { title: "Engineering Design Tool", description: "A high-performance native desktop application for CAD-adjacent technical workflows.", skills: ["Native", "Performance", "Rust"] },
          { title: "Enterprise Compliance Suite", description: "An internally distributed desktop tool with code-signed installers and centralized update management.", skills: ["Enterprise Deployment", "Security", "Auto-update"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "Reliable Offline Productivity", desc: "Teams keep working even when the network doesn't cooperate." },
              { name: "Lower IT Support Overhead", desc: "Signed, auto-updating installers reduce the manual patching burden on your IT team." },
              { name: "Deeper Hardware Capability", desc: "Direct system access unlocks workflows a browser sandbox simply can't support." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "Framework-agnostic Expertise", desc: "We pick Electron, Tauri, or native based on your requirements, not our comfort zone." },
              { name: "Enterprise Deployment Experience", desc: "We know what IT departments need for code signing, packaging, and managed rollouts." },
              { name: "Long-term Maintenance Mindset", desc: "We build for the OS updates and hardware changes that will happen after launch, not just for day one." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Dedicated Team", desc: "A committed desktop engineering team for products with an ongoing release roadmap." },
              { name: "Fixed Scope Project", desc: "A defined build, timeline, and price for well-specified desktop tools." },
              { name: "Staff Augmentation", desc: "Embed our desktop engineers into your existing team for specific platform expertise." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical timelines by project scope, so you can plan around a realistic release date."
        bands={[
          { scope: "Internal Tool MVP", duration: "3–4 Weeks", fill: 35, description: "A focused internal tool to validate a workflow before wider rollout." },
          { scope: "Commercial Desktop App", duration: "6–9 Weeks", fill: 70, description: "A polished, signed, auto-updating application ready for external distribution." },
          { scope: "Enterprise-managed Suite", duration: "9+ Weeks", fill: 100, description: "Multi-platform delivery with centralized deployment and update management for large fleets." },
        ]}
      />

      <FAQAccordion
        faqs={[
          { question: "Should we use Electron or a fully native framework?", answer: "It depends on your performance needs, team's existing skills, and how deep your system-access requirements are — we'll assess your specific case rather than defaulting to one framework." },
          { question: "Can the app work without an internet connection?", answer: "Yes, offline-first design with local storage is one of our core patterns for desktop applications." },
          { question: "How do you handle software updates after release?", answer: "We build signed, staged auto-update pipelines so new versions roll out safely without manual reinstalls or workflow interruptions." },
          { question: "Can you modernize our existing legacy desktop application?", answer: "Yes, we regularly migrate legacy Windows Forms, MFC, or older Electron apps to modern frameworks incrementally, feature by feature." },
          { question: "Do you handle code signing and enterprise packaging?", answer: "Yes, we handle Authenticode/notarization code signing and enterprise-ready installer packaging as part of delivery." },
        ]}
      />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Web App Development", description: "Pair your desktop tool with a companion web dashboard or portal.", href: "/services/web-app-development", icon: Globe },
          { title: "AI/ML Solutions", description: "Add predictive features or local AI inference to your desktop software.", href: "/services/ai-ml-solutions", icon: Cpu },
          { title: "Vision Intelligence", description: "Add camera or scanner-based image analysis to your desktop workflows.", href: "/services/vision-intelligence", icon: ScanEye },
        ]}
      />

      <DetailCTA
        heading="Ready to build software that lives on the desktop?"
        description="Let's talk about your platform requirements, your users' workflows, and how we can help you ship reliable desktop software."
        ctaLabel="Get a Quote"
      />
    </div>
  );
}
