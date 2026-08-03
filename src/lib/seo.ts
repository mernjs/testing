export const siteUrl = "https://yashorbit.com";

export const organizationInfo = {
  name: "YashOrbit",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
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
