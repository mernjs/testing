import "server-only";
import { getDb } from "@/lib/mongodb";
import { dateFormatFor, type DashboardGranularity } from "@/lib/granularity";
import { round2 } from "@/lib/fms/constants";
import { receivablesAging as getReceivablesAging, totalOutstandingInvoices, overdueInvoices as getOverdueInvoices } from "@/lib/fms/receivables";
import { payablesAging as getPayablesAging, totalOutstandingPayable } from "@/lib/fms/payables";

/**
 * FMS executive dashboard analytics (§4). Aggregation-only, same shape/style
 * as `getPrmsDashboardStats` in `src/lib/prms/dashboard.ts`. Revenue/expense
 * KPIs and charts are computed from `fms_transactions` (realized cash
 * flow); Accounts Receivable/Payable and their aging now come from real
 * `fms_invoices`/PRMS `prms_invoices` balances (Phase 2 — see `fms/
 * receivables.ts`/`fms/payables.ts`), replacing Phase 1's transaction-status
 * approximation. Fields that depend on collections a later phase introduces
 * (bank, cash, payroll, tax) still return `0`/`[]`: querying a missing
 * collection is a Mongo no-op, so this is never fabricated data, just "not
 * yet available".
 */

const TRANSACTIONS_COLLECTION = "fms_transactions";
const RECEIVED_STATUSES = ["completed", "reconciled"];

export interface FmsDashboardFilters {
  dateFrom?: Date;
  dateTo?: Date;
  granularity?: DashboardGranularity;
}

export interface LabelledValue {
  label: string;
  value: number;
}
export interface RevenueExpensePoint {
  date: string;
  revenue: number;
  expense: number;
}

export interface FmsDashboardStats {
  // KPI cards (§4)
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  accountsReceivable: number;
  accountsPayable: number;
  pendingReceivables: number;
  pendingPayables: number;
  totalCash: number;
  totalBankBalance: number;
  outstandingInvoices: number;
  overdueInvoices: number;
  upcomingPayments: number;
  pendingApprovals: number;
  payrollPayable: number;
  taxPayable: number;
  currentMonthRevenue: number;
  currentMonthExpenses: number;
  currentMonthProfit: number;

  // Charts (§4)
  revenueVsExpenses: RevenueExpensePoint[];
  cashFlow: RevenueExpensePoint[];
  revenueBySource: LabelledValue[];
  expensesByCategory: LabelledValue[];
  receivablesAging: LabelledValue[];
  payablesAging: LabelledValue[];
  projectProfitability: LabelledValue[];
  monthlyProfitLoss: RevenueExpensePoint[];
}

type Doc = { _id: string } & Record<string, unknown>;

function rangeMatch(field: string, from?: Date, to?: Date): Record<string, unknown> {
  if (!from && !to) return {};
  const r: Record<string, Date> = {};
  if (from) r.$gte = from;
  if (to) r.$lte = to;
  return { [field]: r };
}

async function sumField(field: string, match: Record<string, unknown>): Promise<number> {
  try {
    const db = await getDb();
    const res = await db
      .collection<Doc>(TRANSACTIONS_COLLECTION)
      .aggregate<{ total: number }>([
        { $match: { deletedAt: null, ...match } },
        { $group: { _id: null, total: { $sum: `$${field}` } } },
      ])
      .toArray();
    return round2(res[0]?.total ?? 0);
  } catch {
    return 0;
  }
}

async function countDocs(match: Record<string, unknown>): Promise<number> {
  try {
    const db = await getDb();
    return db.collection<Doc>(TRANSACTIONS_COLLECTION).countDocuments({ deletedAt: null, ...match });
  } catch {
    return 0;
  }
}

async function groupSum(groupField: string, match: Record<string, unknown>, limit = 10): Promise<LabelledValue[]> {
  try {
    const db = await getDb();
    const rows = await db
      .collection<Doc>(TRANSACTIONS_COLLECTION)
      .aggregate<{ _id: string; value: number }>([
        { $match: { deletedAt: null, ...match } },
        { $group: { _id: `$${groupField}`, value: { $sum: "$amount" } } },
        { $sort: { value: -1 } },
        { $limit: limit },
      ])
      .toArray();
    return rows.map((r) => ({ label: r._id ?? "—", value: r.value }));
  } catch {
    return [];
  }
}

async function revenueExpenseSeries(
  format: string,
  match: Record<string, unknown>
): Promise<RevenueExpensePoint[]> {
  try {
    const db = await getDb();
    const rows = await db
      .collection<Doc>(TRANSACTIONS_COLLECTION)
      .aggregate<{ _id: string; type: string; total: number }>([
        { $match: { deletedAt: null, type: { $in: ["income", "expense"] }, ...match } },
        {
          $group: {
            _id: { date: { $dateToString: { format, date: "$transactionDate" } }, type: "$type" },
            total: { $sum: "$amount" },
          },
        },
        { $project: { _id: "$_id.date", type: "$_id.type", total: 1 } },
        { $sort: { _id: 1 } },
      ])
      .toArray();
    const map = new Map<string, RevenueExpensePoint>();
    for (const row of rows) {
      const point = map.get(row._id) ?? { date: row._id, revenue: 0, expense: 0 };
      if (row.type === "income") point.revenue = row.total;
      else point.expense = row.total;
      map.set(row._id, point);
    }
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

export async function getFmsDashboardStats(filters: FmsDashboardFilters = {}): Promise<FmsDashboardStats> {
  const granularity = filters.granularity ?? "month";
  const format = dateFormatFor(granularity);
  const { dateFrom, dateTo } = filters;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const rangeDateMatch = rangeMatch("transactionDate", dateFrom, dateTo);

  const [
    totalRevenue,
    totalExpenses,
    currentMonthRevenue,
    currentMonthExpenses,
    outstandingInvoicesResult,
    accountsPayableAmount,
    overdueInvoicesResult,
    receivablesAgingResult,
    payablesAgingResult,
    pendingApprovals,
    upcomingPayments,
    revenueVsExpenses,
    monthlyProfitLoss,
    revenueBySourceRaw,
    expensesByCategoryRaw,
  ] = await Promise.all([
    sumField("amount", { type: "income", status: { $in: RECEIVED_STATUSES }, ...rangeDateMatch }),
    sumField("amount", { type: "expense", status: { $in: RECEIVED_STATUSES }, ...rangeDateMatch }),
    sumField("amount", { type: "income", status: { $in: RECEIVED_STATUSES }, transactionDate: { $gte: monthStart } }),
    sumField("amount", { type: "expense", status: { $in: RECEIVED_STATUSES }, transactionDate: { $gte: monthStart } }),
    totalOutstandingInvoices(),
    totalOutstandingPayable(),
    getOverdueInvoices(),
    getReceivablesAging(),
    getPayablesAging(),
    countDocs({ status: "pending_approval" }),
    countDocs({ status: "scheduled" }),
    revenueExpenseSeries(format, rangeDateMatch),
    revenueExpenseSeries(format, {}),
    groupSum("sourceModule", { type: "income", status: { $in: RECEIVED_STATUSES }, ...rangeDateMatch }),
    groupSum("accountId", { type: "expense", status: { $in: RECEIVED_STATUSES }, ...rangeDateMatch }),
  ]);

  const accountsReceivableAmount = outstandingInvoicesResult.amount;

  return {
    totalRevenue,
    totalExpenses,
    netProfit: round2(totalRevenue - totalExpenses),
    accountsReceivable: accountsReceivableAmount,
    accountsPayable: accountsPayableAmount,
    pendingReceivables: accountsReceivableAmount,
    pendingPayables: accountsPayableAmount,
    // Bank / Cash accounts ship in a later phase (§19–21) — never fabricated.
    totalCash: 0,
    totalBankBalance: 0,
    outstandingInvoices: outstandingInvoicesResult.count,
    overdueInvoices: overdueInvoicesResult.count,
    upcomingPayments,
    pendingApprovals,
    // Payroll ships in Phase 3 (§12).
    payrollPayable: 0,
    // Tax module ships in Phase 7 (§25).
    taxPayable: 0,
    currentMonthRevenue,
    currentMonthExpenses,
    currentMonthProfit: round2(currentMonthRevenue - currentMonthExpenses),

    revenueVsExpenses,
    // Cash Flow chart depends on Banking/Cash (Phase 4).
    cashFlow: [],
    revenueBySource: revenueBySourceRaw,
    expensesByCategory: expensesByCategoryRaw,
    receivablesAging: receivablesAgingResult,
    payablesAging: payablesAgingResult,
    // Depends on PMS project-cost integration (Phase 6).
    projectProfitability: [],
    monthlyProfitLoss,
  };
}
