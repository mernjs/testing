"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Sparkles, Rocket } from "lucide-react";

const ICONS = [CheckCircle2, ShieldCheck, Sparkles, Rocket];

interface Feature {
  name: string;
  desc: string;
}

interface FeatureHighlightsProps {
  title?: string;
  features: Feature[];
}

function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" className="w-5 h-5 shrink-0 mx-1.5 inline-block align-[-3px]" aria-hidden="true">
      <circle cx="32" cy="32" r="25.5" fill="#1D428A" />
      <path d="M17.6,17.6 L32,33.6" fill="none" stroke="#ECF2FD" strokeWidth="9" strokeLinecap="round" />
      <path d="M32,33.6 L32,48" fill="none" stroke="#ECF2FD" strokeWidth="9" strokeLinecap="round" />
      <path d="M46.4,17.6 L36,29.2" fill="none" stroke="#ECF2FD" strokeWidth="9" strokeLinecap="round" />
      <circle cx="34.4" cy="30.4" r="5.2" fill="#E56043" />
    </svg>
  );
}

// Renders the section title as-is, except any "YashOrbit" mention is swapped for the
// icon + two-tone wordmark, matching the treatment already used in Header/Footer.
function renderTitle(title: string) {
  const idx = title.indexOf("YashOrbit");
  if (idx === -1) return title;
  return (
    <>
      {title.slice(0, idx)}
      <BrandMark />
      <span className="text-foreground">Yash</span>
      <span className="text-primary">Orbit</span>
      {title.slice(idx + "YashOrbit".length)}
    </>
  );
}

export default function FeatureHighlights({ title, features }: FeatureHighlightsProps) {
  // When `title` renders its own h3, feature items nest one level deeper as h4.
  // When there's no local title, the items sit directly under the page's own
  // section heading (h2) elsewhere, so they need to be h3 themselves.
  const ItemHeading = title ? "h4" : "h3";

  return (
    <div id="features">
      {title && <h3 className="text-xl font-bold mb-6 text-foreground">{renderTitle(title)}</h3>}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {features.map((f, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-muted/20 border border-border/50 hover:border-primary/30 hover:bg-muted/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <ItemHeading className="font-bold text-foreground mb-2 leading-snug">{f.name}</ItemHeading>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
