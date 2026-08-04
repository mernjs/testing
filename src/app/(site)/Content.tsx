"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Code, Cpu, LineChart, Globe, Sparkles, CheckCircle2, Play, Users, Zap, Layers,
  Network, Bot, Mic, Users as UsersIcon, BrainCircuit, Briefcase, Trophy, Clock3, Building,
  ThumbsUp, Globe2, Users2, Smartphone, Server, Cloud, Database, Package, Palette,
  MessageSquare, ScanEye, ChevronLeft, ChevronRight, ShieldCheck, Rocket,
  Mail, Phone, Quote, TrendingUp, Workflow, Building2, GraduationCap, Newspaper, HelpCircle,
} from "lucide-react";
import ExecutionFramework from "@/components/sections/ExecutionFramework";
import ProcessOrbit from "@/components/sections/ProcessOrbit";
import ClientTestimonials from "@/components/sections/ClientTestimonials";
import AnimatedCounter from "@/components/AnimatedCounter";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import CurriculumTimeline from "@/components/sections/CurriculumTimeline";
import TechStackGrid from "@/components/sections/TechStackGrid";
import TeamGrid from "@/components/sections/TeamGrid";
import FAQAccordion from "@/components/sections/FAQAccordion";
import SectionHeader from "@/components/sections/SectionHeader";
import { brandify } from "@/lib/brand";

const stats = [
  { value: 10, suffix: "+", label: "Years Founder Experience", icon: Trophy },
  { value: 12, suffix: "+", label: "Projects Delivered", icon: Briefcase },
  { value: 6, suffix: "+", label: "Global Clients", icon: Building },
  { value: 8, suffix: "+", label: "Team Members", icon: Users2 },
  { value: 4, suffix: "+", label: "Industries Served", icon: Globe2 },
  { value: 99, suffix: "%", label: "Customer Satisfaction", icon: ThumbsUp },
];

const trustedClients = ["Nexora Health", "Bloomly", "Vertex Logistics", "Arclight Finance", "Wavecrest Media", "Northgate Retail"];

const aiEcosystemNodes = [
  { label: "RAG Solutions", icon: Network, color: "text-amber-500", detail: "Grounding model responses in your own proprietary data." },
  { label: "Agentic AI", icon: Bot, color: "text-indigo-500", detail: "Autonomous agents that plan, act, and self-correct." },
  { label: "Conversational AI", icon: Mic, color: "text-rose-500", detail: "Natural, task-oriented chat and voice interfaces for your product." },
  { label: "Generative AI", icon: Sparkles, color: "text-emerald-500", detail: "On-demand content, code, and creative generation." },
  { label: "AI Automation", icon: UsersIcon, color: "text-teal-500", detail: "Task-specific agents that automate real workflows end-to-end." },
  { label: "Computer Vision", icon: BrainCircuit, color: "text-blue-500", detail: "Understanding and acting on images and video in real time." },
];

const developmentProcess = [
  { title: "Discovery", duration: "Phase 1", topics: ["Stakeholder interviews", "Requirements gathering", "Goal alignment"] },
  { title: "Planning", duration: "Phase 2", topics: ["Technical scoping", "Roadmap creation", "Resource planning"] },
  { title: "Design", duration: "Phase 3", topics: ["UX wireframes", "Design system", "Prototype validation"] },
  { title: "Development", duration: "Phase 4", topics: ["Sprint-based builds", "Code reviews", "Continuous integration"] },
  { title: "Testing", duration: "Phase 5", topics: ["Automated testing", "Manual QA", "Performance testing"] },
  { title: "Deployment", duration: "Phase 6", topics: ["CI/CD rollout", "Staging validation", "Production launch"] },
  { title: "Support & Maintenance", duration: "Phase 7", topics: ["Monitoring", "Bug fixes", "Ongoing iteration"] },
];

const technologies = [
  { name: "React / Next.js", category: "Frontend", icon: Code },
  { name: "Node.js", category: "Backend", icon: Server },
  { name: "React Native", category: "Mobile", icon: Smartphone },
  { name: "PyTorch / TensorFlow", category: "AI/ML", icon: BrainCircuit },
  { name: "AWS / GCP", category: "Cloud", icon: Cloud },
  { name: "PostgreSQL / MongoDB", category: "Database", icon: Database },
  { name: "Docker / Kubernetes", category: "DevOps", icon: Package },
  { name: "Figma", category: "UI/UX", icon: Palette },
];

const trainingPrograms = [
  { title: "MERN Stack", overview: "Full-stack JavaScript development with MongoDB, Express, React, and Node.js.", duration: "12 Weeks", tech: ["MongoDB", "React", "Node.js"], icon: Code, href: "/industrial-training/mern-stack" },
  { title: "MEAN Stack", overview: "Enterprise-grade single-page apps with MongoDB, Express, Angular, and Node.js.", duration: "12 Weeks", tech: ["Angular", "TypeScript", "RxJS"], icon: Database, href: "/industrial-training/mean-stack" },
  { title: "Generative AI", overview: "Prompt engineering, fine-tuning, and RAG pipelines on top of modern LLMs.", duration: "10 Weeks", tech: ["LLM APIs", "LangChain", "Vector DB"], icon: Sparkles, href: "/industrial-training/generative-ai" },
  { title: "Agentic AI", overview: "Autonomous agents that plan, use tools, and coordinate to complete tasks.", duration: "10 Weeks", tech: ["Python", "Agent Frameworks", "Memory"], icon: Bot, href: "/industrial-training/agentic-ai" },
  { title: "Conversational AI", overview: "Task-oriented chatbots and voice assistants for real businesses.", duration: "10 Weeks", tech: ["NLU", "Dialogue Mgmt", "Voice"], icon: MessageSquare, href: "/industrial-training/conversational-ai" },
  { title: "Computer Vision", overview: "Image classification, object detection, and real-time video analytics.", duration: "10 Weeks", tech: ["OpenCV", "CNNs", "Edge Deploy"], icon: ScanEye, href: "/industrial-training/computer-vision" },
];

const successStories = [
  {
    segment: "Retail Tech",
    title: "Cutting checkout abandonment for an omnichannel retailer",
    challenge: "A fast-growing retailer was losing a significant share of customers at checkout, with cart abandonment spiking on mobile during peak sale periods.",
    solution: "We rebuilt the checkout flow with optimistic UI updates, faster payment processing, and aggressive caching, cutting load times by more than half.",
    technologies: ["Next.js", "Stripe", "Redis"],
    metric: "-42%",
    metricLabel: "Cart abandonment rate",
  },
  {
    segment: "HealthTech",
    title: "Building a scheduling platform for a telehealth network",
    challenge: "A telehealth provider's manual, phone-based scheduling process couldn't keep up with patient demand, leading to long wait times and missed appointments.",
    solution: "We built a self-service scheduling platform with automated reminders and provider availability sync across their clinic network.",
    technologies: ["React Native", "Node.js", "PostgreSQL"],
    metric: "3x",
    metricLabel: "Faster appointment booking",
  },
  {
    segment: "Logistics",
    title: "Automating route planning for a regional delivery fleet",
    challenge: "A regional delivery company was planning routes manually every morning, leading to inefficient routing and rising fuel costs as their fleet grew.",
    solution: "We built an automated route optimization engine that factors in traffic, delivery windows, and vehicle capacity in real time.",
    technologies: ["Python", "OR-Tools", "AWS"],
    metric: "-28%",
    metricLabel: "Fuel & delivery costs",
  },
];

const teamMembers = [
  { name: "Aditya Rao", role: "Co-Founder & CEO", bio: "Sets the long-term product and business vision, and still reviews architecture decisions on major engagements.", initials: "AR", color: "from-primary to-[#ff8e75]" },
  { name: "Simone Carter", role: "Chief Technology Officer", bio: "Owns technical strategy across every engagement, from cloud architecture to AI implementation standards.", initials: "SC", color: "from-secondary to-primary" },
  { name: "Devraj Malhotra", role: "VP of Engineering", bio: "Leads delivery across client teams, keeping quality and timelines consistent as we scale.", initials: "DM", color: "from-[#ff8e75] to-secondary" },
  { name: "Elena Popescu", role: "Head of AI", bio: "Directs our applied AI practice, from model development through production MLOps.", initials: "EP", color: "from-primary to-secondary" },
];

const insights = [
  { title: "Where Applied AI Actually Pays Off in 2026", excerpt: "Most businesses don't need a chatbot — they need automation grounded in their own data. Here's where we see AI creating real ROI right now.", href: "/services/ai-ml-solutions", tag: "AI Trends" },
  { title: "What We're Learning With Our First Projects", excerpt: "Early patterns from our client engagements so far: the technical decisions that consistently paid off, and the ones that didn't.", href: "/about/success-stories", tag: "Company Insights" },
  { title: "Why We Built an Industrial Training Program", excerpt: "How a talent pipeline problem turned into one of our most rewarding initiatives — and what it means for the businesses we serve.", href: "/industrial-training", tag: "Company News" },
];

const homeFaqs = [
  { question: brandify("How do I get started working with YashOrbit?"), answer: "Reach out through our contact form or book a consultation call — we'll start with a short discovery conversation to understand your goals before proposing an approach." },
  { question: "Do you work with startups, or only established enterprises?", answer: "Both. We work with early-stage startups building their first product through to enterprises modernizing decades-old systems, adjusting our engagement model to fit." },
  { question: "What industries do you have the most experience in?", answer: "We have particularly deep experience in EdTech, FinTech, and Real Estate Tech, alongside general SaaS and enterprise software across other sectors." },
  { question: "How long does a typical project take?", answer: "It depends heavily on scope — an MVP can take 3-4 weeks, while a full enterprise platform typically runs 6-10+ weeks. AI-assisted workflows let us move faster than traditional timelines without cutting corners. We'll give you a realistic estimate during scoping." },
  { question: "Do you offer support after a project launches?", answer: "Yes, SLA-backed support plans covering monitoring, bug fixes, and ongoing feature work are a standard part of how we deliver, not a separate add-on." },
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
  const [storyIndex, setStoryIndex] = useState(0);
  const [storyDirection, setStoryDirection] = useState(1);

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

  const nextStory = React.useCallback(() => {
    setStoryDirection(1);
    setStoryIndex((i) => (i + 1) % successStories.length);
  }, []);
  const prevStory = () => {
    setStoryDirection(-1);
    setStoryIndex((i) => (i - 1 + successStories.length) % successStories.length);
  };
  const activeStory = successStories[storyIndex];

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      {/* Immersive Hero Section */}
      <section className="relative bg-background pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-screen flex items-center justify-center overflow-hidden border-b border-border/50">

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
                <span>Next-Generation Technology Partner</span>
              </motion.div>

              <motion.h1 variants={fadeIn} className="text-5xl font-black tracking-tighter text-foreground sm:text-7xl leading-[1.1] mb-6">
                Build the future with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#ff8e75] to-primary bg-300% animate-gradient">
                  Intelligent Tech
                </span>
              </motion.h1>

              <motion.p variants={fadeIn} className="text-lg sm:text-xl leading-relaxed text-muted-foreground mb-10 max-w-lg">
                <span className="font-bold"><span className="text-foreground">Yash</span><span className="text-primary">Orbit</span></span> partners with growing businesses to design, build, and scale software that actually moves the needle — from full-stack products to production-grade AI systems.
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

      {/* Animated Stats Bar */}
      <section className="relative bg-background border-b border-border/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            align="center"
            category="By The Numbers"
            icon={TrendingUp}
            heading="Results you can measure."
            description="A snapshot of the scale and consistency behind every engagement."
            className="mx-auto"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center gap-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                  <stat.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite Marquee Section */}
      <section className="py-10 border-b border-border/50 bg-muted/20 overflow-hidden flex flex-col items-center justify-center">
        <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-6">Trusted by growing businesses worldwide</p>
        <div className="relative w-full max-w-7xl mx-auto flex overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-muted/20 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-muted/20 to-transparent z-10 pointer-events-none"></div>
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="flex whitespace-nowrap gap-16 sm:gap-24 items-center pr-16 sm:pr-24 w-max"
          >
            {[1, 2].map((set) => (
              <React.Fragment key={set}>
                {trustedClients.map((brand) => (
                  <div key={brand + set} className="text-2xl sm:text-3xl font-black text-foreground/20 hover:text-primary transition-colors duration-300 cursor-default">
                    {brand}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ULTRA-MODERN: Interactive Services Section (Hover Reveal Showcase) */}
      <section className="py-24 sm:py-32 bg-background relative overflow-hidden border-b border-border/50">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <SectionHeader
            align="center"
            category="Accelerate Growth"
            icon={Rocket}
            heading="Architecture for the modern web."
            description="Top services engineered for performance, security, and scale."
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
                    ? "bg-muted/30 border-primary/20 shadow-xl"
                    : "bg-transparent border-transparent hover:bg-muted/10"
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
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative z-10 w-full h-full flex flex-col justify-center"
                >
                  <div className="w-24 h-24 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-8">
                    {services[activeService].iconLarge}
                  </div>
                  <h4 className="text-primary text-sm font-bold uppercase tracking-widest mb-6">
                    {services[activeService].subtitle}
                  </h4>
                  <p className="text-white text-xl sm:text-2xl leading-relaxed mb-10 max-w-lg font-medium">
                    {services[activeService].desc}
                  </p>
                  <Link
                    href={services[activeService].href}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-all w-fit shadow-xl shadow-black/20"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
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
              <span className="w-10 h-10 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <ArrowRight className="w-4 h-4 group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            align="center"
            category="Why Choose Us"
            icon={ShieldCheck}
            heading="A partner built around outcomes."
            description="Eight reasons growing businesses choose to build with us."
            className="mx-auto"
          />
          <FeatureHighlights
            features={[
              { name: "Industry Expertise", desc: "Deep experience across EdTech, FinTech, Real Estate Tech, and general enterprise software." },
              { name: "Experienced Team", desc: "Senior-led delivery on every engagement, not junior hours billed at a discount." },
              { name: "Fastest Development", desc: "Reusable components and proven workflows take you from kickoff to launch faster, without cutting corners on quality." },
              { name: "Agile Development", desc: "Sprint-based delivery with regular demos, so you see progress every step of the way." },
              { name: "AI-first Approach", desc: "We evaluate where AI genuinely creates value in your product, not just where it's trendy." },
              { name: "Security by Default", desc: "Authentication, data protection, and compliance built in from the first architecture review." },
              { name: "Built to Scale", desc: "Infrastructure designed for where your business is headed, not just where it is today." },
              { name: "Post-launch Support", desc: "SLA-backed maintenance and monitoring once your product is live, not radio silence after go-live." },
            ]}
          />
        </div>
      </section>

      {/* Development Process */}
      <CurriculumTimeline
        align="center"
        category="How We Work"
        icon={Workflow}
        title="Our development process"
        description="A disciplined, seven-phase process behind every engagement, regardless of size."
        modules={developmentProcess}
      />

      {/* Technologies We Work With */}
      <TechStackGrid
        tone="muted"
        align="center"
        category="Our Toolkit"
        icon={Code}
        title="Technologies we work with"
        description="A snapshot of the stack we reach for across frontend, backend, mobile, and AI."
        items={technologies}
      />

      {/* ULTRA-MODERN: Interactive Industry Focus Section (Expanding Horizontal Accordion) */}
      <section className="py-24 sm:py-32 bg-background relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <SectionHeader
            align="center"
            category="Industry Focus"
            icon={Building2}
            heading="Empowering diverse sectors."
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

      {/* Industrial Training */}
      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            align="center"
            category="Industrial Training"
            icon={GraduationCap}
            heading="Build job-ready skills with us."
            description="Hands-on programs across full-stack development and applied AI."
            className="mx-auto"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingPrograms.map((program, i) => (
              <motion.div
                key={program.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
                className="p-7 rounded-2xl bg-background border border-border/50 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                    <program.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {program.duration}
                  </span>
                </div>
                <h4 className="font-bold text-foreground mb-2 leading-snug">{program.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{program.overview}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {program.tech.map((t) => (
                    <span key={t} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-2.5 py-1 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
                <Link href={program.href} className="inline-flex items-center text-sm font-bold text-foreground hover:text-primary hover:gap-3 gap-2 transition-all mt-auto">
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
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
              href="/industrial-training"
              className="group inline-flex items-center gap-3 text-sm font-bold text-foreground hover:text-primary transition-colors"
            >
              View All Programs
              <span className="w-10 h-10 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <ArrowRight className="w-4 h-4 group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* The AI Ecosystem */}
      <ProcessOrbit
        eyebrowIcon={Network}
        heading="AI &"
        headingAccent="Innovation"
        description="Building true intelligence requires more than just calling an API. We architect comprehensive AI ecosystems that blend cutting-edge models into seamless, autonomous workflows tailored for your business."
        centerLabel="AI Core"
        centerSublabel="The Intelligence Hub"
        nodes={aiEcosystemNodes}
        glow="primary"
        image="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?q=80&w=1600&auto=format&fit=crop"
      />

      {/* Success Stories — Navigable Carousel */}
      <section className="py-24 sm:py-32 bg-muted/10 relative overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="mx-auto max-w-5xl px-6 lg:px-8 relative z-10">
          <SectionHeader
            align="center"
            category="Success Stories"
            icon={Trophy}
            heading="Real challenges, real results."
            description="A closer look at how we've solved real problems for real businesses."
            className="mx-auto"
          />

          <div className="relative min-h-[480px] sm:min-h-[420px] rounded-[2.5rem] bg-background border border-border/50 shadow-xl overflow-hidden">
            <Quote className="absolute top-8 right-8 w-16 h-16 text-primary/10" />

            <AnimatePresence mode="wait" custom={storyDirection}>
              <motion.div
                key={storyIndex}
                custom={storyDirection}
                initial={{ opacity: 0, x: storyDirection * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: storyDirection * -60 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative z-10 p-8 sm:p-12"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full w-fit inline-block mb-5">
                  {activeStory.segment}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 leading-snug">{activeStory.title}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Challenge</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{activeStory.challenge}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Solution</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{activeStory.solution}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-border/50">
                  <div className="flex flex-wrap gap-2">
                    {activeStory.technologies.map((t) => (
                      <span key={t} className="text-xs font-semibold text-foreground bg-muted/40 border border-border/60 px-2.5 py-1 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-foreground leading-tight">{activeStory.metric}</div>
                      <div className="text-xs text-muted-foreground">{activeStory.metricLabel}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prevStory}
              aria-label="Previous success story"
              className="w-11 h-11 rounded-full border border-border/50 bg-muted/30 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {successStories.map((s, i) => (
                <button
                  key={s.title}
                  onClick={() => { setStoryDirection(i > storyIndex ? 1 : -1); setStoryIndex(i); }}
                  aria-label={`Go to success story ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === storyIndex ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/40"}`}
                />
              ))}
            </div>
            <button
              onClick={nextStory}
              aria-label="Next success story"
              className="w-11 h-11 rounded-full border border-border/50 bg-muted/30 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href="/about/success-stories"
              className="group inline-flex items-center gap-3 text-sm font-bold text-foreground hover:text-primary transition-colors"
            >
              View All Success Stories
              <span className="w-10 h-10 rounded-full bg-muted/50 border border-border/50 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <ArrowRight className="w-4 h-4 group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-all" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* What Clients Say — Interactive Testimonials Carousel */}
      <ClientTestimonials icon={Quote} category="Client Voices" />

      {/* Team Highlights */}
      <TeamGrid
        align="center"
        category="Team Highlights"
        icon={Users2}
        title="The team behind the work"
        description="Senior leadership guiding every engagement, backed by engineers, designers, and AI specialists."
        members={teamMembers}
      />
      <div className="pb-24 sm:pb-32 bg-background flex justify-center -mt-12 relative z-10">
        <Link
          href="/about/our-team"
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-muted/30 border border-border/50 px-8 py-4 text-sm font-bold text-foreground hover:bg-muted/60 transition-all"
        >
          Meet the Full Team <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Latest Insights */}
      <section className="py-24 sm:py-32 bg-muted/10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeader
            align="center"
            category="Latest Insights"
            icon={Newspaper}
            heading="Ideas worth sharing."
            description="Perspectives on AI, technology, and how we build for our clients."
            className="mx-auto"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {insights.map((post, i) => (
              <motion.div
                key={post.href + post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-7 rounded-2xl bg-background border border-border/50 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full w-fit mb-5">
                  {post.tag}
                </span>
                <h4 className="font-bold text-foreground mb-3 leading-snug">{post.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{post.excerpt}</p>
                <Link href={post.href} className="inline-flex items-center text-sm font-bold text-foreground hover:text-primary hover:gap-3 gap-2 transition-all mt-auto">
                  Read More <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FAQAccordion
        category="FAQs"
        icon={HelpCircle}
        title="Frequently asked questions"
        faqs={homeFaqs}
      />

      {/* The Execution: Think. Build. Scale. */}
      <ExecutionFramework />

      {/* Interactive CTA Section */}
      <section className="relative overflow-hidden border-t border-border/50 py-24 sm:py-32">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

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
                <a href="tel:+918076623694" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Phone className="w-4 h-4 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">+91 8076623694</span>
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
                <p className="relative z-10 text-sm text-muted-foreground mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary flex-none" />
                  We reply to every consultation request within one business day.
                </p>
                <form className="relative z-10 space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="Work email"
                      className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your project..."
                    className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="group w-full rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    Start a Project <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
