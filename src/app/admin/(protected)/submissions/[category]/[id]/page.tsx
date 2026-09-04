import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, Phone, Calendar, Tag, Download, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import StatusBadge from "@/components/admin/StatusBadge";
import StatusSelect from "./StatusSelect";
import NotesEditor from "./NotesEditor";
import DeleteButton from "./DeleteButton";
import { getLead, isValidCategory, getCategoryLabel, categoryAcceptsResume, DEFAULT_LEAD_STATUS } from "@/lib/leads";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  if (!isValidCategory(category)) notFound();

  const lead = await getLead(category, id);
  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href={`/admin/submissions/${category}`} className="mb-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3" />
            Back to {getCategoryLabel(category)}
          </Link>
          <h1 className="text-2xl font-bold text-foreground">{lead.name}</h1>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-muted-foreground" />
              {lead.email ? <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a> : <span className="text-muted-foreground">Not provided</span>}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-muted-foreground" />
              <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="size-4 shrink-0 text-muted-foreground" />
              <span>{getCategoryLabel(category)}{lead.subService ? ` · ${lead.subService}` : ""}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 shrink-0 text-muted-foreground" />
              <span>{new Date(lead.createdAt).toLocaleString()}</span>
            </div>

            {categoryAcceptsResume(category) ? (
              <div className="pt-2">
                <h3 className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Resume</h3>
                {lead.resume ? (
                  <a
                    href={`/api/leads/${category}/${id}/resume`}
                    className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                    <Download className="size-3.5" data-icon="inline-start" />
                    {lead.resume.filename}
                  </a>
                ) : (
                  <p className="text-muted-foreground">No resume uploaded.</p>
                )}
              </div>
            ) : (
              <div className="pt-2">
                <h3 className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Project Details</h3>
                <p className="whitespace-pre-wrap text-foreground">{lead.message || "No message provided."}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Status</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <StatusSelect category={category} id={id} initialStatus={lead.status ?? DEFAULT_LEAD_STATUS} />
            <DeleteButton category={category} id={id} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Internal Notes</CardTitle></CardHeader>
        <CardContent>
          <NotesEditor category={category} id={id} initialNotes={lead.notes ?? ""} />
        </CardContent>
      </Card>
    </div>
  );
}
