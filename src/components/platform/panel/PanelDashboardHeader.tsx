/**
 * The common top of every panel's Dashboard, under the shared "Back to Workspace" action row (PanelBackBar), whose "Workspace › Panel" trail is the only breadcrumb:
 * a heading section (title + description on the left, CTAs on the right) → filters. The panel's own
 * widgets follow it.
 *
 * `filters` is the panel's search & filter bar; `actions` are the CTAs shown on the right of the heading section.
 */
export default function PanelDashboardHeader({
  title,
  description,
  filters,
  actions,
}: {
  /** Kept for callers; the Back to Workspace row already shows the trail, so no second breadcrumb is rendered. */
  breadcrumbs?: { label: string; href?: string }[];
  title: React.ReactNode;
  description: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="space-y-4">
      <section className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-r from-primary/10 via-card to-card p-5 shadow-sm sm:p-6">
        <div className="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1.5">
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{title}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
          {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-2 [&_a]:rounded-xl [&_a]:shadow-sm [&_button]:rounded-xl">{actions}</div>
          )}
        </div>
      </section>
      {filters}
    </header>
  );
}
