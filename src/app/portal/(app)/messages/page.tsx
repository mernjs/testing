import { MessagesSquare, FileText } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { guardPortalPage } from "@/lib/portal/guard";
import { getActivePortalLead } from "@/lib/portal/lead";
import { PortalPageHeader } from "@/components/portal/widgets";
import EmptyPortalState from "@/components/portal/EmptyPortalState";

import { brandify } from "@/lib/brand";
export const dynamic = "force-dynamic";
export const metadata = { title: "Messages · YashOrbit Portal" };

function when(iso: string) {
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function MessagesPage() {
  const user = await guardPortalPage();
  const view = await getActivePortalLead(user);
  if (!view) return <EmptyPortalState title="No messages" body="Messages from the YashOrbit team appear here." />;

  return (
    <div className="mx-auto max-w-2xl space-y-5 p-4 sm:p-6">
      <Breadcrumbs items={[{ label: "Portal", href: "/portal" }, { label: "Messages" }]} />
      <PortalPageHeader title="Messages" subtitle="Updates from your YashOrbit team" />

      <GlassCard>
        <CardContent className="space-y-3 py-4">
          {view.messages.length === 0 && (
            <p className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground">
              <MessagesSquare className="size-6 text-muted-foreground/50" />
              No messages yet. We&apos;ll reach out here as things progress.
            </p>
          )}
          {view.messages.map((m) => (
            <div key={m._id} className="rounded-xl border border-border/50 p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {m.channel === "document_request" ? <FileText className="size-3.5" /> : <MessagesSquare className="size-3.5" />}
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {m.channel === "document_request" ? "Document request" : brandify("YashOrbit team")}
                </span>
                <span className="ml-auto text-[11px] text-muted-foreground">{when(m.createdAt)}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{m.body}</p>
            </div>
          ))}
        </CardContent>
      </GlassCard>

      <p className="text-xs text-muted-foreground">
        Need to reply? Use the contact details in your welcome email or call your {brandify("YashOrbit")} point of contact.
      </p>
    </div>
  );
}
