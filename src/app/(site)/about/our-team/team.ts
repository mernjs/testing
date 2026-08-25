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

// Temporary placeholder photos — swap for each team member's actual headshot when available.
export const teamMembers: { name: string; role: string; department: Department; description: string; photo: string; href?: string }[] = [
  { name: "[NAME_OF_CEO]", role: "Co-Founder & CEO", department: "Leadership", description: "Sets company strategy and culture, staying closely involved in the leadership team and key client relationships.", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop", href: "/about/co-founder-ceo" },
  { name: "Priyanka Singh", role: "Co-Founder & COO", department: "Leadership", description: "Owns delivery operations, hiring, and the cross-team coordination that keeps every engagement on schedule.", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop", href: "/about/co-founder-coo" },
  { name: "Tej Pratap Singh", role: "Chief Technology Officer", department: "Leadership", description: "Leads engineering strategy, architecture standards, and the company's applied AI roadmap.", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop", href: "/about/cto" },
  { name: "Shikha Singh", role: "Chief Financial Officer", department: "Leadership", description: "Owns financial planning, statutory compliance, and pricing strategy across the company.", photo: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=800&auto=format&fit=crop", href: "/about/cfo" },
  { name: "Pooja Singh", role: "Chief Human Resources Officer", department: "Leadership", description: "Owns talent acquisition, culture, and learning and development as the team grows.", photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=800&auto=format&fit=crop", href: "/about/chro" },
  { name: "Arjun Mehta", role: "Technical Lead Engineer", department: "Engineering", description: "Leads architecture decisions across client engagements and mentors the team on system design.", photo: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Ananya Sharma", role: "MERN Developer", department: "Engineering", description: "Builds and ships full-stack features across React, Node.js, and MongoDB for client web apps.", photo: "https://randomuser.me/api/portraits/women/12.jpg" },
  { name: "Karan Kulkarni", role: "Android App Developer", department: "Engineering", description: "Builds native Android applications, from architecture through Play Store release.", photo: "https://randomuser.me/api/portraits/men/45.jpg" },
  { name: "Kavya Nair", role: "iOS App Developer", department: "Engineering", description: "Builds native iOS applications in Swift, focused on performance and App Store readiness.", photo: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Divya Reddy", role: "Desktop App Developer", department: "Engineering", description: "Builds cross-platform desktop applications for clients needing offline-capable, native experiences.", photo: "https://randomuser.me/api/portraits/women/5.jpg" },
  { name: "Meera Joshi", role: "Software Tester (QA)", department: "Engineering", description: "Owns test planning and manual and automated QA across every release before it reaches a client.", photo: "https://randomuser.me/api/portraits/women/60.jpg" },
  { name: "Ritika Verma", role: "GenAI Engineer", department: "AI & Data", description: "Builds generative AI features and LLM-powered workflows for client products.", photo: "https://randomuser.me/api/portraits/women/21.jpg" },
  { name: "Sneha Iyer", role: "AI/ML Engineer", department: "AI & Data", description: "Develops and deploys machine learning models from prototype through production.", photo: "https://randomuser.me/api/portraits/women/33.jpg" },
  { name: "Aditi Kapoor", role: "UI/UX Designer", department: "Design", description: "Designs end-to-end user experiences, from wireframes to polished, production-ready interfaces.", photo: "https://randomuser.me/api/portraits/women/72.jpg" },
  { name: "Rohan Malhotra", role: "Business Development Manager", department: "Business & Growth", description: "Leads new client acquisition, managing relationships from first conversation through signed engagement.", photo: "https://randomuser.me/api/portraits/men/8.jpg" },
  { name: "Nisha Agarwal", role: "Business Analyst", department: "Business & Growth", description: "Translates client requirements into clear specifications engineering and design can build against.", photo: "https://randomuser.me/api/portraits/women/8.jpg" },
  { name: "Swati Bansal", role: "Bid Executive", department: "Business & Growth", description: "Manages proposal and bid documentation for RFPs and new business opportunities.", photo: "https://randomuser.me/api/portraits/women/90.jpg" },
  { name: "Rashmi Pillai", role: "Account Manager", department: "Business & Growth", description: "Manages ongoing client relationships, keeping engagements on track after the deal is signed.", photo: "https://randomuser.me/api/portraits/women/15.jpg" },
  { name: "Vikram Rao", role: "Project Manager", department: "Operations", description: "Runs day-to-day delivery for client engagements, keeping timelines, scope, and communication on track.", photo: "https://randomuser.me/api/portraits/men/19.jpg" },
  { name: "Neha Chatterjee", role: "MIS Executive", department: "Operations", description: "Maintains internal reporting and dashboards that keep leadership informed on project and business metrics.", photo: "https://randomuser.me/api/portraits/women/27.jpg" },
  { name: "Pallavi Desai", role: "HR Executive", department: "People", description: "Manages recruitment coordination, onboarding, and day-to-day people operations.", photo: "https://randomuser.me/api/portraits/women/55.jpg" },
];
