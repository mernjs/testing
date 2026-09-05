import "server-only";
import { Collection, Document, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { CATEGORIES, collectionNameFor, getCategoryLabel, getSubServices, type CategorySlug } from "@/lib/categories";
import type { LeadRecord } from "@/lib/lead-validation";
import { DEFAULT_LEAD_STATUS, type LeadStatus } from "@/lib/lead-status";
import { deleteResumeFile, readResumeFile, saveResumeFile } from "@/lib/resume-storage";
import { escapeRegExp } from "@/lib/text-search";
import { staleThresholdDate } from "@/lib/stale-days";
import { previousPeriodRange, computeGrowthPercent } from "@/lib/period-comparison";
import { dateFormatFor, type DashboardGranularity } from "@/lib/granularity";

export type { DashboardGranularity } from "@/lib/granularity";

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

export interface DashboardFilters extends BaseLeadFilterOptions {
  category?: CategorySlug;
  granularity?: DashboardGranularity;
}

export interface CategoryStats {
  slug: CategorySlug;
  label: string;
  total: number;
  previousPeriodTotal: number | null;
  growthPercent: number | null;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  bySubService: { subService: string; label: string; count: number }[];
  timeSeries: { date: string; count: number }[];
  /** Same dateFormat as `timeSeries`, but covering the previous-period range — zip
   * by sorted ordinal index (not calendar date) when comparing to `timeSeries`. */
  previousTimeSeries: { date: string; count: number }[];
  byWeekday: { day: string; count: number }[];
  completed: number;
  completionRate: number;
  recent: Lead[];
  funnel: { stage: string; count: number }[];
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
  topCategories: { category: string; label: string; total: number; completed: number; completionRate: number; growthPercent: number | null }[];
  funnel: { stage: string; count: number }[];
  perCategory: Record<CategorySlug, CategoryStats>;
  /** Leads still "new"/"in_progress" after STALE_DAYS — ignores the active date range (a backlog view is about what's open now), still respects category/status/source/search. */
  staleCount: number;
  staleLeads: Lead[];
}

interface FacetResult extends Document {
  total: { count: number }[];
  byStatus: { _id: string | null; count: number }[];
  bySource: { _id: string | null; count: number }[];
  byBucket: { _id: string; count: number }[];
  byWeekday: { _id: number; count: number }[];
  bySubService: { _id: string | null; count: number }[];
  completed: { count: number }[];
  recent: Lead[];
}

interface PrevFacetResult extends Document {
  total: { count: number }[];
  byBucket: { _id: string; count: number }[];
}

interface StaleFacetResult extends Document {
  count: { count: number }[];
  items: Lead[];
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildFunnel(byStatus: Record<string, number>, total: number): { stage: string; count: number }[] {
  const progressed = (byStatus.in_progress ?? 0) + (byStatus.completed ?? 0);
  return [
    { stage: "New", count: total },
    { stage: "In Progress", count: progressed },
    { stage: "Completed", count: byStatus.completed ?? 0 },
  ];
}

export async function getDashboardStats(filters: DashboardFilters = {}): Promise<DashboardStats> {
  const targetCategories = filters.category ? [filters.category] : CATEGORIES.map((c) => c.slug);
  const granularity = filters.granularity ?? "day";
  const dateFormat = dateFormatFor(granularity);

  const matchFilter = buildLeadFilter(filters);
  const prevRange = previousPeriodRange(filters.dateFrom, filters.dateTo);
  const prevFilter = prevRange ? buildLeadFilter({ ...filters, dateFrom: prevRange.from, dateTo: prevRange.to }) : null;

  const staleThreshold = staleThresholdDate();
  const staleBaseFilter = buildLeadFilter({ ...filters, dateFrom: undefined, dateTo: undefined });
  const staleFilter: Record<string, unknown> = { ...staleBaseFilter, createdAt: { $lte: staleThreshold } };
  if (filters.status) {
    // A specific status filter is active — stale/pending only makes sense for
    // open statuses, so anything else deliberately matches nothing.
    if (filters.status !== "new" && filters.status !== "in_progress") {
      staleFilter.status = { $in: [] };
    }
  } else {
    staleFilter.status = { $in: ["new", "in_progress"] };
  }

  const perCategoryRaw = await Promise.all(
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
              bySubService: [{ $group: { _id: { $ifNull: ["$subService", "Not specified"] }, count: { $sum: 1 } } }],
              completed: [{ $match: { status: "completed" } }, { $count: "count" }],
              recent: [{ $sort: { createdAt: -1 } }, { $limit: 10 }],
            },
          },
        ])
        .toArray();

      const [prevResult] = prevFilter
        ? await collection
            .aggregate<PrevFacetResult>([
              { $match: prevFilter },
              {
                $facet: {
                  total: [{ $count: "count" }],
                  byBucket: [
                    { $group: { _id: { $dateToString: { format: dateFormat, date: "$createdAt" } }, count: { $sum: 1 } } },
                  ],
                },
              },
            ])
            .toArray()
        : [undefined];

      const [staleResult] = await collection
        .aggregate<StaleFacetResult>([
          { $match: staleFilter },
          { $facet: { count: [{ $count: "count" }], items: [{ $sort: { createdAt: 1 } }, { $limit: 5 }] } },
        ])
        .toArray();

      return { slug, result, prevResult, staleResult };
    })
  );

  const perCategory = {} as Record<CategorySlug, CategoryStats>;
  let staleCount = 0;
  let staleLeadsAll: Lead[] = [];

  for (const { slug, result, prevResult, staleResult } of perCategoryRaw) {
    const total = result?.total?.[0]?.count ?? 0;
    const completed = result?.completed?.[0]?.count ?? 0;

    const byStatus: Record<string, number> = { new: 0, in_progress: 0, completed: 0, rejected: 0 };
    for (const s of result?.byStatus ?? []) {
      const key = s._id ?? DEFAULT_LEAD_STATUS;
      byStatus[key] = (byStatus[key] ?? 0) + s.count;
    }

    const bySource: Record<string, number> = {};
    for (const s of result?.bySource ?? []) {
      const key = s._id ?? "unknown";
      bySource[key] = (bySource[key] ?? 0) + s.count;
    }

    const subServiceLabels = new Map(getSubServices(slug).map((s) => [s.slug, s.label]));
    const bySubService = (result?.bySubService ?? [])
      .map((s) => {
        const key = s._id ?? "Not specified";
        return { subService: key, label: subServiceLabels.get(key) ?? key, count: s.count };
      })
      .sort((a, b) => b.count - a.count);

    const timeSeries = (result?.byBucket ?? [])
      .map((d) => ({ date: d._id, count: d.count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const previousTimeSeries = (prevResult?.byBucket ?? [])
      .map((d) => ({ date: d._id, count: d.count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const weekdayCounts = new Array(7).fill(0);
    for (const w of result?.byWeekday ?? []) {
      // MongoDB $dayOfWeek: 1 (Sunday) .. 7 (Saturday)
      const idx = ((w._id ?? 1) - 1 + 7) % 7;
      weekdayCounts[idx] += w.count;
    }
    const byWeekday = WEEKDAY_LABELS.map((day, i) => ({ day, count: weekdayCounts[i] }));

    const previousPeriodTotal = prevFilter ? (prevResult?.total?.[0]?.count ?? 0) : null;
    const growthPercent = computeGrowthPercent(total, previousPeriodTotal);

    perCategory[slug] = {
      slug,
      label: getCategoryLabel(slug),
      total,
      previousPeriodTotal,
      growthPercent,
      byStatus,
      bySource,
      bySubService,
      timeSeries,
      previousTimeSeries,
      byWeekday,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 1000) / 10 : 0,
      recent: result?.recent ?? [],
      funnel: buildFunnel(byStatus, total),
    };

    staleCount += staleResult?.count?.[0]?.count ?? 0;
    staleLeadsAll = staleLeadsAll.concat(staleResult?.items ?? []);
  }

  const byCategory: Record<string, number> = {};
  const byStatus: Record<string, number> = { new: 0, in_progress: 0, completed: 0, rejected: 0 };
  const bySource: Record<string, number> = {};
  const bucketMap = new Map<string, number>();
  const weekdayCounts = new Array(7).fill(0);
  const topCategories: DashboardStats["topCategories"] = [];
  let recentAll: Lead[] = [];
  let totalOverall = 0;
  let previousPeriodTotal: number | null = prevFilter ? 0 : null;

  for (const slug of targetCategories) {
    const cat = perCategory[slug];
    byCategory[slug] = cat.total;
    totalOverall += cat.total;
    if (cat.previousPeriodTotal !== null) previousPeriodTotal = (previousPeriodTotal ?? 0) + cat.previousPeriodTotal;

    topCategories.push({
      category: slug,
      label: cat.label,
      total: cat.total,
      completed: cat.completed,
      completionRate: cat.completionRate,
      growthPercent: cat.growthPercent,
    });

    for (const [key, count] of Object.entries(cat.byStatus)) byStatus[key] = (byStatus[key] ?? 0) + count;
    for (const [key, count] of Object.entries(cat.bySource)) bySource[key] = (bySource[key] ?? 0) + count;
    for (const d of cat.timeSeries) bucketMap.set(d.date, (bucketMap.get(d.date) ?? 0) + d.count);
    cat.byWeekday.forEach((w, i) => (weekdayCounts[i] += w.count));

    recentAll = recentAll.concat(cat.recent);
  }

  const timeSeries = Array.from(bucketMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const byWeekday = WEEKDAY_LABELS.map((day, i) => ({ day, count: weekdayCounts[i] }));

  recentAll.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  topCategories.sort((a, b) => b.total - a.total);

  staleLeadsAll.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const growthPercent = computeGrowthPercent(totalOverall, previousPeriodTotal);
  const funnel = buildFunnel(byStatus, totalOverall);

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
    perCategory,
    staleCount,
    staleLeads: staleLeadsAll.slice(0, 10),
  };
}

export interface StaleLeadsSummary {
  count: number;
  items: Lead[];
}

/** Global, unfiltered version of the dashboard's stale-lead facet — used by the
 * topbar notifications bell, which reflects the current real backlog across the
 * whole panel rather than whatever filters happen to be active on the dashboard. */
export async function getStaleLeadsSummary(): Promise<StaleLeadsSummary> {
  const staleThreshold = staleThresholdDate();
  const filter = { status: { $in: ["new", "in_progress"] }, createdAt: { $lte: staleThreshold } };

  let count = 0;
  let items: Lead[] = [];

  await Promise.all(
    CATEGORIES.map(async (c) => {
      const collection = await getLeadsCollection(c.slug);
      const [result] = await collection
        .aggregate<{ count: { count: number }[]; items: Lead[] }>([
          { $match: filter },
          { $facet: { count: [{ $count: "count" }], items: [{ $sort: { createdAt: 1 } }, { $limit: 5 }] } },
        ])
        .toArray();
      count += result?.count?.[0]?.count ?? 0;
      items = items.concat(result?.items ?? []);
    })
  );

  items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  return { count, items: items.slice(0, 10) };
}

export interface RecentLeadsSummary {
  count: number;
  items: Lead[];
}

/** Global, unfiltered — powers the topbar notifications bell's "Recent Activity"
 * section: leads created in the last `days` days, across every category. */
export async function getRecentLeadsSummary(days = 2): Promise<RecentLeadsSummary> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const filter = { createdAt: { $gte: since } };

  let count = 0;
  let items: Lead[] = [];

  await Promise.all(
    CATEGORIES.map(async (c) => {
      const collection = await getLeadsCollection(c.slug);
      const [result] = await collection
        .aggregate<{ count: { count: number }[]; items: Lead[] }>([
          { $match: filter },
          { $facet: { count: [{ $count: "count" }], items: [{ $sort: { createdAt: -1 } }, { $limit: 5 }] } },
        ])
        .toArray();
      count += result?.count?.[0]?.count ?? 0;
      items = items.concat(result?.items ?? []);
    })
  );

  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return { count, items: items.slice(0, 10) };
}
