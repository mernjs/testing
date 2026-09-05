import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * The one card surface for the whole admin panel — a 1:1 match of the public
 * Services Listing card (`src/components/sections/ListingCard.tsx`):
 *
 *   rounded-3xl · bg-background/90 (dark: the blue-tinted --card) · backdrop-blur
 *   · border-border/60 · shadow-md · coral→blue hover glow · lift on hover
 *
 * `interactive={false}` drops the hover lift + glow for surfaces where a
 * pointer response is wrong (data-table shells, filter bars, loading skeletons).
 */
export default function GlassCard({
  className,
  interactive = true,
  ...props
}: React.ComponentProps<typeof Card> & { interactive?: boolean }) {
  return (
    <div className="group/gcard relative h-full">
      {interactive && <div className="admin-card-glow group-hover/gcard:opacity-100" aria-hidden />}
      <Card
        className={cn(
          "admin-surface relative rounded-3xl border border-border/60 bg-background/90 shadow-md ring-0 backdrop-blur-md transition-all duration-300 ease-out",
          "dark:bg-card/85 dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_16px_36px_-10px_rgba(0,0,0,0.45)]",
          interactive &&
            "group-hover/gcard:-translate-y-1 group-hover/gcard:border-primary/40 group-hover/gcard:shadow-2xl group-hover/gcard:shadow-primary/10",
          className
        )}
        {...props}
      />
    </div>
  );
}
