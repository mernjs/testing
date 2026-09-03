import { siteUrl } from "@/lib/seo";
import type { Job } from "@/app/(site)/careers/jobs-data";
import { perks } from "@/app/(site)/careers/jobs-data";

/**
 * Maps human-readable employment types to Google for Jobs / Schema.org enum values.
 */
function mapEmploymentType(type: string): string[] {
  const normalized = type.toLowerCase();
  if (normalized.includes("full")) return ["FULL_TIME"];
  if (normalized.includes("part")) return ["PART_TIME"];
  if (normalized.includes("contract")) return ["CONTRACTOR"];
  if (normalized.includes("intern")) return ["INTERN"];
  if (normalized.includes("temp")) return ["TEMPORARY"];
  return ["FULL_TIME"];
}

/**
 * Parses experience string (e.g. "1–4 Years") to estimate minimum months of experience required.
 */
function parseExperienceMonths(experienceStr: string): number | null {
  const match = experienceStr.match(/(\d+)/);
  if (!match) return null;
  const years = parseInt(match[1], 10);
  return Number.isNaN(years) ? null : years * 12;
}

/**
 * Builds HTML-formatted job description matching Google for Jobs guidelines.
 */
export function buildJobDescriptionHtml(job: Job): string {
  const respHtml = job.responsibilities
    .map((item) => `<li><strong>${item.title}:</strong> ${item.description}</li>`)
    .join("");

  const qualHtml = job.qualifications
    .map((item) => `<li><strong>${item.title}:</strong> ${item.description}</li>`)
    .join("");

  const niceHtml = job.niceToHave
    .map((item) => `<li>${item}</li>`)
    .join("");

  const skillsHtml = job.skills
    .map((skill) => `<li>${skill}</li>`)
    .join("");

  const perksHtml = perks
    .map((perk) => `<li><strong>${perk.title}:</strong> ${perk.description}</li>`)
    .join("");

  return `
    <p>${job.summary}</p>
    <h3>Role Overview</h3>
    <p>Department: ${job.category}<br/>Employment Type: ${job.employmentType}<br/>Location: ${job.location}<br/>Experience: ${job.experience}</p>
    <h3>Key Responsibilities</h3>
    <ul>${respHtml}</ul>
    <h3>Qualifications & Requirements</h3>
    <ul>${qualHtml}</ul>
    ${niceHtml ? `<h3>Nice to Have</h3><ul>${niceHtml}</ul>` : ""}
    <h3>Skills & Tools</h3>
    <ul>${skillsHtml}</ul>
    <h3>What We Offer</h3>
    <ul>${perksHtml}</ul>
  `.trim();
}

/**
 * Generates Schema.org `JobPosting` JSON-LD object for Google for Jobs.
 */
export function jobPostingJsonLd(job: Job) {
  const jobUrl = `${siteUrl}/careers/${job.slug}`;
  const isRemoteOrHybrid = job.location.toLowerCase().includes("remote") || job.location.toLowerCase().includes("hybrid") || job.isRemote;
  const expMonths = parseExperienceMonths(job.experience);

  // Base posting object
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: buildJobDescriptionHtml(job),
    datePosted: job.datePosted || "2026-01-15T09:00:00+05:30",
    employmentType: mapEmploymentType(job.employmentType),
    hiringOrganization: {
      "@type": "Organization",
      name: "YashOrbit Technologies Pvt. Ltd.",
      sameAs: siteUrl,
      logo: `${siteUrl}/brand/icon-tile-512.png`,
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
    directApply: true,
    url: jobUrl,
    skills: job.skills.join(", "),
  };

  // Optional validThrough date (if job is expired/closed or validThrough specified)
  if (job.validThrough) {
    schema.validThrough = job.validThrough;
  } else if (job.status === "closed" || job.status === "expired") {
    schema.validThrough = "2026-01-01T00:00:00+05:30"; // past date signals expired job to Google
  }

  // Telecommute / Hybrid handling
  if (isRemoteOrHybrid) {
    schema.jobLocationType = "TELECOMMUTE";
    schema.applicantLocationRequirements = {
      "@type": "Country",
      name: "IN",
    };
  }

  // Optional Experience Requirements
  if (expMonths !== null && expMonths > 0) {
    schema.experienceRequirements = {
      "@type": "OccupationalExperienceRequirements",
      monthsOfExperience: expMonths,
    };
  }

  // Optional Base Salary
  if (job.baseSalary) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.baseSalary.currency,
      value: {
        "@type": "QuantitativeValue",
        ...(job.baseSalary.value !== undefined ? { value: job.baseSalary.value } : {}),
        ...(job.baseSalary.minValue !== undefined ? { minValue: job.baseSalary.minValue } : {}),
        ...(job.baseSalary.maxValue !== undefined ? { maxValue: job.baseSalary.maxValue } : {}),
        unitText: job.baseSalary.unitText,
      },
    };
  }

  return schema;
}
