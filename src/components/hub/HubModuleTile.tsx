"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import GlassCard from "@/components/lms/GlassCard";
import { CardContent } from "@/components/ui/card";

/** Same fade/slide-in entrance as `KpiCard`, staggered by grid position. */
export default function HubModuleTile({
  href,
  label,
  description,
  icon,
  index = 0,
}: {
  href: string;
  label: string;
  description: string;
  /** A rendered icon element (e.g. `<Users className="size-5" />`) — pass an
   * element, not a component reference, so this can be sent from a Server
   * Component (mirrors `KpiCard`'s `icon` prop). */
  icon: React.ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="h-full"
    >
      <Link href={href} className="group block h-full">
        <GlassCard>
          <CardContent className="flex h-full flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                {icon}
              </span>
              <ArrowRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            </div>
          </CardContent>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
