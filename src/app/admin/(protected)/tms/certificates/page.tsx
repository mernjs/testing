import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { searchCertificates } from "@/lib/tms/certificates";
import CertificatesFilterBar from "./CertificatesFilterBar";
import CertificatesGrid, { type AdminCertificateRow } from "./CertificatesGrid";

export default async function AdminCertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; sortBy?: string; sortDir?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const sortBy = sp.sortBy === "issuedOn" ? "issuedOn" : "createdAt";
  const sortDir = sp.sortDir === "asc" ? "asc" : "desc";

  const { items, total, totalPages } = await searchCertificates({
    page,
    pageSize: 20,
    search: sp.search,
    sortBy,
    sortDir,
  });

  const rows: AdminCertificateRow[] = items.map((c) => ({
    _id: c._id,
    certificateNumber: c.certificateNumber,
    typeLabel: c.typeLabel,
    studentName: c.studentName,
    programName: c.programName,
    issuedOn: c.issuedOn,
    grade: c.grade,
    revoked: c.revoked,
  }));

  const hasActiveFilters = Boolean(sp.search);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "TMS" }, { label: "Certificates" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Certificates</h1>
        <p className="text-sm text-muted-foreground">{total} certificate{total === 1 ? "" : "s"} issued.</p>
      </div>

      <CertificatesGrid
        rows={rows}
        total={total}
        page={page}
        totalPages={totalPages}
        sortBy={sortBy}
        sortDir={sortDir}
        hasActiveFilters={hasActiveFilters}
        filters={<CertificatesFilterBar initialSearch={sp.search ?? ""} />}
      />
    </div>
  );
}
