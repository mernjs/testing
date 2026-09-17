"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatOfferBadge, getServiceHref } from "@/lib/offers/constants";
import { getCategoryLabel, getSubServices } from "@/lib/categories";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { SerializedOffer } from "@/lib/offers/offers";

function subServiceLabel(offer: SerializedOffer): string {
  if (offer.subService === "all") return getCategoryLabel(offer.category);
  return getSubServices(offer.category).find((s) => s.slug === offer.subService)?.label ?? getCategoryLabel(offer.category);
}

export default function OfferCard({
  offer,
  onClaim,
  compact = false,
}: {
  offer: SerializedOffer;
  onClaim: (offer: SerializedOffer) => void;
  compact?: boolean;
}) {
  const badge = offer.badgeText || formatOfferBadge(offer.pricing);
  const hasPrice = offer.pricing.mode !== "custom_quote" && offer.pricing.originalPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col rounded-3xl border border-border/50 bg-background/95 backdrop-blur-md p-6 shadow-none transition-all hover:-translate-y-1 ${compact ? "min-w-[260px]" : ""}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary">
          <Flame className="size-3.5" /> {offer.isDealOfTheDay ? "Deal of the Day" : "Festival Offer"}
        </span>
        {offer.isFeatured && <Badge variant="secondary">Most Popular</Badge>}
      </div>

      <p className="text-xs font-medium text-muted-foreground">{subServiceLabel(offer)}</p>
      <h3 className="mt-1 text-lg font-bold text-foreground">{offer.title}</h3>
      {offer.description && !compact && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{offer.description}</p>}

      <div className="mt-4 flex items-baseline gap-2">
        {hasPrice && offer.pricing.originalPrice && (
          <span className="text-sm text-muted-foreground line-through">
            {formatCurrency(offer.pricing.originalPrice, offer.pricing.currency)}
          </span>
        )}
      </div>
      <p className="text-2xl font-black tracking-tight text-primary">{badge}</p>

      {offer.benefits.length > 0 && !compact && (
        <ul className="mt-4 space-y-1.5">
          {offer.benefits.slice(0, 4).map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="size-4 shrink-0 text-primary" /> {b}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-xs text-muted-foreground">Valid until {formatDate(offer.validUntil)}</p>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onClaim(offer)}
          className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
        >
          Claim Offer <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
      <Link
        href={getServiceHref(offer.category, offer.subService)}
        className="mt-3 text-center text-xs text-muted-foreground hover:text-primary hover:underline"
      >
        Learn more about this service
      </Link>
    </motion.div>
  );
}
