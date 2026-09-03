import type { Metadata } from "next";
import MernInternshipContent from "./Content";
import { mernInternshipFaqs } from "./faqs";
import { socialMetadata, courseJsonLd, internshipJobPostingJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

const title = "MERN Stack Internship | YashOrbit";
const description =
  "A paid, 8–12 week MERN Stack internship — work inside a live MongoDB, Express, React, and Node.js codebase on real feature tickets, under a dedicated mentor.";
const path = "/internship-program/mern-stack";

const image = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1200&auto=format&fit=crop";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["MERN Stack Internship", "Paid Internship", "React Internship", "Node.js Internship", "YashOrbit"],
  alternates: { canonical: path },
  ...socialMetadata({ title, description, path, image }),
};

export default function MernInternshipPage() {
  const jsonLd = [
    internshipJobPostingJsonLd({
      title: "MERN Stack Developer Intern",
      description,
      path,
      skills: ["MongoDB", "Express", "React", "Node.js", "JavaScript", "Git"],
      responsibilities: [
        "Develop responsive UI components in React and Tailwind CSS.",
        "Build RESTful API endpoints with Node.js and Express.",
        "Write unit tests and debug full-stack feature tickets.",
        "Participate in daily standups and code reviews with senior engineers.",
      ],
    }),
    courseJsonLd({ name: "MERN Stack Internship", description, path, duration: "P12W", credential: "MERN Stack Internship Certificate" }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Internship Program", path: "/internship-program" },
      { name: "MERN Stack", path },
    ]),
    faqJsonLd(mernInternshipFaqs),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <MernInternshipContent />
    </>
  );
}
