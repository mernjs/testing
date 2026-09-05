import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Wraps the shared `Card` primitive (reusing its spacing/layout structure that
 * CardHeader/CardContent depend on) but reskins the surface for the admin
 * panel's glass/elevated look, without touching `Card` itself — it's also
 * used by the public marketing site.
 *
 * The gradient wash is built entirely from existing tokens (--primary/
 * --secondary), so it stays centralized — no hardcoded hex here. Light and
 * dark deliberately use a different angle and different stop intensities
 * (dark can carry more contrast before it looks noisy) rather than just
 * inheriting whatever --secondary happens to resolve to.
 */
export default function GlassCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "bg-gradient-to-br from-primary/[0.05] via-card to-secondary/[0.12]",
        "dark:bg-gradient-to-tr dark:from-primary/[0.07] dark:via-card dark:to-secondary/[0.22]",
        "border-border/50 bg-card/60 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-8px_rgba(0,0,0,0.12)] ring-0 backdrop-blur-xl transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:scale-[1.008] hover:border-primary/25 hover:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_20px_40px_-8px_rgba(0,0,0,0.16)]",
        "hover:from-primary/[0.08] hover:to-secondary/[0.18]",
        "dark:bg-card/40 dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_12px_32px_-8px_rgba(0,0,0,0.4)]",
        "dark:hover:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_20px_40px_-8px_rgba(0,0,0,0.5)] dark:hover:from-primary/[0.1] dark:hover:to-secondary/[0.32]",
        className
      )}
      {...props}
    />
  );
}
