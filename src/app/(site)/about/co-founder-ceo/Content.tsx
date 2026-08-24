"use client";

import { Compass, Calendar, Rocket, Users2, TrendingUp } from "lucide-react";
import ExecutiveProfile from "@/components/sections/ExecutiveProfile";
import { brandify } from "@/lib/brand";

// Temporary placeholder photo — swap for [NAME_OF_CEO]'s actual headshot when available.
const PHOTO = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1200&auto=format&fit=crop";

export default function CoFounderCeoContent() {
  return (
    <ExecutiveProfile
      name="[NAME_OF_CEO]"
      role="Co-Founder & CEO"
      tagline={brandify("Co-Founder & CEO, YashOrbit")}
      heroDescription={brandify("Setting the direction for YashOrbit — company strategy, culture, and the long-term bets that decide what this business becomes.")}
      heroIcon={Compass}
      photo={PHOTO}
      bioParagraphs={[
        "[NAME_OF_CEO] trained and qualified as a Chartered Accountant early in her career, spending several years in corporate finance and audit before moving into broader business leadership roles. That financial grounding shaped how she thinks about company-building: growth that has to hold up under scrutiny, not just look good on a pitch deck.",
        brandify("She co-founded YashOrbit in 2026 as CEO, setting the company's direction across strategy, culture, and long-term investment — while staying closely involved in major client relationships and every key hiring decision on the leadership team."),
      ]}
      bioStats={[
        { label: "Years in Leadership", value: "12+", icon: Calendar },
        { label: "Companies Co-Founded", value: "1", icon: Rocket },
        { label: "Leadership Team Built", value: "5", icon: Users2 },
        { label: "Focus", value: "Strategy & Growth", icon: TrendingUp },
      ]}
      overviewTitle="Leadership overview"
      overviewDescription="How [NAME_OF_CEO] approaches leading the company."
      overviewItems={[
        { title: "Decide Slow on Strategy, Move Fast on Execution", description: "\"I'll take the time to get a strategic call right, but once it's made, I want the team moving on it within days, not months.\"" },
        { title: "Build a Leadership Team You Don't Have to Manage Closely", description: "\"My job is to hire people I trust to run their function, then stay close enough to help, not close enough to slow them down.\"" },
        { title: "Numbers Discipline, Applied Company-wide", description: "\"My finance background means I ask for evidence, not just conviction, before we commit to a big bet.\"" },
        { title: "Be the Person Clients Can Escalate To", description: "\"On our most important relationships, I want clients to know they can reach me directly if something needs my attention.\"" },
      ]}
      expertiseItems={[
        { title: "Company Strategy & Growth Planning", description: "Setting the long-term direction across service lines, products, and training, and deciding where to invest next." },
        { title: "Executive Leadership & Org Design", description: "Building and aligning a leadership team across operations, finance, technology, and people functions." },
        { title: "Key Client & Partner Relationships", description: "Personally involved in the company's most strategic client and partnership conversations." },
        { title: "Financial Governance", description: "A Chartered Accountant background that keeps growth decisions grounded in real unit economics, not just ambition." },
      ]}
      responsibilityItems={[
        { title: "Overall Company Strategy", description: "Owns YashOrbit's long-term direction and the major decisions that shape where the company invests next." },
        { title: "Leadership Team Alignment", description: "Coordinates the COO, CFO, CTO, and CHRO to keep strategy, delivery, finance, and people functions moving together." },
        { title: "Strategic Client & Partner Relationships", description: "Leads or personally supports conversations with the company's most significant clients and partners." },
        { title: "Culture & Long-term Vision", description: "Sets and protects the operating principles and culture the company is built on as it scales." },
      ]}
      achievementsDescription={brandify("A few of the milestones [NAME_OF_CEO] has led YashOrbit through.")}
      achievements={[
        { title: brandify("Built YashOrbit's Founding Leadership Team"), description: "Recruited and aligned a five-person leadership team spanning operations, finance, technology, and people.", skills: ["Executive Hiring", "Org Design"] },
        { title: "Set the Company's Multi-line Strategy", description: "Directed the decision to build services, products, and training as three complementary, mutually reinforcing revenue lines.", skills: ["Strategy", "Business Planning"] },
        { title: "Established Financially Disciplined Growth", description: "Set the expectation that every new investment or hire is justified against real unit economics before it's approved.", skills: ["Financial Governance", "Strategic Planning"] },
      ]}
      visionStatement={brandify("I want YashOrbit to be the company a client trusts with their most important technical problem, not because we're the biggest name available, but because every leader here is personally accountable for the outcome. That means staying disciplined about what we take on, investing in the team before we need to, and never letting growth outrun our ability to deliver on what we've promised.")}
      visionQuote="Every commitment we make as a company is one I consider mine personally. That's the standard I hold the whole leadership team to, and it's the reason clients can trust what we tell them."
      ctaHeading="Want to talk with our leadership team?"
      ctaDescription="For complex or high-stakes engagements, we're glad to bring [NAME_OF_CEO] directly into the conversation."
    />
  );
}
