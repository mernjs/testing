"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import CampaignCountdown from "@/components/offers/CampaignCountdown";
import { PUBLIC_AUDIENCE_TABS, getThemePreset, type PublicAudienceTabKey } from "@/lib/offers/constants";
import type { SerializedCampaign } from "@/lib/offers/campaigns";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function OffersHero({
  campaign,
  onSelectAudience,
}: {
  campaign: SerializedCampaign | null;
  onSelectAudience: (key: PublicAudienceTabKey) => void;
}) {
  const headline = campaign?.theme.bannerHeadline ?? "Build More. Pay Less.";
  const subheadline =
    campaign?.theme.bannerSubheadline ??
    "Exclusive limited-time offers on Software, AI, Training, Internships & Technology Talent.";
  const preset = campaign ? getThemePreset(campaign.themePreset) : null;
  const primaryColor = campaign?.theme.primaryColor;
  const accentColor = campaign?.theme.accentColor;

  return (
    <section className="relative overflow-hidden bg-background pt-28 pb-16 lg:pt-36 lg:pb-24 border-b border-border/50">
      {campaign?.bannerImage && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={campaign.bannerImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div
            className="absolute inset-0 bg-background"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 65%, black 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 65%, black 100%)",
            }}
          />
        </div>
      )}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob ${primaryColor ? "" : "bg-primary/15"}`}
          style={primaryColor ? { backgroundColor: primaryColor, opacity: 0.15 } : undefined}
        />
        <div
          className={`absolute top-[10%] right-[5%] w-[50%] h-[50%] rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000 ${accentColor ? "" : "bg-secondary/15"}`}
          style={accentColor ? { backgroundColor: accentColor, opacity: 0.15 } : undefined}
        />
      </div>

      <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center relative z-10">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-sm font-medium text-foreground backdrop-blur-sm mx-auto shadow-sm"
          >
            {preset?.emoji ? (
              <span className="text-base leading-none" aria-hidden="true">{preset.emoji}</span>
            ) : (
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            )}
            <span>{campaign ? campaign.name : "Festival Offers"}</span>
          </motion.div>

          <motion.h1 variants={fadeIn} className="text-4xl font-black tracking-tight text-foreground sm:text-6xl">
            {headline}
          </motion.h1>
          <motion.p variants={fadeIn} className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {subheadline}
          </motion.p>

          {!campaign && (
            <motion.p variants={fadeIn} className="text-sm text-muted-foreground">
              No festival campaign is live right now — check back soon, or explore our{" "}
              <a href="/services" className="text-primary hover:underline">
                full range of services
              </a>{" "}
              in the meantime.
            </motion.p>
          )}

          {campaign && (
            <motion.div variants={fadeIn}>
              <CampaignCountdown endDate={campaign.endDate} />
            </motion.div>
          )}

          {campaign && (
            <motion.div variants={fadeIn} className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
              {PUBLIC_AUDIENCE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onSelectAudience(tab.key)}
                  className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:text-primary"
                >
                  {tab.cta} →
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
