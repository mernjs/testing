import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { FacebookIcon, GithubIcon, XIcon, InstagramIcon, WhatsAppIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { socialLinks, emails, phone, whatsapp, linkedin, mapsUrl } from "@/lib/contact";

const socialIcons = { Facebook: FacebookIcon, GitHub: GithubIcon, "X (Twitter)": XIcon, Instagram: InstagramIcon };

export default function Footer() {
  return (
    <footer className="relative bg-secondary text-secondary-foreground border-t border-border mt-auto overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* CTA strip */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-3xl bg-background/10 border border-white/10 backdrop-blur-sm px-8 py-10 sm:px-12">
          <div className="text-center sm:text-left">
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
              {/* Footer background flips to navy in dark mode (bg-secondary), which matches the
                  standard icon's globe fill exactly — so it's swapped for the reversed, ice-globe
                  variant there to stay visible. See public/brand/icon-on-blue.svg. */}
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
                  <span className="text-secondary-foreground">Yash</span><span className="text-orange-700 dark:text-orange-300">Orbit</span>
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
                      className="w-10 h-10 rounded-full bg-background/10 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors"
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
                className="w-10 h-10 rounded-full bg-background/10 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <LinkedinIcon className="h-4 w-4" />
              </a>  
              <a
                href={whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors"
              >
                <span className="sr-only">WhatsApp</span>
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-colors"
              >
                <span className="sr-only">Location</span>
                <MapPin className="h-4 w-4" aria-hidden="true" />
              </a>             
              </div>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold leading-6 uppercase tracking-wider text-orange-700 dark:text-orange-300">Services</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <Link href="/services/web-app-development" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/services/mobile-app-development" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Mobile Apps
                  </Link>
                </li>
                <li>
                  <Link href="/services/desktop-app-development" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Desktop Apps
                  </Link>
                </li>
                <li>
                  <Link href="/services/ai-ml-solutions" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    AI & ML
                  </Link>
                </li>
                <li>
                  <Link href="/services/ai-agent" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    AI Agent
                  </Link>
                </li>
                <li>
                  <Link href="/services/ar-vr" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    AR/VR
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-sm font-semibold leading-6 text-primary hover:underline transition-colors">
                    View All Services
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 uppercase tracking-wider text-orange-700 dark:text-orange-300">Products</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <Link href="/products/ai-construction-platform" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    AI Construction Platform
                  </Link>
                </li>
                <li>
                  <Link href="/products/smart-spam-filter" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Smart Spam Filter
                  </Link>
                </li>
                <li>
                  <Link href="/products/ai-voice-assistant" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    AI Voice Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/products/predictive-analytics-engine" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Predictive Analytics Engine
                  </Link>
                </li>
                <li>
                  <Link href="/products/image-recognition-system" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Image Recognition System
                  </Link>
                </li>
                <li>
                  <Link href="/products/ai-job-board-portal" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    AI Job Board Portal
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-sm font-semibold leading-6 text-primary hover:underline transition-colors">
                    View All Products
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 uppercase tracking-wider text-orange-700 dark:text-orange-300">Company</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <Link href="/about/what-we-do" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/about/our-mission" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link href="/about/our-team" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link href="/about/technologies" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Technologies
                  </Link>
                </li>
                <li>
                  <Link href="/about/success-stories" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm font-semibold leading-6 text-primary hover:underline transition-colors">
                    View All Company
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 uppercase tracking-wider text-orange-700 dark:text-orange-300">Legal</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <Link href="/about/privacy-policy" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/about/terms-and-conditions" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/about/refund-cancellation-policy" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Refund & Cancellation Policy
                  </Link>
                </li>
                <li>
                  <Link href="/about/acceptable-use-policy" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Acceptable Use Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-6 uppercase tracking-wider text-orange-700 dark:text-orange-300">Live Demos</h3>
              <ul role="list" className="mt-6 space-y-4">
                <li>
                  <Link href="/live-demos/social-media-ai-reels-generator" className="text-sm leading-6 text-secondary-foreground/80 hover:text-primary transition-colors">
                    Social Media AI Reels Generator
                  </Link>
                </li>
                <li>
                  <Link href="/live-demos" className="text-sm font-semibold leading-6 text-primary hover:underline transition-colors">
                    View All Live Demos
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs leading-5 text-secondary-foreground/85">
            &copy; {new Date().getFullYear()} <span className="text-secondary-foreground">Yash</span><span className="text-orange-700 dark:text-orange-300">Orbit</span> Technologies Pvt. Ltd. All rights reserved.
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
    </footer>
  );
}
