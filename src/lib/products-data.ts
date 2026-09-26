import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Kanban,
  ShoppingCart,
  GraduationCap,
  MessageSquare,
  Filter,
  Globe,
  Search,
  KeyRound,
  Bot,
  Megaphone,
  FileQuestion,
  Laptop,
  LucideIcon,
} from "lucide-react";

export interface ProductScreen {
  id: string;
  title: string;
  description: string;
  badge?: string;
  mockupType: string;
}

export interface ProductFeature {
  title: string;
  description: string;
  aiPowered?: boolean;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  badge: string;
  tagline: string;
  category: "Executive & Operations" | "HR & Talent" | "Project & Delivery" | "Procurement & Finance" | "Sales & Marketing" | "AI & Intelligence" | "Assessment & Security";
  panelPath: string;
  iconName: string;
  icon: LucideIcon;
  shortDescription: string;
  fullDescription: string;
  primaryPurpose: string;
  targetDepartments: string[];
  targetUsers: string[];
  aiCapabilities: string[];
  keyFeatures: ProductFeature[];
  metrics: { label: string; value: string }[];
  screens: ProductScreen[];
  accentColor: string;
  isFeatured?: boolean;
}

export const PRODUCT_CATEGORIES = [
  "All Products",
  "AI & Intelligence",
  "Executive & Operations",
  "Sales & Marketing",
  "HR & Talent",
  "Project & Delivery",
  "Procurement & Finance",
  "Assessment & Security",
] as const;

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: "admin-command-center",
    slug: "admin-command-center",
    name: "YashOrbit Executive Command Center",
    badge: "Super Admin Platform",
    tagline: "Real-Time Executive Intelligence & Multi-Panel Governance",
    category: "Executive & Operations",
    panelPath: "/admin",
    iconName: "ShieldCheck",
    icon: ShieldCheck,
    accentColor: "from-blue-600 to-indigo-600",
    isFeatured: true,
    shortDescription: "Central executive dashboard aggregating live operational metrics, revenue streams, single sign-on security, and role governance across all 15 platform modules.",
    fullDescription: "The Super Admin Command Center serves as the nerve center for leadership. Instead of logging into separate SaaS applications, executives gain instant, single-pane-of-glass visibility into company-wide revenue, active client projects, HR headcount, procurement spend, and OpenAI API token consumption—all updated in real time with zero manual reconciliation.",
    primaryPurpose: "Unify cross-module enterprise operations, automate identity & access control, and provide real-time executive decision intelligence.",
    targetDepartments: ["Executive Leadership", "IT & Security", "Operations Management", "Finance"],
    targetUsers: ["Super Admin", "Chief Executive Officer", "CTO", "Head of Operations"],
    aiCapabilities: [
      "Real-time token & model spend ledger across AI Bots & SMMS",
      "Predictive cross-module operational bottleneck alerts",
      "Automated access anomaly & permission risk scoring",
      "Executive summary synthesis generated from live panel feeds",
    ],
    keyFeatures: [
      {
        title: "Live Cross-Module Aggregator",
        description: "Pulls real figures live from HRMS, PMS, PRMS, TMS, LMS, and Chat without estimates.",
      },
      {
        title: "Central Audit-Logged RBAC",
        description: "Grant, adjust, or revoke permissions per role or person across all 15 panels instantly.",
        aiPowered: false,
      },
      {
        title: "AI & API Usage Intelligence",
        description: "Track OpenAI model calls, latency, estimated costs, and token consumption by bot and employee.",
        aiPowered: true,
      },
      {
        title: "Cross-Module SSO Provisioning",
        description: "Single login provisions real sessions across all authorized tools automatically.",
      },
    ],
    metrics: [
      { label: "Real-Time Modules Sync", value: "15 Panels" },
      { label: "Session Security Audit", value: "100% Logged" },
      { label: "SSO Provisioning Speed", value: "< 50ms" },
    ],
    screens: [
      {
        id: "exec-dashboard",
        title: "Executive Health Dashboard",
        description: "Live revenue, active project health, recruitment funnel, and AI token spend.",
        badge: "Real-Time Stream",
        mockupType: "admin-overview",
      },
      {
        id: "rbac-matrix",
        title: "Global Permission Matrix",
        description: "Granular access control and permission toggles for all 15 applications.",
        badge: "Security Audit",
        mockupType: "admin-permissions",
      },
      {
        id: "ai-ledger",
        title: "AI Spend & Model Monitor",
        description: "Token consumption, model latency, and cost per department breakdown.",
        badge: "AI Analytics",
        mockupType: "admin-ai-ledger",
      },
    ],
  },
  {
    id: "staff-hub",
    slug: "staff-hub",
    name: "YashOrbit Workspace Hub",
    badge: "SSO Launchpad",
    tagline: "Universal Employee Front Door & Contextual Workspace Launcher",
    category: "Executive & Operations",
    panelPath: "/workspace",
    iconName: "LayoutDashboard",
    icon: LayoutDashboard,
    accentColor: "from-cyan-600 to-blue-600",
    isFeatured: false,
    shortDescription: "A unified single sign-on hub presenting employees with a personalized, role-gated application suite and instant one-click launch access.",
    fullDescription: "Eliminating bookmark sprawl and password fatigue, the Staff Hub provides every employee with a clean, personalized workspace. Based on their active roles, staff see exactly the applications they are authorized to use, alongside team announcements, pending task items, and quick action shortcuts.",
    primaryPurpose: "Streamline employee onboarding, centralize tool access, and eliminate login friction across the enterprise.",
    targetDepartments: ["All Departments", "HR & People", "Internal Staff"],
    targetUsers: ["Employees", "Team Leads", "Contractors", "New Hires"],
    aiCapabilities: [
      "Smart workspace layout customized by daily usage patterns",
      "Contextual tool & action recommendations based on role",
      "Intelligent onboarding guide for new team members",
    ],
    keyFeatures: [
      {
        title: "One Login for Everything",
        description: "Single identity credentials unlock authorized internal applications smoothly.",
      },
      {
        title: "Role-Adaptive Card Grid",
        description: "Cards dynamically display accessible panels with status badges and quick links.",
      },
      {
        title: "Zero IT Helpdesk Password Friction",
        description: "Eliminates forgotten URLs and multi-account confusion across staff.",
      },
    ],
    metrics: [
      { label: "Login Friction", value: "Zero Passwords" },
      { label: "Module Accessibility", value: "Role-Gated" },
      { label: "Onboarding Time", value: "-60% Reduction" },
    ],
    screens: [
      {
        id: "workspace-launcher",
        title: "Personalized Staff Launcher",
        description: "Clean app launcher with role-gated panel cards and quick shortcuts.",
        badge: "Single Sign-On",
        mockupType: "workspace-grid",
      },
      {
        id: "role-access",
        title: "Authorized Module Access",
        description: "Visual role breakdown showing permissions across active modules.",
        badge: "Role Security",
        mockupType: "workspace-roles",
      },
    ],
  },
  {
    id: "hrms-suite",
    slug: "hrms-suite",
    name: "YashOrbit HRMS Intelligence",
    badge: "Human Capital Management",
    tagline: "End-to-End HR, Automated Payroll & AI Recruitment Pipeline",
    category: "HR & Talent",
    panelPath: "/hrms",
    iconName: "Users",
    icon: Users,
    accentColor: "from-teal-600 to-emerald-600",
    isFeatured: true,
    shortDescription: "Integrated HR management system covering employee records, org trees, self-service leave, attendance, payroll, and AI applicant screening.",
    fullDescription: "HRMS eliminates spreadsheet-driven HR by establishing a single, permission-gated system of record. From candidate shortlisting that converts straight into an employee record, to attendance-linked payroll calculation and complete audit logs on salary changes, HRMS automates workforce administration effortlessly.",
    primaryPurpose: "Manage employee lifecycles, automate attendance and payroll, and accelerate candidate recruitment with AI.",
    targetDepartments: ["Human Resources", "Talent Acquisition", "Finance & Payroll", "Management"],
    targetUsers: ["HR Manager", "Recruiter", "Payroll Specialist", "Employees"],
    aiCapabilities: [
      "AI resume parser & candidate requirement matching engine",
      "Predictive employee attrition & engagement analytics",
      "Automated attendance anomaly detection and overtime flag",
      "AI-generated job descriptions and interview question prompts",
    ],
    keyFeatures: [
      {
        title: "Single Source Employee Truth",
        description: "Centralized employee profiles, reporting trees, document vaults, and history.",
      },
      {
        title: "Attendance & Payroll Automation",
        description: "Calculates payslips against real biometric/clock-in data and approved leaves.",
      },
      {
        title: "AI Candidate Pipeline (Careers Sync)",
        description: "Seamlessly converts shortlisted career applicants into employee profiles.",
        aiPowered: true,
      },
      {
        title: "Sensitive Change Audit Trail",
        description: "Logs every change to status, designation, compensation, or access role.",
      },
    ],
    metrics: [
      { label: "Payroll Accuracy", value: "100% Biometric" },
      { label: "Hire to Onboard", value: "1-Click Sync" },
      { label: "Audit Compliance", value: "Full Logged" },
    ],
    screens: [
      {
        id: "hrms-dashboard",
        title: "HR Command Dashboard",
        description: "Headcount trends, active leaves, department ratio, and pending approvals.",
        badge: "Workforce Overview",
        mockupType: "hrms-overview",
      },
      {
        id: "recruitment-pipeline",
        title: "AI Candidate Shortlist Engine",
        description: "Resume score matching, candidate evaluation, and 1-click hire conversion.",
        badge: "AI Recruitment",
        mockupType: "hrms-recruitment",
      },
      {
        id: "payroll-engine",
        title: "Automated Payroll Computation",
        description: "Salary slips, tax breakdown, and payout tracking tied to actual attendance.",
        badge: "Payroll System",
        mockupType: "hrms-payroll",
      },
    ],
  },
  {
    id: "pms-project-command",
    slug: "pms-project-command",
    name: "YashOrbit PMS Project Command",
    badge: "Project & Financial Engine",
    tagline: "Profitability-Driven Project Management & Timesheet Billing",
    category: "Project & Delivery",
    panelPath: "/pms",
    iconName: "Kanban",
    icon: Kanban,
    accentColor: "from-blue-600 to-cyan-600",
    isFeatured: true,
    shortDescription: "Profitability-focused project management system tracking clients, tasks, milestones, timesheets, and real-time cost versus billing margins.",
    fullDescription: "Unlike generic task managers like Jira or Trello, PMS is engineered around real business profitability. It connects logged employee timesheets directly to hourly billing rates and project budgets, giving delivery managers exact cost-versus-margin visibility before completion deadlines.",
    primaryPurpose: "Track delivery project health, enforce workflow quality gates, and ensure billable profitability on every account.",
    targetDepartments: ["Engineering & Delivery", "Project Management Office", "Client Services", "Finance"],
    targetUsers: ["Project Manager", "Scrum Master", "Delivery Lead", "Developers"],
    aiCapabilities: [
      "AI resource allocation & workload balancing recommendations",
      "Predictive project delay and scope creep warnings",
      "Automated sprint retrospective & milestone summary generator",
      "Profitability margin optimization insights",
    ],
    keyFeatures: [
      {
        title: "Real-Time Profitability Tracking",
        description: "Compares estimated versus actual labor costs derived from verified timesheets.",
      },
      {
        title: "Guarded Milestone Workflows",
        description: "Enforces strict quality transitions so tasks cannot bypass required testing stages.",
      },
      {
        title: "Timesheet-Driven Billing",
        description: "Accurate invoice line items generated from actual developer hours.",
      },
    ],
    metrics: [
      { label: "Margin Accuracy", value: "Real-Time" },
      { label: "Workflow Integrity", value: "Guarded Gates" },
      { label: "Timesheet Leakage", value: "0% Unbilled" },
    ],
    screens: [
      {
        id: "pms-board",
        title: "Project Kanban & Profitability Board",
        description: "Task stages, client budgets, burn-down charts, and live cost margin bar.",
        badge: "Delivery Dashboard",
        mockupType: "pms-board",
      },
      {
        id: "pms-costing",
        title: "Project Margin Analytics",
        description: "Estimated vs actual hours, billable rates, and projected profit margin.",
        badge: "Financial Control",
        mockupType: "pms-analytics",
      },
    ],
  },
  {
    id: "prms-procurement",
    slug: "prms-procurement",
    name: "YashOrbit PRMS Procurement",
    badge: "Resource & Supply Chain",
    tagline: "Multi-Level Requisitions, Asset Life-Cycle & SaaS Expense Control",
    category: "Procurement & Finance",
    panelPath: "/prms",
    iconName: "ShoppingCart",
    icon: ShoppingCart,
    accentColor: "from-amber-600 to-orange-600",
    isFeatured: false,
    shortDescription: "Enterprise procurement and resource management platform controlling vendor RFQs, purchase orders, asset inventory, SaaS subscriptions, and approval chains.",
    fullDescription: "PRMS protects company capital by replacing loose email approvals with structured multi-tier authorization workflows. Every equipment requisition, software license purchase, or vendor payment moves through transparent threshold rules, linked directly to asset tracking and department budget caps.",
    primaryPurpose: "Enforce purchasing approvals, eliminate duplicate SaaS/infrastructure spend, and track asset lifecycles across teams.",
    targetDepartments: ["Procurement", "Finance & Accounts", "IT Asset Management", "Administration"],
    targetUsers: ["Procurement Officer", "CFO / Finance Manager", "Asset Admin", "Department Heads"],
    aiCapabilities: [
      "AI vendor invoice OCR parsing & line-item verification",
      "Duplicate expense & redundant SaaS subscription detector",
      "Automated vendor price trends & contract renegotiation alerts",
    ],
    keyFeatures: [
      {
        title: "Multi-Tier Approval Chains",
        description: "Customizable spend thresholds and automated manager approval routing.",
      },
      {
        title: "Budget Enforcement Engine",
        description: "Live comparison of committed purchase orders against allocated department budgets.",
      },
      {
        title: "Asset Lifecycle & Assignment",
        description: "Tracks serial numbers, assignment history, depreciation, and warranty terms.",
      },
      {
        title: "SaaS & Infrastructure Vault",
        description: "Monitors monthly cloud subscriptions and flags unused seats.",
        aiPowered: true,
      },
    ],
    metrics: [
      { label: "Approval Trail", value: "100% Audited" },
      { label: "Unused SaaS Spend", value: "-35% Cost Cut" },
      { label: "Asset Visibility", value: "Full Lifecycle" },
    ],
    screens: [
      {
        id: "prms-approval",
        title: "Purchase Requisition Approval Chain",
        description: "Multi-level authorization flow, vendor RFQs, and invoice comparison.",
        badge: "Spend Control",
        mockupType: "prms-approval",
      },
      {
        id: "prms-assets",
        title: "Asset & SaaS Subscription Monitor",
        description: "Company hardware assignments, warranty timers, and software licenses.",
        badge: "Asset Manager",
        mockupType: "prms-assets",
      },
    ],
  },
  {
    id: "tms-academy",
    slug: "tms-academy",
    name: "YashOrbit TMS Academy",
    badge: "Education & Internships",
    tagline: "End-to-End Student Lifecycle, Mentor Batches & Placement Analytics",
    category: "HR & Talent",
    panelPath: "/tms",
    iconName: "GraduationCap",
    icon: GraduationCap,
    accentColor: "from-purple-600 to-indigo-600",
    isFeatured: false,
    shortDescription: "Training and internship management system covering student enrollment, batch scheduling, mentor allocation, project reviews, and verifiable certificates.",
    fullDescription: "TMS powers YashOrbit’s professional training business. It handles candidate applications, fee payments, batch class schedules, mentor assignments, project evaluation, and hiring partner placements—all anchored by QR-verifiable graduation certificates.",
    primaryPurpose: "Streamline industrial training programs, monitor student progression, and prove placement outcomes.",
    targetDepartments: ["Industrial Training", "Academic Operations", "Placement Cell", "Mentorship Team"],
    targetUsers: ["Training Director", "Mentor / Instructor", "Student Counselor", "Students"],
    aiCapabilities: [
      "AI student placement probability scoring based on performance",
      "Automated personalized learning recommendations",
      "AI code & project evaluation helper for mentors",
    ],
    keyFeatures: [
      {
        title: "Full Journey Lifecycle",
        description: "Manages intake applications through training, capstone projects, and placement.",
      },
      {
        title: "Real Placement Reporting",
        description: "Verifiable salary statistics and hiring partner metrics for prospective trainees.",
      },
      {
        title: "QR-Verifiable Digital Certificates",
        description: "Tamper-proof digital certificates verifiable publicly at `/verify/<code>`.",
      },
    ],
    metrics: [
      { label: "Student Tracking", value: "100% Digital" },
      { label: "Certificate Verifier", value: "Instant QR" },
      { label: "Placement Rate", value: "Real Data" },
    ],
    screens: [
      {
        id: "tms-batches",
        title: "Batch & Student Command",
        description: "Active training tracks, batch schedules, attendance, and project submissions.",
        badge: "Academic Ops",
        mockupType: "tms-batches",
      },
      {
        id: "tms-placement",
        title: "Placement & Certificate Engine",
        description: "Hiring partner pipeline, student offers, and public verification issuer.",
        badge: "Placements",
        mockupType: "tms-placement",
      },
    ],
  },
  {
    id: "messenger-yashchat",
    slug: "messenger-yashchat",
    name: "YashOrbit Messenger (YashChat)",
    badge: "Contextual Team Comms",
    tagline: "Enterprise Communication Engine with Project Channels & AI Summaries",
    category: "Executive & Operations",
    panelPath: "/messenger",
    iconName: "MessageSquare",
    icon: MessageSquare,
    accentColor: "from-emerald-600 to-teal-600",
    isFeatured: false,
    shortDescription: "In-house team communication platform featuring direct messaging, project-linked channels, team announcements, file sharing, and embedded AI assistants.",
    fullDescription: "YashChat provides an internal alternative to third-party messaging apps like Slack or Teams, eliminating seat licensing fees while keeping company communication tied directly to active PMS projects and employee org structures.",
    primaryPurpose: "Enable fast, secure, context-aware collaboration across cross-functional teams without third-party data leakage.",
    targetDepartments: ["All Delivery Teams", "Engineering", "Design", "Management"],
    targetUsers: ["Employees", "Project Leads", "Executives"],
    aiCapabilities: [
      "In-chat thread AI summarizer for long discussions",
      "Automated action item & task extraction from channel chats",
      "Smart quick-reply suggestions for common queries",
    ],
    keyFeatures: [
      {
        title: "Project-Linked Auto-Channels",
        description: "Channel memberships automatically mirror active PMS project teams.",
      },
      {
        title: "Zero SaaS Seat Costs",
        description: "Unlimited users and storage hosted securely within company infrastructure.",
      },
      {
        title: "Embedded AI Channel Assistant",
        description: "Ask questions or generate code directly inside any project channel.",
        aiPowered: true,
      },
    ],
    metrics: [
      { label: "Per-Seat Cost", value: "$0 SaaS Fees" },
      { label: "Project Sync", value: "Automatic" },
      { label: "Data Security", value: "100% In-House" },
    ],
    screens: [
      {
        id: "chat-workspace",
        title: "Project Channel Workspace",
        description: "Project channels, direct messaging, code snippets, and file sharing.",
        badge: "Team Chat",
        mockupType: "chat-workspace",
      },
      {
        id: "chat-ai",
        title: "AI Thread Summarizer",
        description: "Instant AI summary of key decisions made in team channels.",
        badge: "AI Helper",
        mockupType: "chat-ai-summary",
      },
    ],
  },
  {
    id: "lms-sales-crm",
    slug: "lms-sales-crm",
    name: "YashOrbit LMS AI Sales CRM",
    badge: "CRM & Autonomous Sales",
    tagline: "Inbound Lead Intelligence & 24/7 AI Chatbot / Voice Assistant",
    category: "Sales & Marketing",
    panelPath: "/lms",
    iconName: "Filter",
    icon: Filter,
    accentColor: "from-rose-600 to-pink-600",
    isFeatured: true,
    shortDescription: "Intelligent lead management CRM capturing inbound site inquiries, client pipelines, campaign analytics, backed by an autonomous 24/7 AI chatbot and voice assistant.",
    fullDescription: "LMS ensures zero lead decay by instantly capturing every inquiry from public touchpoints. An integrated OpenAI chatbot and voice assistant qualifies prospective clients around the clock, books consultations, and feeds structured lead scoring straight to sales managers.",
    primaryPurpose: "Capture, qualify, nurture, and convert sales leads and applicant pipelines automatically.",
    targetDepartments: ["Sales & BD", "Marketing", "Customer Acquisition"],
    targetUsers: ["Business Development Manager", "Sales Rep", "Growth Director"],
    aiCapabilities: [
      "24/7 Autonomous AI Website Chatbot & Voice Assistant",
      "AI lead intent scoring & automated assignment",
      "Conversational qualification script adaptation",
      "Campaign ROI & channel conversion predictive analytics",
    ],
    keyFeatures: [
      {
        title: "Instant Inbound Intake",
        description: "Web forms, booking requests, and chat leads route straight into active CRM pipelines.",
      },
      {
        title: "24/7 AI Voice & Chat Assistant",
        description: "Qualifies prospects, answers service FAQs, and books calls automatically.",
        aiPowered: true,
      },
      {
        title: "Full Lead Lifecycle Kanban",
        description: "Tracks stages from New Lead to Qualified, Proposal Sent, and Closed Won.",
      },
    ],
    metrics: [
      { label: "Response Time", value: "< 1 Second" },
      { label: "Lead Qualification", value: "24/7 Autonomous" },
      { label: "Conversion Lift", value: "+42% Higher" },
    ],
    screens: [
      {
        id: "crm-pipeline",
        title: "Sales Lead Pipeline Board",
        description: "Kanban lead stages, deal values, activity logs, and conversion odds.",
        badge: "Sales Pipeline",
        mockupType: "lms-pipeline",
      },
      {
        id: "crm-ai-bot",
        title: "AI Voice & Chat Console",
        description: "Real-time transcript of AI chatbot qualifying inbound leads.",
        badge: "AI Agent",
        mockupType: "lms-ai-agent",
      },
    ],
  },
  {
    id: "external-portal",
    slug: "external-portal",
    name: "YashOrbit Stakeholder Portal",
    badge: "Client & Partner Hub",
    tagline: "Isolated Self-Service Portal for Clients, Candidates & Trainees",
    category: "Assessment & Security",
    panelPath: "/portal",
    iconName: "Globe",
    icon: Globe,
    accentColor: "from-blue-600 to-teal-600",
    isFeatured: false,
    shortDescription: "Secure client and candidate self-service portal with dedicated external identity storage, delivering project progress, invoices, and application status.",
    fullDescription: "External Portal gives clients, applicants, and trainees real-time visibility into their respective milestones without exposing internal systems. Built on a completely isolated identity database, external users enjoy a sleek, transparent portal experience.",
    primaryPurpose: "Provide self-service transparency to clients and applicants while keeping internal staff infrastructure secure.",
    targetDepartments: ["Client Services", "Recruitment", "Trainee Relations"],
    targetUsers: ["External Clients", "Job Applicants", "Enrolled Trainees"],
    aiCapabilities: [
      "AI project status summary for client update reports",
      "Automated applicant onboarding guide",
    ],
    keyFeatures: [
      {
        title: "Isolated Identity Architecture",
        description: "Structural boundary prevents external credentials from reaching internal tooling.",
      },
      {
        title: "Client Project & Billing Hub",
        description: "Clients track project progress, review deliverables, and view invoices.",
      },
      {
        title: "Candidate & Trainee Portal",
        description: "Applicants inspect interview status; trainees access schedules & certificates.",
      },
    ],
    metrics: [
      { label: "Status Inquiry Calls", value: "-75% Reduction" },
      { label: "Security Boundary", value: "100% Isolated" },
      { label: "Client Satisfaction", value: "4.9 / 5 Rating" },
    ],
    screens: [
      {
        id: "client-dashboard",
        title: "Client Project Self-Service",
        description: "Live project phase status, timesheet hours breakdown, and invoice list.",
        badge: "Client Hub",
        mockupType: "portal-client",
      },
      {
        id: "applicant-portal",
        title: "Candidate & Trainee Dashboard",
        description: "Application status tracker, scheduled interview dates, and certificates.",
        badge: "Self-Service",
        mockupType: "portal-applicant",
      },
    ],
  },
  {
    id: "seo-panel",
    slug: "seo-panel",
    name: "YashOrbit SEO Intelligence Platform",
    badge: "Search & Growth Engine",
    tagline: "Automated Site Audit, Technical SEO & Live Dynamic Meta Publishing",
    category: "Sales & Marketing",
    panelPath: "/seo",
    iconName: "Search",
    icon: Search,
    accentColor: "from-purple-600 to-pink-600",
    isFeatured: true,
    shortDescription: "Comprehensive SEO platform running automated 50+ check audits, rank tracking, keyword analysis, schema validation, and dynamic meta edits without code deploys.",
    fullDescription: "SEO Panel replaces static meta tags and scattered spreadsheet audits with a live search control center. Its crawler continuously checks 50+ technical, content, and mobile parameters, while allowing marketers to publish title, description, and JSON-LD schema edits instantly to the website.",
    primaryPurpose: "Maximize search rankings, eliminate technical SEO bugs, and publish optimized metadata without developer intervention.",
    targetDepartments: ["Digital Marketing", "SEO Team", "Content Operations", "Web Development"],
    targetUsers: ["SEO Specialist", "Content Strategist", "Growth Lead"],
    aiCapabilities: [
      "AI content optimization & title tag generator",
      "Automated technical issue resolution recommendations",
      "AI keyword cluster & search intent mapping",
      "Auto-generated JSON-LD structured data schema",
    ],
    keyFeatures: [
      {
        title: "50+ Check Automated Crawler",
        description: "Audits technical, on-page, performance, mobile, and structured data health continuously.",
      },
      {
        title: "No-Deploy Live Meta Publishing",
        description: "Edit titles, canonicals, OG tags, and schema directives directly to the live website.",
      },
      {
        title: "Labelled Data Trust",
        description: "Search Console and Analytics are verified; keyword volume estimates are clearly flagged.",
      },
      {
        title: "Dynamic Sitemap & Robots.txt",
        description: "Manage sitemap inclusions and crawler directives with audit-logged diffs.",
      },
    ],
    metrics: [
      { label: "Audit Checkpoints", value: "50+ Automated" },
      { label: "Publish Speed", value: "Instant No-Deploy" },
      { label: "Health Score", value: "98 / 100 Audit" },
    ],
    screens: [
      {
        id: "seo-audit",
        title: "SEO Health & Crawler Scorecard",
        description: "Audit score, issue breakdown, speed checks, and missing tags queue.",
        badge: "Site Audit",
        mockupType: "seo-audit",
      },
      {
        id: "seo-editor",
        title: "Live Meta Tag & Schema Editor",
        description: "Page-by-page meta title, description, and JSON-LD preview editor.",
        badge: "Meta Editor",
        mockupType: "seo-editor",
      },
    ],
  },
  {
    id: "dlms-digilocker",
    slug: "dlms-digilocker",
    name: "YashOrbit DigiLocker (DLMS)",
    badge: "Enterprise Vault & Security",
    tagline: "Multi-Tenant Password Vault, Secret Masking & Document Locker",
    category: "Assessment & Security",
    panelPath: "/dlms",
    iconName: "KeyRound",
    icon: KeyRound,
    accentColor: "from-amber-600 to-yellow-600",
    isFeatured: false,
    shortDescription: "Ultra-secure vault managing company and client credentials, hosting logins, SSL certificates, and agreements with encrypted storage and reveal audit logging.",
    fullDescription: "DLMS ends dangerous credential sharing via chat apps. It isolates company secrets and client vaults with field-level encryption, default masking, permission-gated reveals, and daily expiry sweeps that alert managers before domains or SSL certificates expire.",
    primaryPurpose: "Store company and client credentials securely, audit access reveals, and prevent service expiration outages.",
    targetDepartments: ["IT Infrastructure", "Security & Compliance", "Account Management"],
    targetUsers: ["System Administrator", "Account Manager", "Security Officer"],
    aiCapabilities: [
      "AI credential & domain expiration risk forecasting",
      "Anomalous secret reveal pattern detection",
      "Automated document classification & tagging",
    ],
    keyFeatures: [
      {
        title: "Audited Secret Reveal Logging",
        description: "Passwords masked by default; every copy/reveal event is immutably logged.",
      },
      {
        title: "Daily Expiry Sweep",
        description: "Automated daily checks alert admins to upcoming domain, hosting, and SSL expirations.",
      },
      {
        title: "Client Vault Isolation",
        description: "Staff only see credentials for clients they are explicitly assigned to.",
      },
    ],
    metrics: [
      { label: "Secret Masking", value: "100% Default" },
      { label: "Reveal Audit", value: "Immutable Log" },
      { label: "Outage Prevention", value: "Daily Sweeps" },
    ],
    screens: [
      {
        id: "dlms-vault",
        title: "Client & Company Vault Manager",
        description: "Encrypted password entries, masked fields, and access control list.",
        badge: "Password Vault",
        mockupType: "dlms-vault",
      },
      {
        id: "dlms-expiry",
        title: "Expiration Monitoring Dashboard",
        description: "Domain, SSL, hosting, and license renewal countdown timers.",
        badge: "Expiry Alerts",
        mockupType: "dlms-expiry",
      },
    ],
  },
  {
    id: "aibots-studio",
    slug: "aibots-studio",
    name: "YashOrbit AI Bots Studio",
    badge: "Enterprise AI Assistant Engine",
    tagline: "No-Code Assistant Factory Powered by Private Vector Knowledge Bases",
    category: "AI & Intelligence",
    panelPath: "/aibots",
    iconName: "Bot",
    icon: Bot,
    accentColor: "from-violet-600 to-fuchsia-600",
    isFeatured: true,
    shortDescription: "Enterprise AI assistant studio enabling teams to build, train, and deploy purpose-built GPT bots with private OpenAI vector stores and token spend tracking.",
    fullDescription: "AI Bots Studio turns custom prompt setups into reusable company assets. Staff can create specialized assistants—such as ProposalGPT, Requirement Analyzer AI, or Code Inspector—upload proprietary PDF/Doc context, restrict user access, and chat in a secure workspace without API key leakage.",
    primaryPurpose: "Build, manage, and audit custom organizational AI agents with private company knowledge bases.",
    targetDepartments: ["AI & Engineering", "Business Analysis", "Sales & Support", "Product Management"],
    targetUsers: ["AI Engineer", "Business Analyst", "Product Manager", "Team Staff"],
    aiCapabilities: [
      "OpenAI Retrieval-Augmented Generation (RAG) vector search per bot",
      "Dynamic prompt instruction tuning & multi-model selection (GPT-4o, Claude)",
      "Automated chat transcript token & dollar cost calculation ledger",
      "Private document semantic indexing and context retrieval",
    ],
    keyFeatures: [
      {
        title: "No-Code Bot Factory",
        description: "Create new assistants in minutes with custom prompts, model choice, and access lists.",
        aiPowered: true,
      },
      {
        title: "Isolated Vector Knowledge Bases",
        description: "Uploaded files are parsed into OpenAI vector stores accessible only by authorized bots.",
        aiPowered: true,
      },
      {
        title: "Role & Person Access Control",
        description: "Restrict sensitive assistants (e.g. FinanceGPT) to specific individuals or roles.",
      },
      {
        title: "Token Usage & Financial Ledger",
        description: "Full oversight of executions, token consumption, cost estimates, and latency.",
      },
    ],
    metrics: [
      { label: "Bot Creation Speed", value: "< 2 Minutes" },
      { label: "Vector Retrieval", value: "Private RAG" },
      { label: "Cost Oversight", value: "Per-Token Ledger" },
    ],
    screens: [
      {
        id: "aibots-factory",
        title: "AI Bot Factory & KB Uploader",
        description: "Bot configurator, prompt editor, model selector, and document store manager.",
        badge: "Bot Builder",
        mockupType: "aibots-factory",
      },
      {
        id: "aibots-chat",
        title: "Interactive RAG Workspace",
        description: "Multi-bot chat interface with source citation and document grounding.",
        badge: "AI Chatspace",
        mockupType: "aibots-chat",
      },
      {
        id: "aibots-analytics",
        title: "Token & Financial Spend Ledger",
        description: "Cost per bot chart, execution counts, token burn rate, and latency logs.",
        badge: "AI Analytics",
        mockupType: "aibots-analytics",
      },
    ],
  },
  {
    id: "smms-social-engine",
    slug: "smms-social-engine",
    name: "YashOrbit SMMS AI Social Engine",
    badge: "Autonomous Social Media",
    tagline: "AI Campaign Strategist, Multi-Platform Content & Reel Script Generator",
    category: "Sales & Marketing",
    panelPath: "/smms",
    iconName: "Megaphone",
    icon: Megaphone,
    accentColor: "from-pink-600 to-rose-600",
    isFeatured: true,
    shortDescription: "AI-first social media marketing workspace generating multi-platform posts, video reel scripts, image assets, and scheduling content for Instagram, YouTube, and LinkedIn.",
    fullDescription: "SMMS streamlines social marketing by transforming a single campaign brief into multi-platform collateral. Using live brand context pulled from the website and PMS, OpenAI crafts platform-specific copy, visual prompts, scene-by-scene video reel scripts, and manages human approval before publishing.",
    primaryPurpose: "Automate social media content generation, reel creation, ad copy, and multi-channel posting.",
    targetDepartments: ["Social Media Marketing", "Growth & Ads", "Brand Management", "Creative Studio"],
    targetUsers: ["Social Media Manager", "Growth Marketer", "Content Specialist", "Brand Lead"],
    aiCapabilities: [
      "Brief-to-Campaign AI Strategy (target audience, hashtags, concepts)",
      "Multi-platform post adaptation (Instagram, LinkedIn, YouTube, X, FB)",
      "Scene-by-scene video reel script & thumbnail prompt generator",
      "AI image creative generator & iterative refinement tools",
    ],
    keyFeatures: [
      {
        title: "Brief-to-Campaign Strategy",
        description: "Generates complete platform strategies, hashtags, and creative hooks from one brief.",
        aiPowered: true,
      },
      {
        title: "Reel & Video Script Builder",
        description: "Writes visual scenes, audio prompts, hooks, and timestamps for short-form video.",
        aiPowered: true,
      },
      {
        title: "Live Brand Context Sync",
        description: "Reads company service details, active offers, and client portfolio live without copying.",
      },
      {
        title: "Human Approval Flow",
        description: "Guards publishing with explicit human sign-off; edits auto-withdraw approval.",
      },
    ],
    metrics: [
      { label: "Content Output", value: "10x Faster" },
      { label: "Supported Platforms", value: "6 Channels" },
      { label: "Approval Security", value: "100% Guarded" },
    ],
    screens: [
      {
        id: "smms-generator",
        title: "AI Campaign Strategy & Post Generator",
        description: "Brief input, platform tabs, post variants, and visual prompt editor.",
        badge: "AI Content Studio",
        mockupType: "smms-generator",
      },
      {
        id: "smms-reels",
        title: "Video Reel Script & Scene Builder",
        description: "Scene-by-scene visual instructions, voiceover scripts, and preview.",
        badge: "Reels Studio",
        mockupType: "smms-reels",
      },
    ],
  },
  {
    id: "ots-exam-engine",
    slug: "ots-exam-engine",
    name: "YashOrbit OTS Assessment Engine",
    badge: "Testing & Evaluation Engine",
    tagline: "Universal Assessment Engine with 17 Question Types & AI Proctoring",
    category: "Assessment & Security",
    panelPath: "/ots",
    iconName: "FileQuestion",
    icon: FileQuestion,
    accentColor: "from-indigo-600 to-purple-600",
    isFeatured: true,
    shortDescription: "Comprehensive test engine powering employee compliance, applicant screening, and student exams with 17 question types, timed security, and auto-evaluation.",
    fullDescription: "OTS replaces scattered quiz forms with an enterprise assessment engine. Supporting 17 question types (including coding sandbox, SQL, video response, matching), OTS handles test creation, targeted assignment, proctored candidate test-taking, server-enforced timers, auto-grading, and certificate issuance.",
    primaryPurpose: "Evaluate employee skills, screen job candidates, and examine training students with high security.",
    targetDepartments: ["Recruitment & HR", "Academic Testing", "Technical Training", "Compliance"],
    targetUsers: ["Recruiter", "Technical Examiner", "Instructor", "Candidates"],
    aiCapabilities: [
      "AI question bank generation from syllabus / job descriptions",
      "Automated code execution grading & SQL query evaluation",
      "AI anti-cheat tab-switch & proctoring anomaly scoring",
      "Subjective answer evaluation assistant for evaluators",
    ],
    keyFeatures: [
      {
        title: "17 Reusable Question Types",
        description: "Choice, coding, SQL, debugging, audio/video, ordering, match-the-following, and open text.",
      },
      {
        title: "Server-Enforced Exam Security",
        description: "Tab-switch detection, fullscreen locking, copy/paste blocking, IP recording, and auto-submit.",
      },
      {
        title: "Universal Assignment Resolver",
        description: "Assign by department, role, employee, applicant, student, or batch dynamically.",
      },
      {
        title: "Auto & Queue Evaluation",
        description: "Objective answers auto-graded instantly; subjective items routed to evaluation queue.",
      },
    ],
    metrics: [
      { label: "Question Formats", value: "17 Types" },
      { label: "Exam Security", value: "Server Enforced" },
      { label: "Grading Speed", value: "Instant Auto" },
    ],
    screens: [
      {
        id: "ots-builder",
        title: "Test Builder & Question Bank Vault",
        description: "17 question type picker, section timers, pass criteria, and target assignments.",
        badge: "Test Builder",
        mockupType: "ots-builder",
      },
      {
        id: "ots-exam",
        title: "Proctored Candidate Exam Interface",
        description: "Clean exam UI with section timer, code editor, and proctoring status.",
        badge: "Exam Sandbox",
        mockupType: "ots-exam",
      },
    ],
  },
  {
    id: "web-portal",
    slug: "web-portal",
    name: "YashOrbit Public Web Portal",
    badge: "Brand Front Door",
    tagline: "Unified Marketing Front Door & High-Conversion Service Showcase",
    category: "Sales & Marketing",
    panelPath: "/",
    iconName: "Laptop",
    icon: Laptop,
    accentColor: "from-blue-600 to-indigo-600",
    isFeatured: false,
    shortDescription: "Public website showcase featuring company profile, service catalog, case studies, blog, and live job postings directly feeding the internal CRM.",
    fullDescription: "The public site serves as the primary acquisition channel for clients and talent. Designed with modern aesthetics, glassmorphism, dark/light theme options, and embedded AI chatbots, every form submission feeds directly into LMS and HRMS without manual data entry.",
    primaryPurpose: "Showcase enterprise capability, capture qualified leads, and attract top engineering talent.",
    targetDepartments: ["Marketing", "Sales", "Careers"],
    targetUsers: ["Prospective Clients", "Candidates", "Partners"],
    aiCapabilities: [
      "Embedded Ask AI Chatbot for instant visitor queries",
      "Dynamic SEO metadata rendering from SEO Panel",
    ],
    keyFeatures: [
      {
        title: "Direct CRM & HR Pipeline Feed",
        description: "Inbound leads and career applications flow immediately into LMS and HRMS.",
      },
      {
        title: "Dynamic SEO Panel Sync",
        description: "Titles, meta descriptions, and structured JSON-LD update from SEO panel without code deploys.",
      },
      {
        title: "Modern Premium UX",
        description: "Fluid micro-animations, glassmorphism, dark/light modes, and responsive design.",
      },
    ],
    metrics: [
      { label: "Lead Pipeline Sync", value: "Instant Direct" },
      { label: "Lighthouse Performance", value: "95+ Score" },
      { label: "Design System", value: "100% Unified" },
    ],
    screens: [
      {
        id: "web-home",
        title: "Public Platform Showcase",
        description: "Hero section, interactive service cards, and client impact stats.",
        badge: "Marketing Site",
        mockupType: "web-home",
      },
    ],
  },
];
