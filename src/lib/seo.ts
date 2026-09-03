export const siteUrl = "https://yashorbit.com";
export const siteName = "YashOrbit";

// 512x512 brand tile — used as the sitewide fallback social preview image
// for routes that don't set their own page-specific image.
export const defaultOgImage = `${siteUrl}/brand/social-avatar.png`;

export const organizationInfo = {
  name: "YashOrbit Technologies Pvt. Ltd.",
  legalName: "YashOrbit Technologies Private Limited",
  url: siteUrl,
  logo: `${siteUrl}/brand/icon-tile-512.png`,
  email: "contact@yashorbit.com",
  telephone: "+91 93159 47683",
  address: {
    streetAddress: "Sector 62",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201309",
    addressCountry: "IN",
  },
};

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organizationInfo.name,
    legalName: organizationInfo.legalName,
    url: organizationInfo.url,
    logo: organizationInfo.logo,
    email: organizationInfo.email,
    telephone: organizationInfo.telephone,
    address: {
      "@type": "PostalAddress",
      ...organizationInfo.address,
    },
    sameAs: [siteUrl],
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ITService",
    name: organizationInfo.name,
    image: organizationInfo.logo,
    "@id": `${siteUrl}/#localbusiness`,
    url: siteUrl,
    telephone: organizationInfo.telephone,
    email: organizationInfo.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      ...organizationInfo.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.6273,
      longitude: 77.3725,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:30",
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    publisher: {
      "@type": "Organization",
      name: organizationInfo.name,
      url: organizationInfo.url,
    },
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
  duration?: string;
  credential?: string;
}

export function courseJsonLd({
  name,
  description,
  path,
  mode = ["Online", "Offline"],
  duration = "P6W",
  credential = "Industrial Training Certificate of Completion",
}: CourseJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url: `${siteUrl}${path}`,
    educationalCredentialAwarded: credential,
    provider: {
      "@type": "Organization",
      name: organizationInfo.name,
      sameAs: organizationInfo.url,
      logo: organizationInfo.logo,
    },
    hasCourseInstance: mode.map((courseMode) => ({
      "@type": "CourseInstance",
      courseMode,
      courseWorkload: duration,
      location: {
        "@type": "Place",
        name: "YashOrbit Noida Campus",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Sector 62",
          addressLocality: "Noida",
          addressRegion: "Uttar Pradesh",
          postalCode: "201309",
          addressCountry: "IN",
        },
      },
    })),
  };
}

interface InternshipJsonLdInput {
  title: string;
  description: string;
  path: string;
  datePosted?: string;
  skills?: string[];
  responsibilities?: string[];
}

export function internshipJobPostingJsonLd({
  title,
  description,
  path,
  datePosted = "2026-01-15T09:00:00+05:30",
  skills = [],
  responsibilities = [],
}: InternshipJsonLdInput) {
  const respList = responsibilities.map((r) => `<li>${r}</li>`).join("");
  const skillsList = skills.map((s) => `<li>${s}</li>`).join("");

  const fullDescriptionHtml = `
    <p>${description}</p>
    ${respList ? `<h3>Key Internship Responsibilities</h3><ul>${respList}</ul>` : ""}
    ${skillsList ? `<h3>Skills & Technologies</h3><ul>${skillsList}</ul>` : ""}
  `.trim();

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description: fullDescriptionHtml,
    datePosted,
    employmentType: ["INTERN"],
    hiringOrganization: {
      "@type": "Organization",
      name: organizationInfo.name,
      sameAs: organizationInfo.url,
      logo: organizationInfo.logo,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Sector 62",
        addressLocality: "Noida",
        addressRegion: "Uttar Pradesh",
        postalCode: "201309",
        addressCountry: "IN",
      },
    },
    jobLocationType: "TELECOMMUTE",
    applicantLocationRequirements: {
      "@type": "Country",
      name: "IN",
    },
    directApply: true,
    url: `${siteUrl}${path}`,
    ...(skills.length > 0 ? { skills: skills.join(", ") } : {}),
    experienceRequirements: {
      "@type": "OccupationalExperienceRequirements",
      monthsOfExperience: 0,
    },
  };
}

interface ServiceJsonLdInput {
  name: string;
  description: string;
  path: string;
  category?: string;
}

export function serviceJsonLd({ name, description, path, category = "IT & Software Services" }: ServiceJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    category,
    url: `${siteUrl}${path}`,
    provider: {
      "@type": "Organization",
      name: organizationInfo.name,
      sameAs: organizationInfo.url,
      logo: organizationInfo.logo,
    },
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
    termsOfService: `${siteUrl}/about/terms-and-conditions`,
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
  imageAlt?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  keywords?: string[];
  articleSection?: string;
}

export function articleJsonLd({
  title,
  description,
  path,
  image,
  imageAlt,
  datePublished,
  dateModified,
  author = siteName,
  keywords = [],
  articleSection,
}: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: imageAlt
      ? {
          "@type": "ImageObject",
          url: image,
          description: imageAlt,
        }
      : image,
    url: `${siteUrl}${path}`,
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: "en-IN",
    ...(articleSection ? { articleSection } : {}),
    ...(keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
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
