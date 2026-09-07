import PhasePlaceholder from "@/components/tms/PhasePlaceholder";

export default function ApplicationsPage() {
  return (
    <PhasePlaceholder
      title="Applications"
      description="The admissions pipeline — new, contacted, shortlisted, enrolled or rejected — with convert-to-student."
      phase="Phase 3"
      breadcrumbs={[{ label: "TMS", href: "/tms" }, { label: "Applications" }]}
    />
  );
}
