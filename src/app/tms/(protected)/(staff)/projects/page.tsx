import PhasePlaceholder from "@/components/tms/PhasePlaceholder";

export default function ProjectsPage() {
  return (
    <PhasePlaceholder
      title="Live Projects"
      description="Assign real-world projects to students — mentors, milestones, submissions, repo and demo links."
      phase="Phase 6"
      breadcrumbs={[{ label: "TMS", href: "/tms" }, { label: "Projects" }]}
    />
  );
}
