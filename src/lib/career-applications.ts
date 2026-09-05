import "server-only";
import { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { ApplicationRecord } from "@/lib/career-application-validation";
import { CAREER_APPLICATION_STATUSES, DEFAULT_CAREER_APPLICATION_STATUS, type CareerApplicationStatus } from "@/lib/career-application-status";
import { deleteResumeFile, readResumeFile, saveResumeFile } from "@/lib/resume-storage";

const APPLICATIONS_COLLECTION = "career_applications";
const POSITIONS_COLLECTION = "job_positions";

export interface ResumeMeta {
  storageKey: string;
  filename: string;
  contentType: string;
  size: number;
}

export interface JobPosition {
  _id: ObjectId;
  slug: string;
  title: string;
  category: string;
  isOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CareerApplication {
  _id: ObjectId;
  positionId: ObjectId | null;
  positionSlug: string | null;
  positionTitle: string;
  name: string;
  email: string;
  phone: string;
  coverNote?: string;
  resume: ResumeMeta;
  status: CareerApplicationStatus;
  notes?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GENERAL_APPLICATION_TITLE = "General Application";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getApplicationsCollection(): Promise<Collection<Omit<CareerApplication, "_id">>> {
  const db = await getDb();
  return db.collection<Omit<CareerApplication, "_id">>(APPLICATIONS_COLLECTION);
}

async function getPositionsCollection(): Promise<Collection<Omit<JobPosition, "_id">>> {
  const db = await getDb();
  return db.collection<Omit<JobPosition, "_id">>(POSITIONS_COLLECTION);
}

export async function uploadResume(file: File): Promise<ResumeMeta> {
  return saveResumeFile(file);
}

export function openResumeDownloadStream(storageKey: string) {
  return readResumeFile(storageKey);
}

export async function getOpenJobPositions(): Promise<Pick<JobPosition, "slug" | "title" | "category">[]> {
  const collection = await getPositionsCollection();
  const docs = await collection.find({ isOpen: true }).sort({ title: 1 }).toArray();
  return docs.map((d) => ({ slug: d.slug, title: d.title, category: d.category }));
}

/** Includes closed positions, used to populate the admin filter dropdown so
 * past applications to now-closed roles remain filterable. */
export async function getAllJobPositions(): Promise<Pick<JobPosition, "slug" | "title" | "category">[]> {
  const collection = await getPositionsCollection();
  const docs = await collection.find({}).sort({ title: 1 }).toArray();
  return docs.map((d) => ({ slug: d.slug, title: d.title, category: d.category }));
}

export async function getOpenJobPositionBySlug(slug: string): Promise<JobPosition | null> {
  const collection = await getPositionsCollection();
  return collection.findOne({ slug, isOpen: true });
}

interface BaseApplicationFilterOptions {
  search?: string;
  status?: CareerApplicationStatus;
  positionSlug?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

function buildApplicationFilter(opts: BaseApplicationFilterOptions): Record<string, unknown> {
  const filter: Record<string, unknown> = {};
  if (opts.search && opts.search.trim()) {
    const regex = new RegExp(escapeRegExp(opts.search.trim()), "i");
    filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
  }
  if (opts.status) filter.status = opts.status;
  if (opts.positionSlug) filter.positionSlug = opts.positionSlug;
  if (opts.dateFrom || opts.dateTo) {
    const range: Record<string, Date> = {};
    if (opts.dateFrom) range.$gte = opts.dateFrom;
    if (opts.dateTo) range.$lte = opts.dateTo;
    filter.createdAt = range;
  }
  return filter;
}

export async function createApplication(
  data: ApplicationRecord & { resume: ResumeMeta }
): Promise<CareerApplication> {
  const collection = await getApplicationsCollection();
  const now = new Date();

  let positionId: ObjectId | null = null;
  let positionSlug: string | null = null;
  let positionTitle = GENERAL_APPLICATION_TITLE;

  if (data.positionSlug) {
    const position = await getOpenJobPositionBySlug(data.positionSlug);
    if (!position) {
      throw new Error("INVALID_POSITION");
    }
    positionId = position._id;
    positionSlug = position.slug;
    positionTitle = position.title;
  }

  const doc: Omit<CareerApplication, "_id"> = {
    positionId,
    positionSlug,
    positionTitle,
    name: data.name,
    email: data.email,
    phone: data.phone,
    coverNote: data.coverNote,
    resume: data.resume,
    status: DEFAULT_CAREER_APPLICATION_STATUS,
    source: data.source,
    createdAt: now,
    updatedAt: now,
  };
  const result = await collection.insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

export interface SearchApplicationsOptions extends BaseApplicationFilterOptions {
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
}

export async function searchApplications(opts: SearchApplicationsOptions = {}) {
  const collection = await getApplicationsCollection();
  const page = Math.max(opts.page ?? 1, 1);
  const pageSize = Math.min(Math.max(opts.pageSize ?? 20, 1), 100);

  const filter = buildApplicationFilter(opts);
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

export interface ExportApplicationsOptions extends BaseApplicationFilterOptions {
  sortBy?: "createdAt" | "name";
  sortDir?: "asc" | "desc";
  ids?: string[];
}

const EXPORT_ROW_LIMIT = 5000;

export async function exportApplications(opts: ExportApplicationsOptions = {}): Promise<CareerApplication[]> {
  const collection = await getApplicationsCollection();

  const filter =
    opts.ids && opts.ids.length > 0
      ? { _id: { $in: opts.ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id)) } }
      : buildApplicationFilter(opts);

  const sortField = opts.sortBy ?? "createdAt";
  const sortDir = opts.sortDir === "asc" ? 1 : -1;

  const docs = await collection
    .find(filter)
    .sort({ [sortField]: sortDir })
    .limit(EXPORT_ROW_LIMIT)
    .toArray();

  return docs.map((doc) => ({ ...doc })) as CareerApplication[];
}

export async function getApplication(id: string): Promise<CareerApplication | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getApplicationsCollection();
  return collection.findOne({ _id: new ObjectId(id) });
}

export async function updateApplication(id: string, data: Partial<ApplicationRecord>) {
  if (!ObjectId.isValid(id)) return null;
  const collection = await getApplicationsCollection();
  const update = { ...data, updatedAt: new Date() };
  return collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: update }, { returnDocument: "after" });
}

export async function deleteApplication(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const collection = await getApplicationsCollection();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  if (!doc) return false;

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 1 && doc.resume?.storageKey) {
    await deleteResumeFile(doc.resume.storageKey);
  }
  return result.deletedCount === 1;
}

export interface CareerDashboardStats {
  total: number;
  byStatus: Record<string, number>;
  topPositions: { positionTitle: string; count: number }[];
  recent: CareerApplication[];
}

export async function getCareerDashboardStats(filters: BaseApplicationFilterOptions = {}): Promise<CareerDashboardStats> {
  const collection = await getApplicationsCollection();
  const filter = buildApplicationFilter(filters);

  const [total, statusAgg, positionAgg, recent] = await Promise.all([
    collection.countDocuments(filter),
    collection.aggregate<{ _id: string; count: number }>([{ $match: filter }, { $group: { _id: "$status", count: { $sum: 1 } } }]).toArray(),
    collection
      .aggregate<{ _id: string; count: number }>([
        { $match: filter },
        { $group: { _id: "$positionTitle", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ])
      .toArray(),
    collection.find(filter).sort({ createdAt: -1 }).limit(8).toArray(),
  ]);

  const byStatus: Record<string, number> = {};
  for (const s of CAREER_APPLICATION_STATUSES) byStatus[s.value] = 0;
  for (const row of statusAgg) byStatus[row._id] = row.count;

  const topPositions = positionAgg.map((row) => ({ positionTitle: row._id, count: row.count }));

  return { total, byStatus, topPositions, recent: recent as CareerApplication[] };
}
