import type { Metadata } from "next";
import LiveDemosContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";

const title = "Live Demos — Try Our In-House AI Projects | YashOrbit";
const description =
  "Explore YashOrbit's in-house AI projects and try them yourself, live — starting with Social Media AI Reels Generator, an image-to-video AI tool with real or AI-generated voice narration.";
const path = "/live-demos";
const image = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "YashOrbit live demos",
    "AI product demos",
    "in-house AI projects",
    "social media AI reels generator",
    "try AI demo",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function LiveDemosPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Live Demos", path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <LiveDemosContent />
    </>
  );
}
