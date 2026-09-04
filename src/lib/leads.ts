import "server-only";
import { Collection, ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { collectionNameFor, type CategorySlug } from "@/lib/categories";
import type { LeadRecord } from "@/lib/lead-validation";
import { deleteResumeFile, readResumeFile, saveResumeFile } from "@/lib/resume-storage";

export { CATEGORIES, isValidCategory, getCategoryLabel, categoryAcceptsResume, getSubServices, type CategorySlug, type SubService } from "@/lib/categories";
export { validateLeadInput, validateLeadUpdate, validateResumeFile, type LeadInput, type LeadRecord } from "@/lib/lead-validation";

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
  source?: string;
  createdAt: Date;
  updatedAt: Date;
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
  const doc: Omit<Lead, "_id"> = { category, ...data, createdAt: now, updatedAt: now };
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
