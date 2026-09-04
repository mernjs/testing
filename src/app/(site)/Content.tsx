"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Code, Cpu, LineChart, Globe, Sparkles, CheckCircle2, Play, Users, Zap, Layers,
  Network, Bot, Mic, Users as UsersIcon, BrainCircuit, Clock3,
  Smartphone,
  MessageSquare, ShieldCheck, Rocket,
  Mail, Phone, Workflow, Building2, GraduationCap, HelpCircle,
  Eye, Wallet, FileSignature, Copyright, BadgeCheck,
  UserPlus, MonitorPlay, UserCheck, ArrowLeftRight, CalendarClock, Handshake, LifeBuoy, Briefcase,
  Loader2,
} from "lucide-react";
import ProcessOrbit from "@/components/sections/ProcessOrbit";
import FAQAccordion from "@/components/sections/FAQAccordion";
import SectionHeader from "@/components/sections/SectionHeader";
import SubscriptionCard from "@/components/sections/SubscriptionCard";
import BrandMark from "@/components/BrandMark";
import { brandify } from "@/lib/brand";
import { homeFaqs } from "./faqs";
import { engagementCategories } from "./resource-augmentation/resources-data";
import { CATEGORIES, categoryAcceptsResume, getSubServices, type CategorySlug } from "@/lib/categories";
import { SUCCESS_AUTO_HIDE_MS, useLeadSubmit } from "@/lib/useLeadSubmit";
import { useStableCardHeight } from "@/lib/useStableCardHeight";
import LeadSuccessState from "@/components/sections/LeadSuccessState";

const coreDepartments = [
  {
    tag: "Department 01",
    title: "Software Development",
    description: "Our engineering department designs, builds, and ships custom software — web, mobile, desktop, and cloud platforms.",
    services: [
      "Web App Development", "Mobile App Development", "Desktop App Development", "Prediction & Forecasting",
      "AI Agent", "AI/ML Solutions", "Vision Intelligence", "AR/VR",
    ],
    icon: Code,
    href: "/software-development",
    cta: "Explore Software Development",
    badge: "Core Engineering",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    tag: "Department 02",
    title: "AI & Automations",
    description: "Our AI & Automation department delivers production-grade intelligent workflows, RAG chatbots, document pipelines, predictive triggers, and RPA bots.",
    services: [
      "Process Automation", "Conversational AI", "AI Data Analytics", "Document Intelligence",
      "Predictive Workflows", "AI Integration", "RPA Solutions",
    ],
    icon: BrainCircuit,
    href: "/ai-automations",
    cta: "Explore AI & Automations",
    badge: "New & Featured Division",
    featured: true,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  },
  {
    tag: "Department 03",
    title: "Industrial Training",
    description: "Our training department runs mentor-led, project-based programs that take developers from fundamentals to job-ready.",
    services: [
      "MERN Stack", "MEAN Stack", "Generative AI", "Agentic AI", "Conversational AI", "Computer Vision",
    ],
    icon: GraduationCap,
    href: "/industrial-training",
    cta: "Explore Training",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop",
  },
  {
    tag: "Department 04",
    title: "Resource Augmentation",
    description: "Our staffing department places pre-vetted developers and full teams directly inside your workflow, fast.",
    services: engagementCategories.map((category) => category.title),
    icon: UserPlus,
    href: "/resource-augmentation",
    cta: "Explore Hiring",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    tag: "Department 05",
    title: "Internship Program",
    description: "Our internship department places students and freshers directly onto live engagements, working real feature tickets under a dedicated mentor.",
    services: [
      "MERN Stack", "MEAN Stack", "Generative AI", "Agentic AI", "Conversational AI", "Computer Vision",
    ],
    icon: Briefcase,
    href: "/internship-program",
    cta: "Explore Internships",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
  },
];

const whyChooseUs = [
  { name: "Industry Expertise", desc: "Deep experience across EdTech, FinTech, Real Estate Tech, and general enterprise software.", icon: Building2 },
  { name: "Experienced Team", desc: "Senior-led delivery on every engagement, not junior hours billed at a discount.", icon: Users },
  { name: "Fastest Development", desc: "Reusable components and proven workflows take you from kickoff to launch faster, without cutting corners on quality.", icon: Zap },
  { name: "Agile Development", desc: "Sprint-based delivery with regular demos, so you see progress every step of the way.", icon: Workflow },
  { name: "AI-first Approach", desc: "We evaluate where AI genuinely creates value in your product, not just where it's trendy.", icon: Sparkles },
  { name: "Security by Default", desc: "Authentication, data protection, and compliance built in from the first architecture review.", icon: ShieldCheck },
  { name: "Built to Scale", desc: "Infrastructure designed for where your business is headed, not just where it is today.", icon: LineChart },
  { name: "Post-launch Support", desc: "SLA-backed maintenance and monitoring once your product is live, not radio silence after go-live.", icon: LifeBuoy },
];

const trustBadges = [
  { label: "Free Live Project Demo", icon: MonitorPlay },
  { label: "Pre-Vetted Developers", icon: UserCheck },
  { label: "NDA & IP Protected", icon: FileSignature },
  { label: "Developer Replacement Anytime", icon: ArrowLeftRight },
];

const howWeWorkSteps = [
  { title: "Discovery Call", description: "We learn your goals, constraints, and the right engagement model for your project or hiring need.", icon: MessageSquare },
  { title: "Proposal & Team Match", description: "A clear scope, timeline, and pricing — plus the right developers or team matched to the work.", icon: FileSignature },
  { title: "Build & Weekly Updates", description: "Sprint-based development or fast onboarding, with weekly demos so you always see real progress.", icon: Workflow },
  { title: "Launch & Ongoing Support", description: "Go live with SLA-backed support — we stay accountable long after the first release.", icon: Rocket },
];

const clientCommitments = [
  { title: "Full Transparency", description: "Milestone-based billing and honest timelines — you always know exactly where your project stands.", icon: Eye },
  { title: "Weekly Progress Updates", description: "Structured weekly check-ins and demos, not radio silence between kickoff and delivery.", icon: CalendarClock },
  { title: "Dedicated Project Manager", description: "One point of contact who owns your engagement end to end, not a rotating cast of account reps.", icon: Handshake },
  { title: "Long-Term Support", description: "SLA-backed maintenance and support long after launch — we don't disappear after go-live.", icon: LifeBuoy },
];

const developmentProcess = [
  { title: "Discovery", duration: "Phase 1", topics: ["Stakeholder interviews", "Requirements gathering", "Goal alignment"], icon: Eye },
  { title: "Planning", duration: "Phase 2", topics: ["Technical scoping", "Roadmap creation", "Resource planning"], icon: CalendarClock },
  { title: "Design", duration: "Phase 3", topics: ["UX wireframes", "Design system", "Prototype validation"], icon: Layers },
  { title: "Development", duration: "Phase 4", topics: ["Sprint-based builds", "Code reviews", "Continuous integration"], icon: Code },
  { title: "Testing", duration: "Phase 5", topics: ["Automated testing", "Manual QA", "Performance testing"], icon: CheckCircle2 },
  { title: "Deployment", duration: "Phase 6", topics: ["CI/CD rollout", "Staging validation", "Production launch"], icon: Rocket },
  { title: "Support & Maintenance", duration: "Phase 7", topics: ["Monitoring", "Bug fixes", "Ongoing iteration"], icon: LifeBuoy },
];

const aiEcosystemNodes = [
  { label: "RAG Solutions", icon: Network, color: "text-amber-500", detail: "Grounding model responses in your own proprietary data." },
  { label: "Agentic AI", icon: Bot, color: "text-indigo-500", detail: "Autonomous agents that plan, act, and self-correct." },
  { label: "Conversational AI", icon: Mic, color: "text-rose-500", detail: "Natural, task-oriented chat and voice interfaces for your product." },
  { label: "Generative AI", icon: Sparkles, color: "text-emerald-500", detail: "On-demand content, code, and creative generation." },
  { label: "AI Automation", icon: UsersIcon, color: "text-teal-500", detail: "Task-specific agents that automate real workflows end-to-end." },
  { label: "Computer Vision", icon: BrainCircuit, color: "text-blue-500", detail: "Understanding and acting on images and video in real time." },
];

const engagementAssurances = [
  { title: "You control the spend", desc: "Milestone-based billing — you approve spend before it happens, not after.", icon: Wallet },
  { title: "NDA from day one", desc: "A mutual NDA is signed before a single project detail is shared.", icon: FileSignature },
  { title: "100% code ownership", desc: "You own 100% of what we build for you — the code, the assets, all of it.", icon: Copyright },
  { title: "Quality, guaranteed", desc: "Automated tests, manual QA, and senior code review before anything ships.", icon: BadgeCheck },
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function HomeContent() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [absMousePosition, setAbsMousePosition] = useState({ x: 0, y: 0 });

  const [activeService, setActiveService] = useState(0);
  const [activeIndustry, setActiveIndustry] = useState(0);

  const [heroCategory, setHeroCategory] = useState<CategorySlug>(CATEGORIES[0].slug);
  const [heroSubService, setHeroSubService] = useState<string>(getSubServices(CATEGORIES[0].slug)[0].slug);
  const [heroName, setHeroName] = useState("");
  const [heroPhone, setHeroPhone] = useState("");
  const [heroMessage, setHeroMessage] = useState("");
  const [heroResumeFile, setHeroResumeFile] = useState<File | null>(null);
  const heroLead = useLeadSubmit();
  const { ref: heroCardBodyRef, minHeight: heroCardMinHeight } = useStableCardHeight(heroLead.status === "success");
  const heroWantsResume = categoryAcceptsResume(heroCategory);

  function handleHeroCategoryChange(next: CategorySlug) {
    setHeroCategory(next);
    setHeroSubService(getSubServices(next)[0].slug);
  }

  async function handleHeroSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await heroLead.submit(heroCategory, {
      name: heroName,
      phone: heroPhone,
      message: heroWantsResume ? undefined : heroMessage,
      subService: heroSubService,
      resume: heroWantsResume ? heroResumeFile : undefined,
      source: "homepage-hero",
    });
    if (ok) {
      setHeroName("");
      setHeroPhone("");
      setHeroMessage("");
      setHeroResumeFile(null);
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setAbsMousePosition({ x: e.clientX, y: e.clientY });
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const services = [
    {
      title: "Web App Development",
      subtitle: "Scalable platforms for the modern web.",
      desc: "Custom, highly responsive web applications tailored to your business needs. We build robust platforms capable of handling millions of users effortlessly.",
      icon: <Globe className="w-6 h-6" />,
      iconLarge: <Globe className="w-10 h-10 text-white" />,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
      href: "/services/web-app-development"
    },
    {
      title: "Mobile App Development",
      subtitle: "Native and cross-platform apps.",
      desc: "Intuitive, high-performance mobile apps for iOS and Android, built for offline reliability and deep device integration.",
      icon: <Smartphone className="w-6 h-6" />,
      iconLarge: <Smartphone className="w-10 h-10 text-white" />,
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
      href: "/services/mobile-app-development"
    },
    {
      title: "AI/ML Solutions",
      subtitle: "Custom machine learning architecture.",
      desc: "Deploy intelligent models that automate complex processes, enhance customer experiences, and provide deep actionable insights instantly.",
      icon: <Cpu className="w-6 h-6" />,
      iconLarge: <Cpu className="w-10 h-10 text-white" />,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
      href: "/services/ai-ml-solutions"
    },
    {
      title: "AI Agent",
      subtitle: "Autonomous assistants for your enterprise.",
      desc: "Deploy intelligent, autonomous AI agents that handle customer support, automate internal workflows, and act as 24/7 digital employees.",
      icon: <Bot className="w-6 h-6" />,
      iconLarge: <Bot className="w-10 h-10 text-white" />,
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
      href: "/services/ai-agent"
    }
  ];

  const industries = [
    {
      title: "Education",
      subtitle: "Transforming modern education.",
      desc: "We build intuitive learning management systems, virtual classrooms, and educational games that make learning accessible and engaging.",
      icon: <Users className="w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
      href: "/industries/education",
      related: ["Web App Development", "AI/ML Solutions"],
    },
    {
      title: "Real Estate",
      subtitle: "Digitizing property management.",
      desc: "From virtual property tours to automated tenant management software, we provide comprehensive solutions for modern real estate.",
      icon: <Layers className="w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
      href: "/industries/real-estate",
      related: ["Web App Development", "AR/VR"],
    },
    {
      title: "Finance",
      subtitle: "Secure financial technology.",
      desc: "We engineer highly secure banking portals, automated trading platforms, and seamless payment gateways compliant with financial regulations.",
      icon: <LineChart className="w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
      href: "/industries/finance",
      related: ["AI/ML Solutions", "Vision Intelligence"],
    }
  ];

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      {/* 1. Hero — Who we are & what we do */}
      <section className="relative bg-background pt-28 pb-20 lg:pt-36 lg:pb-32 min-h-screen flex items-center justify-center overflow-hidden border-b border-border/50">

        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/90 lg:hidden"></div>
          <div
            className="absolute inset-0 bg-background hidden lg:block"
            style={{
              maskImage: "linear-gradient(to right, black 0%, black 45%, transparent 92%)",
              WebkitMaskImage: "linear-gradient(to right, black 0%, black 45%, transparent 92%)",
            }}
          ></div>
          <div
            className="absolute inset-0 bg-background hidden lg:block"
            style={{
              maskImage: "linear-gradient(to top, black 0%, transparent 40%)",
              WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 40%)",
            }}
          ></div>
        </div>

        {/* Ultra-Modern Ambient Aurora Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/15 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
          <div className="absolute top-[20%] right-[5%] w-[40vw] h-[40vw] rounded-full bg-secondary/15 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[#ff8e75]/15 blur-[140px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
        </div>

        {/* Interactive Spotlight Reveal Grid */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Base faint grid */}
          <div className="absolute inset-0 bg-grid-slate-900/[0.02] dark:bg-grid-slate-400/[0.02] [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>

          {/* Spotlight bright grid */}
          <div
            className="absolute inset-0 bg-grid-slate-900/[0.08] dark:bg-grid-slate-400/[0.08]"
            style={{
              WebkitMaskImage: "radial-gradient(500px circle at " + absMousePosition.x + "px " + absMousePosition.y + "px, black, transparent 80%)",
              maskImage: "radial-gradient(500px circle at " + absMousePosition.x + "px " + absMousePosition.y + "px, black, transparent 80%)"
            }}
          />
        </div>

        {/* Floating Parallax Elements */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden hidden lg:block">
          <motion.div
            animate={{ x: mousePosition.x * -1.5, y: mousePosition.y * -1.5, rotate: mousePosition.x * 0.5 }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            className="absolute top-[20%] left-[10%] opacity-20"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0L24.4903 15.5097L40 20L24.4903 24.4903L20 40L15.5097 24.4903L0 20L15.5097 15.5097L20 0Z" fill="currentColor" className="text-primary" />
            </svg>
          </motion.div>
          <motion.div
            animate={{ x: mousePosition.x * 2, y: mousePosition.y * 2, rotate: mousePosition.y * -0.5 }}
            transition={{ type: "spring", stiffness: 30, damping: 25 }}
            className="absolute bottom-[25%] right-[15%] opacity-20"
          >
            <div className="w-16 h-16 border border-secondary rounded-full"></div>
          </motion.div>
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/40 border border-border/50 text-sm font-medium text-foreground backdrop-blur-md mb-8 shadow-sm">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span>Next-Gen Software Development · Training · Dedicated Teams</span>
              </motion.div>

              <motion.h1 variants={fadeIn} className="text-5xl font-black tracking-tighter text-foreground sm:text-7xl leading-[1.1] mb-6">
                Build the future with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#ff8e75] to-primary bg-300% animate-gradient">
                  Intelligent Tech
                </span>
              </motion.h1>

              <motion.p variants={fadeIn} className="text-lg sm:text-xl leading-relaxed text-muted-foreground mb-10 max-w-lg">
                <span className="font-bold"><span className="text-foreground">Yash</span><span className="text-primary">Orbit</span></span> delivers next-gen software development, builds developers who ship from day one, and deploys pre-vetted tech talent in days — so you launch faster, scale without limits, and never let hiring slow you down.
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-start gap-4">
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-8 py-4 text-sm font-bold text-background transition-all hover:scale-105 active:scale-95 shadow-xl shadow-foreground/20"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Let&apos;s Talk <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/services"
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-foreground bg-muted/30 border border-border/50 hover:bg-muted/60 backdrop-blur-sm transition-all shadow-sm"
                >
                  <Play className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" fill="currentColor" />
                  Explore Solutions
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative hidden lg:block perspective-1000"
            >
              <motion.div
                animate={{ rotateX: mousePosition.y * 0.5, rotateY: mousePosition.x * 0.5 }}
                transition={{ type: "spring", stiffness: 100, damping: 30 }}
                className="relative w-full aspect-square max-w-lg mx-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2.5rem] blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative h-full w-full bg-background/40 backdrop-blur-xl border border-border/60 rounded-[2.5rem] shadow-2xl p-6 flex flex-col gap-4 overflow-hidden">
                  <div className="flex justify-between items-center border-b border-border/50 pb-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-primary/10 text-primary">React</span>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-secondary/20 text-secondary-foreground">Node.js</span>
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#ff8e75]/15 text-[#ff8e75]">AI/ML</span>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="col-span-2 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-border/30 relative overflow-hidden">
                      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-primary/20 to-transparent"></div>
                      <svg className="absolute bottom-0 w-full h-24 text-primary/40" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,100 C20,80 40,100 60,60 C80,20 100,60 100,60 L100,100 Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="h-24 bg-muted/30 rounded-2xl border border-border/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" style={{ animationDuration: '3s' }}></div>
                    </div>
                    <div className="h-24 bg-muted/30 rounded-2xl border border-border/30 p-4 flex flex-col gap-2 justify-center">
                      <div className="w-3/4 h-2 bg-foreground/20 rounded-full"></div>
                      <div className="w-1/2 h-2 bg-foreground/20 rounded-full"></div>
                      <div className="w-full h-2 bg-foreground/20 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -right-8 top-16 p-4 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">System Online</div>
                    <div className="text-xs text-muted-foreground">99.99% Uptime</div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="absolute -left-12 bottom-24 p-4 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Performance</div>
                    <div className="text-xs text-muted-foreground">Optimized</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Scroll to explore</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-muted-foreground/50 to-transparent"></div>
        </motion.div>
      </section>

      {/* 2. Trust Badges — Instant credibility signals */}
      <section className="relative bg-background border-b border-border/50 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={stagger}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {trustBadges.map((badge) => (
              <motion.div
                key={badge.label}
                variants={fadeIn}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-muted/40 border border-border/50 text-xs sm:text-sm font-semibold text-foreground backdrop-blur-md shadow-sm"
              >
                <badge.icon className="w-4 h-4 text-primary flex-none" />
                {badge.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Our Specialized Service Departments — What we offer */}
      <section className="py-24 sm:py-32 bg-muted/10 relative overflow-hidden border-b border-border/50">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <SectionHeader
            align="center"
            category="How We're Structured"
            icon={Layers}
            heading="Our Specialized Service Departments"
            description="YashOrbit operates through five specialized departments — engineered to deliver custom software, enterprise AI & automations, industry-ready training, talent augmentation, and real-world internships."
            className="mx-auto"
          />

          {/* Top 2 Featured Bento Cards — Software Engineering & AI & Automations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {coreDepartments.slice(0, 2).map((department) => {
              const IconComponent = department.icon;
              const isAI = department.featured;
              return (
                <motion.div
                  key={department.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                  className="group relative"
                >
                  <div className={`absolute -inset-1 rounded-[2.5rem] bg-gradient-to-br ${
                    isAI ? "from-primary/40 via-primary/10 to-secondary/30" : "from-primary/30 via-primary/0 to-secondary/30"
                  } opacity-60 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none`} />

                  <Link
                    href={department.href}
                    className="relative flex flex-col justify-between h-full rounded-[2.5rem] bg-muted/10 p-8 sm:p-11 border border-border/50 hover:border-primary/40 overflow-hidden shadow-xl group-hover:shadow-2xl group-hover:shadow-primary/10 group-hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Ambient color wash */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <Image
                        src={department.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 600px, 100vw"
                        className="object-cover scale-125 blur-2xl opacity-[0.09] group-hover:opacity-[0.18] transition-opacity duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-muted/20" />
                    </div>

                    {/* Ambient glow blobs */}
                    <div className={`absolute -top-32 -right-16 w-80 h-80 ${isAI ? "bg-primary/25" : "bg-secondary/20"} rounded-full blur-[100px] pointer-events-none`} />
                    <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-primary/15 rounded-full blur-[90px] pointer-events-none" />

                    <div className="relative z-10 mb-8">
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${
                          isAI
                            ? "text-primary-foreground bg-gradient-to-r from-primary to-[#ff8e75] shadow-lg shadow-primary/30"
                            : "text-foreground bg-background border border-border/50"
                        } px-3.5 py-1.5 rounded-full`}>
                          <Sparkles className="w-3.5 h-3.5" />
                          {department.badge}
                        </span>
                        <div className="flex items-center gap-2 bg-background/80 border border-border/50 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm">
                          <BrandMark className="w-4 h-4 shrink-0" />
                          <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground">{department.tag}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 rounded-2xl ${
                          isAI ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "bg-primary/10 text-primary border border-border/50"
                        } flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                          <IconComponent className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight group-hover:text-primary transition-colors">{department.title}</h3>
                      </div>

                      <p className="text-muted-foreground text-base leading-relaxed mb-6">{department.description}</p>

                      <div className="pt-2">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                          Featured Capabilities ({department.services.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {department.services.map((service) => (
                            <span
                              key={service}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground bg-background border border-border/60 px-3 py-1 rounded-full group-hover:border-primary/40 group-hover:bg-primary/5 transition-colors duration-300"
                            >
                              <CheckCircle2 className="w-3 h-3 text-primary flex-none" />
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 pt-4 border-t border-border/50">
                      <span className="inline-flex items-center gap-2 rounded-full bg-foreground group-hover:bg-primary px-6 py-3 text-sm font-bold text-background group-hover:text-primary-foreground transition-all duration-300">
                        {department.cta}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Remaining 3 Departments Grid — Compact & Clean */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreDepartments.slice(2).map((department, idx) => (
              <motion.div
                key={department.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-primary/25 via-primary/0 to-secondary/25 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 pointer-events-none" />

                <Link
                  href={department.href}
                  className="relative flex flex-col h-full p-7 rounded-[1.75rem] bg-muted/10 border border-border/50 overflow-hidden shadow-sm group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:border-primary/40 group-hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Ambient color wash, sampled from the item's real image */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <Image
                      src={department.image}
                      alt=""
                      fill
                      sizes="400px"
                      className="object-cover scale-125 blur-2xl opacity-[0.08] group-hover:opacity-[0.16] transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-muted/20" />
                  </div>

                  <span className="pointer-events-none absolute -top-4 -right-2 text-6xl font-black leading-none text-muted-foreground/[0.07] group-hover:text-primary/10 transition-colors duration-500 select-none">
                    0{idx + 3}
                  </span>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <department.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-background/70 border border-border/50 px-2.5 py-1 rounded-full backdrop-blur-sm group-hover:border-primary/30 group-hover:text-foreground transition-colors duration-300">
                        <BrandMark className="w-3.5 h-3.5" />
                        <span>0{idx + 3}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2 leading-snug">{department.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{department.description}</p>

                    <div className="mb-6 flex-1">
                      <div className="flex flex-wrap gap-1.5">
                        {department.services.slice(0, 4).map((service) => (
                          <span
                            key={service}
                            className="inline-flex items-center text-[11px] font-semibold text-foreground bg-muted/40 border border-border/50 px-2.5 py-1 rounded-full group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors duration-300"
                          >
                            {service}
                          </span>
                        ))}
                        {department.services.length > 4 && (
                          <span className="inline-flex items-center text-[11px] font-semibold text-muted-foreground px-2.5 py-1">
                            +{department.services.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="mt-auto inline-flex w-fit items-center gap-1.5 text-sm font-bold text-foreground group-hover:text-primary group-hover:gap-2.5 transition-all duration-300">
                      {department.cta}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-14 flex justify-center"
          >
            <p className="text-sm text-muted-foreground text-center">
              Want to build this with us?{" "}
              <Link href="/careers" className="font-bold text-foreground hover:text-primary transition-colors">
                We&apos;re hiring — explore Careers <ArrowRight className="inline w-3.5 h-3.5 ml-0.5" />
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4. Why Choose Us — Why trust us */}
      <section className="py-24 sm:py-32 bg-muted/10 relative overflow-hidden">
        <div className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-1/2 w-[700px] h-[700px] bg-secondary/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <SectionHeader
            align="center"
            category="Why Choose Us"
            icon={ShieldCheck}
            heading="A partner built around outcomes."
            description="Eight reasons growing businesses choose to build with us."
            className="mx-auto"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyChooseUs.map((reason, i) => (
              <motion.div
                key={reason.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className="group relative"
              >
                <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-primary/25 via-primary/0 to-secondary/25 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 pointer-events-none" />

                <div className="relative h-full p-6 rounded-3xl bg-background/90 dark:bg-muted/10 backdrop-blur-md border border-border/60 shadow-md group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:border-primary/40 group-hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {/* Ambient color wash matching department card background */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/15 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-muted/20" />
                  </div>

                  <span className="pointer-events-none absolute -top-3 -right-1 text-5xl font-black leading-none text-muted-foreground/[0.06] group-hover:text-primary/10 transition-colors duration-500 select-none">
                    0{i + 1}
                  </span>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[#ff8e75] flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <reason.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-background/70 border border-border/50 px-2.5 py-1 rounded-full backdrop-blur-sm group-hover:border-primary/30 group-hover:text-foreground transition-colors duration-300">
                        <BrandMark className="w-3.5 h-3.5" />
                        <span>0{i + 1}</span>
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground mb-2 leading-snug">{reason.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{reason.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How We Work — How to get started */}
      <section className="py-24 sm:py-32 bg-background relative overflow-hidden border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <SectionHeader
            align="center"
            category="How We Work"
            icon={Workflow}
            heading="From First Call to Launch."
            accent="Four Steps."
            description="A simple, transparent process whether you're hiring a project team or a single developer."
            className="mx-auto"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howWeWorkSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-primary/25 via-primary/0 to-secondary/25 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 pointer-events-none" />

                <div className="relative h-full p-7 rounded-3xl bg-background/90 dark:bg-muted/10 backdrop-blur-md border border-border/60 shadow-md group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:border-primary/40 group-hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {/* Ambient color wash matching department card background */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/15 via-transparent to-primary/10 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-muted/20" />
                  </div>

                  <span className="pointer-events-none absolute -top-4 -right-2 text-6xl font-black leading-none text-muted-foreground/[0.06] group-hover:text-primary/10 transition-colors duration-500 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[#ff8e75] flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-background/70 border border-border/50 px-2.5 py-1 rounded-full backdrop-blur-sm group-hover:border-primary/30 group-hover:text-foreground transition-colors duration-300">
                        <BrandMark className="w-3.5 h-3.5" />
                        <span>Step {i + 1}</span>
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground mb-2 leading-snug">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {i < howWeWorkSteps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-[calc(0.75rem+1px)] -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-background border border-border/50 items-center justify-center group-hover:border-primary/40 transition-colors duration-300">
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-14 flex justify-center"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 text-sm font-bold text-foreground hover:text-primary transition-colors"
            >
              Start With a Discovery Call
              <span className="w-10 h-10 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <ArrowRight className="w-4 h-4 group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 6. Our Delivery Process — How we build */}
      <section className="py-24 sm:py-32 bg-muted/10 relative overflow-hidden">
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[900px] h-[500px] bg-primary/10 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <SectionHeader
            align="center"
            category="Our Delivery Process"
            icon={Workflow}
            heading="Our development process"
            description="A closer look at the seven phases behind every software engagement, from first call to launch."
            className="mx-auto"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {developmentProcess.map((phase, i) => (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
                className="group relative"
              >
                <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-primary/25 via-primary/0 to-secondary/25 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 pointer-events-none" />

                <div className="relative h-full flex flex-col p-6 rounded-3xl bg-background/90 dark:bg-muted/10 backdrop-blur-md border border-border/60 shadow-md group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:border-primary/40 group-hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {/* Ambient color wash matching department card background */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/15 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-muted/20" />
                  </div>

                  <span className="pointer-events-none absolute -top-4 -right-2 text-6xl font-black leading-none text-muted-foreground/[0.06] group-hover:text-primary/10 transition-colors duration-500 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[#ff8e75] flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <phase.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                        <BrandMark className="w-3.5 h-3.5" />
                        {phase.duration}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-3 leading-snug">{phase.title}</h3>

                    <ul className="space-y-1.5 mt-auto">
                      {phase.topics.map((topic) => (
                        <li key={topic} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-none" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {i < developmentProcess.length - 1 && (i + 1) % 4 !== 0 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-[calc(1.25rem+1px)] -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-background border border-border/50 items-center justify-center group-hover:border-primary/40 transition-colors duration-300">
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Client Commitment — Relationship trust */}
      <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <SectionHeader
            align="center"
            category="Our Commitment"
            icon={Handshake}
            heading="Working With Us Feels"
            accent="Different."
            description="Every engagement — big or small — comes with the same standard of communication and accountability."
            className="mx-auto"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clientCommitments.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-primary/25 via-primary/0 to-secondary/25 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 pointer-events-none" />

                <div className="relative h-full p-7 rounded-3xl bg-background/90 dark:bg-muted/10 backdrop-blur-md border border-border/60 shadow-md group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:border-primary/40 group-hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {/* Ambient color wash matching department card background */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/15 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-muted/20" />
                  </div>

                  <span className="pointer-events-none absolute -top-4 -right-2 text-6xl font-black leading-none text-muted-foreground/[0.06] group-hover:text-primary/10 transition-colors duration-500 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[#ff8e75] flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-background/70 border border-border/50 px-2.5 py-1 rounded-full backdrop-blur-sm group-hover:border-primary/30 group-hover:text-foreground transition-colors duration-300">
                        <BrandMark className="w-3.5 h-3.5" />
                        <span>0{i + 1}</span>
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground mb-2 leading-snug">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Resource Augmentation Preview — Hiring deep-dive */}
      <section className="py-24 sm:py-32 bg-muted/10 relative overflow-hidden border-b border-border/50">
        <div className="absolute right-0 top-1/3 translate-x-1/3 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <SectionHeader
            align="center"
            category="Resource Augmentation"
            icon={UserPlus}
            heading="Need Extra Hands?"
            accent="We&apos;ve Got You."
            description="Hire a single developer or a complete pre-built team — flexible engagement models built for how you actually work."
            className="mx-auto"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {engagementCategories
              .filter((category) => category.slug === "single-resource" || category.slug === "package-based-team")
              .map((category, idx) => (
                <SubscriptionCard
                  key={category.slug}
                  index={idx}
                  icon={category.icon}
                  title={category.title}
                  tagline={category.tagline}
                  price={category.cardHighlight.pricing}
                  billingType={category.cardHighlight.billingType}
                  bestFor={category.cardHighlight.idealUseCase}
                  features={category.keyBenefits}
                  featuresLabel="Key Benefits"
                  href={`/resource-augmentation/${category.slug}`}
                  ctaLabel="View Details"
                  featured={category.slug === "package-based-team"}
                />
              ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-14 flex justify-center"
          >
            <Link
              href="/resource-augmentation"
              className="group inline-flex items-center gap-3 text-sm font-bold text-foreground hover:text-primary transition-colors"
            >
              View All Engagement Models
              <span className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <ArrowRight className="w-4 h-4 group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 9. Industries We Serve — Sector relevance & trust */}
      <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <SectionHeader
            align="center"
            category="Industries We Serve"
            icon={Building2}
            heading="Built for your industry."
            description="Deep, applied experience across the industries we know best."
            className="mx-auto"
          />

          {/* Horizontal Expanding Accordion Container */}
          <div className="flex flex-col lg:flex-row h-auto lg:h-[600px] gap-4 w-full">
            {industries.map((ind, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveIndustry(idx)}
                className={`relative rounded-[2.5rem] overflow-hidden transition-all duration-700 ease-out border border-border/50 flex flex-col justify-end p-8 cursor-pointer group ${activeIndustry === idx
                  ? "lg:flex-[3] shadow-2xl h-[450px] lg:h-auto"
                  : "lg:flex-[1] h-[150px] lg:h-auto"
                  }`}
              >
                {/* Background Photo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ind.image}
                  alt={ind.title}
                  className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10 transition-opacity duration-700 ${activeIndustry === idx ? "opacity-100" : "opacity-90 group-hover:opacity-80"
                  }`}></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/25 mix-blend-overlay"></div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  {/* Top Area: Icon and Collapsed Title (Desktop Only) */}
                  <div className="flex flex-col gap-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${activeIndustry === idx ? "bg-primary text-primary-foreground" : "bg-white/10 backdrop-blur-md text-white group-hover:bg-primary/80"
                      }`}>
                      {ind.icon}
                    </div>
                    {/* Collapsed rotated text for inactive panels on desktop */}
                    <div className={`hidden lg:block transition-all duration-500 origin-left ${activeIndustry === idx ? "opacity-0 max-h-0" : "opacity-100 -rotate-90 translate-y-32 translate-x-4"
                      }`}>
                      <h3 className="text-3xl font-bold text-white/80 whitespace-nowrap">
                        {ind.title}
                      </h3>
                    </div>
                  </div>

                  {/* Expanded Content Area */}
                  <div className={`flex flex-col justify-end overflow-hidden transition-all duration-700 ease-out ${activeIndustry === idx ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    }`}>
                    <h3 className="text-4xl sm:text-5xl font-bold text-white mb-4">{ind.title}</h3>
                    <p className="text-primary text-sm font-bold uppercase tracking-widest mb-6">{ind.subtitle}</p>
                    <p className="text-white/70 text-lg leading-relaxed mb-6 max-w-lg">
                      {ind.desc}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {ind.related.map((service) => (
                        <span key={service} className="text-xs font-semibold text-white/90 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                          {service}
                        </span>
                      ))}
                    </div>
                    <Link href={ind.href} className="inline-flex items-center gap-2 text-white font-bold hover:text-primary transition-all w-fit">
                      Explore {ind.title} <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mt-14 flex justify-center"
          >
            <Link
              href="/industries"
              className="group inline-flex items-center gap-3 text-sm font-bold text-foreground hover:text-primary transition-colors"
            >
              View All Industries
              <span className="w-10 h-10 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <ArrowRight className="w-4 h-4 group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 10. What We Build — Software Development deep-dive */}
      <section className="py-24 sm:py-32 bg-muted/10 relative overflow-hidden border-b border-border/50">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <SectionHeader
            align="center"
            category="What We Build"
            icon={Rocket}
            heading="The core services we deliver most."
            description="From web platforms to AI agents — engineered for performance, security, and scale."
            className="mx-auto"
          />

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start">
            {/* Interactive Left Sidebar List */}
            <div className="w-full lg:w-[45%] flex flex-col gap-4">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveService(idx)}
                  className={`group relative p-6 sm:p-8 rounded-[2rem] cursor-pointer transition-all duration-500 border ${activeService === idx
                    ? "bg-background border-primary/20 shadow-xl"
                    : "bg-transparent border-transparent hover:bg-background/60"
                    }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${activeService === idx
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30"
                      : "bg-muted text-muted-foreground"
                      }`}>
                      {service.icon}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold transition-colors duration-500 ${activeService === idx ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
                        }`}>
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Interactive Display Area */}
            <div className="w-full lg:w-[55%] h-[550px] relative rounded-[3rem] border border-border/50 overflow-hidden shadow-2xl flex items-center justify-center p-8 sm:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={services[activeService].image}
                    alt={services[activeService].title}
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-secondary/30 mix-blend-overlay"></div>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  initial={{ y: 40, scale: 0.95 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: -40, scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative z-10 w-full h-full flex flex-col justify-center"
                >
                  <div className="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-8">
                    {services[activeService].iconLarge}
                  </div>
                  <p className="text-primary text-sm font-bold uppercase tracking-widest mb-6">
                    {services[activeService].subtitle}
                  </p>
                  <p className="text-white text-xl sm:text-2xl leading-relaxed mb-10 max-w-lg font-medium">
                    {services[activeService].desc}
                  </p>
                  <Link
                    href={services[activeService].href}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-all w-fit shadow-xl shadow-black/20"
                  >
                    Learn More<span className="sr-only"> about {services[activeService].title}</span> <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="mt-14 flex justify-center"
          >
            <Link
              href="/services"
              className="group inline-flex items-center gap-3 text-sm font-bold text-foreground hover:text-primary transition-colors"
            >
              View All Services
              <span className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <ArrowRight className="w-4 h-4 group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 11. AI & Innovation */}
      <ProcessOrbit
        eyebrowIcon={Network}
        heading="AI &"
        headingAccent="Innovation"
        description="We build AI features that solve real problems, not chatbots bolted onto your product. Every integration is grounded in your own data and tailored to your workflow."
        centerLabel="AI Core"
        centerSublabel="The Intelligence Hub"
        nodes={aiEcosystemNodes}
        glow="primary"
        image="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=1600&auto=format&fit=crop"
      />

      {/* 12. Transparency & Trust — Legal/contractual trust */}
      <section className="py-24 sm:py-32 bg-muted/10 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <SectionHeader
            align="center"
            category="Trust & Transparency"
            icon={Eye}
            heading="Every engagement also includes"
            description="The baseline protections that come standard with every engagement — no exceptions, and no fine print to go hunting for."
            className="mx-auto"
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {engagementAssurances.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-primary/25 via-primary/0 to-secondary/25 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-500 pointer-events-none" />

                <div className="relative h-full flex flex-col items-center text-center gap-3 p-6 rounded-3xl bg-background/90 dark:bg-muted/10 backdrop-blur-md border border-border/60 shadow-md group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:border-primary/40 group-hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  {/* Ambient color wash matching department card background */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/15 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/5 to-muted/20" />
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-[#ff8e75] flex items-center justify-center shadow-md shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <item.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground bg-background/70 border border-border/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      <BrandMark className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="text-sm font-bold text-foreground mt-1">{item.title}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 13. FAQs */}
      <FAQAccordion
        category="FAQs"
        icon={HelpCircle}
        title="Frequently asked questions"
        faqs={homeFaqs.map((f) => ({ question: brandify(f.question), answer: f.answer }))}
      />

      {/* 14. Final CTA — Get started */}
      <section className="relative overflow-hidden border-t border-border/50 py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/5 to-transparent"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl leading-[1.1]">
                Ready to transform your ideas?
              </h2>
              <p className="text-xl leading-8 text-muted-foreground max-w-lg">
                Let&apos;s discuss how our technology solutions can help your business achieve its full potential.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-6 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Free consultation</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Dedicated team</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Agile methodology</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <a href="mailto:support@yashorbit.com" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Mail className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">support@yashorbit.com</span>
                </a>
                <a href="tel:+918072278460" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Phone className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">+91 8072278460</span>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -top-6 -right-6 z-10 p-3 bg-background/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Clock3 className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <div className="text-xs font-bold">24hr Response</div>
                  <div className="text-[11px] text-muted-foreground">Guaranteed</div>
                </div>
              </div>

              <div className="p-8 sm:p-10 rounded-[2rem] bg-muted/20 border border-border/50 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
                <div ref={heroCardBodyRef} style={{ minHeight: heroCardMinHeight }} className="relative flex flex-col justify-center">
                {heroLead.status !== "success" && (
                  <p className="relative z-10 text-sm text-muted-foreground mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-primary flex-none" />
                    We reply to every consultation request within one business day.
                  </p>
                )}
                <AnimatePresence mode="wait">
                {heroLead.status === "success" ? (
                  <LeadSuccessState
                    key="success"
                    title="Request sent!"
                    description="Thanks — our team will reach out within one business day."
                    onDismiss={heroLead.reset}
                    autoHideMs={SUCCESS_AUTO_HIDE_MS}
                    compact
                  />
                ) : (
                <form key="form" className="relative z-10 space-y-5" onSubmit={handleHeroSubmit} noValidate>
                  <select
                    value={heroCategory}
                    onChange={(e) => handleHeroCategoryChange(e.target.value as CategorySlug)}
                    aria-label="I'm interested in"
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.label}</option>
                    ))}
                  </select>
                  <select
                    value={heroSubService}
                    onChange={(e) => setHeroSubService(e.target.value)}
                    aria-label="Specific service"
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  >
                    {getSubServices(heroCategory).map((s) => (
                      <option key={s.slug} value={s.slug}>{s.label}</option>
                    ))}
                  </select>
                  {heroLead.fieldErrors.subService && <p className="text-xs text-red-500 -mt-3">{heroLead.fieldErrors.subService}</p>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={heroName}
                        onChange={(e) => setHeroName(e.target.value)}
                        required
                        className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                      />
                      {heroLead.fieldErrors.name && <p className="text-xs text-red-500 mt-1">{heroLead.fieldErrors.name}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Phone Number"
                        value={heroPhone}
                        onChange={(e) => setHeroPhone(e.target.value)}
                        required
                        className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                      />
                      {heroLead.fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{heroLead.fieldErrors.phone}</p>}
                    </div>
                  </div>
                  {heroWantsResume ? (
                    <div>
                      <input
                        type="file"
                        aria-label="Resume / CV"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={(e) => setHeroResumeFile(e.target.files?.[0] ?? null)}
                        className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-primary-foreground hover:file:bg-primary/90 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                      />
                      {heroResumeFile && <p className="text-xs text-muted-foreground mt-1">Selected: {heroResumeFile.name}</p>}
                      {heroLead.fieldErrors.resume && <p className="text-xs text-red-500 mt-1">{heroLead.fieldErrors.resume}</p>}
                    </div>
                  ) : (
                    <textarea
                      rows={3}
                      placeholder="Tell us about your project..."
                      value={heroMessage}
                      onChange={(e) => setHeroMessage(e.target.value)}
                      className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                    ></textarea>
                  )}
                  {heroLead.error && <p className="text-xs text-red-500 text-center">{heroLead.error}</p>}
                  <button
                    type="submit"
                    disabled={heroLead.status === "submitting"}
                    className="group w-full rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {heroLead.status === "submitting" ? (
                      <>Sending <Loader2 className="w-4 h-4 animate-spin" /></>
                    ) : (
                      <>Start a Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </form>
                )}
                </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
