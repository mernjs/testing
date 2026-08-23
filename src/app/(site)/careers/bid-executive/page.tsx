import type { Metadata } from "next";
import Content from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getJobBySlug } from "../jobs-data";

const job = getJobBySlug("bid-executive")!;
const title = `${job.title} — Careers | YashOrbit`;
const description = `Apply for the ${job.title} role at YashOrbit. ${job.summary}`;
const path = "/careers/bid-executive";
const image = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [job.title, "YashOrbit careers", job.category, "job openings Noida"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
    { name: job.title, path },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <Content />
    </>
  );
}
