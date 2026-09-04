import type { ReactNode } from "react";
import { brandify } from "./brand";

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: ReactNode;
  rating: number;
  initials: string;
  color: string;
}

export const clientTestimonialsData: Testimonial[] = [
  {
    name: "Ariana Cole",
    role: "CTO",
    company: "Nexora Health",
    quote: brandify("YashOrbit didn't just build what we asked for — they challenged our assumptions and shipped a platform that scaled to 10x our users without a single outage."),
    rating: 5,
    initials: "AC",
    color: "from-primary to-[#ff8e75]",
  },
  {
    name: "Marcus Webb",
    role: "Founder",
    company: "Bloomly",
    quote: "The team moved faster than any agency we'd worked with before. Our MVP went from whiteboard to production in under eight weeks, fully polished.",
    rating: 5,
    initials: "MW",
    color: "from-secondary to-primary",
  },
  {
    name: "Priya Nandan",
    role: "VP Engineering",
    company: "Vertex Logistics",
    quote: "Their AI integration work is genuinely elite. What used to take our ops team hours of manual triage now happens automatically, in seconds.",
    rating: 5,
    initials: "PN",
    color: "from-[#ff8e75] to-secondary",
  },
  {
    name: "Daniel Osei",
    role: "Head of Product",
    company: "Arclight Finance",
    quote: brandify("Security and compliance were non-negotiable for us. YashOrbit understood that from day one and it shows in every layer of the architecture."),
    rating: 5,
    initials: "DO",
    color: "from-primary to-secondary",
  },
  {
    name: "Lena Fischer",
    role: "COO",
    company: "Wavecrest Media",
    quote: "Communication was the best part — clear timelines, honest tradeoffs, zero surprises. We always knew exactly where the project stood.",
    rating: 5,
    initials: "LF",
    color: "from-secondary to-[#ff8e75]",
  },
];
