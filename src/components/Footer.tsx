import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { FacebookIcon, GithubIcon, XIcon, InstagramIcon, YoutubeIcon, WhatsAppIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { socialLinks, emails, phone, whatsapp, linkedin, mapsUrl } from "@/lib/contact";

const socialIcons = { Facebook: FacebookIcon, GitHub: GithubIcon, "X (Twitter)": XIcon, Instagram: InstagramIcon, YouTube: YoutubeIcon };

export default function Footer() {
  return (
    <footer className="relative bg-secondary dark:bg-[#1a1533] text-secondary-foreground border-t border-border mt-auto overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[500px] h-[400px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* CTA strip */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-16 sm:pt-20 group/cta">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-primary/20 via-primary/0 to-secondary/20 opacity-0 group-hover/cta:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl bg-background/10 border border-secondary-foreground/15 dark:border-white/10 backdrop-blur-sm px-8 py-10 sm:px-12 transition-all duration-300 group-hover/cta:border-primary/30 group-hover/cta:-translate-y-1">
          <div className="text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary mb-4">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Available for new projects
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Have a project in mind?</h3>
            <p className="text-sm sm:text-base text-secondary-foreground/85 mt-2">Let&apos;s turn your idea into a scalable product.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/30"
            >
              Start a Conversation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-bold text-background hover:scale-105 active:scale-95 transition-all shadow-lg shadow-foreground/10"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-20 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-6 xl:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              {/* Dark mode swaps to the reversed, ice-globe variant for better contrast against
                  the footer's dark surface. See public/brand/icon-on-blue.svg. */}
              <svg viewBox="0 0 64 64" className="w-9 h-9 shrink-0 dark:hidden" aria-hidden="true">
                <path d="M4,50 C0,60 40,38 50,26" fill="none" stroke="#ECF2FD" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                <circle cx="32" cy="32" r="25.5" fill="#1D428A" />
                <g fill="#ECF2FD" opacity="0.4">
                  <circle cx="29.4" cy="24.6" r="0.92" />
                  <circle cx="34.6" cy="24.6" r="0.92" />
                  <circle cx="26.8" cy="29.8" r="0.98" />
                  <circle cx="32.0" cy="29.8" r="1.09" />
                  <circle cx="37.2" cy="29.8" r="0.98" />
                  <circle cx="24.2" cy="35.0" r="0.9" />
                  <circle cx="29.4" cy="35.0" r="1.03" />
                  <circle cx="34.6" cy="35.0" r="1.03" />
                  <circle cx="39.8" cy="35.0" r="0.9" />
                  <circle cx="21.6" cy="19.4" r="0.75" />
                  <circle cx="32.0" cy="19.4" r="0.78" />
                  <circle cx="42.4" cy="19.4" r="0.75" />
                  <circle cx="19.0" cy="45.4" r="0.6" />
                  <circle cx="29.4" cy="45.4" r="0.75" />
                  <circle cx="34.6" cy="45.4" r="0.75" />
                  <circle cx="45.0" cy="45.4" r="0.6" />
                </g>
                <path d="M17.6,17.6 L32,33.6" fill="none" stroke="#ECF2FD" strokeWidth="8" strokeLinecap="round" />
                <path d="M32,33.6 L32,48" fill="none" stroke="#ECF2FD" strokeWidth="8" strokeLinecap="round" />
                <path d="M46.4,17.6 L36,29.2" fill="none" stroke="#ECF2FD" strokeWidth="8" strokeLinecap="round" />
                <circle cx="34.4" cy="30.4" r="4.8" fill="#E56043" />
                <path d="M8,44 C2,57 45,31 56,12" fill="none" stroke="#E56043" strokeWidth="3" strokeLinecap="round" />
                <polygon points="58.6,15.8 51.4,11.6 59.8,5.5" fill="#E56043" />
              </svg>
              <svg viewBox="0 0 64 64" className="hidden w-9 h-9 shrink-0 dark:block" aria-hidden="true">
                <path d="M4,50 C0,60 40,38 50,26" fill="none" stroke="#1D428A" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
                <circle cx="32" cy="32" r="25.5" fill="#ECF2FD" />
                <g fill="#1D428A" opacity="0.22">
                  <circle cx="29.4" cy="24.6" r="0.92" />
                  <circle cx="34.6" cy="24.6" r="0.92" />
                  <circle cx="26.8" cy="29.8" r="0.98" />
                  <circle cx="32.0" cy="29.8" r="1.09" />
                  <circle cx="37.2" cy="29.8" r="0.98" />
                  <circle cx="24.2" cy="35.0" r="0.9" />
                  <circle cx="29.4" cy="35.0" r="1.03" />
                  <circle cx="34.6" cy="35.0" r="1.03" />
                  <circle cx="39.8" cy="35.0" r="0.9" />
                  <circle cx="21.6" cy="19.4" r="0.75" />
                  <circle cx="32.0" cy="19.4" r="0.78" />
                  <circle cx="42.4" cy="19.4" r="0.75" />
                  <circle cx="19.0" cy="45.4" r="0.6" />
                  <circle cx="29.4" cy="45.4" r="0.75" />
                  <circle cx="34.6" cy="45.4" r="0.75" />
                  <circle cx="45.0" cy="45.4" r="0.6" />
                </g>
                <path d="M17.6,17.6 L32,33.6" fill="none" stroke="#1D428A" strokeWidth="8" strokeLinecap="round" />
                <path d="M32,33.6 L32,48" fill="none" stroke="#1D428A" strokeWidth="8" strokeLinecap="round" />
                <path d="M46.4,17.6 L36,29.2" fill="none" stroke="#1D428A" strokeWidth="8" strokeLinecap="round" />
                <circle cx="34.4" cy="30.4" r="4.8" fill="#E56043" />
                <path d="M8,44 C2,57 45,31 56,12" fill="none" stroke="#E56043" strokeWidth="3" strokeLinecap="round" />
                <polygon points="58.6,15.8 51.4,11.6 59.8,5.5" fill="#E56043" />
              </svg>
              <span className="flex flex-col leading-none">
                <span className="font-extrabold text-2xl tracking-tight">
                  <span className="text-secondary-foreground">Yash</span><span className="text-primary">Orbit</span>
                </span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-secondary-foreground/85">
                  Technologies Pvt. Ltd.
                </span>
              </span>
            </Link>
            <p className="text-sm leading-6 text-secondary-foreground/85 max-w-xs">
              Tech solutions built around your business goals — web, mobile, and AI/ML systems engineered to accelerate growth and deliver measurable results.
            </p>

            <div className="space-y-2.5">
              <a
                href={`mailto:${emails.support}`}
                className="flex items-center gap-2.5 text-sm text-secondary-foreground/85 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 flex-none" aria-hidden="true" />
                {emails.support}
              </a>
              <a
                href={phone.href}
                className="flex items-center gap-2.5 text-sm text-secondary-foreground/85 hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 flex-none" aria-hidden="true" />
                {phone.display}
              </a>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground/85 mb-3">Follow us</p>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = socialIcons[social.name];
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-background/10 border border-secondary-foreground/15 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                    >
                      <span className="sr-only">{social.name}</span>
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
                <a
                href={linkedin.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 border border-secondary-foreground/15 dark:border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:scale-110 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                <span className="sr-only">LinkedIn</span>
                <LinkedinIcon className="h-4 w-4" />
              </a>
              </div>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold leading-6 uppercase tracking-wider text-[#b83e23] dark:text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary" />
                Services
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <Link href="/software-development" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Software Development
                  </Link>
                </li>
                <li>
                  <Link href="/services/web-app-development" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/services/mobile-app-development" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link href="/services/ai-ml-solutions" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    AI & ML
                  </Link>
                </li>
                <li>
                  <Link href="/services/ai-agent" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    AI Agent
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="group inline-flex items-center gap-1.5 text-sm font-semibold leading-6 text-secondary-foreground hover:text-primary transition-colors">
                    View All Services
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold leading-6 uppercase tracking-wider text-[#b83e23] dark:text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary" />
                AI & Automations
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <Link href="/ai-automations/intelligent-process-automation" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Process Automation
                  </Link>
                </li>
                <li>
                  <Link href="/ai-automations/conversational-ai-chatbots" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Conversational AI
                  </Link>
                </li>
                <li>
                  <Link href="/ai-automations/ai-powered-data-analytics" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    AI Data Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/ai-automations/document-intelligence" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Document Intelligence
                  </Link>
                </li>
                <li>
                  <Link href="/ai-automations/predictive-ai-workflows" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Predictive Workflows
                  </Link>
                </li>
                <li>
                  <Link href="/ai-automations/ai-integration-services" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    AI Integration
                  </Link>
                </li>
                <li>
                  <Link href="/ai-automations" className="group inline-flex items-center gap-1.5 text-sm font-semibold leading-6 text-secondary-foreground hover:text-primary transition-colors">
                    View All AI Automations
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold leading-6 uppercase tracking-wider text-[#b83e23] dark:text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary" />
                Products
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <Link href="/products/ai-construction-platform" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    AI Construction Platform
                  </Link>
                </li>
                <li>
                  <Link href="/products/smart-spam-filter" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Smart Spam Filter
                  </Link>
                </li>
                <li>
                  <Link href="/products/ai-voice-assistant" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    AI Voice Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/products/predictive-analytics-engine" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Predictive Analytics Engine
                  </Link>
                </li>
                <li>
                  <Link href="/products/image-recognition-system" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Image Recognition System
                  </Link>
                </li>
                <li>
                  <Link href="/products/ai-job-board-portal" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    AI Job Board Portal
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="group inline-flex items-center gap-1.5 text-sm font-semibold leading-6 text-secondary-foreground hover:text-primary transition-colors">
                    View All Products
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold leading-6 uppercase tracking-wider text-[#b83e23] dark:text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary" />
                Company
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <Link href="/about/what-we-do" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/about/our-mission" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link href="/about/our-team" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link href="/about/technologies" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Technologies
                  </Link>
                </li>
                <li>
                  <Link href="/about/success-stories" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="/resource-augmentation" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Resource Augmentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="group inline-flex items-center gap-1.5 text-sm font-semibold leading-6 text-secondary-foreground hover:text-primary transition-colors">
                    View All Company
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold leading-6 uppercase tracking-wider text-[#b83e23] dark:text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary" />
                Training
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <Link href="/industrial-training/mern-stack" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    MERN Stack
                  </Link>
                </li>
                <li>
                  <Link href="/industrial-training/mean-stack" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    MEAN Stack
                  </Link>
                </li>
                <li>
                  <Link href="/industrial-training/generative-ai" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Generative AI
                  </Link>
                </li>
                <li>
                  <Link href="/industrial-training/agentic-ai" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Agentic AI
                  </Link>
                </li>
                <li>
                  <Link href="/industrial-training/conversational-ai" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Conversational AI
                  </Link>
                </li>
                <li>
                  <Link href="/industrial-training/computer-vision" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Computer Vision
                  </Link>
                </li>
                <li>
                  <Link href="/industrial-training" className="group inline-flex items-center gap-1.5 text-sm font-semibold leading-6 text-secondary-foreground hover:text-primary transition-colors">
                    View All Programs
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold leading-6 uppercase tracking-wider text-[#b83e23] dark:text-primary">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-primary to-secondary" />
                Careers
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <Link href="/careers/mern-developer" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    MERN Developer
                  </Link>
                </li>
                <li>
                  <Link href="/careers/genai-developer" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    GenAI Developer
                  </Link>
                </li>
                <li>
                  <Link href="/careers/ui-ux-designer" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    UI/UX Designer
                  </Link>
                </li>
                <li>
                  <Link href="/careers/business-analyst" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Business Analyst
                  </Link>
                </li>
                <li>
                  <Link href="/careers/project-manager" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Project Manager
                  </Link>
                </li>
                <li>
                  <Link href="/careers/digital-marketing" className="inline-block text-sm leading-6 text-secondary-foreground/80 hover:text-primary hover:translate-x-1 transition-all duration-200">
                    Digital Marketing
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="group inline-flex items-center gap-1.5 text-sm font-semibold leading-6 text-secondary-foreground hover:text-primary transition-colors">
                    View All Careers
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-secondary-foreground/10 dark:border-white/10 sm:mt-20 lg:mt-24">
          <div className="mt-8 rounded-2xl bg-white/40 dark:bg-white/5 px-4 py-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs leading-5 text-secondary-foreground/85">
              &copy; {new Date().getFullYear()} <span className="text-secondary-foreground">Yash</span><span className="text-primary">Orbit</span> Technologies Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-secondary-foreground/85">
              <Link href="/about/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/about/terms-and-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link>
              <Link href="/about/refund-cancellation-policy" className="hover:text-primary transition-colors">Refund & Cancellation</Link>
              <Link href="/about/acceptable-use-policy" className="hover:text-primary transition-colors">Acceptable Use</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
