import type { PageSection } from "@/lib/cms/section-registry";

/**
 * A neutral starter website for a new company — the pages the public site
 * can't render without (`/`, `/contact`) plus Services, About and a privacy
 * policy starting point. Built only from the CMS's existing section types, so
 * everything is editable in the company's CMS afterwards.
 *
 * Content is deliberately generic for an IT/software company: no client
 * names, testimonials, statistics or promises that the company hasn't made.
 */

export interface StarterVars {
  name: string;
  /** Public contact email for the privacy page; blank until the company profile provides one. */
  email: string;
}

export interface StarterPage {
  path: string;
  title: string;
  sections: PageSection[];
  seo: { title: string; description: string };
}

const IMG = {
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop",
  code: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
  mobile: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
  cloud: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
  design: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop",
  support: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop",
  contact: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1600&auto=format&fit=crop",
  privacy: "https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=1200&auto=format&fit=crop",
};

let order = 0;
function section(type: string, config: Record<string, unknown>): PageSection {
  order += 1024;
  return { id: `${type}-${order}`, type, orderKey: order, enabled: true, config } as PageSection;
}

const SERVICES = [
  { title: "Web Applications", subtitle: "Fast, secure, built to scale.", description: "Custom web platforms, portals and dashboards built with modern frameworks and engineered for performance.", icon: "Code2", image: IMG.code, highlights: ["Web apps", "Portals", "APIs"] },
  { title: "Mobile Apps", subtitle: "iOS, Android and cross-platform.", description: "Native and cross-platform mobile apps with clean design, offline support and reliable releases.", icon: "Smartphone", image: IMG.mobile, highlights: ["iOS", "Android", "Cross-platform"] },
  { title: "Cloud & DevOps", subtitle: "Infrastructure that keeps up.", description: "Cloud architecture, CI/CD pipelines, monitoring and cost optimisation for teams that ship often.", icon: "Cloud", image: IMG.cloud, highlights: ["Cloud", "CI/CD", "Monitoring"] },
  { title: "AI & Data", subtitle: "Practical AI for real problems.", description: "Automation, analytics and AI features that fit your product and your data — where they genuinely add value.", icon: "Sparkles", image: IMG.ai, highlights: ["Automation", "Analytics", "AI features"] },
  { title: "UI/UX Design", subtitle: "Products people enjoy using.", description: "Research, wireframes, design systems and prototypes that turn ideas into clear, usable products.", icon: "Palette", image: IMG.design, highlights: ["Research", "Design systems", "Prototypes"] },
  { title: "Support & Maintenance", subtitle: "We stay after launch.", description: "Updates, fixes, security patches and improvements so your software keeps running smoothly.", icon: "LifeBuoy", image: IMG.support, highlights: ["Updates", "Security", "Improvements"] },
];

export function starterPages(v: StarterVars): StarterPage[] {
  order = 0;
  const home: StarterPage = {
    path: "/",
    title: "Home",
    seo: { title: `${v.name} — Software Development & IT Services`, description: `${v.name} designs, builds and supports web, mobile and cloud software for growing businesses.` },
    sections: [
      section("home-hero", {
        badge: "Software Development · Cloud · AI",
        titleLine1: "Software that moves",
        titleHighlight: "your business forward",
        description: `${v.name} designs, builds and supports web, mobile and cloud software — from first idea to launch and beyond.`,
        primaryCtaLabel: "Let's Talk",
        primaryCtaHref: "/contact",
        secondaryCtaLabel: "Our Services",
        secondaryCtaHref: "/services",
        chipOne: "Web",
        chipTwo: "Mobile",
        chipThree: "Cloud",
        statusTitle: "Built to last",
        statusText: "Secure by design",
        perfTitle: "Performance",
        perfText: "Optimised",
        scrollLabel: "Scroll to explore",
      }),
      section("home-why-choose-us", {
        eyebrow: "Why Choose Us",
        headerIcon: "ShieldCheck",
        heading: "A partner focused on outcomes.",
        description: "What working with us looks like.",
        reasons: [
          { name: "Clear Communication", desc: "Regular updates and demos, so you always know where your project stands.", icon: "MessageSquare" },
          { name: "Quality First", desc: "Code reviews, testing and documentation are part of the work, not extras.", icon: "BadgeCheck" },
          { name: "Agile Delivery", desc: "Short iterations that turn feedback into working software quickly.", icon: "Workflow" },
          { name: "Long-term Support", desc: "We keep improving and maintaining what we build after it goes live.", icon: "LifeBuoy" },
        ],
      }),
      section("home-how-we-work", {
        eyebrow: "How We Work",
        headerIcon: "Workflow",
        heading: "From first call to launch.",
        accent: "Four steps.",
        description: "A simple, transparent process for every project.",
        steps: [
          { title: "Discovery", description: "We learn your goals, users and constraints.", icon: "MessageSquare" },
          { title: "Proposal", description: "A clear scope, timeline and estimate.", icon: "FileSignature" },
          { title: "Build", description: "Iterative development with regular demos.", icon: "Workflow" },
          { title: "Launch & Support", description: "Go live, then keep improving together.", icon: "Rocket" },
        ],
        linkLabel: "Start a conversation",
        linkHref: "/contact",
      }),
      section("faq-accordion", {
        title: "Frequently asked questions",
        faqs: [
          { question: `How do I start a project with ${v.name}?`, answer: "Send us a message through the contact page. We'll set up a short call to understand your goals and suggest the right next step." },
          { question: "How long does a project take?", answer: "It depends on scope. After the discovery call we share a timeline with clear milestones before any work begins." },
          { question: "Do you support software after launch?", answer: "Yes — we offer ongoing maintenance, updates and improvements." },
        ],
      }),
      section("detail-cta", { heading: "Have a project in mind?", description: "Tell us about it — we'll get back to you with next steps.", ctaLabel: "Contact Us", external: false, checklist: ["Free consultation", "Clear estimates", "Regular updates"] }),
    ],
  };

  const services: StarterPage = {
    path: "/services",
    title: "Services",
    seo: { title: `Services | ${v.name}`, description: `Web, mobile, cloud, AI and design services from ${v.name}.` },
    sections: [
      section("listing-hero", { eyebrow: "services", title: "Our Services", description: "End-to-end software development, from design to launch and ongoing support.", icon: "Layers", image: IMG.code }),
      section("listing-grid", { badge: "Services", badgeIcon: "Layers", sectionLabel: "What We Do", items: SERVICES.map((s) => ({ ...s, href: "/contact" })) }),
      section("detail-cta", { heading: "Not sure what you need?", description: "Tell us about your idea and we'll recommend the right approach.", ctaLabel: "Contact Us", external: false, checklist: [] }),
    ],
  };

  const about: StarterPage = {
    path: "/about",
    title: "About",
    seo: { title: `About | ${v.name}`, description: `Learn about ${v.name} and how we work.` },
    sections: [
      section("listing-hero", { eyebrow: "about", title: `About ${v.name}`, description: "We're a software team that builds reliable products and stays with them after launch.", icon: "Users", image: IMG.team }),
      section("home-how-we-work", {
        eyebrow: "Our Approach",
        headerIcon: "Compass",
        heading: "How we work with you.",
        accent: "",
        description: "Principles we bring to every project.",
        steps: [
          { title: "Understand first", description: "We start with your users and your business goals.", icon: "Search" },
          { title: "Build in the open", description: "Frequent demos and honest progress updates.", icon: "Eye" },
          { title: "Own the quality", description: "Testing, reviews and documentation as standard.", icon: "BadgeCheck" },
          { title: "Stay accountable", description: "Support and improvements long after launch.", icon: "HeartHandshake" },
        ],
        linkLabel: "Work with us",
        linkHref: "/contact",
      }),
      section("detail-cta", { heading: "Let's build something together", description: "Tell us about your project and we'll take it from there.", ctaLabel: "Contact Us", external: false, checklist: [] }),
    ],
  };

  const contact: StarterPage = {
    path: "/contact",
    title: "Contact",
    seo: { title: `Contact | ${v.name}`, description: `Get in touch with ${v.name}.` },
    sections: [
      section("contact-hero", {
        badge: "Get in touch",
        headingLead: "Let's build something ",
        headingHighlight: "great",
        headingTail: ".",
        description: "Have a project in mind or a question? Send us a message and we'll get back to you.",
        backgroundImage: IMG.contact,
        cardImage: IMG.contact,
        badgeOneTitle: "Quick response",
        badgeOneSubtitle: "Every enquiry answered",
        badgeTwoTitle: "Free consultation",
        badgeTwoSubtitle: "No commitment",
      }),
      section("contact-form", {
        heading: "Get in Touch",
        intro: "Fill out the form and we'll reach out to you.",
        emailTitle: "Email us",
        emailText: "For general enquiries and project proposals.",
        callTitle: "Call us",
        callText: "Available during business hours.",
        whatsappTitle: "Chat on WhatsApp",
        whatsappText: "Message us directly.",
        visitTitle: "Visit us",
        successDescription: "Thanks for reaching out. We'll get back to you soon.",
        submitLabel: "Send Message",
        submittingLabel: "Sending",
        interestLabel: "I'm interested in",
        subServiceLabel: "Specific Service",
        resumeLabel: "Resume / CV (PDF or Word, optional)",
        consentLead: "By submitting this form, you agree to our ",
        consentLinkLabel: "Privacy Policy",
        consentHref: "/privacy-policy",
        consentTail: ".",
      }),
    ],
  };

  const privacy: StarterPage = {
    path: "/privacy-policy",
    title: "Privacy Policy",
    seo: { title: `Privacy Policy | ${v.name}`, description: `How ${v.name} handles personal data.` },
    sections: [
      section("page-hero", { category: "legal", categoryLabel: "legal", title: "Privacy Policy", subtitle: "How we handle your information.", description: "A starting template — review and adapt it to your company's practices and applicable law before relying on it.", icon: "ShieldCheck", image: IMG.privacy, primaryCtaExternal: false }),
      section("legal-document", {
        sections: [
          { id: "collect", title: "Information we collect", icon: "FileText", paragraphs: [`${v.name} collects the information you choose to share with us — for example your name, email address, phone number and message when you contact us.`], bullets: [] },
          { id: "use", title: "How we use it", icon: "Settings", paragraphs: ["We use this information to respond to your enquiry, provide our services and improve our website. We don't sell your personal information."], bullets: [] },
          { id: "rights", title: "Your choices", icon: "UserCheck", paragraphs: [`You can ask us to access, correct or delete your information at any time${v.email ? ` by writing to ${v.email}` : ""}.`], bullets: [] },
        ],
      }),
      section("detail-cta", { heading: "Questions about your data?", description: "Reach out any time.", ctaLabel: "Contact Us", external: false, checklist: [] }),
    ],
  };

  return [home, services, about, contact, privacy];
}

export function starterNavigation(): { name: string; href: string; iconKey: string; featured: { title: string; description: string; image: string }; items: { name: string; href: string; description: string; iconKey: string }[] }[] {
  return [
    {
      name: "Services",
      href: "/services",
      iconKey: "Layers",
      featured: { title: "What We Do", description: "Software development from design to support.", image: IMG.code },
      items: [
        { name: "All Services", href: "/services", description: "Web, mobile, cloud, AI and design", iconKey: "Layers" },
        { name: "Start a Project", href: "/contact", description: "Tell us about your idea", iconKey: "Rocket" },
      ],
    },
    {
      name: "About",
      href: "/about",
      iconKey: "Compass",
      featured: { title: "About Us", description: "Who we are and how we work.", image: IMG.team },
      items: [
        { name: "About Us", href: "/about", description: "Our team and approach", iconKey: "Users" },
        { name: "Contact", href: "/contact", description: "Get in touch", iconKey: "Mail" },
      ],
    },
  ];
}

export function starterFooter(): { title: string; viewAllHref?: string; viewAllLabel?: string; links: { label: string; href: string }[] }[] {
  return [
    { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Services", href: "/services" }, { label: "Contact", href: "/contact" }] },
    { title: "Legal", links: [{ label: "Privacy Policy", href: "/privacy-policy" }] },
  ];
}
