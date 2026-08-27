export const departments = [
  "Leadership",
  "Engineering",
  "AI & Data",
  "Design",
  "Business & Growth",
  "Operations",
  "People",
] as const;

export type Department = (typeof departments)[number];

export type Gender = "male" | "female";

export const teamMembers: { name: string; role: string; department: Department; description: string; gender: Gender; href?: string }[] = [
  { name: "[NAME_OF_CEO]", role: "Co-Founder & CEO", department: "Leadership", description: "Sets company strategy and culture, staying closely involved in the leadership team and key client relationships.", gender: "female", href: "/about/co-founder-ceo" },
  { name: "Priyanka Singh", role: "Co-Founder & COO", department: "Leadership", description: "Owns delivery operations, hiring, and the cross-team coordination that keeps every engagement on schedule.", gender: "female", href: "/about/co-founder-coo" },
  { name: "Tej Pratap Singh", role: "Chief Technology Officer", department: "Leadership", description: "Leads engineering strategy, architecture standards, and the company's applied AI roadmap.", gender: "male", href: "/about/cto" },
  { name: "Shikha Singh", role: "Chief Financial Officer", department: "Leadership", description: "Owns financial planning, statutory compliance, and pricing strategy across the company.", gender: "female", href: "/about/cfo" },
  { name: "Pooja Singh", role: "Chief Human Resources Officer", department: "Leadership", description: "Owns talent acquisition, culture, and learning and development as the team grows.", gender: "female", href: "/about/chro" },
  { name: "Arjun Mehta", role: "Technical Lead Engineer", department: "Engineering", description: "Leads architecture decisions across client engagements and mentors the team on system design.", gender: "male" },
  { name: "Ananya Sharma", role: "MERN Developer", department: "Engineering", description: "Builds and ships full-stack features across React, Node.js, and MongoDB for client web apps.", gender: "female" },
  { name: "Karan Kulkarni", role: "Android App Developer", department: "Engineering", description: "Builds native Android applications, from architecture through Play Store release.", gender: "male" },
  { name: "Kavya Nair", role: "iOS App Developer", department: "Engineering", description: "Builds native iOS applications in Swift, focused on performance and App Store readiness.", gender: "female" },
  { name: "Divya Reddy", role: "Desktop App Developer", department: "Engineering", description: "Builds cross-platform desktop applications for clients needing offline-capable, native experiences.", gender: "female" },
  { name: "Meera Joshi", role: "Software Tester (QA)", department: "Engineering", description: "Owns test planning and manual and automated QA across every release before it reaches a client.", gender: "female" },
  { name: "Ritika Verma", role: "GenAI Engineer", department: "AI & Data", description: "Builds generative AI features and LLM-powered workflows for client products.", gender: "female" },
  { name: "Sneha Iyer", role: "AI/ML Engineer", department: "AI & Data", description: "Develops and deploys machine learning models from prototype through production.", gender: "female" },
  { name: "Aditi Kapoor", role: "UI/UX Designer", department: "Design", description: "Designs end-to-end user experiences, from wireframes to polished, production-ready interfaces.", gender: "female" },
  { name: "Rohan Malhotra", role: "Business Development Manager", department: "Business & Growth", description: "Leads new client acquisition, managing relationships from first conversation through signed engagement.", gender: "male" },
  { name: "Nisha Agarwal", role: "Business Analyst", department: "Business & Growth", description: "Translates client requirements into clear specifications engineering and design can build against.", gender: "female" },
  { name: "Swati Bansal", role: "Bid Executive", department: "Business & Growth", description: "Manages proposal and bid documentation for RFPs and new business opportunities.", gender: "female" },
  { name: "Rashmi Pillai", role: "Account Manager", department: "Business & Growth", description: "Manages ongoing client relationships, keeping engagements on track after the deal is signed.", gender: "female" },
  { name: "Vikram Rao", role: "Project Manager", department: "Operations", description: "Runs day-to-day delivery for client engagements, keeping timelines, scope, and communication on track.", gender: "male" },
  { name: "Neha Chatterjee", role: "MIS Executive", department: "Operations", description: "Maintains internal reporting and dashboards that keep leadership informed on project and business metrics.", gender: "female" },
  { name: "Pallavi Desai", role: "HR Executive", department: "People", description: "Manages recruitment coordination, onboarding, and day-to-day people operations.", gender: "female" },
];
