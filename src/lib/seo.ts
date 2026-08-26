export const siteUrl = "https://yashorbit.com";
export const siteName = "YashOrbit";

// 512x512 brand tile — used as the sitewide fallback social preview image
// for routes that don't set their own page-specific image.
export const defaultOgImage = `${siteUrl}/brand/social-avatar.png`;

export const organizationInfo = {
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/brand/icon-tile-512.png`,
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organizationInfo.name,
    url: organizationInfo.url,
    logo: organizationInfo.logo,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
  };
}

interface SocialMetadataInput {
  title: string;
  description: string;
  path: string;
  image: string;
  imageAlt?: string;
}

/**
 * Builds matching openGraph + twitter metadata fields for a page. `image` may
 * be an absolute URL (e.g. Unsplash) or a site-relative path (resolved via
 * metadataBase).
 */
export function socialMetadata({ title, description, path, image, imageAlt }: SocialMetadataInput) {
  return {
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      siteName,
      images: [{ url: image, alt: imageAlt ?? title }],
      type: "website" as const,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [image],
    },
  };
}

interface CourseJsonLdInput {
  name: string;
  description: string;
  path: string;
  mode?: string[];
}

export function courseJsonLd({ name, description, path, mode = ["Online", "Offline"] }: CourseJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url: `${siteUrl}${path}`,
    provider: {
      "@type": "Organization",
      name: organizationInfo.name,
      sameAs: organizationInfo.url,
    },
    hasCourseInstance: mode.map((courseMode) => ({
      "@type": "CourseInstance",
      courseMode,
    })),
  };
}

interface ServiceJsonLdInput {
  name: string;
  description: string;
  path: string;
}

export function serviceJsonLd({ name, description, path }: ServiceJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url: `${siteUrl}${path}`,
    provider: {
      "@type": "Organization",
      name: organizationInfo.name,
      sameAs: organizationInfo.url,
    },
  };
}

interface SoftwareApplicationJsonLdInput {
  name: string;
  description: string;
  path: string;
  category?: string;
}

export function softwareApplicationJsonLd({ name, description, path, category = "BusinessApplication" }: SoftwareApplicationJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `${siteUrl}${path}`,
    applicationCategory: category,
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
    },
    publisher: {
      "@type": "Organization",
      name: organizationInfo.name,
      sameAs: organizationInfo.url,
    },
  };
}

interface FaqJsonLdInput {
  question: string;
  answer: string;
}

export function faqJsonLd(faqs: FaqJsonLdInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

interface PersonJsonLdInput {
  name: string;
  jobTitle: string;
  path: string;
  description?: string;
}

export function personJsonLd({ name, jobTitle, path, description }: PersonJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    url: `${siteUrl}${path}`,
    ...(description ? { description } : {}),
    worksFor: {
      "@type": "Organization",
      name: organizationInfo.name,
      url: organizationInfo.url,
    },
  };
}

interface ArticleJsonLdInput {
  title: string;
  description: string;
  path: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}

export function articleJsonLd({ title, description, path, image, datePublished, dateModified, author = siteName }: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image,
    url: `${siteUrl}${path}`,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Organization",
      name: author,
      url: organizationInfo.url,
    },
    publisher: {
      "@type": "Organization",
      name: organizationInfo.name,
      logo: {
        "@type": "ImageObject",
        url: organizationInfo.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}${path}`,
    },
  };
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
