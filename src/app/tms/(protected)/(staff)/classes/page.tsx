import PhasePlaceholder from "@/components/tms/PhasePlaceholder";

export default function ClassesPage() {
  return (
    <PhasePlaceholder
      title="Classes"
      description="Daily class scheduling — batch, mentor, topic, meeting link, recordings — with calendar and agenda views."
      phase="Phase 5"
      breadcrumbs={[{ label: "TMS", href: "/tms" }, { label: "Classes" }]}
    />
  );
}
