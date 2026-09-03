import type { Metadata } from "next";
import AgenticAiInternshipContent from "./Content";
import { agenticAiInternshipFaqs } from "./faqs";
import { socialMetadata, courseJsonLd, internshipJobPostingJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Agentic AI Internship | YashOrbit";
const description =
  "A paid, 8–12 week Agentic AI internship — design and build goal-driven, tool-using AI agents for real automation problems, under a dedicated mentor.";
const path = "/internship-program/agentic-ai";

const image = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Agentic AI Internship", "Paid Internship", "AI Agents Internship", "Automation Internship", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function AgenticAiInternshipPage() {
  const jsonLd = [
    internshipJobPostingJsonLd({
      title: "Agentic AI Developer Intern",
      description,
      path,
      skills: ["Python", "LangGraph", "AutoGen", "Function Calling", "Vector DBs"],
      responsibilities: [
        "Develop custom tools and function-calling modules for AI agents.",
        "Build multi-agent graph workflows using LangGraph / AutoGen.",
        "Test agent decision-making loops and memory persistence.",
        "Document agent architectures and API interfaces.",
      ],
    }),
    courseJsonLd({ name: "Agentic AI Internship", description, path, duration: "P12W", credential: "Agentic AI Internship Certificate" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Internship Program", path: "/internship-program" },
      { name: "Agentic AI", path },
    ]),
    faqJsonLd(agenticAiInternshipFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <AgenticAiInternshipContent />
    </>
  );
}
