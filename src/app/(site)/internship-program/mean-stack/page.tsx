import type { Metadata } from "next";
import MeanInternshipContent from "./Content";
import { meanInternshipFaqs } from "./faqs";
import { socialMetadata, courseJsonLd, internshipJobPostingJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "MEAN Stack Internship | YashOrbit";
const description =
  "A paid, 8–12 week MEAN Stack internship — work inside a live MongoDB, Express, Angular, and Node.js codebase on real feature tickets, under a dedicated mentor.";
const path = "/internship-program/mean-stack";

const image = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["MEAN Stack Internship", "Paid Internship", "Angular Internship", "Node.js Internship", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function MeanInternshipPage() {
  const jsonLd = [
    internshipJobPostingJsonLd({
      title: "MEAN Stack Developer Intern",
      description,
      path,
      skills: ["MongoDB", "Express", "Angular", "Node.js", "TypeScript", "Git"],
      responsibilities: [
        "Build dynamic Angular components and TypeScript services.",
        "Integrate backend REST APIs with Express and Node.js.",
        "Participate in database schema modeling and query optimization.",
        "Collaborate with senior developers on real client projects.",
      ],
    }),
    courseJsonLd({ name: "MEAN Stack Internship", description, path, duration: "P12W", credential: "MEAN Stack Internship Certificate" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Internship Program", path: "/internship-program" },
      { name: "MEAN Stack", path },
    ]),
    faqJsonLd(meanInternshipFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <MeanInternshipContent />
    </>
  );
}
