import { getCurrentPortalUser } from "@/lib/portal-auth";
import { getActivePortalLead } from "@/lib/portal/lead";
import { getApplicantOverview } from "@/lib/portal/applicant";
import { getLearnerOverview } from "@/lib/portal/student";
import { getClientOverview } from "@/lib/portal/client";
import ApplicantDashboard from "@/components/portal/dashboards/ApplicantDashboard";
import LearnerDashboard from "@/components/portal/dashboards/LearnerDashboard";
import ClientDashboard from "@/components/portal/dashboards/ClientDashboard";
import LeadOnlyDashboard from "@/components/portal/dashboards/LeadOnlyDashboard";
import EmptyPortalState from "@/components/portal/EmptyPortalState";

export const dynamic = "force-dynamic";

export default async function PortalDashboardPage() {
  const user = await getCurrentPortalUser();
  if (!user) return null;

  const leadView = await getActivePortalLead(user);
  const type = leadView?.lead.type ?? user.role;
  const firstName = user.displayName.split(" ")[0];

  if (type === "job_applicant") {
    const data = await getApplicantOverview(user.applicationId ?? leadView?.lead.applicationId ?? "");
    if (data) return <ApplicantDashboard data={data} firstName={firstName} leadView={leadView} />;
    if (leadView) return <LeadOnlyDashboard view={leadView} firstName={firstName} />;
    return <EmptyPortalState title="No application found" body="We couldn't find your application record. Contact recruitment@yashorbit.com." />;
  }

  if (type === "intern" || type === "trainee") {
    const data = await getLearnerOverview(user.studentId ?? leadView?.lead.studentId ?? null);
    if (data) return <LearnerDashboard data={data} role={type} firstName={firstName} leadView={leadView} />;
    if (leadView) return <LeadOnlyDashboard view={leadView} firstName={firstName} />;
    return <EmptyPortalState title="No enrolment found" body="We couldn't find your training record yet. It appears here once our team enrols you." />;
  }

  const data = await getClientOverview(user.clientId ?? leadView?.lead.clientId ?? null);
  if (data) return <ClientDashboard data={data} firstName={firstName} leadView={leadView} />;
  if (leadView) return <LeadOnlyDashboard view={leadView} firstName={firstName} />;
  return <EmptyPortalState title="No projects yet" body="Your projects will appear here once they're set up." />;
}
