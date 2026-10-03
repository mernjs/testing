import { redirect } from "next/navigation";
import { PenLine } from "lucide-react";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { CardContent } from "@/components/ui/card";
import { getViewer } from "@/lib/lpms/viewer";
import { lpmsCan } from "@/lib/lpms-roles";
import { getDb } from "@/lib/mongodb";
import { currentCompanyId } from "@/lib/platform/tenancy/context";

export default async function SignaturesPage() {
  const viewer = await getViewer();
  if (!viewer) redirect("/lpms/login");

  const ctx = { roles: viewer.roles, permissionOverrides: viewer.overrides };
  if (!lpmsCan(ctx, "SIGN")) redirect("/lpms");

  const companyId = currentCompanyId();
  const db = await getDb();
  const requests = await db
    .collection("lpms_signatures")
    .find({ companyId })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <Breadcrumbs items={[{ label: "LPMS", href: "/lpms" }, { label: "Signatures" }]} />

      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          Signature Requests
        </h1>
        <p className="text-sm text-muted-foreground">
          {requests.length} signature request{requests.length !== 1 ? "s" : ""}
        </p>
      </div>

      <GlassCard interactive={false}>
        <CardContent className="p-0">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <PenLine className="size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No signature requests yet.</p>
              <p className="max-w-xs text-xs text-muted-foreground">
                Request signatures from inside any document that has a signature block.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/40">
              {requests.map((req: any) => {
                const statusColor: Record<string, string> = {
                  pending: "text-amber-500",
                  signed: "text-emerald-500",
                  declined: "text-destructive",
                  expired: "text-muted-foreground",
                };
                return (
                  <li key={req._id.toString()} className="flex items-center gap-4 px-4 py-3">
                    <PenLine className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {req.signerName ?? req.signerEmail}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Document: {req.documentId} ·{" "}
                        {new Date(req.requestedAt ?? req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold capitalize ${
                        statusColor[req.status] ?? "text-muted-foreground"
                      }`}
                    >
                      {req.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </GlassCard>
    </div>
  );
}
