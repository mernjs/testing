import type { Metadata } from "next";
import ConversationalAiContent from "./Content";
import { conversationalAiFaqs } from "./faqs";
import { socialMetadata, courseJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Conversational AI Training | YashOrbit";
const description =
  "Practical Conversational AI training covering NLU, dialogue management, and voice interfaces — design and deploy chatbots and voice assistants for real businesses.";
const path = "/industrial-training/conversational-ai";

const image = "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Conversational AI Training", "NLU", "Dialogue Mgmt", "Voice", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function ConversationalAiTrainingPage() {
  const jsonLd = [
    courseJsonLd({
      name: "Conversational AI Training",
      description,
      path,
      duration: "P6W",
      credential: "Conversational AI Industrial Training Certificate of Completion",
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Training", path: "/industrial-training" },
      { name: "Conversational AI", path },
    ]),
    faqJsonLd(conversationalAiFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <ConversationalAiContent />
    </>
  );
}
