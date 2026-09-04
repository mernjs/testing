import type { Metadata } from "next";
import ContactContent from "./Content";
import { socialMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { getSubServices, isValidCategory, type CategorySlug } from "@/lib/categories";

const title = "Contact Us — Start Your Project | YashOrbit";
const description =
  "Get in touch with YashOrbit for a free consultation. Email, call, or send us a project brief and our technical team will respond within 24 hours.";
const path = "/contact";
const image = "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "contact YashOrbit",
    "software development consultation",
    "hire software developers",
    "get a quote",
    "project inquiry",
  ],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; subService?: string }>;
}) {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path },
  ]);

  const { category, subService } = await searchParams;
  const initialCategory: CategorySlug | undefined = category && isValidCategory(category) ? category : undefined;
  const initialSubService: string | undefined =
    initialCategory && subService && getSubServices(initialCategory).some((s) => s.slug === subService)
      ? subService
      : undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <ContactContent initialCategory={initialCategory} initialSubService={initialSubService} />
    </>
  );
}
