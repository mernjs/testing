import { notFound } from "next/navigation";
import { Mail, Phone, Calendar, Briefcase, Download } from "lucide-react";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/admin/GlassCard";
import { buttonVariants } from "@/components/ui/button";
import CareerStatusBadge from "@/components/admin/CareerStatusBadge";
import Breadcrumbs from "@/components/admin/Breadcrumbs";
import StatusSelect from "./StatusSelect";
import NotesEditor from "./NotesEditor";
import DeleteButton from "./DeleteButton";
import { getApplication } from "@/lib/career-applications";
import { DEFAULT_CAREER_APPLICATION_STATUS } from "@/lib/career-application-status";
import { formatDateTime } from "@/lib/utils";

export default async function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const application = await getApplication(id);
  if (!application) notFound();

  return (
    <div className="space-y-4">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Applicants", href: "/admin/careers/applicants" },
          { label: application.name },
        ]}
      />
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">{application.name}</h1>
        <CareerStatusBadge status={application.status} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <CardHeader><CardTitle>Applicant Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-muted-foreground" />
              <a href={`mailto:${application.email}`} className="hover:underline">{application.email}</a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-muted-foreground" />
              <a href={`tel:${application.phone}`} className="hover:underline">{application.phone}</a>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="size-4 shrink-0 text-muted-foreground" />
              <span>{application.positionTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 shrink-0 text-muted-foreground" />
              <span>{formatDateTime(application.createdAt)}</span>
            </div>

            <div className="pt-2">
              <h3 className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Resume</h3>
              <a
                href={`/api/careers/applications/${id}/resume`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <Download className="size-3.5" data-icon="inline-start" />
                {application.resume.filename}
              </a>
            </div>

            <div className="pt-2">
              <h3 className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Cover Note</h3>
              <p className="whitespace-pre-wrap text-foreground">{application.coverNote || "No cover note provided."}</p>
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader><CardTitle>Status</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <StatusSelect id={id} initialStatus={application.status ?? DEFAULT_CAREER_APPLICATION_STATUS} />
            <DeleteButton id={id} />
          </CardContent>
        </GlassCard>
      </div>

      <GlassCard>
        <CardHeader><CardTitle>Internal HR Notes</CardTitle></CardHeader>
        <CardContent>
          <NotesEditor id={id} initialNotes={application.notes ?? ""} />
        </CardContent>
      </GlassCard>
    </div>
  );
}
