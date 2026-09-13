import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { guardPortalPage } from "@/lib/portal/guard";
import { getActivePortalLead } from "@/lib/portal/lead";
import { HiringTimeline, PortalPageHeader } from "@/components/portal/widgets";
import LeadJourney from "@/components/portal/LeadJourney";
import EmptyPortalState from "@/components/portal/EmptyPortalState";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Journey · YashOrbit Portal" };

export default async function JourneyPage() {
  const user = await guardPortalPage();
  const view = await getActivePortalLead(user);
  if (!view) return <EmptyPortalState title="No activity yet" body="Your journey appears here once your request is in our system." />;

  return (
    <div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-6">
      <Breadcrumbs items={[{ label: "Portal", href: "/portal" }, { label: "My Journey" }]} />
      <PortalPageHeader
        title="My Journey"
        subtitle={`${view.lead.code} · currently: ${view.currentStagePortalLabel}`}
      />

      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <HiringTimeline steps={view.stageTimeline} rejected={view.lead.status === "lost"} />
        </CardContent>
      </GlassCard>

      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadJourney events={view.events} />
        </CardContent>
      </GlassCard>
    </div>
  );
}
