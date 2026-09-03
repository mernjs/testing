import type { Metadata } from "next";
import ConversationalAIChatbotsContent from "./Content";
import { socialMetadata, serviceJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Conversational AI & Chatbots | YashOrbit AI & Automations";
const description =
  "Deploy LLM-powered chatbots and voice bots that understand intent, retrieve knowledge, and take real actions — 24/7 intelligent customer and employee engagement built by YashOrbit Technologies.";
const path = "/ai-automations/conversational-ai-chatbots";
const image = "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "conversational AI",
    "AI chatbot development",
    "LLM chatbot",
    "RAG chatbot",
    "customer support chatbot",
    "voice bot",
    "YashOrbit",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function ConversationalAIChatbotsPage() {
  const jsonLd = [
    serviceJsonLd({ name: "Conversational AI & Chatbots", description, path, category: "AI & Process Automation" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "AI & Automations", path: "/ai-automations" },
      { name: "Conversational AI & Chatbots", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ConversationalAIChatbotsContent />
    </>
  );
}
