import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Tags } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { CardContent } from "@/components/ui/card";
import { getViewer } from "@/lib/lpms/viewer";
import { lpmsCan } from "@/lib/lpms-roles";
import { listCategories } from "@/lib/lpms/categories";

export default async function CategoriesPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/lpms/login");

  const ctx = { roles: viewer.roles, permissionOverrides: viewer.overrides };
  const canManage = lpmsCan(ctx, "MANAGE_POLICIES");

  const categories = await listCategories(viewer);

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Breadcrumbs items={[{ label: "LPMS", href: "/lpms" }, { label: "Categories" }]} />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Organise documents into categories for easier discovery.
          </p>
        </div>
        {canManage && (
          <Link href="/lpms/categories/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="size-3.5" />
            New Category
          </Link>
        )}
      </div>

      {categories.length === 0 ? (
        <GlassCard interactive={false}>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Tags className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          </CardContent>
        </GlassCard>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat: any) => (
            <GlassCard key={cat.id} interactive={canManage}>
              <CardContent className="flex items-center gap-3 py-4">
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{ background: cat.color ? `${cat.color}20` : "hsl(var(--muted))" }}
                >
                  {cat.icon ?? "🏷️"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.slug}</p>
                </div>
                {canManage && (
                  <Link
                    href={`/lpms/categories/${cat.id}`}
                    className="text-xs text-muted-foreground hover:text-primary"
                  >
                    Edit
                  </Link>
                )}
              </CardContent>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
