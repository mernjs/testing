const fs = require('fs');
const path = require('path');

const pageData = {
  about: [
    {
      title: "What We Do",
      slug: "what-we-do",
      subtitle: "Driving digital transformation across industries.",
      heroDescription: "We build scalable, high-performance software solutions tailored to solve complex business challenges. From modern web applications to advanced AI systems, we bring your vision to life.",
      icon: "Compass",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "End-to-End Development", desc: "We handle everything from initial concept and design to deployment and scaling." },
        { name: "Consulting & Strategy", desc: "Expert guidance to help you navigate the complex technology landscape." },
        { name: "Continuous Support", desc: "We partner with you long-term to ensure your platforms remain cutting-edge." }
      ],
      closing: "Our mission is simple: empower organizations through technology that actually makes a difference."
    },
    {
      title: "Success Stories",
      slug: "success-stories",
      subtitle: "Real results for real businesses.",
      heroDescription: "Don't just take our word for it. Explore how we've helped companies across the globe scale their operations, increase revenue, and dominate their markets.",
      icon: "Trophy",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "150+ Projects Delivered", desc: "A proven track record of successful launches across various sectors." },
        { name: "Measurable ROI", desc: "Our solutions are designed to directly impact your bottom line." },
        { name: "Long-term Partnerships", desc: "Most of our clients stay with us for years, trusting us as their core tech partner." }
      ],
      closing: "Read through our case studies and imagine what we could achieve together."
    },
    {
      title: "Our Team",
      slug: "our-team",
      subtitle: "The minds behind the technology.",
      heroDescription: "We are a diverse group of engineers, designers, and strategists united by a passion for building exceptional digital experiences.",
      icon: "Users",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Top-Tier Engineering", desc: "Our developers are experts in the latest modern frameworks and languages." },
        { name: "Design Thinkers", desc: "Our UI/UX team ensures every product is intuitive, beautiful, and accessible." },
        { name: "Strategic Leadership", desc: "Guided by industry veterans who understand how technology drives business growth." }
      ],
      closing: "Work with a team that cares about your product just as much as you do."
    },
    {
      title: "Privacy Policy",
      slug: "privacy-policy",
      subtitle: "Your data, secured and respected.",
      heroDescription: "We take your privacy seriously. This policy outlines exactly how we collect, use, and protect your information in compliance with global standards.",
      icon: "ShieldCheck",
      image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Data Encryption", desc: "All sensitive data is encrypted both in transit and at rest." },
        { name: "Transparent Practices", desc: "We never sell your data to third parties, plain and simple." },
        { name: "GDPR Compliant", desc: "Our infrastructure and policies meet the highest international privacy standards." }
      ],
      closing: "Trust is the foundation of our business. We are committed to keeping your data safe."
    }
  ],
  services: [
    {
      title: "Web App Development",
      slug: "web-app-development",
      subtitle: "Scalable platforms for the modern web.",
      heroDescription: "We engineer lightning-fast, highly secure web applications using React, Next.js, and modern cloud architectures that provide seamless experiences across all devices.",
      icon: "Globe",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Responsive Design", desc: "Flawless performance on desktops, tablets, and smartphones." },
        { name: "Modern Tech Stack", desc: "Built with Next.js, TypeScript, and optimized backend architectures." },
        { name: "SEO Optimized", desc: "Server-side rendering ensures search engines can easily index your content." }
      ],
      closing: "Give your users a fast, app-like experience directly in their browser."
    },
    {
      title: "Mobile App Development",
      slug: "mobile-app-development",
      subtitle: "Native and cross-platform mobile solutions.",
      heroDescription: "Reach your audience wherever they are. We build intuitive, high-performance mobile apps for iOS and Android that users love to engage with.",
      icon: "Smartphone",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Cross-Platform Efficiency", desc: "Using React Native and Flutter to deliver two apps from a single codebase." },
        { name: "Native Performance", desc: "Smooth animations, fast load times, and deep OS integration." },
        { name: "App Store Launch", desc: "We handle the rigorous submission process for both Apple and Google." }
      ],
      closing: "Take your business mobile with an app that stands out in crowded marketplaces."
    },
    {
      title: "Desktop App Development",
      slug: "desktop-app-development",
      subtitle: "Powerful applications for macOS and Windows.",
      heroDescription: "When web browsers aren't enough, we build robust desktop software using frameworks like Electron and Tauri to deliver raw performance and deep system access.",
      icon: "Monitor",
      image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Offline Capabilities", desc: "Full functionality without requiring a constant internet connection." },
        { name: "System Integration", desc: "Direct access to file systems, hardware, and OS-level notifications." },
        { name: "Cross-OS Compatibility", desc: "Write once, deploy to Windows, macOS, and Linux seamlessly." }
      ],
      closing: "Empower your workforce with heavy-duty tools tailored to your complex workflows."
    },
    {
      title: "Prediction & Forecasting",
      slug: "prediction-and-forecasting",
      subtitle: "Data-driven foresight for your business.",
      heroDescription: "Stop guessing and start knowing. Our predictive analytics solutions use historical data and advanced algorithms to forecast trends, demand, and user behavior.",
      icon: "LineChart",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Demand Forecasting", desc: "Optimize your inventory and resource allocation before the rush hits." },
        { name: "Risk Assessment", desc: "Identify potential market shifts and mitigate risks early." },
        { name: "Custom Data Models", desc: "Algorithms trained specifically on your company's unique datasets." }
      ],
      closing: "Turn your raw data into a crystal ball for strategic decision-making."
    },
    {
      title: "AI Agent",
      slug: "ai-agent",
      subtitle: "Autonomous assistants for your enterprise.",
      heroDescription: "Deploy intelligent, autonomous AI agents that can handle customer support, automate internal workflows, and act as 24/7 digital employees.",
      icon: "Bot",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Contextual Understanding", desc: "Agents that remember past interactions and understand complex nuances." },
        { name: "Seamless Integrations", desc: "Connects directly to your CRM, database, and internal communication tools." },
        { name: "24/7 Availability", desc: "Provide instant resolutions to users at any time of day." }
      ],
      closing: "Scale your operations without scaling your headcount using intelligent automation."
    },
    {
      title: "AI/ML Solutions",
      slug: "ai-ml-solutions",
      subtitle: "Custom machine learning architecture.",
      heroDescription: "We design, train, and deploy bespoke machine learning models that solve highly specific problems—from natural language processing to complex recommendation engines.",
      icon: "Cpu",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Custom Model Training", desc: "We build architectures tailored to your specific use cases." },
        { name: "Natural Language Processing", desc: "Extract meaning, sentiment, and data from unstructured text." },
        { name: "Recommendation Systems", desc: "Increase conversions by showing users exactly what they want to see." }
      ],
      closing: "Unlock the hidden value in your data with enterprise-grade machine learning."
    },
    {
      title: "Vision Intelligence",
      slug: "vision-intelligence",
      subtitle: "Advanced image and video analysis.",
      heroDescription: "Give your software the ability to see. Our computer vision solutions can identify objects, track movement, and analyze visual data in real-time.",
      icon: "Eye",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Real-Time Processing", desc: "Analyze live video feeds for immediate alerts and insights." },
        { name: "Object Detection", desc: "Automatically identify and track specific items, vehicles, or people." },
        { name: "Quality Control", desc: "Automate manufacturing inspections with superhuman accuracy." }
      ],
      closing: "Automate visual tasks that previously required human eyes."
    },
    {
      title: "AR/VR",
      slug: "ar-vr",
      subtitle: "Immersive virtual experiences.",
      heroDescription: "Transport your users to new worlds. We build augmented and virtual reality applications for training simulations, virtual showrooms, and interactive marketing.",
      icon: "Glasses",
      image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Interactive Training", desc: "Safe, repeatable, and highly effective virtual training environments." },
        { name: "3D Product Visualization", desc: "Let customers place your products in their own space using AR." },
        { name: "Cross-Device Support", desc: "Deploy to Meta Quest, Apple Vision Pro, or mobile browsers." }
      ],
      closing: "Engage your audience in ways flat screens simply cannot match."
    }
  ],
  products: [
    {
      title: "ConvoCraft",
      slug: "convocraft",
      subtitle: "The next-generation conversational AI platform.",
      heroDescription: "Build, deploy, and manage highly intelligent chatbots and voice assistants without writing a single line of code. ConvoCraft makes AI accessible to everyone.",
      icon: "MessageSquare",
      image: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Visual Builder", desc: "Drag-and-drop interface for designing complex conversation flows." },
        { name: "Omnichannel Deployment", desc: "Publish instantly to WhatsApp, Web, Messenger, and Slack." },
        { name: "Deep Analytics", desc: "Understand exactly how users interact with your bots to improve responses." }
      ],
      closing: "Transform how you communicate with your customers at scale."
    },
    {
      title: "Legal Tech",
      slug: "legal-tech",
      subtitle: "Streamlining modern legal workflows.",
      heroDescription: "A comprehensive suite of tools designed specifically for law firms. Automate document generation, track case progress, and ensure absolute compliance.",
      icon: "Scale",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Document Automation", desc: "Generate complex contracts in seconds using intelligent templates." },
        { name: "Secure Client Portal", desc: "A military-grade encrypted environment for sharing sensitive files." },
        { name: "Time Tracking & Billing", desc: "Seamlessly log hours and generate accurate invoices automatically." }
      ],
      closing: "Spend less time on paperwork and more time winning cases."
    },
    {
      title: "Illumate",
      slug: "illumate",
      subtitle: "Intelligent illumination controls.",
      heroDescription: "The ultimate IoT platform for smart lighting. Illumate provides granular control, scheduling, and energy optimization for commercial and residential properties.",
      icon: "Lightbulb",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Energy Optimization", desc: "AI-driven scheduling reduces electricity costs by up to 40%." },
        { name: "Mesh Networking", desc: "Reliable connectivity across thousands of devices without a central hub." },
        { name: "Circadian Rhythm Sync", desc: "Automatically adjusts color temperature to promote health and productivity." }
      ],
      closing: "Shed light on a smarter, more sustainable way to manage your environment."
    },
    {
      title: "AI HR Assistant",
      slug: "ai-hr-assistant",
      subtitle: "Automate your human resources.",
      heroDescription: "Revolutionize your HR department. This AI-powered tool handles initial candidate screening, employee onboarding, and routine HR queries automatically.",
      icon: "UserCog",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Resume Parsing", desc: "Instantly analyze and rank thousands of applications based on custom criteria." },
        { name: "Automated Onboarding", desc: "Guide new hires through paperwork, training, and company culture." },
        { name: "Internal Helpdesk", desc: "Answer common employee questions about benefits and policies 24/7." }
      ],
      closing: "Let your HR team focus on strategy and culture, not administrative overhead."
    },
    {
      title: "AI Powered Smart DMS",
      slug: "ai-powered-smart-dms",
      subtitle: "Intelligent document management.",
      heroDescription: "Never lose a file again. Our Smart DMS uses optical character recognition (OCR) and natural language processing to categorize, tag, and search your entire company archives.",
      icon: "FolderSearch",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Semantic Search", desc: "Find documents based on concepts and meaning, not just exact keywords." },
        { name: "Auto-Categorization", desc: "The AI automatically routes incoming files to the correct folders." },
        { name: "Version Control", desc: "Keep track of every change made to a document across its entire lifecycle." }
      ],
      closing: "Bring order to the chaos of enterprise documentation."
    },
    {
      title: "DataPulse AI",
      slug: "datapulse-ai",
      subtitle: "Real-time business intelligence.",
      heroDescription: "A centralized dashboard that connects to all your data sources, providing real-time visualizations and AI-generated insights into your business health.",
      icon: "Activity",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Unified Dashboard", desc: "See your sales, marketing, and operational data in one beautiful interface." },
        { name: "Automated Reporting", desc: "Generate comprehensive reports and email them to stakeholders automatically." },
        { name: "Anomaly Detection", desc: "Get instantly alerted when metrics spike or drop unexpectedly." }
      ],
      closing: "Stop drowning in spreadsheets and start seeing the big picture."
    },
    {
      title: "GeoVista AI",
      slug: "geovista-ai",
      subtitle: "Geospatial intelligence mapping.",
      heroDescription: "Turn location data into actionable strategy. GeoVista AI combines satellite imagery, geographic data, and machine learning to analyze spatial trends.",
      icon: "Globe2",
      image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Site Selection", desc: "Identify the most profitable locations for new retail stores or facilities." },
        { name: "Route Optimization", desc: "Calculate the most efficient paths for logistics and delivery fleets." },
        { name: "Environmental Monitoring", desc: "Track changes in land use, vegetation, and urban development over time." }
      ],
      closing: "Discover the hidden geographic patterns that drive your industry."
    },
    {
      title: "iGaming",
      slug: "igaming",
      subtitle: "Innovative gaming and betting solutions.",
      heroDescription: "High-performance software for the modern iGaming industry. We provide secure, scalable, and provably fair platforms for casinos and sportsbooks.",
      icon: "Gamepad2",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "High-Frequency Engine", desc: "Process thousands of bets per second with zero latency." },
        { name: "Cryptocurrency Support", desc: "Seamlessly accept Bitcoin, Ethereum, and other digital assets." },
        { name: "Regulatory Compliance", desc: "Built-in KYC and AML tools to ensure you meet global gaming regulations." }
      ],
      closing: "Build the next generation of entertainment with robust, secure infrastructure."
    }
  ],
  industries: [
    {
      title: "EdTech",
      slug: "edtech",
      subtitle: "Transforming modern education.",
      heroDescription: "We build intuitive learning management systems, virtual classrooms, and educational games that make learning accessible, engaging, and effective for students worldwide.",
      icon: "GraduationCap",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Interactive Classrooms", desc: "High-quality video streaming paired with real-time whiteboarding." },
        { name: "Progress Tracking", desc: "Detailed analytics for teachers and parents to monitor student success." },
        { name: "Gamified Learning", desc: "Increase engagement and retention through rewards and interactive challenges." }
      ],
      closing: "Empower the next generation of learners with technology that works."
    },
    {
      title: "Real Estate Tech",
      slug: "real-estate-tech",
      subtitle: "Modernizing property management.",
      heroDescription: "From immersive 3D virtual tours to automated property management software, we provide the tools real estate professionals need to close deals faster and manage assets efficiently.",
      icon: "Building2",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Virtual Tours", desc: "Allow buyers to walk through properties from anywhere in the world." },
        { name: "Automated CRM", desc: "Track leads, schedule follow-ups, and manage client communications." },
        { name: "Smart Contracts", desc: "Streamline the closing process with secure, digital agreements." }
      ],
      closing: "Bring the real estate industry into the digital age."
    },
    {
      title: "FinTech",
      slug: "fintech",
      subtitle: "Secure financial technology.",
      heroDescription: "We engineer highly secure, compliant, and lightning-fast financial applications. From payment gateways to blockchain integration, we build the future of finance.",
      icon: "Landmark",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
      features: [
        { name: "Bank-Grade Security", desc: "Industry-leading encryption and multi-factor authentication protocols." },
        { name: "Payment Processing", desc: "Seamless integrations with major payment networks and localized gateways." },
        { name: "Blockchain Integration", desc: "Implement smart contracts, wallets, and decentralized finance protocols." }
      ],
      closing: "Build trust with your users through flawless, secure financial infrastructure."
    }
  ]
};

const parentData = {
  about: {
    title: "About YashOrbit",
    description: "Discover our mission, our values, and the talented team that drives our innovation. We are committed to delivering world-class technology solutions.",
    icon: "Users",
    image: "https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=1400&auto=format&fit=crop"
  },
  services: {
    title: "Our Services",
    description: "From custom web and mobile applications to cutting-edge AI integrations, explore the comprehensive suite of services we offer to accelerate your digital growth.",
    icon: "Layers",
    image: "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1400&auto=format&fit=crop"
  },
  products: {
    title: "Our Products",
    description: "Explore our proprietary software solutions and platforms designed to solve industry-specific challenges, automate workflows, and empower your workforce.",
    icon: "Box",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1400&auto=format&fit=crop"
  },
  industries: {
    title: "Industries We Serve",
    description: "We provide tailored technology solutions across a diverse range of sectors. See how our deep industry expertise translates into measurable results for your business.",
    icon: "Globe",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1400&auto=format&fit=crop"
  }
};

const escapeJSX = (str) => {
  return str.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
};

const getPageTemplate = (data, category) => `"use client";

import React from "react";
import { ${data.icon} } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import FeatureHighlights from "@/components/sections/FeatureHighlights";
import DetailCTA from "@/components/sections/DetailCTA";

export default function ${data.title.replace(/[^a-zA-Z]/g, '')}Page() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="${category}"
        categoryLabel="${category}"
        title="${escapeJSX(data.title)}"
        subtitle="${escapeJSX(data.subtitle)}"
        description="${escapeJSX(data.heroDescription)}"
        icon={${data.icon}}
        image="${data.image}"
      />

      {/* Interactive Content Layout */}
      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sticky Sidebar / Navigation */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-32 space-y-8">
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                  <h3 className="text-lg font-bold text-foreground mb-4">In this section</h3>
                  <ul className="space-y-3">
                    <li><a href="#overview" className="text-primary font-medium hover:underline">Overview</a></li>
                    <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Core Highlights</a></li>
                    <li><a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Get Started</a></li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <${data.icon} className="w-8 h-8 mb-4 opacity-80" />
                  <h3 className="text-xl font-bold mb-2">Need a custom solution?</h3>
                  <p className="text-sm text-primary-foreground/80 mb-6">Our experts are ready to build exactly what you need. Let&apos;s discuss your specific goals.</p>
                  <a href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all bg-background text-foreground px-4 py-2 rounded-full">
                    Talk to an expert
                  </a>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-16">
              <div id="overview">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
                  Why choose our ${escapeJSX(data.title)} solutions?
                </h2>
                <p className="text-lg leading-8 text-muted-foreground mb-12">
                  At YashOrbit, we don&apos;t just write code—we solve problems. Our approach to ${escapeJSX(data.title.toLowerCase())} combines deep industry knowledge with cutting-edge technology to ensure that you receive the best possible outcome for your unique requirements. We focus on scalability, security, and exceptional user experiences.
                </p>

                <FeatureHighlights
                  title="Core Highlights"
                  features={[
                    ${data.features.map(f => `{ name: ${JSON.stringify(f.name)}, desc: ${JSON.stringify(f.desc)} },`).join('\n                    ')}
                  ]}
                />
              </div>

              <div className="p-8 sm:p-10 rounded-3xl bg-muted/20 border border-border/50">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
                  The YashOrbit Advantage
                </h2>
                <p className="text-lg leading-8 text-muted-foreground">
                  ${escapeJSX(data.closing)} By leveraging the latest advancements in technology, our strategies ensure that your infrastructure is modern, fast, and completely reliable. We partner with you for the long haul.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DetailCTA
        heading="Ready to explore ${escapeJSX(data.title)}?"
        description="Join hundreds of forward-thinking companies building the future with YashOrbit."
      />
    </div>
  );
}
`;

const getParentPageTemplate = (category) => `"use client";

import React from "react";
import { ${[...new Set([parentData[category].icon, ...pageData[category].map(i => i.icon)])].join(', ')} } from "lucide-react";
import ListingHero from "@/components/sections/ListingHero";
import ListingCard from "@/components/sections/ListingCard";
import DetailCTA from "@/components/sections/DetailCTA";

const items = [
  ${pageData[category].map(item => `{ title: ${JSON.stringify(item.title)}, subtitle: ${JSON.stringify(item.subtitle)}, description: ${JSON.stringify(item.heroDescription)}, href: "/${category}/${item.slug}", icon: ${item.icon}, image: "${item.image}" },`).join('\n  ')}
];

export default function ${category.charAt(0).toUpperCase() + category.slice(1)}Page() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 overflow-hidden">
      <ListingHero
        eyebrow="${category} portfolio"
        title="${escapeJSX(parentData[category].title)}"
        description="${escapeJSX(parentData[category].description)}"
        icon={${parentData[category].icon}}
        image="${parentData[category].image}"
      />

      {/* Modern Listing Grid */}
      <section className="py-24 sm:py-32 bg-background relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl pointer-events-none opacity-50"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {items.map((item, i) => (
              <ListingCard key={item.href} index={i} icon={item.icon} title={item.title} subtitle={item.subtitle} description={item.description} href={item.href} image={item.image} />
            ))}
          </div>
        </div>
      </section>

      <DetailCTA
        heading="Didn't find what you're looking for?"
        description="We specialize in custom enterprise solutions. Contact our technical team to discuss your specific requirements."
      />
    </div>
  );
}
`;

const baseDir = path.join(__dirname, 'src', 'app');

Object.keys(pageData).forEach(category => {
  const categoryPath = path.join(baseDir, category);

  if (!fs.existsSync(categoryPath)) {
    fs.mkdirSync(categoryPath, { recursive: true });
  }

  // Create parent page
  fs.writeFileSync(path.join(categoryPath, 'page.tsx'), getParentPageTemplate(category));

  // Create subpages
  pageData[category].forEach(page => {
    const pagePath = path.join(categoryPath, page.slug);
    if (!fs.existsSync(pagePath)) {
      fs.mkdirSync(pagePath, { recursive: true });
    }
    fs.writeFileSync(path.join(pagePath, 'page.tsx'), getPageTemplate(page, category));
  });
});

console.log("Pages regenerated with UNIQUE content successfully!");
