"use client";

import { Users2, Calendar, HeartHandshake, GraduationCap, TrendingUp } from "lucide-react";
import ExecutiveProfile from "@/components/sections/ExecutiveProfile";
import { brandify } from "@/lib/brand";

// Temporary placeholder photo — swap for Pooja's actual headshot when available.
const PHOTO = "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1200&auto=format&fit=crop";

export default function ChroContent() {
  return (
    <ExecutiveProfile
      name="Pooja Singh"
      role="Chief Human Resources Officer"
      tagline={brandify("Chief Human Resources Officer, YashOrbit")}
      heroDescription={brandify("Building the culture and people practices behind YashOrbit's growth — hiring, career development, and the environment that lets senior talent do their best work here.")}
      heroIcon={Users2}
      photo={PHOTO}
      bioParagraphs={[
        "Pooja spent years in human resources leadership roles at technology and professional services companies, focused on building hiring pipelines for senior technical talent and designing employee experience programs that hold up as companies scale quickly.",
        brandify("She joined YashOrbit as Chief Human Resources Officer, where she owns talent acquisition, culture, learning and development, and the people policies that shape day-to-day life at the company."),
      ]}
      bioStats={[
        { label: "Years in HR Leadership", value: "10+", icon: Calendar },
        { label: "Hiring Pipelines Built", value: "6+", icon: TrendingUp },
        { label: "Background", value: "Talent Acquisition → CHRO", icon: GraduationCap },
        { label: "Focus", value: "Culture & People Development", icon: HeartHandshake },
      ]}
      overviewTitle="Leadership overview"
      overviewDescription="How Pooja approaches building the company's people function."
      overviewItems={[
        { title: "Hire for Judgment, Design the Process to Find It", description: "\"Technical skill shows up on a resume. Judgment only shows up if your interview process is designed to surface it.\"" },
        { title: "Culture Is What You Reward, Not What You Post", description: "\"A values statement means nothing if the people who get promoted don't actually reflect it.\"" },
        { title: "Onboarding Sets the Tone for Everything After", description: "\"How someone's first two weeks go predicts a lot about whether they'll still be here in two years.\"" },
        { title: "Retention Starts With Honest Career Conversations", description: "\"Most people don't leave over money first — they leave because no one talked to them honestly about where they were headed.\"" },
      ]}
      expertiseItems={[
        { title: "Technical Talent Acquisition", description: "Building hiring pipelines and interview processes for senior engineering, AI, and design roles." },
        { title: "Culture & Employee Experience", description: "Designing the policies and practices that shape day-to-day working life as the company scales." },
        { title: "Learning & Career Development", description: "Building structured growth paths and learning programs for technical and non-technical roles alike." },
        { title: "HR Policy & Compliance", description: "Maintaining people policies and employment compliance across a distributed, remote-first team." },
      ]}
      responsibilityItems={[
        { title: "Talent Acquisition", description: "Owns hiring strategy and pipeline design across engineering, AI, design, and business roles." },
        { title: "Culture & Employee Experience", description: "Shapes the policies, rituals, and practices that define day-to-day life at the company." },
        { title: "Learning & Development", description: "Builds career growth paths and learning programs for every function at the company." },
        { title: "HR Policy & Compliance", description: "Maintains employment policy and compliance as the team grows and diversifies." },
      ]}
      achievementsDescription={brandify("A few of the milestones Pooja has led at YashOrbit.")}
      achievements={[
        { title: brandify("Built YashOrbit's Technical Hiring Pipeline"), description: "Designed the interview and evaluation process now used to hire across engineering, AI, and design roles.", skills: ["Talent Acquisition", "Process Design"] },
        { title: "Launched Structured Career Development Paths", description: "Introduced defined growth tracks and regular career conversations across technical and non-technical teams.", skills: ["Career Development", "People Programs"] },
        { title: "Designed a Remote-first Culture Playbook", description: "Built the onboarding, communication, and team-ritual practices that keep a distributed team connected.", skills: ["Culture Design", "Remote Operations"] },
      ]}
      visionStatement={brandify("I want YashOrbit to be a place senior people choose to stay, not just a place they can get hired. That means hiring processes that actually find good judgment, career paths that are honest about what growth looks like, and a culture where the values we talk about are the same ones that get rewarded in practice.")}
      visionQuote="The best hiring process in the world doesn't matter if people don't want to stay once they're here. I spend as much time on retention and growth as I do on recruiting — they're the same job, really."
      ctaHeading="Interested in joining our team?"
      ctaDescription="For questions about open roles or our hiring process, we're glad to bring Pooja directly into the conversation."
    />
  );
}
