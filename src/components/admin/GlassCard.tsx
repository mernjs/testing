import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Wraps the shared `Card` primitive (reusing its spacing/layout structure that
 * CardHeader/CardContent depend on) but reskins the surface for the admin
 * panel's glass/elevated look, without touching `Card` itself — it's also
 * used by the public marketing site.
 *
 * The gradient wash (`.admin-surface`, defined in globals.css) is the same
 * one used on every other admin surface — sidebar, topbar, this card — built
 * entirely from existing tokens, so the whole panel reads as one theme.
 */
export default function GlassCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        "admin-surface",
        "border-border/50 bg-card/60 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-8px_rgba(0,0,0,0.12)] ring-0 backdrop-blur-xl transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_1px_2px_rgba(0,0,0,0.06),0_20px_40px_-8px_rgba(0,0,0,0.16)]",
        "dark:bg-card/40 dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_12px_32px_-8px_rgba(0,0,0,0.4)]",
        "dark:hover:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_20px_40px_-8px_rgba(0,0,0,0.5)]",
        className
      )}
      {...props}
    />
  );
}
