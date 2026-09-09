import Breadcrumbs from "@/components/lms/Breadcrumbs";
import GlobalSearch from "@/components/messenger/GlobalSearch";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <Breadcrumbs items={[{ label: "Messenger", href: "/messenger" }, { label: "Search" }]} />
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Search</h1>
        <GlobalSearch initialQuery={q ?? ""} />
      </div>
    </div>
  );
}
