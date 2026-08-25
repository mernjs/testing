"use client";

import { Users } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import TeamRoster from "@/components/sections/TeamRoster";
import DetailCTA from "@/components/sections/DetailCTA";
import { teamMembers, departments } from "./team";

export default function OurTeamContent() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <PageHero
        category="about"
        categoryLabel="about"
        title="Our Team"
        subtitle="The people building your product."
        description="A remote-first team of 16 specialists spanning engineering, AI, design, and business — senior-led, distributed across timezones, and coordinated around overlapping core hours."
        icon={Users}
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
      />

      <TeamRoster
        title="Meet the team"
        description="Filter by department to browse the people behind every engagement."
        members={teamMembers}
        departments={departments}
      />

      <DetailCTA
        heading="Want to build with us?"
        description="We're always interested in hearing from strong engineers, designers, and AI specialists."
        ctaLabel="Join Our Team"
      />
    </div>
  );
}
