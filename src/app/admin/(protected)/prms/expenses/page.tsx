import Breadcrumbs from "@/components/lms/Breadcrumbs";
import { searchExpenses } from "@/lib/prms/expenses";
import { isValidExpenseStatus } from "@/lib/prms/constants";
import ExpensesFilterBar from "./ExpensesFilterBar";
import ExpensesGrid, { type AdminExpenseRow } from "./ExpensesGrid";

export default async function AdminExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; approvalStatus?: string; sortBy?: string; sortDir?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(Number(sp.page) || 1, 1);
  const approvalStatus = sp.approvalStatus && isValidExpenseStatus(sp.approvalStatus) ? sp.approvalStatus : undefined;
  const sortBy = sp.sortBy === "totalAmount" ? "totalAmount" : "expenseDate";
  const sortDir = sp.sortDir === "asc" ? "asc" : "desc";

  const { items, total, totalPages } = await searchExpenses({
    page,
    pageSize: 20,
    search: sp.search,
    approvalStatus,
    sortBy,
    sortDir,
  });

  const rows: AdminExpenseRow[] = items.map((e) => ({
    _id: e._id,
    expenseCode: e.expenseCode,
    category: e.category,
    vendorName: e.vendorName,
    departmentName: e.departmentName,
    totalAmount: e.totalAmount,
    currency: e.currency,
    approvalStatus: e.approvalStatus,
    expenseDate: new Date(e.expenseDate).toISOString(),
  }));

  const hasActiveFilters = Boolean(sp.search || approvalStatus);

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Procurement" }, { label: "Expenses" }]} />
      <div>
        <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Expenses</h1>
        <p className="text-sm text-muted-foreground">{total} expense{total === 1 ? "" : "s"}.</p>
      </div>

      <ExpensesGrid
        rows={rows}
        total={total}
        page={page}
        totalPages={totalPages}
        sortBy={sortBy}
        sortDir={sortDir}
        hasActiveFilters={hasActiveFilters}
        filters={<ExpensesFilterBar initialSearch={sp.search ?? ""} initialStatus={approvalStatus ?? ""} />}
      />
    </div>
  );
}
