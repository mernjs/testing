import PhasePlaceholder from "@/components/tms/PhasePlaceholder";

export default function StudentsPage() {
  return (
    <PhasePlaceholder
      title="Students"
      description="The full student CRM — profiles, enrolments, progress, attendance, projects, certificates and payments."
      phase="Phase 4"
      breadcrumbs={[{ label: "TMS", href: "/tms" }, { label: "Students" }]}
    />
  );
}
