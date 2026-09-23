import type { Metadata } from "next";
import { withSeoOverrides } from "@/lib/seo-panel/public";
import CybersecurityContent from "./Content";
import { socialMetadata, breadcrumbJsonLd, articleJsonLd } from "@/lib/seo";
import { getBlogPost } from "@/lib/blog";

const post = getBlogPost("cybersecurity-in-custom-software-development")!;
const path = `/blog/${post.slug}`;

const baseMetadata: Metadata = {
  title: post.seoTitle,
  description: post.description,
  keywords: post.keywords,
  alternates: { canonical: path },
  ...socialMetadata({ title: post.seoTitle, description: post.description, path, image: post.image, imageAlt: post.imageAlt }),
};

export const generateMetadata = () => withSeoOverrides("/blog/cybersecurity-in-custom-software-development", baseMetadata);

export default function Page() {
  const jsonLd = [
    articleJsonLd({ title: post.title, description: post.description, path, image: post.image, imageAlt: post.imageAlt, datePublished: post.date, author: post.author, keywords: post.keywords, articleSection: post.category }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <CybersecurityContent />
    </>
  );
}
