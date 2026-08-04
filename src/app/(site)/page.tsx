import type { Metadata } from "next";
import HomeContent from "./Content";
import { socialMetadata, defaultOgImage } from "@/lib/seo";

const title = "YashOrbit — Tech Solutions Built Around Your Business";
const description =
  "YashOrbit builds tech solutions designed around your business goals — web, mobile, and AI/ML systems engineered to cut costs, accelerate growth, and give your team a lasting competitive edge.";
const path = "/";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "YashOrbit",
    "software development company",
    "business technology solutions",
    "web app development",
    "mobile app development",
    "AI/ML solutions",
    "AI agent development",
    "custom software solutions",
    "digital transformation",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image: defaultOgImage, imageAlt: "YashOrbit — Tech Solutions Built Around Your Business" }),
};

export default function Home() {
  return <HomeContent />;
}
