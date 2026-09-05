import "server-only";
import { Collection, Document, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { CATEGORIES, collectionNameFor, getCategoryLabel, type CategorySlug } from "@/lib/categories";
import type { LeadRecord } from "@/lib/lead-validation";
import { DEFAULT_LEAD_STATUS, type LeadStatus } from "@/lib/lead-status";
import { deleteResumeFile, readResumeFile, saveResumeFile } from "@/lib/resume-storage";

export { CATEGORIES, isValidCategory, getCategoryLabel, categoryAcceptsResume, getSubServices, type CategorySlug, type SubService } from "@/lib/categories";
export { validateLeadInput, validateLeadUpdate, validateResumeFile, type LeadInput, type LeadAdminInput, type LeadRecord } from "@/lib/lead-validation";
export { LEAD_STATUSES, DEFAULT_LEAD_STATUS, isValidLeadStatus, getStatusMeta, type LeadStatus } from "@/lib/lead-status";

export interface ResumeMeta {
  storageKey: string;
  filename: string;
  contentType: string;
  size: number;
}

export interface Lead {
  _id: ObjectId;
  category: CategorySlug;
  name: string;
  email?: string;
  phone: string;
  message?: string;
  resume?: ResumeMeta;
  subService?: string;
  status?: LeadStatus;
  notes?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

interface BaseLeadFilterOptions {
  search?: string;
  status?: LeadStatus;
  source?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

/** Shared by searchLeads, exportLeads, and the dashboard aggregation so filtering can't drift between them. */
function buildLeadFilter(opts: BaseLeadFilterOptions): Record<string, unknown> {
  const filter: Record<string, unknown> = {};
  if (opts.search && opts.search.trim()) {
    const regex = new RegExp(escapeRegExp(opts.search.trim()), "i");
    filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
  }
  if (opts.status) filter.status = opts.status;
  if (opts.source) filter.source = opts.source;
  if (opts.dateFrom || opts.dateTo) {
    const range: Record<string, Date> = {};
    if (opts.dateFrom) range.$gte = opts.dateFrom;
    if (opts.dateTo) range.$lte = opts.dateTo;
    filter.createdAt = range;
  }
  return filter;
}

async function getLeadsCollection(category: CategorySlug): Promise<Collection<Omit<Lead, "_id">>> {
  const db = await getDb();
  return db.collection<Omit<Lead, "_id">>(collectionNameFor(category));
}

export async function uploadResume(file: File): Promise<ResumeMeta> {
  return saveResumeFile(file);
}

export function openResumeDownloadStream(storageKey: string) {
  return readResumeFile(storageKey);
}

export async function createLead(category: CategorySlug, data: LeadRecord & { resume?: ResumeMeta }) {
  const collection = await getLeadsCollection(category);
  const now = new Date();
  // status is never taken from caller input here — public submissions always start "new".
  const doc: Omit<Lead, "_id"> = { category, ...data, status: DEFAULT_LEAD_STATUS, createdAt: now, updatedAt: now };
  const result = await collection.insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

export async function listLeads(category: CategorySlug, opts: { limit?: number; cursor?: string } = {}) {
  const collection = await getLeadsCollection(category);
  const limit = Math.min(Math.max(opts.limit ?? 20, 1), 100);

  const filter = opts.cursor && ObjectId.isValid(opts.cursor) ? { _id: { $lt: new ObjectId(opts.cursor) } } : {};

  const docs = await collection
    .find(filter)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .toArray();

  const hasMore = docs.length > limit;
  const items = hasMore ? docs.slice(0, limit) : docs;
  const nextCursor = hasMore ? String(items[items.length - 1]._id) : null;

  return { items, nextCursor };
}

export interface SearchLeadsOptions extends BaseLeadFilterOptions {
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
}

export async function searchLeads(category: CategorySlug, opts: SearchLeadsOptions = {}) {
  const collection = await getLeadsCollection(category);
  const page = Math.max(opts.page ?? 1, 1);
  const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);

  const filter = buildLeadFilter(opts);
  const sortField = opts.sortBy ?? "createdAt";
  const sortDir = opts.sortDir === "asc" ? 1 : -1;

  const [items, total] = await Promise.all([
    collection
      .find(filter)
      .sort({ [sortField]: sortDir })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray(),
    collection.countDocuments(filter),
  ]);

  return { items, total, page, pageSize, totalPages: Math.max(Math.ceil(total / pageSize), 1) };
}

export interface ExportLeadsOptions extends BaseLeadFilterOptions {
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
  ids?: string[];
}

const EXPORT_ROW_LIMIT = 5000;

export async function exportLeads(category: CategorySlug, opts: ExportLeadsOptions = {}): Promise<Lead[]> {
  const collection = await getLeadsCollection(category);

  const filter =
    opts.ids && opts.ids.length > 0
      ? { _id: { $in: opts.ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id)) } }
      : buildLeadFilter(opts);

  const sortField = opts.sortBy ?? "createdAt";
  const sortDir = opts.sortDir === "asc" ? 1 : -1;

  const docs = await collection
    .find(filter)
    .sort({ [sortField]: sortDir })
    .limit(EXPORT_ROW_LIMIT)
    .toArray();

  return docs.map((doc) => ({ ...doc, category })) as Lead[];
}

export async function getLead(category: CategorySlug, id: string) {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getLeadsCollection(category);
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function updateLead(category: CategorySlug, id: string, data: Partial<LeadRecord>) {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getLeadsCollection(category);
  const update: Partial<LeadRecord> & { updatedAt: Date } = { ...data, updatedAt: new Date() };
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: update },
    { returnDocument: "after" }
  );
  return result;
}

export async function deleteLead(category: CategorySlug, id: string) {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getLeadsCollection(category);
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  if (!doc) return false;

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 1 && doc.resume?.storageKey) {
    await deleteResumeFile(doc.resume.storageKey);
  }
  return result.deletedCount === 1;
}

export type DashboardGranularity = "day" | "week" | "month" | "year";

export interface DashboardFilters extends BaseLeadFilterOptions {
  category?: CategorySlug;
  granularity?: DashboardGranularity;
}

export interface DashboardStats {
  totalOverall: number;
  previousPeriodTotal: number | null;
  growthPercent: number | null;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  byWeekday: { day: string; count: number }[];
  timeSeries: { date: string; count: number }[];
  recent: Lead[];
  topCategories: { category: string; label: string; total: number; completed: number; completionRate: number }[];
  funnel: { stage: string; count: number }[];
}

interface FacetResult extends Document {
  total: { count: number }[];
  byStatus: { _id: string | null; count: number }[];
  bySource: { _id: string | null; count: number }[];
  byBucket: { _id: string; count: number }[];
  byWeekday: { _id: number; count: number }[];
  completed: { count: number }[];
  recent: Lead[];
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function dateFormatFor(granularity: DashboardGranularity): string {
  switch (granularity) {
    case "week":
      return "%G-W%V";
    case "month":
      return "%Y-%m";
    case "year":
      return "%Y";
    default:
      return "%Y-%m-%d";
  }
}

function previousPeriodRange(dateFrom?: Date, dateTo?: Date): { from: Date; to: Date } | null {
  if (!dateFrom || !dateTo) return null;
  const durationMs = dateTo.getTime() - dateFrom.getTime();
  if (durationMs <= 0) return null;
  const prevTo = new Date(dateFrom.getTime() - 1);
  const prevFrom = new Date(prevTo.getTime() - durationMs);
  return { from: prevFrom, to: prevTo };
}

export async function getDashboardStats(filters: DashboardFilters = {}): Promise<DashboardStats> {
  const targetCategories = filters.category ? [filters.category] : CATEGORIES.map((c) => c.slug);
  const granularity = filters.granularity ?? "day";
  const dateFormat = dateFormatFor(granularity);

  const matchFilter = buildLeadFilter(filters);
  const prevRange = previousPeriodRange(filters.dateFrom, filters.dateTo);
  const prevFilter = prevRange ? buildLeadFilter({ ...filters, dateFrom: prevRange.from, dateTo: prevRange.to }) : null;

  const perCategory = await Promise.all(
    targetCategories.map(async (slug) => {
      const collection = await getLeadsCollection(slug);
      const [result] = await collection
        .aggregate<FacetResult>([
          { $match: matchFilter },
          {
            $facet: {
              total: [{ $count: "count" }],
              byStatus: [{ $group: { _id: { $ifNull: ["$status", DEFAULT_LEAD_STATUS] }, count: { $sum: 1 } } }],
              bySource: [{ $group: { _id: { $ifNull: ["$source", "unknown"] }, count: { $sum: 1 } } }],
              byBucket: [
                { $group: { _id: { $dateToString: { format: dateFormat, date: "$createdAt" } }, count: { $sum: 1 } } },
              ],
              byWeekday: [{ $group: { _id: { $dayOfWeek: "$createdAt" }, count: { $sum: 1 } } }],
              completed: [{ $match: { status: "completed" } }, { $count: "count" }],
              recent: [{ $sort: { createdAt: -1 } }, { $limit: 10 }],
            },
          },
        ])
        .toArray();

      const prevCount = prevFilter ? await collection.countDocuments(prevFilter) : null;

      return { slug, result, prevCount };
    })
  );

  const byCategory: Record<string, number> = {};
  const byStatus: Record<string, number> = { new: 0, in_progress: 0, completed: 0, rejected: 0 };
  const bySource: Record<string, number> = {};
  const bucketMap = new Map<string, number>();
  const weekdayCounts = new Array(7).fill(0);
  const topCategories: DashboardStats["topCategories"] = [];
  let recentAll: Lead[] = [];
  let totalOverall = 0;
  let previousPeriodTotal: number | null = prevFilter ? 0 : null;

  for (const { slug, result, prevCount } of perCategory) {
    const total = result?.total?.[0]?.count ?? 0;
    const completed = result?.completed?.[0]?.count ?? 0;
    byCategory[slug] = total;
    totalOverall += total;
    if (prevCount !== null) previousPeriodTotal = (previousPeriodTotal ?? 0) + prevCount;

    topCategories.push({
      category: slug,
      label: getCategoryLabel(slug),
      total,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 1000) / 10 : 0,
    });

    for (const s of result?.byStatus ?? []) {
      const key = s._id ?? DEFAULT_LEAD_STATUS;
      byStatus[key] = (byStatus[key] ?? 0) + s.count;
    }

    for (const s of result?.bySource ?? []) {
      const key = s._id ?? "unknown";
      bySource[key] = (bySource[key] ?? 0) + s.count;
    }

    for (const d of result?.byBucket ?? []) {
      bucketMap.set(d._id, (bucketMap.get(d._id) ?? 0) + d.count);
    }

    for (const w of result?.byWeekday ?? []) {
      // MongoDB $dayOfWeek: 1 (Sunday) .. 7 (Saturday)
      const idx = ((w._id ?? 1) - 1 + 7) % 7;
      weekdayCounts[idx] += w.count;
    }

    recentAll = recentAll.concat(result?.recent ?? []);
  }

  const timeSeries = Array.from(bucketMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const byWeekday = WEEKDAY_LABELS.map((day, i) => ({ day, count: weekdayCounts[i] }));

  recentAll.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  topCategories.sort((a, b) => b.total - a.total);

  const growthPercent =
    previousPeriodTotal === null
      ? null
      : previousPeriodTotal > 0
        ? Math.round(((totalOverall - previousPeriodTotal) / previousPeriodTotal) * 1000) / 10
        : null;

  const progressed = (byStatus.in_progress ?? 0) + (byStatus.completed ?? 0);
  const funnel = [
    { stage: "New", count: totalOverall },
    { stage: "In Progress", count: progressed },
    { stage: "Completed", count: byStatus.completed ?? 0 },
  ];

  return {
    totalOverall,
    previousPeriodTotal,
    growthPercent,
    byCategory,
    byStatus,
    bySource,
    byWeekday,
    timeSeries,
    recent: recentAll.slice(0, 10),
    topCategories,
    funnel,
  };
}
