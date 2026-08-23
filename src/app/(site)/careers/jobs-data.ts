import { emails } from "@/lib/contact";
import {
  Code2,
  Sparkles,
  Cpu,
  Smartphone,
  Apple,
  CheckCircle2,
  Palette,
  Briefcase,
  Handshake,
  BarChart3,
  ClipboardList,
  FileText,
  Calculator,
  Database,
  Users,
  PenTool,
  Megaphone,
  LucideIcon,
} from "lucide-react";

export interface JobListItem {
  title: string;
  description: string;
}

export interface Job {
  slug: string;
  title: string;
  category: string;
  icon: LucideIcon;
  summary: string;
  employmentType: string;
  location: string;
  experience: string;
  responsibilities: JobListItem[];
  qualifications: JobListItem[];
  skills: string[];
}

export interface JobCategory {
  name: string;
  icon: LucideIcon;
  description: string;
}

export const categories: JobCategory[] = [
  {
    name: "Engineering & Development",
    icon: Code2,
    description: "Build the products, platforms, and AI systems our clients run their businesses on.",
  },
  {
    name: "Design",
    icon: Palette,
    description: "Shape how our products look, feel, and work for the people who use them.",
  },
  {
    name: "Business & Operations",
    icon: Briefcase,
    description: "Drive growth, manage delivery, and keep the business running smoothly.",
  },
  {
    name: "Marketing & Content",
    icon: Megaphone,
    description: "Tell our story and put our products in front of the people who need them.",
  },
];

export const jobs: Job[] = [
  {
    slug: "mern-developer",
    title: "MERN Developer",
    category: "Engineering & Development",
    icon: Code2,
    summary: "Ship full-stack features across MongoDB, Express, React, and Node in production apps used by real clients.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "1–4 Years",
    responsibilities: [
      { title: "API Development", description: "Design and build RESTful APIs and services with Node.js and Express." },
      { title: "Frontend Engineering", description: "Develop responsive, accessible user interfaces in React." },
      { title: "Data Modeling", description: "Model and optimize MongoDB schemas and queries for performance." },
      { title: "Testing & Quality", description: "Write unit and integration tests to keep every release reliable." },
      { title: "Cross-team Collaboration", description: "Work with designers and PMs to scope, estimate, and ship features." },
      { title: "Production Support", description: "Debug and resolve issues across the stack, from UI to database." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "1–4 years of professional experience with the MERN stack." },
      { title: "Education", description: "Bachelor's degree in CS, IT, or equivalent practical experience." },
      { title: "Fundamentals", description: "Strong grasp of data structures and REST API design principles." },
      { title: "Team Fit", description: "Comfortable working in an agile, fast-paced product team." },
    ],
    skills: ["JavaScript / TypeScript", "React", "Node.js", "Express", "MongoDB", "Git", "REST APIs", "Tailwind CSS"],
  },
  {
    slug: "genai-developer",
    title: "GenAI Developer",
    category: "Engineering & Development",
    icon: Sparkles,
    summary: "Build generative AI features — from prompt pipelines to production LLM integrations — that ship real products, not prototypes.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "1–3 Years",
    responsibilities: [
      { title: "LLM Integration", description: "Design prompting strategies, RAG pipelines, and LLM-powered features." },
      { title: "API Development", description: "Build and maintain APIs that expose GenAI capabilities to product teams." },
      { title: "Model Evaluation", description: "Evaluate and tune models for accuracy, latency, and cost." },
      { title: "Guardrails & Monitoring", description: "Implement evaluation harnesses and monitoring for AI features in production." },
      { title: "Applied R&D", description: "Stay current with the LLM ecosystem and bring in relevant tooling." },
      { title: "Product Partnership", description: "Partner with product and design on new AI-powered experiences." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "1–3 years building with LLMs or applied ML systems." },
      { title: "Core Skills", description: "Strong Python fundamentals; comfortable with async and API design." },
      { title: "Domain Knowledge", description: "Familiarity with vector databases and RAG architectures." },
      { title: "Education", description: "Bachelor's degree in CS, AI/ML, or a related field." },
    ],
    skills: ["Python", "LLM APIs", "LangChain", "RAG", "Vector Databases", "Prompt Engineering", "FastAPI"],
  },
  {
    slug: "ai-ml-engineer",
    title: "AI/ML Engineer",
    category: "Engineering & Development",
    icon: Cpu,
    summary: "Design, train, and deploy machine learning models that power real product decisions — from forecasting to computer vision.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "2–5 Years",
    responsibilities: [
      { title: "Model Development", description: "Build and evaluate ML models for classification, forecasting, and vision tasks." },
      { title: "Full Lifecycle Ownership", description: "Own data prep, training, evaluation, and deployment end to end." },
      { title: "Data Pipelines", description: "Build data pipelines and feature stores for training and inference." },
      { title: "Monitoring", description: "Monitor deployed models for drift and performance degradation." },
      { title: "Productionization", description: "Collaborate with engineering to ship models via APIs and services." },
      { title: "Documentation", description: "Document experiments and communicate results clearly to stakeholders." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "2–5 years of experience in applied machine learning." },
      { title: "Core Skills", description: "Strong Python skills with PyTorch, TensorFlow, or scikit-learn." },
      { title: "Fundamentals", description: "Solid grounding in statistics and machine learning fundamentals." },
      { title: "Bonus", description: "Experience deploying models to production is a strong plus." },
    ],
    skills: ["Python", "PyTorch / TensorFlow", "scikit-learn", "SQL", "MLOps", "Docker", "Cloud (AWS/GCP/Azure)"],
  },
  {
    slug: "android-app-developer",
    title: "Android App Developer",
    category: "Engineering & Development",
    icon: Smartphone,
    summary: "Build and ship native Android experiences used by thousands of daily users, from architecture to Play Store release.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "1–4 Years",
    responsibilities: [
      { title: "Native Development", description: "Develop native Android apps using Kotlin and modern Jetpack libraries." },
      { title: "Architecture", description: "Implement clean, testable architecture using MVVM or MVI." },
      { title: "API Integration", description: "Integrate REST APIs and handle offline-first data sync." },
      { title: "Performance", description: "Optimize app performance, memory footprint, and battery usage." },
      { title: "Release Management", description: "Own releases through the Play Store, including CI/CD pipelines." },
      { title: "Iteration", description: "Fix bugs and iterate based on user feedback and analytics." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "1–4 years building and shipping production Android apps." },
      { title: "Core Skills", description: "Strong Kotlin skills; prior Java experience is a plus." },
      { title: "Modern Tooling", description: "Familiarity with Jetpack Compose and modern Android architecture." },
      { title: "Education", description: "Bachelor's degree in CS/IT or equivalent practical experience." },
    ],
    skills: ["Kotlin", "Jetpack Compose", "MVVM", "Room", "Retrofit", "Play Store CI/CD"],
  },
  {
    slug: "ios-app-developer",
    title: "iOS App Developer",
    category: "Engineering & Development",
    icon: Apple,
    summary: "Craft polished, native iOS apps with Swift, from prototype to App Store release, across client and in-house products.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "1–4 Years",
    responsibilities: [
      { title: "Native Development", description: "Build native iOS apps using Swift and SwiftUI/UIKit." },
      { title: "Architecture", description: "Implement clean architecture and reusable, testable components." },
      { title: "Integrations", description: "Integrate REST APIs, push notifications, and third-party SDKs." },
      { title: "Polish & Compliance", description: "Optimize for performance, accessibility, and App Store guidelines." },
      { title: "Release Management", description: "Manage App Store submissions and ongoing release cycles." },
      { title: "Design Collaboration", description: "Work closely with design to deliver pixel-perfect UI." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "1–4 years building and shipping production iOS apps." },
      { title: "Core Skills", description: "Strong Swift skills; SwiftUI experience preferred." },
      { title: "Platform Knowledge", description: "Understanding of Apple's Human Interface Guidelines." },
      { title: "Education", description: "Bachelor's degree in CS/IT or equivalent practical experience." },
    ],
    skills: ["Swift", "SwiftUI", "UIKit", "Combine", "REST APIs", "App Store Connect"],
  },
  {
    slug: "quality-analyst",
    title: "Quality Analyst",
    category: "Engineering & Development",
    icon: CheckCircle2,
    summary: "Own test strategy, automation, and release quality across our web and mobile products, catching issues before users do.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "1–3 Years",
    responsibilities: [
      { title: "Test Planning", description: "Write and execute test plans across web, mobile, and API layers." },
      { title: "Automation", description: "Build and maintain automated test suites for regression coverage." },
      { title: "Exploratory Testing", description: "Perform regression, exploratory, and performance testing." },
      { title: "Defect Management", description: "Log, triage, and track defects through to resolution." },
      { title: "Process Improvement", description: "Partner with engineering to embed quality earlier in the pipeline." },
      { title: "Release Validation", description: "Validate releases before they ship to production." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "1–3 years of QA or software testing experience." },
      { title: "Tooling", description: "Familiarity with test automation tools like Selenium, Cypress, or Playwright." },
      { title: "Mindset", description: "Strong attention to detail and a genuine bug-hunter's instinct." },
      { title: "Technical Grounding", description: "Basic understanding of APIs, databases, and how systems fail." },
    ],
    skills: ["Manual & Automated Testing", "Selenium / Cypress / Playwright", "API Testing", "JIRA", "SQL"],
  },
  {
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    category: "Design",
    icon: Palette,
    summary: "Design intuitive, accessible interfaces from wireframes to polished, production-ready UI across web and mobile products.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "1–4 Years",
    responsibilities: [
      { title: "Product Design", description: "Translate product requirements into wireframes, flows, and prototypes." },
      { title: "Visual Design", description: "Design high-fidelity UI in Figma, maintaining a consistent design system." },
      { title: "Usability", description: "Conduct usability reviews and iterate designs based on feedback." },
      { title: "Dev Collaboration", description: "Partner closely with engineering to ensure pixel-accurate implementation." },
      { title: "Design Systems", description: "Contribute to and evolve our shared component library." },
      { title: "Communication", description: "Present design decisions clearly and persuasively to stakeholders." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "1–4 years of UI/UX design experience." },
      { title: "Portfolio", description: "A strong portfolio showing end-to-end product design work." },
      { title: "Tooling", description: "Proficiency in Figma and modern design system practices." },
      { title: "Fundamentals", description: "Understanding of accessibility and responsive design principles." },
    ],
    skills: ["Figma", "Design Systems", "Prototyping", "User Research", "Accessibility", "HTML/CSS Basics"],
  },
  {
    slug: "business-development-manager",
    title: "Business Development Manager",
    category: "Business & Operations",
    icon: Handshake,
    summary: "Identify new opportunities, build client relationships, and grow our project pipeline across global markets.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "2–6 Years",
    responsibilities: [
      { title: "Prospecting", description: "Identify and qualify new business opportunities across target markets." },
      { title: "Relationship Building", description: "Build and maintain relationships with prospective and existing clients." },
      { title: "Proposals", description: "Prepare proposals, pitches, and pricing with delivery teams." },
      { title: "Pipeline Management", description: "Track pipeline health and forecast revenue against targets." },
      { title: "Market Presence", description: "Represent YashOrbit at industry events and client meetings." },
      { title: "Market Awareness", description: "Stay current on market trends and competitor offerings." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "2–6 years of B2B sales or business development experience." },
      { title: "Domain Knowledge", description: "Experience selling technology or software services is preferred." },
      { title: "Communication", description: "Excellent communication and negotiation skills." },
      { title: "Education", description: "Bachelor's degree in Business, Marketing, or a related field." },
    ],
    skills: ["B2B Sales", "Lead Generation", "CRM Tools", "Negotiation", "Proposal Writing"],
  },
  {
    slug: "business-analyst",
    title: "Business Analyst",
    category: "Business & Operations",
    icon: BarChart3,
    summary: "Translate business needs into clear requirements that engineering can build against, bridging clients and delivery teams.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "1–4 Years",
    responsibilities: [
      { title: "Requirements Gathering", description: "Gather and document business and functional requirements." },
      { title: "Specification", description: "Create user stories, process flows, and wireframes for engineering." },
      { title: "Stakeholder Facilitation", description: "Facilitate discussions to clarify scope and priorities." },
      { title: "QA Support", description: "Support QA with clear acceptance criteria and UAT sessions." },
      { title: "Process Analysis", description: "Analyze data to identify opportunities for process improvement." },
      { title: "Documentation", description: "Maintain clear, up-to-date project documentation." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "1–4 years as a business analyst or in a similar role." },
      { title: "Core Skills", description: "Strong analytical thinking and documentation skills." },
      { title: "Tooling", description: "Familiarity with agile methodologies and tools like JIRA." },
      { title: "Education", description: "Bachelor's degree in Business, IT, or a related field." },
    ],
    skills: ["Requirements Gathering", "User Stories", "JIRA / Confluence", "Process Mapping", "SQL Basics"],
  },
  {
    slug: "project-manager",
    title: "Project Manager",
    category: "Business & Operations",
    icon: ClipboardList,
    summary: "Plan, coordinate, and deliver client projects on time and within scope, keeping teams aligned from kickoff to launch.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "2–6 Years",
    responsibilities: [
      { title: "Project Planning", description: "Own project plans, timelines, and resource allocation." },
      { title: "Agile Ceremonies", description: "Run sprint planning, standups, and retrospectives." },
      { title: "Client Communication", description: "Manage client communication and expectations throughout delivery." },
      { title: "Risk Management", description: "Identify and mitigate risks before they impact delivery." },
      { title: "Budget Tracking", description: "Track budgets, scope, and change requests across the project." },
      { title: "Delivery Quality", description: "Ensure quality and documentation standards are met at handoff." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "2–6 years of project or delivery management experience." },
      { title: "Methodology", description: "Experience with agile/scrum in a software delivery context." },
      { title: "Core Skills", description: "Strong organizational and stakeholder-management skills." },
      { title: "Bonus", description: "PMP or CSM certification is a plus." },
    ],
    skills: ["Agile / Scrum", "JIRA", "Stakeholder Management", "Risk Management", "Budgeting"],
  },
  {
    slug: "bid-executive",
    title: "Bid Executive",
    category: "Business & Operations",
    icon: FileText,
    summary: "Prepare proposals and bid responses that win new business on global freelance platforms and enterprise RFPs.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "1–3 Years",
    responsibilities: [
      { title: "Bid Sourcing", description: "Identify and shortlist relevant bids across freelance and enterprise platforms." },
      { title: "Proposal Writing", description: "Write compelling, technically accurate proposals and cover letters." },
      { title: "Scoping", description: "Coordinate with technical teams to scope effort and pricing." },
      { title: "Performance Tracking", description: "Track bid win rates and continuously refine proposal strategy." },
      { title: "Content Library", description: "Maintain a library of reusable case studies and proposal templates." },
      { title: "Follow-through", description: "Follow up with prospects through to contract closure." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "1–3 years in bidding, pre-sales, or proposal writing." },
      { title: "Communication", description: "Excellent written English and persuasive communication." },
      { title: "Domain Knowledge", description: "Understanding of software development lifecycles and pricing models." },
      { title: "Education", description: "Bachelor's degree in any discipline." },
    ],
    skills: ["Proposal Writing", "Upwork / Freelancer", "Pre-Sales", "Client Communication", "MS Office"],
  },
  {
    slug: "accounts-manager",
    title: "Accounts Manager",
    category: "Business & Operations",
    icon: Calculator,
    summary: "Manage client accounts, billing, and financial operations with precision, keeping the business's finances healthy.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "2–5 Years",
    responsibilities: [
      { title: "Billing Operations", description: "Manage invoicing, billing cycles, and payment follow-ups." },
      { title: "Bookkeeping", description: "Maintain accurate financial records and reconcile accounts." },
      { title: "Reporting", description: "Prepare reports on receivables, payables, and cash flow." },
      { title: "Client Coordination", description: "Coordinate with clients on billing queries and contract terms." },
      { title: "Compliance", description: "Support statutory compliance and audit requirements." },
      { title: "Planning Support", description: "Assist leadership with budgeting and financial planning." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "2–5 years of experience in accounting or finance operations." },
      { title: "Education", description: "B.Com or an equivalent degree in Accounting/Finance." },
      { title: "Tooling", description: "Proficiency with accounting software such as Tally or QuickBooks." },
      { title: "Attention to Detail", description: "Strong accuracy and integrity handling financial data." },
    ],
    skills: ["Accounting", "Invoicing", "Tally / QuickBooks", "GST & Compliance", "MS Excel"],
  },
  {
    slug: "mis-executive",
    title: "MIS Executive",
    category: "Business & Operations",
    icon: Database,
    summary: "Maintain reporting systems and dashboards that keep leadership decisions data-driven across the business.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "1–3 Years",
    responsibilities: [
      { title: "Dashboarding", description: "Build and maintain dashboards and MIS reports across departments." },
      { title: "Data Quality", description: "Collect, clean, and validate data from multiple source systems." },
      { title: "Automation", description: "Automate recurring reports to save manual effort." },
      { title: "Insights", description: "Present insights and trends to management in a clear format." },
      { title: "Data Governance", description: "Maintain data accuracy and access controls across reporting systems." },
      { title: "Ad-hoc Support", description: "Support ad-hoc data requests from leadership." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "1–3 years of experience in MIS reporting or data analysis." },
      { title: "Core Skills", description: "Strong Excel skills; SQL and BI tools like Power BI are a plus." },
      { title: "Attention to Detail", description: "High attention to detail and data accuracy." },
      { title: "Education", description: "Bachelor's degree in any analytical discipline." },
    ],
    skills: ["MS Excel", "SQL", "Power BI / Tableau", "Data Validation", "Report Automation"],
  },
  {
    slug: "hr-executive",
    title: "HR Executive",
    category: "Business & Operations",
    icon: Users,
    summary: "Own recruitment, onboarding, and employee engagement, helping us hire and retain the people who build our products.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "1–4 Years",
    responsibilities: [
      { title: "Recruitment", description: "Manage end-to-end hiring: sourcing, screening, and interview coordination." },
      { title: "Onboarding", description: "Run onboarding and induction programs for new hires." },
      { title: "HR Operations", description: "Maintain HR records, policies, and compliance documentation." },
      { title: "Engagement", description: "Support performance review cycles and employee engagement initiatives." },
      { title: "Employee Support", description: "Address employee queries and escalate issues appropriately." },
      { title: "Payroll Coordination", description: "Coordinate payroll inputs and attendance with the finance team." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "1–4 years of HR generalist or recruitment experience." },
      { title: "Communication", description: "Strong interpersonal and communication skills." },
      { title: "Tooling", description: "Familiarity with HRMS/ATS tools and labor compliance basics." },
      { title: "Education", description: "Bachelor's or Master's degree in HR, Business, or a related field." },
    ],
    skills: ["Recruitment", "Onboarding", "HRMS / ATS", "Employee Engagement", "HR Compliance"],
  },
  {
    slug: "technical-content-writer",
    title: "Technical Content Writer",
    category: "Marketing & Content",
    icon: PenTool,
    summary: "Write documentation, blogs, and case studies that explain complex tech simply, for both technical and business audiences.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "1–3 Years",
    responsibilities: [
      { title: "Content Creation", description: "Write blog posts, case studies, and product documentation." },
      { title: "Technical Translation", description: "Translate complex technical concepts into clear, engaging content." },
      { title: "Source Collaboration", description: "Work with engineering and product teams to source accurate detail." },
      { title: "SEO Writing", description: "Optimize content for search visibility and readability." },
      { title: "Brand Voice", description: "Maintain a consistent voice and style across all content." },
      { title: "Editing", description: "Proofread and edit content from other contributors." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "1–3 years of technical or B2B content writing experience." },
      { title: "Writing Skills", description: "Excellent written English with strong research skills." },
      { title: "Domain Comfort", description: "Comfortable writing about software, AI, and technology topics." },
      { title: "Education", description: "Bachelor's degree in English, Journalism, CS, or a related field." },
    ],
    skills: ["Technical Writing", "SEO Writing", "Content Strategy", "Editing", "CMS Tools"],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    category: "Marketing & Content",
    icon: Megaphone,
    summary: "Run SEO, paid, and social campaigns that grow our brand and generate qualified leads across channels.",
    employmentType: "Full-time",
    location: "Noida, India · Hybrid",
    experience: "1–4 Years",
    responsibilities: [
      { title: "Campaign Execution", description: "Plan and execute SEO, paid ads, and social media campaigns." },
      { title: "Performance Tracking", description: "Track and report on campaign performance and ROI." },
      { title: "Content Calendar", description: "Manage content calendars across social and email channels." },
      { title: "Conversion Optimization", description: "Optimize landing pages and funnels for conversion." },
      { title: "SEO", description: "Conduct keyword research and drive on-page SEO improvements." },
      { title: "Trend Awareness", description: "Stay current with digital marketing trends and platform changes." },
    ],
    qualifications: [
      { title: "Relevant Experience", description: "1–4 years of digital marketing experience." },
      { title: "Hands-on Skills", description: "Experience with Google Ads, Meta Ads, and SEO tools." },
      { title: "Analytics", description: "Strong analytical skills with tools like Google Analytics." },
      { title: "Education", description: "Bachelor's degree in Marketing or a related field." },
    ],
    skills: ["SEO", "Google Ads", "Meta Ads", "Google Analytics", "Social Media Marketing", "Email Marketing"],
  },
];

export function getJobBySlug(slug: string): Job | undefined {
  return jobs.find((job) => job.slug === slug);
}

export function mailtoApplyHref(role: string) {
  const subject = encodeURIComponent(`Application: ${role}`);
  const body = encodeURIComponent(
    `Hi YashOrbit team,\n\nI'm interested in applying for the ${role} role. Please find my resume attached.\n\nThanks,`
  );
  return `mailto:${emails.support}?subject=${subject}&body=${body}`;
}
