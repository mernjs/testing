import type { Metadata } from "next";
import ConversationalAiInternshipContent from "./Content";
import { conversationalAiInternshipFaqs } from "./faqs";
import { socialMetadata, courseJsonLd, internshipJobPostingJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Conversational AI Internship | YashOrbit";
const description =
  "A paid, 8–12 week Conversational AI internship — design and deploy real chatbot and voice assistant experiences for actual business use cases, under a dedicated mentor.";
const path = "/internship-program/conversational-ai";

const image = "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Conversational AI Internship", "Paid Internship", "Chatbot Internship", "Voice AI Internship", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function ConversationalAiInternshipPage() {
  const jsonLd = [
    internshipJobPostingJsonLd({
      title: "Conversational AI Intern",
      description,
      path,
      skills: ["Python", "NLP", "Dialogflow / Rasa", "WhatsApp API", "REST APIs"],
      responsibilities: [
        "Design conversation flows, intent recognition, and entity extraction.",
        "Integrate chatbots with WhatsApp, Web, and backend services.",
        "Analyze conversation logs to improve intent matching accuracy.",
        "Test voice AI integrations and speech-to-text pipelines.",
      ],
    }),
    courseJsonLd({ name: "Conversational AI Internship", description, path, duration: "P12W", credential: "Conversational AI Internship Certificate" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Internship Program", path: "/internship-program" },
      { name: "Conversational AI", path },
    ]),
    faqJsonLd(conversationalAiInternshipFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ConversationalAiInternshipContent />
    </>
  );
}
