import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobDetailContent from "@/components/sections/JobDetailContent";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { jobPostingJsonLd } from "@/lib/job-posting";
import { getJobBySlug, getAllJobSlugs } from "../jobs-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllJobSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);
  if (!job) return {};

  const isDraft = job.status === "draft";
  const title = `${job.title} — Careers | YashOrbit`;
  const description = `Apply for the ${job.title} role at YashOrbit. ${job.summary}`;
  const path = `/careers/${job.slug}`;
  const image = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";

  return {
    title,
    description,
    keywords: [job.title, "YashOrbit careers", job.category, "job openings Noida"],
    alternates: { canonical: path },
    ...(isDraft ? { robots: { index: false, follow: false } } : {}),
    ...socialMetadata({ title, description, path, image }),
  };
}

export default async function DynamicJobPage({ params }: PageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const isDraft = job.status === "draft";
  const path = `/careers/${job.slug}`;

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
    { name: job.title, path },
  ]);

  const jobPosting = isDraft ? null : jobPostingJsonLd(job);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      {jobPosting && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting) }} />
      )}
      <JobDetailContent job={job} />
    </>
  );
}
