export interface BlogPostMeta {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  excerpt: string;
  category: string;
  keywords: string[];
  image: string;
  imageAlt: string;
  author: string;
  date: string;
  readTime: string;
  /** Slugs of the 3 most topically relevant other posts, used for the "Related reading" block. */
  related: string[];
}

export const blogPosts: BlogPostMeta[] = [
  {
    slug: "choosing-the-right-tech-stack-for-your-web-application",
    title: "Choosing the Right Tech Stack for Your Web Application in 2026",
    seoTitle: "Choosing the Right Tech Stack for Your Web App (2026 Guide) | YashOrbit",
    description:
      "A practical framework for picking a frontend, backend, and database for your web app — based on team size, timeline, and scale, not what's trending.",
    excerpt:
      "Framework hype makes stack decisions harder, not easier. Here's a practical framework for choosing based on your team, timeline, and real scale needs.",
    category: "Web Development",
    keywords: ["tech stack selection", "web application development", "web app architecture", "Next.js vs alternatives", "software development company"],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Developer reviewing a web application's code architecture on a laptop screen",
    author: "YashOrbit Team",
    date: "2026-08-18",
    readTime: "9 min read",
    related: ["from-idea-to-mvp-startup-founders-guide", "native-vs-cross-platform-mobile-development", "cybersecurity-in-custom-software-development"],
  },
  {
    slug: "generative-ai-for-business-practical-use-cases",
    title: "Generative AI for Business: Practical Use Cases Beyond the Hype",
    seoTitle: "Generative AI for Business: Practical Use Cases | YashOrbit",
    description:
      "Where generative AI actually pays off in a business today — support, content operations, internal search, and coding — and where it still falls short.",
    excerpt:
      "Most \"AI strategy\" is still a slide deck. Here's where generative AI creates measurable value in a business right now, and where it doesn't yet.",
    category: "Artificial Intelligence",
    keywords: ["generative AI for business", "AI use cases", "enterprise AI adoption", "LLM applications", "AI/ML solutions"],
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Abstract visualization of an AI neural network processing data",
    author: "YashOrbit Team",
    date: "2026-08-04",
    readTime: "10 min read",
    related: ["predictive-analytics-101-business-foresight", "staff-augmentation-vs-outsourcing", "choosing-the-right-tech-stack-for-your-web-application"],
  },
  {
    slug: "native-vs-cross-platform-mobile-development",
    title: "Native vs. Cross-Platform: Choosing the Right Mobile Development Approach",
    seoTitle: "Native vs Cross-Platform Mobile Development: How to Choose | YashOrbit",
    description:
      "Native, React Native, or Flutter? A grounded comparison of cost, performance, and time-to-market to help you pick the right approach for your app.",
    excerpt:
      "The \"native vs. cross-platform\" debate usually skips the part that matters most: what actually happens to your budget and timeline either way.",
    category: "Mobile Development",
    keywords: ["native vs cross-platform", "mobile app development", "React Native vs Flutter", "mobile app cost", "cross-platform apps"],
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Person testing a mobile application on a smartphone",
    author: "YashOrbit Team",
    date: "2026-07-22",
    readTime: "8 min read",
    related: ["choosing-the-right-tech-stack-for-your-web-application", "from-idea-to-mvp-startup-founders-guide", "cybersecurity-in-custom-software-development"],
  },
  {
    slug: "cybersecurity-in-custom-software-development",
    title: "Why Cybersecurity Can't Be an Afterthought in Custom Software Development",
    seoTitle: "Cybersecurity in Custom Software Development | YashOrbit",
    description:
      "The security practices that should be built into custom software from day one — authentication, data handling, dependency hygiene, and infrastructure.",
    excerpt:
      "Security bolted on after launch is expensive and incomplete. Here's what should be built in from day one instead — and why it costs less that way.",
    category: "Security",
    keywords: ["software security best practices", "secure software development", "application security", "custom software development", "data protection"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Digital padlock icon representing application security",
    author: "YashOrbit Team",
    date: "2026-07-08",
    readTime: "8 min read",
    related: ["cloud-cost-optimization-guide-for-growing-businesses", "legacy-system-modernization-roadmap", "choosing-the-right-tech-stack-for-your-web-application"],
  },
  {
    slug: "cloud-cost-optimization-guide-for-growing-businesses",
    title: "Cloud Cost Optimization: A Practical Guide for Growing Businesses",
    seoTitle: "Cloud Cost Optimization Guide for Growing Businesses | YashOrbit",
    description:
      "Where cloud budgets actually leak — idle resources, oversized instances, and untiered storage — and the concrete steps to fix each one.",
    excerpt:
      "Cloud bills rarely spike from one bad decision. They creep up from a dozen small ones. Here's where to look first, and what to fix.",
    category: "Cloud & Infrastructure",
    keywords: ["cloud cost optimization", "cloud infrastructure management", "reduce AWS costs", "cloud architecture", "software scalability"],
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Server room representing cloud infrastructure",
    author: "YashOrbit Team",
    date: "2026-06-24",
    readTime: "9 min read",
    related: ["legacy-system-modernization-roadmap", "cybersecurity-in-custom-software-development", "predictive-analytics-101-business-foresight"],
  },
  {
    slug: "staff-augmentation-vs-outsourcing",
    title: "Staff Augmentation vs. Outsourcing: Which Model Fits Your Project?",
    seoTitle: "Staff Augmentation vs Outsourcing: Which Fits Your Project? | YashOrbit",
    description:
      "How staff augmentation and full project outsourcing actually differ in control, cost, and speed — and a framework for picking the right one.",
    excerpt:
      "\"Should we hire, augment, or outsource?\" is really three different questions about control, cost, and speed. Here's how to answer each one.",
    category: "Resource Augmentation",
    keywords: ["staff augmentation vs outsourcing", "IT staff augmentation", "hire dedicated developers", "software outsourcing model", "resource augmentation"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Team of professionals collaborating around a table",
    author: "YashOrbit Team",
    date: "2026-06-10",
    readTime: "7 min read",
    related: ["from-idea-to-mvp-startup-founders-guide", "legacy-system-modernization-roadmap", "generative-ai-for-business-practical-use-cases"],
  },
  {
    slug: "legacy-system-modernization-roadmap",
    title: "Legacy System Modernization: A Practical Roadmap for Enterprises",
    seoTitle: "Legacy System Modernization Roadmap for Enterprises | YashOrbit",
    description:
      "A phased approach to modernizing legacy systems without a risky rewrite — assessment, strangler-pattern migration, and change management.",
    excerpt:
      "Full rewrites of legacy systems fail more often than they succeed. Here's the phased approach that actually gets enterprises to a modern stack.",
    category: "Digital Transformation",
    keywords: ["legacy system modernization", "digital transformation strategy", "application modernization", "strangler fig pattern", "enterprise software"],
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Enterprise team reviewing a system architecture plan in a meeting",
    author: "YashOrbit Team",
    date: "2026-05-27",
    readTime: "10 min read",
    related: ["cloud-cost-optimization-guide-for-growing-businesses", "cybersecurity-in-custom-software-development", "staff-augmentation-vs-outsourcing"],
  },
  {
    slug: "ar-vr-reshaping-training-retail-real-estate",
    title: "How AR and VR Are Reshaping Training, Retail, and Real Estate",
    seoTitle: "How AR and VR Are Reshaping Training, Retail & Real Estate | YashOrbit",
    description:
      "Where augmented and virtual reality are delivering real ROI today — immersive training, virtual showrooms, and remote property tours.",
    excerpt:
      "AR/VR spent years looking for its business case. In training, retail, and real estate, it's found several — with measurable returns to show for it.",
    category: "AR/VR",
    keywords: ["AR VR business applications", "virtual reality training", "augmented reality retail", "AR VR development", "immersive technology"],
    image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Person using a virtual reality headset",
    author: "YashOrbit Team",
    date: "2026-05-13",
    readTime: "8 min read",
    related: ["generative-ai-for-business-practical-use-cases", "predictive-analytics-101-business-foresight", "from-idea-to-mvp-startup-founders-guide"],
  },
  {
    slug: "predictive-analytics-101-business-foresight",
    title: "Predictive Analytics 101: Turning Historical Data into Business Foresight",
    seoTitle: "Predictive Analytics 101: Business Foresight from Data | YashOrbit",
    description:
      "What predictive analytics can realistically forecast for a business, what data it needs, and how to know if you're ready to build a model.",
    excerpt:
      "Predictive analytics isn't about predicting the future perfectly. It's about being less wrong than a spreadsheet and a gut feeling. Here's how it works.",
    category: "Data & Analytics",
    keywords: ["predictive analytics", "business forecasting", "machine learning for business", "demand forecasting", "data-driven decision making"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Data analytics dashboard displaying charts and forecasts",
    author: "YashOrbit Team",
    date: "2026-04-29",
    readTime: "9 min read",
    related: ["generative-ai-for-business-practical-use-cases", "cloud-cost-optimization-guide-for-growing-businesses", "ar-vr-reshaping-training-retail-real-estate"],
  },
  {
    slug: "from-idea-to-mvp-startup-founders-guide",
    title: "From Idea to MVP: A Startup Founder's Guide to Building the Right First Version",
    seoTitle: "From Idea to MVP: A Startup Founder's Guide | YashOrbit",
    description:
      "How to scope an MVP that actually tests your riskiest assumption — what to cut, what to keep, and how to avoid the two most common MVP mistakes.",
    excerpt:
      "Most MVPs fail to do the one thing they're for: testing a risky assumption cheaply. Here's how to scope one that actually does its job.",
    category: "Product Strategy",
    keywords: ["MVP development", "startup product strategy", "minimum viable product", "build an MVP", "startup software development"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    imageAlt: "Startup team whiteboarding a product roadmap",
    author: "YashOrbit Team",
    date: "2026-04-15",
    readTime: "10 min read",
    related: ["choosing-the-right-tech-stack-for-your-web-application", "native-vs-cross-platform-mobile-development", "staff-augmentation-vs-outsourcing"],
  },
];

export function getBlogPost(slug: string): BlogPostMeta | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(slug: string): BlogPostMeta[] {
  const post = getBlogPost(slug);
  if (!post) return [];
  return post.related
    .map((relatedSlug) => getBlogPost(relatedSlug))
    .filter((p): p is BlogPostMeta => Boolean(p));
}
