import type { Metadata } from "next";
import AIVoiceAssistantContent from "./Content";
import { siteUrl, softwareApplicationJsonLd, breadcrumbJsonLd } from "@/lib/seo";

const title = "AI Voice Assistant — Human-Like Voice AI for Sports Fans | YashOrbit";
const description =
  "AI Voice Assistant is a sports-focused hybrid app that lets fans talk to a human-like AI agent over a live voice call for scores, standings, and updates.";
const path = "/products/ai-voice-assistant";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    siteName: "YashOrbit",
    images: ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop"],
    type: "website",
  },
};

export default function AIVoiceAssistantPage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "AI Voice Assistant", description, path, category: "BusinessApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Products", path: "/products" },
      { name: "AI Voice Assistant", path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <AIVoiceAssistantContent />
    </>
  );
}
