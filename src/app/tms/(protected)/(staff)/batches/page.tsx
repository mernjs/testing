import PhasePlaceholder from "@/components/tms/PhasePlaceholder";

export default function BatchesPage() {
  return (
    <PhasePlaceholder
      title="Batches"
      description="Create and run multiple batches for each program — timings, mentors, capacity and calendars."
      phase="Phase 2"
      breadcrumbs={[{ label: "TMS", href: "/tms" }, { label: "Batches" }]}
    />
  );
}
