import type { Metadata } from "next";
import ConversationalAiContent from "./Content";
import { siteUrl, courseJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "Conversational AI Training | YashOrbit";
const description =
  "Practical Conversational AI training covering NLU, dialogue management, and voice interfaces — design and deploy chatbots and voice assistants for real businesses.";
const path = "/industrial-training/conversational-ai";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function ConversationalAiTrainingPage() {
  const jsonLd = [
    courseJsonLd({ name: "Conversational AI Training", description, path }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Industrial Training", path: "/industrial-training" },
      { name: "Conversational AI", path },
    ]),
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
