import { emails } from "@/lib/contact";
import {
  UserCheck,
  Users,
  Clock,
  Target,
  Building2,
  Shuffle,
  Globe,
  Briefcase,
  Timer,
  FileSignature,
  Rocket,
  Building,
  GraduationCap,
  TrendingUp,
  Award,
  Crown,
  LucideIcon,
} from "lucide-react";

export interface ListItem {
  title: string;
  description: string;
}

export interface HiringStep {
  title: string;
  duration: string;
  topics: string[];
}

export interface Faq {
  question: string;
  answer: string;
}

export interface CardHighlight {
  engagementModel: string;
  idealUseCase: string;
  teamComposition: string;
  pricing: string;
  billingType: string;
  hiringDuration: string;
}

export interface SubOption {
  slug: string;
  title: string;
  icon: LucideIcon;
  tagline: string;
  points: string[];
  price: string;
  featured?: boolean;
}

export interface EngagementCategory {
  slug: string;
  title: string;
  icon: LucideIcon;
  tagline: string;
  summary: string;
  cardHighlight: CardHighlight;
  keyBenefits: string[];
  features: ListItem[];
  overview: ListItem[];
  idealUseCase: string[];
  subOptions: SubOption[];
  subOptionsIntro: string;
  deliverables: string[];
  pricingIntro: string;
  hiringProcess: HiringStep[];
  faqs: Faq[];
}

export const engagementCategories: EngagementCategory[] = [
  {
    slug: "single-resource",
    title: "Single Resource",
    icon: UserCheck,
    tagline: "Hire one developer, plugged directly into your existing team.",
    summary: "Bring on a single developer — onsite, remote, hybrid, dedicated, full-time, part-time, or contract-based — matched to your exact experience and engagement needs, with no recruiting overhead.",
    cardHighlight: {
      engagementModel: "Onsite, Remote, Hybrid & more",
      idealUseCase: "Filling a specific skill or capacity gap",
      teamComposition: "1 Developer",
      pricing: "From $15/hr",
      billingType: "Hourly or Monthly",
      hiringDuration: "Flexible — days to years",
    },
    keyBenefits: [
      "Start in as little as 3–5 business days",
      "Choose the exact engagement style that fits your team",
      "Direct reporting line — no account layer in between",
      "Every experience level, from Junior to Lead",
      "Scale into a full team later, whenever you're ready",
    ],
    features: [
      { title: "Flexible Engagement Styles", description: "Switch between onsite, remote, hybrid, dedicated, full-time, part-time, or contract-based hiring without restarting the process." },
      { title: "Every Experience Level", description: "From Junior developers on guided tasks to Lead-level engineers driving architecture — matched to the seniority your work actually needs." },
      { title: "Fast Time-to-Start", description: "Most single-developer hires begin within 3–5 business days of your discovery call, not weeks." },
      { title: "Direct Team Integration", description: "The developer reports into your existing lead and works inside your tools — no account-manager layer slowing things down." },
      { title: "Replacement Guarantee", description: "If the fit isn't right in the first two weeks, we source a replacement at no extra cost." },
      { title: "Transparent, Predictable Billing", description: "Hourly, monthly, or fixed-contract pricing agreed upfront, with itemized invoices and no surprise charges." },
    ],
    overview: [
      { title: "Choose Your Style", description: "Pick how the developer works with you — onsite, remote, hybrid, dedicated, full-time, part-time, or contract-based." },
      { title: "Matched to Your Stack", description: "We shortlist developers already fluent in your tech stack and domain." },
      { title: "Direct Team Integration", description: "Reports into your existing lead, joins your existing tools and ceremonies." },
      { title: "Flexible Commitment", description: "Scale hours up or down, or convert between engagement styles as your needs change." },
    ],
    idealUseCase: [
      "Filling a specific skill gap on an existing team",
      "Adding capacity without a lengthy in-house hiring process",
      "Testing a working relationship before a bigger commitment",
      "Teams that already have their own technical leadership in place",
    ],
    subOptionsIntro: "One developer, seven ways to engage them — pick the style that matches how your team actually works.",
    subOptions: [
      { slug: "onsite", title: "Onsite", icon: Building2, tagline: "Full visibility, right in your office.", points: ["Embedded in your team", "Direct in-person oversight", "Ongoing, full-time"], price: "From $15/hr" },
      { slug: "hybrid", title: "Hybrid", icon: Shuffle, tagline: "Office days when it counts, remote the rest.", points: ["Flexible on-site/remote split", "Synced to your sprints", "Rolling monthly"], price: "From $15/hr" },
      { slug: "remote", title: "Remote", icon: Globe, tagline: "Top talent, wherever you both are.", points: ["Time-zone aligned hours", "Tool-native from day one", "Hourly or monthly"], price: "From $15/hr", featured: true },
      { slug: "dedicated", title: "Dedicated", icon: UserCheck, tagline: "100% of their time, on your project only.", points: ["Zero shared bandwidth", "Long-term continuity", "Ongoing, long-term"], price: "From $15/hr" },
      { slug: "full-time", title: "Full-Time", icon: Briefcase, tagline: "40+ hrs/week, a true team member.", points: ["Full sprint integration", "Core team membership", "Month-to-month or longer"], price: "From $15/hr" },
      { slug: "part-time", title: "Part-Time", icon: Timer, tagline: "A fixed number of hours, every week.", points: ["Predictable weekly capacity", "Lower monthly cost", "Flexible scheduling"], price: "From $15/hr" },
      { slug: "contract-based", title: "Contract-Based", icon: FileSignature, tagline: "Clear scope, clear terms, clear end date.", points: ["Fixed-term agreement", "Milestone check-ins", "3–12 months"], price: "Custom Quote" },
    ],
    deliverables: [
      "A shortlist of pre-vetted, interview-ready candidates",
      "Daily or weekly progress updates in your existing tools",
      "Signed contract covering IP, NDA, and engagement terms",
      "A dedicated account contact for the life of the engagement",
    ],
    pricingIntro: "Pricing depends on engagement style and experience level — hourly for flexible arrangements, monthly for ongoing seats, or a fixed quote for contract-based work.",
    hiringProcess: [
      { title: "Discovery Call", duration: "Day 1", topics: ["Scope & requirements", "Engagement style", "Experience level"] },
      { title: "Shortlist & Interviews", duration: "Days 2–4", topics: ["Curated shortlist", "Technical interview", "Culture fit check"] },
      { title: "Offer & Onboarding Setup", duration: "Days 5–6", topics: ["Contract signed", "Access & tooling provisioned"] },
      { title: "First Week", duration: "Week 2", topics: ["Team introductions", "Codebase walkthrough", "First ticket assigned"] },
      { title: "Ongoing Management", duration: "Continuous", topics: ["Regular check-ins", "Flexible scaling", "Replacement guarantee"] },
    ],
    faqs: [
      { question: "How do I choose the right engagement style?", answer: "Your account contact walks through your team's setup and workflow on the discovery call and recommends the style that fits best — most clients know within one conversation." },
      { question: "Can we switch engagement styles later?", answer: "Yes — moving from, say, hourly to full-time, or remote to hybrid, is a quick conversation, not a new hiring process." },
      { question: "What if the developer isn't the right fit?", answer: "Our replacement guarantee covers the first two weeks — we'll source a new developer at no additional cost." },
      { question: "Do you handle contracts and compliance?", answer: "Yes, we handle contracts, NDAs, and IP assignment for every engagement style." },
      { question: "Can we hire more than one developer this way?", answer: "Absolutely — add developers individually, or move to a Package-Based Team once you need three or more roles working together." },
      { question: "How is billing handled?", answer: "Hourly and contract engagements are invoiced monthly; full-time and part-time seats are billed monthly per developer." },
    ],
  },
  {
    slug: "package-based-team",
    title: "Package-Based Team",
    icon: Users,
    tagline: "A complete, pre-built development team.",
    summary: "Skip the hiring altogether — bring on a ready-made team with the roles, seniority mix, and governance already worked out, from a lean 3-person squad to a full 10-person enterprise pod.",
    cardHighlight: {
      engagementModel: "Managed team pod",
      idealUseCase: "Scaling a product with a full delivery team",
      teamComposition: "3 to 10+ People",
      pricing: "From $4,000/mo",
      billingType: "Flat Monthly Package",
      hiringDuration: "1 to 6+ month minimum",
    },
    keyBenefits: [
      "One flat invoice instead of managing multiple contracts",
      "Roles and seniority mix pre-balanced for the work",
      "Internal technical leadership included on larger teams",
      "Team staffed and running within 1–2 weeks",
      "Swap individual roles without restarting the engagement",
    ],
    features: [
      { title: "Pre-Balanced Role Mix", description: "Every package is built with the right ratio of engineers, QA, design, and leadership for that tier's typical workload." },
      { title: "One Flat Invoice", description: "A single monthly price covers the whole team — no juggling separate contracts or timesheets per person." },
      { title: "Built-In Technical Leadership", description: "Growth Team and Enterprise Pod include a Tech Lead or Technical Architect who runs day-to-day technical direction internally." },
      { title: "Fast Team Assembly", description: "Full teams are staffed and running within 1–2 weeks of your kickoff call." },
      { title: "Swap Roles Without Restarting", description: "Not the right fit? Individual roles can be replaced without renegotiating the whole engagement." },
      { title: "Scales With You", description: "Move from Starter Squad to Growth Team to Enterprise Pod as your product and governance needs grow." },
    ],
    overview: [
      { title: "Pick Your Team Size", description: "Choose from a lean 3-person squad, a 7-person growth team, or a full 10-person enterprise pod." },
      { title: "Pre-Balanced Roles", description: "Engineering, QA, design, and leadership roles are already mixed for the type of work each tier is built for." },
      { title: "One Flat Invoice", description: "A single monthly package price covers every role — no per-person billing to manage." },
      { title: "Built-In Governance", description: "Larger teams include a Tech Lead or Technical Architect who runs day-to-day technical direction internally." },
    ],
    idealUseCase: [
      "Products that have outgrown a single developer or small squad",
      "Teams that need internal technical leadership, not just extra hands",
      "Companies scaling a roadmap across multiple features in parallel",
      "Organizations running large-scale or compliance-heavy builds",
    ],
    subOptionsIntro: "Three tiers, each with the role mix already worked out — pick the one that matches where your product is right now.",
    subOptions: [
      { slug: "starter-squad", title: "Starter Squad", icon: Rocket, tagline: "A lean 3-person team to ship an MVP fast.", points: ["1× Software Engineer", "1× UI/UX Designer", "1× QA Engineer (part-time)"], price: "$4,000–5,500/mo" },
      { slug: "growth-team", title: "Growth Team", icon: Users, tagline: "A full, self-sufficient 7-person delivery team.", points: ["2× Engineer + 1× Senior + 1× Tech Lead", "1× QA + 1× Designer", "1× PM (part-time)"], price: "$11,000–15,000/mo", featured: true },
      { slug: "enterprise-pod", title: "Enterprise Pod", icon: Building, tagline: "Full governance for a 10-person mission-critical build.", points: ["Technical Architect + Project Lead", "4× Engineers + QA + DevOps", "1× Designer + 1× PM"], price: "Custom Quote" },
    ],
    deliverables: [
      "Weekly or bi-weekly sprint demos",
      "Sprint reports and release notes for every deployment",
      "A single point of contact for status and scope",
      "Monthly roadmap and capacity review",
    ],
    pricingIntro: "Every package is billed as one flat monthly price covering the full team — the price scales with team size and the governance layer included.",
    hiringProcess: [
      { title: "Roadmap & Team Planning", duration: "Days 1–3", topics: ["Roadmap review", "Package selection", "Sprint cadence agreed"] },
      { title: "Team Assembly", duration: "Days 4–10", topics: ["All roles matched and confirmed", "Lead onboarding call"] },
      { title: "Sprint 0", duration: "Week 2", topics: ["Architecture review", "Backlog grooming", "Tooling and access setup"] },
      { title: "First Sprint Delivery", duration: "Weeks 3–4", topics: ["First sprint shipped", "Retrospective and process tuning"] },
      { title: "Ongoing Governance", duration: "Continuous", topics: ["Regular roadmap reviews", "Team composition adjustments as needed"] },
    ],
    faqs: [
      { question: "Which package is right for us?", answer: "Starter Squad suits MVPs, Growth Team suits scaling products, and Enterprise Pod suits large, governance-heavy builds — your discovery call will confirm the fit." },
      { question: "Can we swap out individual team members?", answer: "Yes, any role can be replaced if it's not the right fit, with continuity managed by the team lead to avoid disruption." },
      { question: "Can we adjust the roles included?", answer: "Yes — packages can be adjusted, most commonly by removing part-time roles or adding specialists, with pricing adjusted accordingly." },
      { question: "Do we need our own project manager?", answer: "Growth Team and Enterprise Pod include one; larger organizations often keep their own PM working alongside ours." },
      { question: "Can we start smaller and grow into a bigger package?", answer: "Yes, many clients start with Starter Squad or Growth Team and expand as governance and scale needs increase." },
      { question: "What's the minimum commitment?", answer: "Starter Squad is month-to-month, Growth Team requires a 3-month minimum, and Enterprise Pod requires 6 months given the setup investment." },
    ],
  },
  {
    slug: "hourly-on-demand",
    title: "Hourly / On-Demand",
    icon: Clock,
    tagline: "Pay only for the hours you actually use.",
    summary: "An on-demand developer billed purely by the hour — ideal for audits, bug fixes, and unpredictable workloads that don't justify a dedicated hire.",
    cardHighlight: {
      engagementModel: "Task-based, on-demand",
      idealUseCase: "Bug fixes, audits, unpredictable workloads",
      teamComposition: "1 Developer (flexes as needed)",
      pricing: "$15–50/hr",
      billingType: "Hourly, Pay-As-You-Go",
      hiringDuration: "No minimum commitment",
    },
    keyBenefits: [
      "No minimum hours or long-term contract",
      "Pause and resume whenever your workload changes",
      "Itemized timesheets for full billing transparency",
      "Fast turnaround on bugs, audits, and one-off tasks",
      "Easy upgrade path to part-time or full-time later",
    ],
    features: [
      { title: "Zero Minimum Commitment", description: "No monthly minimum, no long-term contract — use as many or as few hours as your workload needs." },
      { title: "Pause and Resume Freely", description: "Stop when things are quiet, restart when they're not, without losing your developer relationship." },
      { title: "Itemized, Transparent Billing", description: "Every invoice breaks down exactly which tasks consumed which hours." },
      { title: "Matched to Task Complexity", description: "Request Junior through Lead-level developers depending on how demanding the work actually is." },
      { title: "Fast Turnaround", description: "Most task-based work starts within 2–3 business days of your scoping call." },
      { title: "Easy Upgrade Path", description: "Consistent hourly usage converts smoothly into a Part-Time or Full-Time engagement whenever you're ready." },
    ],
    overview: [
      { title: "Usage-Based Billing", description: "Invoiced monthly based on logged, approved hours." },
      { title: "No Minimum Commitment", description: "Scale usage up or down freely from week to week." },
      { title: "Transparent Time Tracking", description: "Detailed timesheets and task logs for every billed hour." },
      { title: "Fast Turnaround", description: "Great for quick fixes and audits that don't need a dedicated hire." },
    ],
    idealUseCase: [
      "Bug fixes, audits, and one-off technical tasks",
      "Teams testing a working relationship before a bigger commitment",
      "Unpredictable or seasonal workloads",
      "Ongoing maintenance on a stable, mature product",
    ],
    subOptionsIntro: "The hourly rate scales with the seniority your task queue actually needs.",
    subOptions: [
      { slug: "junior", title: "Junior", icon: GraduationCap, tagline: "0–2 Years experience", points: ["Guided execution", "Cost-efficient", "Fast ramp-up"], price: "$15–20/hr" },
      { slug: "mid-level", title: "Mid-Level", icon: TrendingUp, tagline: "2–5 Years experience", points: ["Independent delivery", "Feature ownership", "Solid fundamentals"], price: "$20–28/hr" },
      { slug: "senior", title: "Senior", icon: Award, tagline: "5–8 Years experience", points: ["Architecture input", "Mentorship", "Complex problem-solving"], price: "$28–38/hr", featured: true },
      { slug: "lead", title: "Lead", icon: Crown, tagline: "8+ Years experience", points: ["Technical leadership", "Team ownership", "Strategic input"], price: "$38–50/hr" },
    ],
    deliverables: [
      "Itemized timesheet per task",
      "Completed tickets with linked pull requests",
      "Monthly invoice broken down by task",
      "Short handoff note per completed item",
    ],
    pricingIntro: "Hourly billing is the most granular pricing model — you pay only for logged, approved hours, invoiced monthly with full itemization, priced by the seniority the work needs.",
    hiringProcess: [
      { title: "Task Scoping Call", duration: "Day 1", topics: ["Task list & priorities", "Estimated hours", "Access requirements"] },
      { title: "Developer Match", duration: "Days 2–3", topics: ["Skill-matched developer assigned", "Quick intro call"] },
      { title: "Access & Kickoff", duration: "Days 3–4", topics: ["Repo/tool access granted", "First task started"] },
      { title: "First Deliverable", duration: "Within First Week", topics: ["First completed task reviewed", "Timesheet shared"] },
      { title: "Ongoing As-Needed", duration: "Continuous", topics: ["Task queue managed on demand", "Monthly invoice reconciliation"] },
    ],
    faqs: [
      { question: "Is there a minimum number of hours?", answer: "No formal minimum, though very small one-off tasks may be better suited to a fixed project quote instead." },
      { question: "How is time tracked and verified?", answer: "Through detailed timesheets tied to specific tasks, which you review and approve before invoicing." },
      { question: "Can we pause and resume later?", answer: "Yes — hourly engagements have no ongoing commitment, so you can pause whenever and pick back up later." },
      { question: "What if a task takes longer than estimated?", answer: "We flag scope changes before continuing so there are no surprise hours on your invoice." },
      { question: "Can we request a specific experience level?", answer: "Yes — tell us the complexity of your task queue and we'll match a Junior through Lead-level developer accordingly." },
      { question: "How quickly can work start?", answer: "Most task-based engagements start within 2–3 business days of the scoping call." },
    ],
  },
  {
    slug: "project-based",
    title: "Project-Based",
    icon: Target,
    tagline: "A fixed-scope engagement, priced to the outcome.",
    summary: "Hire a developer or small team end-to-end for a specific project — from kickoff to delivery — with a fixed quote tied to milestones instead of hours worked.",
    cardHighlight: {
      engagementModel: "Fixed-scope, milestone-based",
      idealUseCase: "Self-contained builds with a clear finish line",
      teamComposition: "1 Developer or small team",
      pricing: "Custom Quote",
      billingType: "Fixed Project Quote",
      hiringDuration: "Per project, scoped upfront",
    },
    keyBenefits: [
      "Total cost known before work begins",
      "Payment tied to milestones, not hours logged",
      "Full ownership from requirements through launch",
      "Clear exit point when the project ships",
      "Scales from one developer to a small project team",
    ],
    features: [
      { title: "Cost Certainty Upfront", description: "A fixed quote agreed before work begins — the price you're quoted is the price you pay." },
      { title: "Milestone-Based Delivery", description: "Payment and progress are tied to agreed checkpoints, not a running hourly clock." },
      { title: "End-to-End Ownership", description: "Involved from requirements gathering through production launch, not just implementation." },
      { title: "Two Structures to Choose From", description: "Run it as a milestone project or a fixed-term contract, whichever fits how you like to track progress." },
      { title: "Full Documentation & Handoff", description: "Every project closes with complete source code, documentation, and a formal handoff session." },
      { title: "Clear Exit Point", description: "The engagement naturally concludes when the project ships — no ongoing commitment unless you want one." },
    ],
    overview: [
      { title: "Outcome-Focused", description: "Success is measured against a defined deliverable, not hours logged." },
      { title: "Milestone-Based Pricing", description: "Payment tied to agreed project checkpoints and final delivery." },
      { title: "End-to-End Ownership", description: "Involved from kickoff and requirements through launch." },
      { title: "Fixed-Term Option", description: "Prefer a contract over milestones? We also scope fixed-term agreements (3–12 months) with the same cost certainty." },
    ],
    idealUseCase: [
      "Self-contained projects with a clear start and finish",
      "Teams that want cost certainty tied to outcomes",
      "One-off builds like a new feature, integration, or MVP",
      "Compliance-heavy engagements needing a formal, fixed-term agreement",
    ],
    subOptionsIntro: "Two ways to structure a fixed-scope engagement, depending on how you'd rather track progress.",
    subOptions: [
      { slug: "milestone-project", title: "Milestone Project", icon: Target, tagline: "Priced to project checkpoints.", points: ["Requirements to launch", "Demo at every milestone", "Fixed quote upfront"], price: "Custom Quote", featured: true },
      { slug: "fixed-term-contract", title: "Fixed-Term Contract", icon: FileSignature, tagline: "A defined scope, a defined end date.", points: ["3–12 month term", "Formal SOW & sign-off", "Predictable, locked-in cost"], price: "Custom Quote" },
    ],
    deliverables: [
      "Project charter and scoped requirements",
      "Working software delivered at each milestone",
      "Final production deployment",
      "Complete documentation and source handoff",
    ],
    pricingIntro: "Project-based work is priced as a fixed quote tied to agreed milestones or contract terms, so total cost is known before the project starts.",
    hiringProcess: [
      { title: "Project Scoping Workshop", duration: "Days 1–3", topics: ["Requirements & goals", "Milestone plan", "Fixed quote prepared"] },
      { title: "Proposal & Sign-Off", duration: "Days 4–5", topics: ["Quote reviewed", "Project agreement signed"] },
      { title: "Kickoff", duration: "Day 6", topics: ["Developer(s) assigned", "Project workspace set up"] },
      { title: "Milestone Delivery", duration: "Per Project Plan", topics: ["Working software at each milestone", "Client review and feedback"] },
      { title: "Launch & Handoff", duration: "Final Milestone", topics: ["Production deployment", "Documentation and source code delivered"] },
    ],
    faqs: [
      { question: "What if the project scope grows midway?", answer: "Additional scope is quoted separately as a change order rather than absorbed into the original fixed price." },
      { question: "Do you offer support after launch?", answer: "Post-launch support can be added as a separate hourly or retainer arrangement once the project ships." },
      { question: "How is progress reported during the project?", answer: "You'll get milestone demos and a written status update at each checkpoint in the project plan." },
      { question: "Can one developer handle a whole project alone?", answer: "For smaller builds, yes — larger projects are staffed with a small project-based team instead." },
      { question: "What's the difference between a milestone project and a fixed-term contract?", answer: "A milestone project is priced and delivered against specific checkpoints; a fixed-term contract runs for a set time period with defined deliverables — both give you cost certainty, just structured differently." },
      { question: "Can the contract be extended?", answer: "Yes, both milestone projects and fixed-term contracts can be extended or renewed by mutual agreement." },
    ],
  },
];

export function getCategoryBySlug(slug: string): EngagementCategory | undefined {
  return engagementCategories.find((c) => c.slug === slug);
}

export function hireMailto(subject: string) {
  const encodedSubject = encodeURIComponent(subject);
  const body = encodeURIComponent(
    `Hi YashOrbit team,\n\nWe're interested in this engagement and would like to talk through scope, timeline, and pricing.\n\nThanks,`
  );
  return `mailto:${emails.support}?subject=${encodedSubject}&body=${body}`;
}
