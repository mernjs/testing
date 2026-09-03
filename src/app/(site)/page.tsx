import type { Metadata } from "next";
import HomeContent from "./Content";
import { homeFaqs } from "./faqs";
import { socialMetadata, defaultOgImage, faqJsonLd } from "@/lib/seo";

const title = "YashOrbit Technologies | Official Website — Web, Mobile & AI Solutions";
const description =
  "YashOrbit (YashOrbit Technologies Pvt. Ltd.) is a software development company engineering custom web, mobile, and AI/ML systems designed around your business goals.";
const path = "/";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "YashOrbit",
    "YashOrbit Technologies",
    "YashOrbit Technologies Pvt Ltd",
    "software development company",
    "business technology solutions",
    "web app development",
    "mobile app development",
    "AI/ML solutions",
    "AI agent development",
    "custom software solutions",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image: defaultOgImage, imageAlt: "YashOrbit Technologies — Official Website" }),
};

export default function Home() {
  const jsonLd = faqJsonLd(homeFaqs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeContent />
    </>
  );
}
