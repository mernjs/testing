import type { Metadata } from "next";
import { socialMetadata, defaultOgImage } from "@/lib/seo";
import AskContent from "./Content";

export const metadata: Metadata = {
  title: "Ask YashOrbit Chatbot — AI Assistant",
  description:
    "Ask the YashOrbit AI Assistant anything about our services, products, industries, training programs, and how we work. Answers are grounded in our knowledge base.",
  alternates: { canonical: "/ask" },
  // Thin, app-shell page — keep it out of the index but let crawlers follow links.
  robots: { index: false, follow: true },
  ...socialMetadata({
    title: "Ask YashOrbit Chatbot",
    description: "Chat with the YashOrbit AI Assistant about our services, products, and training.",
    path: "/ask",
    image: defaultOgImage,
  }),
};

export default function AskPage() {
  return <AskContent />;
}
