import Breadcrumbs from "@/components/lms/Breadcrumbs";

/** Breadcrumbs + title + description, the same page header every panel uses. */
export default function PlatformPageHeader({ title, description, crumbs = [], actions }: { title: string; description?: string; crumbs?: { label: string; href?: string }[]; actions?: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Breadcrumbs items={[{ label: "Platform", href: "/platform" }, ...crumbs, { label: title }]} />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </div>
    </div>
  );
}
