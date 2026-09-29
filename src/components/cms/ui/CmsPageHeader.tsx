import Breadcrumbs, { type BreadcrumbItemData } from "@/components/lms/Breadcrumbs";
import { cn } from "@/lib/utils";

/**
 * The header every CMS screen opens with: breadcrumbs, an icon + title,
 * a one-line description, optional status badges and the screen's actions.
 */
export default function CmsPageHeader({
  breadcrumbs,
  icon: Icon,
  title,
  description,
  badges,
  actions,
  className,
}: {
  breadcrumbs?: BreadcrumbItemData[];
  icon?: React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  description?: React.ReactNode;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={[{ label: "CMS", href: "/cms" }, ...breadcrumbs]} />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-bold tracking-tight text-foreground sm:text-2xl">{title}</h1>
              {badges}
            </div>
            {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
