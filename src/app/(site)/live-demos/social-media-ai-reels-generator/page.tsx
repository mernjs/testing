import type { Metadata } from "next";
import SocialMediaAiReelsGeneratorContent from "./Content";
import { socialMediaAiReelsGeneratorFaqs } from "./faqs";
import { socialMetadata, softwareApplicationJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "Social Media AI Reels Generator — Live Demo | YashOrbit";
const description =
  "Social Media AI Reels Generator turns a single photo into a voice-narrated, platform-ready short-form video for Instagram Reels, YouTube Shorts, and TikTok — using your real voice or an AI-generated one. Try the live demo now.";
const path = "/live-demos/social-media-ai-reels-generator";

const image = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["Social Media AI Reels Generator", "AI Video Generation", "Voice Cloning", "Image to Video AI", "Live Demo", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function SocialMediaAiReelsGeneratorPage() {
  const jsonLd = [
    softwareApplicationJsonLd({ name: "Social Media AI Reels Generator", description, path, category: "MultimediaApplication" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Live Demos", path: "/live-demos" },
      { name: "Social Media AI Reels Generator", path },
    ]),
    faqJsonLd(socialMediaAiReelsGeneratorFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SocialMediaAiReelsGeneratorContent />
    </>
  );
}
