import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * The one card surface for the whole admin panel — matches the public
 * Services Listing card's shape (`src/components/sections/ListingCard.tsx`):
 * rounded-3xl · translucent bg · backdrop-blur.
 *
 * No shadow, at rest or on hover — flat, defined only by a plain border and
 * the white-on-gray contrast against the page canvas. Same on the sidebar
 * and topbar shells.
 *
 * Hover only lifts the card — no border-color change either.
 *
 * `interactive={false}` drops the hover lift for surfaces where a pointer
 * response is wrong (data-table shells, filter bars, loading skeletons).
 *
 * `h-full` is on the Card itself, not just this wrapper — a CSS grid stretches
 * the wrapper to the row's tallest sibling by default, but `<Card>` is a plain
 * `flex flex-col` div with no height of its own, so it was only ever as tall
 * as its own content. Two cards in the same row with slightly different
 * content (an extra caption line, say) ended up visibly different heights
 * even though the invisible wrapper matched. Every GlassCard now fills its
 * row by default instead of that being something each call site had to
 * remember to opt into.
 */
export default function GlassCard({
  className,
  interactive = true,
  ...props
}: React.ComponentProps<typeof Card> & { interactive?: boolean }) {
  return (
    <div className="group/gcard relative h-full">
      <Card
        className={cn(
          "admin-surface relative h-full rounded-3xl border border-border/40 bg-background/95 shadow-none backdrop-blur-md transition-all duration-300 ease-out",
          "dark:bg-card/85",
          interactive && "group-hover/gcard:-translate-y-1",
          className
        )}
        {...props}
      />
    </div>
  );
}
