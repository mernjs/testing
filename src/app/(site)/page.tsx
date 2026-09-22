import type { Metadata } from "next";
import HomeContent from "./Content";
import { homeFaqs } from "./faqs";
import { socialMetadata, defaultOgImage, faqJsonLd } from "@/lib/seo";

const title = "YashOrbit — Tech Solutions Built Around Your Business";
const description =
  "YashOrbit is a software development company engineering custom web, mobile, desktop, AI/ML & AI automation systems — designed around your business goals.";
const path = "/";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "YashOrbit",
    "YashOrbit Technologies",
    "YashOrbit Technologies Pvt Ltd",
    "software development company",
    "custom software development",
    "web app development company",
    "mobile app development company",
    "desktop app development",
    "AI/ML software development",
    "AI automation solutions",
    "AI agent development",
    "enterprise software development",
    "MVP development company",
  ],
  alternates: { canonical: path },
  ...socialMetadata({
    title,
    description,
    path,
    image: defaultOgImage,
    imageAlt: "YashOrbit — Custom Software & AI/ML, Built Around Your Business",
  }),
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
