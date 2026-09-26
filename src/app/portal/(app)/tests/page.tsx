import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { PortalPageHeader } from "@/components/portal/widgets";
import CandidateTests from "@/components/ots/CandidateTests";
import PortalTestsNav from "@/components/ots/PortalTestsNav";
import { guardPortalPage } from "@/lib/portal/guard";
import { TEST_TAKER_ROLES } from "@/lib/portal-roles";
import { resolveTaker, basePath } from "@/lib/ots/taker";
import { candidateCards } from "@/lib/ots/candidate";
import { maybeSweep } from "@/lib/ots/sweep";
import { after } from "next/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tests · YashOrbit Portal" };

export default async function PortalTestsPage() {
  const user = await guardPortalPage(...TEST_TAKER_ROLES);
  after(() => maybeSweep());
  const taker = await resolveTaker("portal");
  const cards = taker ? await candidateCards(taker) : [];
  return (
    <div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-6">
      <Breadcrumbs items={[{ label: "Portal", href: "/portal" }, { label: "Tests" }]} />
      <PortalPageHeader title={user.role === "job_applicant" ? "Assessments" : "Tests & Exams"} subtitle={user.role === "job_applicant" ? "Screening and technical tests for your application." : "Course, chapter, practice, mock and final exams."} />
      <PortalTestsNav active="tests" />
      <CandidateTests cards={cards} channel="portal" paths={basePath("portal")} emptyHint={user.role === "job_applicant" ? "If the hiring team asks you to take a test, it will appear here." : "Tests from your program will appear here."} />
    </div>
  );
}
