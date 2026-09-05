import type { Metadata } from "next";
import CareerApplyContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getOpenJobPositions } from "@/lib/career-applications";

const title = "Apply Now — Careers | YashOrbit";
const description = "Apply to an open role at YashOrbit Technologies, or send us a general application. Upload your resume and we'll get back to you.";
const path = "/careers/apply";
const image = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default async function CareerApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ position?: string }>;
}) {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
    { name: "Apply", path },
  ]);

  const { position } = await searchParams;
  const positions = await getOpenJobPositions();
  const initialPositionSlug = position && positions.some((p) => p.slug === position) ? position : undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <CareerApplyContent positions={positions} initialPositionSlug={initialPositionSlug} />
    </>
  );
}
