import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LifeBuoy } from "lucide-react";
import GlassCard from "@/components/lms/GlassCard";
import { Markdown } from "@/components/chat/Markdown";
import { buttonVariants } from "@/components/ui/button";
import { getPublishedBySlug } from "@/lib/support/articles";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HelpArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedBySlug(slug);
  if (!article) notFound();
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href="/support/help" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Help Center</Link>
      <GlassCard interactive={false} className="p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-wide text-primary uppercase">{article.category}</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-foreground">{article.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground">Updated {formatDate(article.updatedAt)}</p>
        <Markdown content={article.body} className="mt-5" />
      </GlassCard>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/50 bg-card p-4">
        <p className="text-sm text-muted-foreground">Didn&apos;t solve it?</p>
        <Link href="/support/requests/new" className={buttonVariants({ size: "sm" })}><LifeBuoy className="size-3.5" data-icon="inline-start" /> Contact YashOrbit</Link>
      </div>
    </div>
  );
}
