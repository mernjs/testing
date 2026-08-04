import type { Metadata } from "next";
import HomeContent from "./Content";
import { socialMetadata, defaultOgImage } from "@/lib/seo";

const title = "YashOrbit — Empowering Businesses via Next-Gen Tech Solutions";
const description =
  "YashOrbit partners with growing businesses to design, build, and scale web, mobile, and AI/ML software — from full-stack products to production-grade AI systems.";
const path = "/";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "YashOrbit",
    "software development company",
    "web app development",
    "mobile app development",
    "AI/ML solutions",
    "AI agent development",
    "custom software solutions",
    "digital transformation",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image: defaultOgImage, imageAlt: "YashOrbit — Next-Gen Tech Solutions" }),
};

export default function Home() {
  return <HomeContent />;
}
