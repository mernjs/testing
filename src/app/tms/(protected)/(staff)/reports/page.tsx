import PhasePlaceholder from "@/components/tms/PhasePlaceholder";

export default function ReportsPage() {
  return (
    <PhasePlaceholder
      title="Reports"
      description="Student, batch, program, revenue, placement, certificate and attendance reports — exported to PDF, Excel and CSV."
      phase="Phase 9"
      breadcrumbs={[{ label: "TMS", href: "/tms" }, { label: "Reports" }]}
    />
  );
}
