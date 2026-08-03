"use client";

import {
  Smartphone, Clock, Users, Layers, Headphones,
  Code2, Cpu, Server, Database, RefreshCw, Palette, Package, GitBranch,
  Globe, Glasses, Bot,
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

export default function MobileAppDevelopmentContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="services"
        categoryLabel="services"
        title="Mobile App Development"
        subtitle="Native and cross-platform mobile solutions."
        description="Reach your audience wherever they are. We build intuitive, high-performance mobile apps for iOS and Android that users love to engage with."
        icon={Smartphone}
        image="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop"
      />

      <CourseOverview
        title="Apps built for how people actually use their phones"
        paragraphs={[
          "Mobile users are unforgiving — a slow launch, a confusing first screen, or a battery-draining background process is often all it takes to lose them to a competitor's app. We build with that reality in mind, not just a feature checklist.",
          "Whether you need a single cross-platform codebase or two fully native apps, we choose the approach based on your performance requirements, budget, and how deeply you need to integrate with device hardware, not a one-size-fits-all default.",
        ]}
        stats={[
          { label: "Typical Timeline", value: "5–9 Weeks", icon: Clock },
          { label: "Engagement Model", value: "Dedicated Team or Fixed Scope", icon: Users },
          { label: "Team Composition", value: "iOS + Android + QA", icon: Layers },
          { label: "Support", value: "App Store Release Management", icon: Headphones },
        ]}
      />

      <ChecklistGrid
        id="challenges"
        title="Business challenges we solve"
        description="What makes or breaks a mobile app in its first week of real usage."
        items={[
          { title: "High Uninstall Rates After First Use", description: "A confusing onboarding or slow first launch drives users to delete an app within the first session." },
          { title: "Fragmented Device & OS Support", description: "Apps need to perform consistently across a wide range of phone models, screen sizes, and OS versions." },
          { title: "Offline & Unreliable Connectivity", description: "Users expect core functionality to keep working on the subway, on a plane, or with patchy signal." },
          { title: "App Store Review Delays", description: "Rejected submissions and review delays can push back a launch date by weeks." },
          { title: "Battery & Performance Drain", description: "Poorly optimized background tasks and location tracking quickly earn one-star reviews." },
          { title: "Costly Native Duplication", description: "Maintaining separate iOS and Android codebases doubles the cost of every new feature." },
        ]}
      />

      <ChecklistGrid
        id="approach"
        tone="muted"
        title="Our approach"
        description="How we design around the realities of mobile devices and app stores."
        items={[
          { title: "Platform Strategy Before Code", description: "We assess whether cross-platform or fully native is the right call for your performance and budget needs." },
          { title: "Offline-first Data Architecture", description: "Local-first data storage with background sync so core features work without a live connection." },
          { title: "Store Guideline Compliance from Day One", description: "We build to Apple and Google's review guidelines throughout development, not as a last-minute scramble." },
          { title: "Battery & Performance Profiling", description: "Regular profiling on real devices, not just simulators, to catch drain and jank early." },
          { title: "Shared Business Logic, Native Feel", description: "Cross-platform code sharing where it saves cost, native modules where the platform truly needs it." },
          { title: "Continuous Beta Testing", description: "TestFlight and Play Store beta channels used throughout development, not just before launch." },
        ]}
      />

      <ChecklistGrid
        id="features"
        title="Key features"
        items={[
          { title: "Biometric & Secure Authentication", description: "Face ID, fingerprint, and secure token storage for frictionless, safe logins." },
          { title: "Push Notifications & Deep Linking", description: "Targeted re-engagement notifications that open directly to the right in-app screen." },
          { title: "Offline Mode with Background Sync", description: "Users can keep working without a connection, with changes syncing automatically once back online." },
          { title: "Device Hardware Integration", description: "Camera, GPS, Bluetooth, and sensor access built in wherever your app needs it." },
        ]}
      />

      <ChecklistGrid
        id="offerings"
        tone="muted"
        title="Service offerings"
        items={[
          { title: "Native iOS & Android Apps", description: "Fully native builds when performance or platform-specific capability is non-negotiable." },
          { title: "Cross-platform Apps", description: "A single React Native or Flutter codebase when speed-to-market and cost matter most." },
          { title: "App Modernization & Rebuilds", description: "Rebuilding aging or poorly performing apps on a modern, maintainable foundation." },
          { title: "Wearables & Companion Apps", description: "Smartwatch and tablet companion experiences that extend your core app." },
          { title: "App Store Optimization & Launch Support", description: "Store listing optimization and submission management to get you approved faster." },
          { title: "Post-launch Feature Development", description: "Ongoing feature releases based on real usage data and user feedback." },
        ]}
      />

      <TechStackGrid
        tone="muted"
        title="Technologies & tools we use"
        items={[
          { name: "React Native", category: "Cross-platform", icon: Code2 },
          { name: "Swift / Kotlin", category: "Native Development", icon: Cpu },
          { name: "Firebase", category: "Backend & Push", icon: Server },
          { name: "SQLite / Realm", category: "Local Storage", icon: Database },
          { name: "Fastlane", category: "Release Automation", icon: RefreshCw },
          { name: "Figma", category: "Design Handoff", icon: Palette },
          { name: "App Store / Play Console", category: "Distribution", icon: Package },
          { name: "GitHub Actions", category: "CI/CD", icon: GitBranch },
        ]}
      />

      <CurriculumTimeline
        title="Development process"
        description="How we take a mobile app from concept to a published, supported release."
        modules={[
          { title: "Discovery & Platform Strategy", duration: "3–5 Days", topics: ["Requirements workshops", "Native vs cross-platform decision", "Wireframes", "Technical scoping"] },
          { title: "UI/UX Design", duration: "1 Week", topics: ["Design system", "Interactive prototypes", "Platform guidelines", "Usability review"] },
          { title: "Core Development", duration: "3–5 Weeks", topics: ["Feature development", "API integration", "Offline data layer", "Device hardware integration"] },
          { title: "QA & Device Testing", duration: "1 Week", topics: ["Real-device testing", "Performance profiling", "Battery/memory testing", "Accessibility testing"] },
          { title: "Store Submission", duration: "3–5 Days", topics: ["Store listing prep", "Submission & review", "Beta testing rollout", "Compliance fixes"] },
          { title: "Post-launch Support", duration: "Ongoing", topics: ["Crash monitoring", "Feature updates", "OS version compatibility", "User feedback triage"] },
        ]}
      />

      <ArchitectureOverview
        tone="muted"
        title="Architecture & solution overview"
        description="A typical layered architecture for the mobile apps we build."
        layers={[
          { name: "Presentation Layer", description: "Native or shared UI components optimized for each platform's design language and performance expectations.", tech: "React Native / SwiftUI / Jetpack Compose", icon: Code2 },
          { name: "Business Logic Layer", description: "Shared logic and state management that keeps behavior consistent across iOS and Android.", tech: "TypeScript / Native Modules", icon: Cpu },
          { name: "Local Data & Sync Layer", description: "On-device storage with conflict-resolved background sync for offline-first reliability.", tech: "SQLite / Realm", icon: Database },
          { name: "Backend & Services Layer", description: "Cloud backend handling auth, push notifications, and business APIs shared with your web platform.", tech: "Firebase / Node.js", icon: Server },
        ]}
      />

      <ChecklistGrid
        id="ai-automation"
        title="AI & automation capabilities"
        description="Where AI meaningfully improves engagement and app quality."
        items={[
          { title: "On-device Personalization", description: "Recommend content and features based on individual usage patterns, processed on-device for speed and privacy." },
          { title: "Smart Push Notification Timing", description: "Send notifications when a user is statistically most likely to engage, not at a fixed hour." },
          { title: "AI-assisted Crash Triage", description: "Automatically cluster and prioritize crash reports so engineering time goes to the highest-impact bugs first." },
          { title: "In-app Support Chatbots", description: "Embedded AI assistants that resolve common support questions without leaving the app." },
        ]}
      />

      <ProjectShowcase
        tone="muted"
        title="Industry use cases"
        description="The kinds of mobile apps we build across marketplaces, field service, and consumer products."
        projects={[
          { title: "On-demand Delivery App", description: "A two-sided marketplace app with real-time order tracking and driver routing.", skills: ["React Native", "Maps", "Real-time"] },
          { title: "Field Service Companion App", description: "An offline-first app for field technicians to log jobs and sync data once back in signal range.", skills: ["Offline-first", "Native", "Sync"] },
          { title: "Fitness & Wearable Companion", description: "A fitness tracking app with a companion smartwatch experience and biometric data sync.", skills: ["Wearables", "HealthKit", "Sensors"] },
        ]}
      />

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Benefits & business outcomes"
            features={[
              { name: "Higher Day-1 Retention", desc: "A fast, intuitive first experience keeps more installs from becoming immediate uninstalls." },
              { name: "Lower Cost Per Feature", desc: "Smart cross-platform code sharing means new features ship to both platforms at once, not twice the cost." },
              { name: "Fewer Store Rejections", desc: "Guideline-aware development from day one means fewer surprise delays at submission time." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Why choose our team"
            features={[
              { name: "Real Device Testing Discipline", desc: "We test on a real device lab, not just simulators, so performance issues surface before your users find them." },
              { name: "Store Submission Expertise", desc: "We've navigated enough Apple and Google reviews to avoid the common rejection triggers." },
              { name: "Built for the Next OS Update", desc: "We track platform betas so your app doesn't break the day a new OS version ships." },
            ]}
          />
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <FeatureHighlights
            title="Engagement models"
            features={[
              { name: "Dedicated Team", desc: "A committed mobile team for products with an ongoing roadmap of features and platforms." },
              { name: "Fixed Scope Project", desc: "A defined app scope, timeline, and price for well-specified builds." },
              { name: "Staff Augmentation", desc: "Embed our mobile engineers into your existing team for specific skill or capacity gaps." },
            ]}
          />
        </div>
      </section>

      <DeliveryTimeline
        tone="muted"
        title="Project delivery timeline"
        description="Typical timelines by project scope, so you can plan your launch date realistically."
        bands={[
          { scope: "Single-platform MVP", duration: "4–5 Weeks", fill: 35, description: "A focused build on one platform to validate your app concept with real users." },
          { scope: "Cross-platform Launch", duration: "7–10 Weeks", fill: 70, description: "A full-featured app shipped simultaneously to iOS and Android." },
          { scope: "Enterprise Mobile Suite", duration: "10+ Weeks", fill: 100, description: "Multi-app, multi-team delivery including companion and wearable experiences." },
        ]}
      />

      <FAQAccordion
        faqs={[
          { question: "Should we build native apps or use a cross-platform framework?", answer: "It depends on your performance needs and budget — we'll walk you through the tradeoffs for your specific app and recommend the approach that fits, rather than defaulting to one answer." },
          { question: "How long does app store approval usually take?", answer: "Typically a few days to two weeks depending on the platform and how closely the app follows store guidelines — we build to those guidelines throughout development to minimize surprises." },
          { question: "Can the app work without an internet connection?", answer: "Yes, we regularly build offline-first apps with local storage and background sync for when connectivity returns." },
          { question: "Do you support wearables like Apple Watch or Wear OS?", answer: "Yes, we build companion apps for smartwatches and other wearables as an extension of your core mobile app." },
          { question: "What happens after the app is published?", answer: "We offer ongoing support covering crash monitoring, OS compatibility updates, and continued feature development based on real usage data." },
        ]}
      />

      <RelatedServices
        tone="muted"
        services={[
          { title: "Web App Development", description: "Pair your mobile app with a full web platform or admin dashboard.", href: "/services/web-app-development", icon: Globe },
          { title: "AR/VR", description: "Add immersive AR features directly into your mobile experience.", href: "/services/ar-vr", icon: Glasses },
          { title: "AI Agent", description: "Add an in-app AI assistant for support or automation.", href: "/services/ai-agent", icon: Bot },
        ]}
      />

      <DetailCTA
        heading="Ready to put your product in your users' pockets?"
        description="Let's talk about your app idea, your platform priorities, and how we can help you launch with confidence."
        ctaLabel="Get a Quote"
      />
    </div>
  );
}
