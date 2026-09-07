import PhasePlaceholder from "@/components/tms/PhasePlaceholder";

export default function StudentHomePage() {
  return (
    <PhasePlaceholder
      title="Student portal"
      description="Your program, batch, class schedule, assignments, live projects, certificates and payments."
      phase="Phase 4"
      breadcrumbs={[{ label: "TMS" }, { label: "My Dashboard" }]}
    />
  );
}
