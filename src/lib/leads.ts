import "server-only";
import { Collection, Document, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { CATEGORIES, collectionNameFor, type CategorySlug } from "@/lib/categories";
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

export interface SearchLeadsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: LeadStatus;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
}

export async function searchLeads(category: CategorySlug, opts: SearchLeadsOptions = {}) {
  const collection = await getLeadsCollection(category);
  const page = Math.max(opts.page ?? 1, 1);
  const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);

  const filter: Record<string, unknown> = {};
  if (opts.search && opts.search.trim()) {
    const regex = new RegExp(escapeRegExp(opts.search.trim()), "i");
    filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
  }
  if (opts.status) filter.status = opts.status;
  if (opts.dateFrom || opts.dateTo) {
    const range: Record<string, Date> = {};
    if (opts.dateFrom) range.$gte = opts.dateFrom;
    if (opts.dateTo) range.$lte = opts.dateTo;
    filter.createdAt = range;
  }

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

export interface DashboardFilters {
  category?: CategorySlug;
  status?: LeadStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface DashboardStats {
  totalOverall: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  timeSeries: { date: string; count: number }[];
  recent: Lead[];
}

interface FacetResult extends Document {
  total: { count: number }[];
  byStatus: { _id: string | null; count: number }[];
  byDay: { _id: string; count: number }[];
  recent: Lead[];
}

export async function getDashboardStats(filters: DashboardFilters = {}): Promise<DashboardStats> {
  const targetCategories = filters.category ? [filters.category] : CATEGORIES.map((c) => c.slug);

  const matchFilter: Record<string, unknown> = {};
  if (filters.status) matchFilter.status = filters.status;
  if (filters.dateFrom || filters.dateTo) {
    const range: Record<string, Date> = {};
    if (filters.dateFrom) range.$gte = filters.dateFrom;
    if (filters.dateTo) range.$lte = filters.dateTo;
    matchFilter.createdAt = range;
  }

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
              byDay: [
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
              ],
              recent: [{ $sort: { createdAt: -1 } }, { $limit: 10 }],
            },
          },
        ])
        .toArray();
      return { slug, result };
    })
  );

  const byCategory: Record<string, number> = {};
  const byStatus: Record<string, number> = { new: 0, in_progress: 0, completed: 0, rejected: 0 };
  const dayMap = new Map<string, number>();
  let recentAll: Lead[] = [];
  let totalOverall = 0;

  for (const { slug, result } of perCategory) {
    const total = result?.total?.[0]?.count ?? 0;
    byCategory[slug] = total;
    totalOverall += total;

    for (const s of result?.byStatus ?? []) {
      const key = s._id ?? DEFAULT_LEAD_STATUS;
      byStatus[key] = (byStatus[key] ?? 0) + s.count;
    }

    for (const d of result?.byDay ?? []) {
      dayMap.set(d._id, (dayMap.get(d._id) ?? 0) + d.count);
    }

    recentAll = recentAll.concat(result?.recent ?? []);
  }

  const timeSeries = Array.from(dayMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  recentAll.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return { totalOverall, byCategory, byStatus, timeSeries, recent: recentAll.slice(0, 10) };
}
