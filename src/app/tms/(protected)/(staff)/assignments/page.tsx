import PhasePlaceholder from "@/components/tms/PhasePlaceholder";

export default function AssignmentsPage() {
  return (
    <PhasePlaceholder
      title="Assignments"
      description="Create assignments per batch — due dates, max marks, file uploads — with student submissions and mentor review."
      phase="Phase 6"
      breadcrumbs={[{ label: "TMS", href: "/tms" }, { label: "Assignments" }]}
    />
  );
}
