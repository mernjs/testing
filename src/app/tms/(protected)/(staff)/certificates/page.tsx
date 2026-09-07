import PhasePlaceholder from "@/components/tms/PhasePlaceholder";

export default function CertificatesPage() {
  return (
    <PhasePlaceholder
      title="Certificates"
      description="Generate training, internship, project and excellence certificates with QR verification and PDF download."
      phase="Phase 7"
      breadcrumbs={[{ label: "TMS", href: "/tms" }, { label: "Certificates" }]}
    />
  );
}
