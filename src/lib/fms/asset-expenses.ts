import "server-only";
import { getDb } from "@/lib/mongodb";
import { newId, createStamp, notDeleted, nextYearSequence, formatYearCode, type AuditFields } from "@/lib/fms/db";
import { round2, type PaymentMethod, type FundAccountType } from "@/lib/fms/constants";
import { getAsset } from "@/lib/prms/assets";
import { postSystemTransaction } from "@/lib/fms/transactions";

/**
 * Asset Expenses (§14) — genuinely new, same gap `asset-disposals.ts` found
 * and filled: confirmed via research that no ongoing/recurring asset cost
 * (maintenance, insurance, AMC) exists anywhere in PRMS or FMS — an asset
 * only ever tracks its original `purchaseCost`. Unlike disposal, an asset
 * can have any number of these over its life, so there's no uniqueness
 * constraint on `assetId` here.
 */

export const ASSET_EXPENSES_COLLECTION = "fms_asset_expenses";
const ASSET_EXPENSE_NUMBER_PREFIX = "AEX";

export type AssetExpenseCategory = "maintenance" | "insurance" | "amc" | "other";

export const ASSET_EXPENSE_CATEGORIES: { value: AssetExpenseCategory; label: string }[] = [
  { value: "maintenance", label: "Maintenance" },
  { value: "insurance", label: "Insurance" },
  { value: "amc", label: "AMC / Service Contract" },
  { value: "other", label: "Other" },
];

export function isValidAssetExpenseCategory(value: unknown): value is AssetExpenseCategory {
  return typeof value === "string" && ASSET_EXPENSE_CATEGORIES.some((c) => c.value === value);
}

export interface AssetExpense extends AuditFields {
  _id: string;
  expenseNumber: string;
  assetId: string;
  assetCode: string;
  assetName: string;
  category: AssetExpenseCategory;
  amount: number;
  currency: string;
  expenseDate: Date;
  vendorId: string | null;
  vendorName: string | null;
  notes: string | null;
  transactionId: string | null;
}

export interface SerializedAssetExpense extends Omit<AssetExpense, "createdAt" | "updatedAt" | "deletedAt" | "expenseDate"> {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  expenseDate: string;
}

export function serializeAssetExpense(e: AssetExpense): SerializedAssetExpense {
  return {
    ...e,
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
    deletedAt: e.deletedAt ? e.deletedAt.toISOString() : null,
    expenseDate: e.expenseDate.toISOString().slice(0, 10),
  };
}

let indexesEnsured = false;
async function getCollection() {
  const db = await getDb();
  const collection = db.collection<AssetExpense>(ASSET_EXPENSES_COLLECTION);
  if (!indexesEnsured) {
    indexesEnsured = true;
    await Promise.all([
      collection.createIndex({ expenseNumber: 1 }, { unique: true }).catch(() => {}),
      collection.createIndex({ assetId: 1, expenseDate: -1 }).catch(() => {}),
    ]);
  }
  return collection;
}

export async function generateAssetExpenseNumber(year = new Date().getFullYear()): Promise<string> {
  const seq = await nextYearSequence(ASSET_EXPENSE_NUMBER_PREFIX, year);
  return formatYearCode(ASSET_EXPENSE_NUMBER_PREFIX, year, seq);
}

export async function listAssetExpensesForAsset(assetId: string): Promise<AssetExpense[]> {
  const collection = await getCollection();
  return collection.find({ assetId, ...notDeleted }).sort({ expenseDate: -1 }).toArray();
}

export async function searchAssetExpenses(opts: { page?: number; pageSize?: number } = {}) {
  const collection = await getCollection();
  const page = Math.max(opts.page ?? 1, 1);
  const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);
  const filter = { ...notDeleted };
  const [items, total] = await Promise.all([
    collection.find(filter).sort({ expenseDate: -1 }).skip((page - 1) * pageSize).limit(pageSize).toArray(),
    collection.countDocuments(filter),
  ]);
  return { items, total, page, pageSize, totalPages: Math.max(Math.ceil(total / pageSize), 1) };
}

export async function totalAssetExpenses(assetId: string): Promise<number> {
  const items = await listAssetExpensesForAsset(assetId);
  return round2(items.reduce((s, e) => s + e.amount, 0));
}

export interface RecordAssetExpenseData {
  assetId: string;
  category: AssetExpenseCategory;
  amount: number;
  expenseDate: string;
  method: PaymentMethod;
  vendorId: string | null;
  vendorName: string | null;
  notes: string | null;
  fundAccountId?: string | null;
  fundAccountType?: FundAccountType | null;
}

export async function recordAssetExpense(
  data: RecordAssetExpenseData,
  actorId: string,
  actorEmail: string | null
): Promise<{ ok: true; expense: AssetExpense } | { ok: false; reason: string }> {
  const asset = await getAsset(data.assetId);
  if (!asset) return { ok: false, reason: "Asset not found." };

  const amount = round2(data.amount);
  if (amount <= 0) return { ok: false, reason: "Enter an expense amount." };

  const expenseDate = new Date(`${data.expenseDate}T00:00:00`);
  const categoryLabel = ASSET_EXPENSE_CATEGORIES.find((c) => c.value === data.category)?.label ?? "Expense";

  const txn = await postSystemTransaction(
    {
      type: "expense",
      transactionDate: expenseDate,
      postingDate: expenseDate,
      amount,
      currency: asset.currency,
      paymentMethod: data.method,
      sourceModule: "prms",
      sourceRecordId: asset._id,
      customerId: null,
      vendorId: data.vendorId,
      employeeId: null,
      projectId: null,
      department: null,
      accountId: null,
      fundAccountId: data.fundAccountId ?? null,
      fundAccountType: data.fundAccountType ?? null,
      taxAmount: 0,
      referenceNumber: null,
      description: `${categoryLabel} for ${asset.assetCode} (${asset.name})`,
      attachments: [],
    },
    actorId,
    actorEmail
  );
  if ("ok" in txn) return txn;

  const collection = await getCollection();
  const doc: AssetExpense = {
    _id: newId(),
    expenseNumber: await generateAssetExpenseNumber(expenseDate.getFullYear()),
    assetId: asset._id,
    assetCode: asset.assetCode,
    assetName: asset.name,
    category: data.category,
    amount,
    currency: asset.currency,
    expenseDate,
    vendorId: data.vendorId,
    vendorName: data.vendorName,
    notes: data.notes,
    transactionId: txn._id,
    ...createStamp(actorId),
  };
  await collection.insertOne(doc);
  return { ok: true, expense: doc };
}
