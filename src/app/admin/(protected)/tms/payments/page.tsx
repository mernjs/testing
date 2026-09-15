import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { searchPaymentPlans } from "@/lib/tms/payments";
import PaymentsFilterBar from "./PaymentsFilterBar";
import PaymentsGrid, { type AdminPaymentRow } from "./PaymentsGrid";

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; sortBy?: string; sortDir?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const sortBy = sp.sortBy === "totalFees" ? "totalFees" : "createdAt";
  const sortDir = sp.sortDir === "asc" ? "asc" : "desc";

  const { items, total, totalPages } = await searchPaymentPlans({
    page,
    pageSize: 20,
    search: sp.search,
    sortBy,
    sortDir,
  });

  const rows: AdminPaymentRow[] = items.map((p) => ({
    _id: p._id,
    studentName: p.studentName,
    programName: p.programName,
    totalFees: p.totalFees,
    paidAmount: p.paidAmount,
    pendingAmount: p.pendingAmount,
    status: p.status,
    currency: p.currency,
  }));

  const hasActiveFilters = Boolean(sp.search);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "TMS" }, { label: "Payments" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Payments</h1>
        <p className="text-sm text-muted-foreground">{total} payment plan{total === 1 ? "" : "s"}.</p>
      </div>

      <PaymentsGrid
        rows={rows}
        total={total}
        page={page}
        totalPages={totalPages}
        sortBy={sortBy}
        sortDir={sortDir}
        hasActiveFilters={hasActiveFilters}
        filters={<PaymentsFilterBar initialSearch={sp.search ?? ""} />}
      />
    </div>
  );
}
