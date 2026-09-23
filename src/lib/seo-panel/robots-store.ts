import "server-only";
import { siteUrl } from "@/lib/seo";
import { COLLECTIONS, seoCollection } from "@/lib/seo-panel/db";
import { invalidateSite } from "@/lib/seo-panel/pages";
import { DEFAULT_ROBOTS_TXT, validateRobots } from "@/lib/seo-panel/robots-parse";
import { SeoInputError } from "@/lib/seo-panel/viewer";
import type { SeoPage } from "@/lib/seo-panel/types";

/**
 * The managed robots.txt (`seo_settings` document `_id: "robots"`). `content`
 * null means "serve the code default". Every publish is validated on the
 * server, keeps the last 20 revisions for rollback, and refuses a file that
 * would block the whole site unless the publisher explicitly confirms it.
 */

export interface RobotsRevision {
  content: string | null;
  at: Date;
  by: string;
  byEmail: string | null;
  note: string;
}

export interface RobotsDoc {
  _id: "robots";
  content: string | null;
  publishedAt: Date | null;
  publishedBy: string | null;
  revisions: RobotsRevision[];
}

async function col() {
  return seoCollection<RobotsDoc>(COLLECTIONS.settings);
}

export async function getRobotsDoc(): Promise<RobotsDoc> {
  return (await (await col()).findOne({ _id: "robots" })) ?? { _id: "robots", content: null, publishedAt: null, publishedBy: null, revisions: [] };
}

export function effectiveRobots(doc: RobotsDoc): string {
  return doc.content ?? DEFAULT_ROBOTS_TXT;
}

/** Paths the latest audit found indexable — the validator warns if a rule would block them. */
export async function importantPaths(): Promise<string[]> {
  const pages = await seoCollection<SeoPage>(COLLECTIONS.pages);
  return (await pages.find({ "crawl.indexable": true }, { projection: { path: 1 } }).toArray()).map((p) => p.path);
}

export async function publishRobots(content: string | null, opts: { actorId: string; actorEmail: string | null; confirmBlockAll: boolean; note: string }) {
  const before = await getRobotsDoc();
  if (content !== null) {
    const text = content.replace(/\r\n/g, "\n").trimEnd() + "\n";
    const v = validateRobots(text, { primaryHost: new URL(siteUrl).host, importantPaths: await importantPaths() });
    const errors = v.problems.filter((p) => p.level === "error" && !(v.blocksEverything && p.message.startsWith("This file blocks the home page")));
    if (errors.length > 0) throw new SeoInputError(`Fix ${errors.length} error(s) first: ${errors[0].message}`);
    if (v.blocksEverything && !opts.confirmBlockAll) throw new SeoInputError("This robots.txt would block the entire site. Tick the confirmation box if that is really intended.");
    content = text;
  }
  const revision: RobotsRevision = { content: before.content, at: new Date(), by: opts.actorId, byEmail: opts.actorEmail, note: opts.note.slice(0, 200) };
  await (await col()).updateOne(
    { _id: "robots" },
    { $set: { content, publishedAt: new Date(), publishedBy: opts.actorId }, $push: { revisions: { $each: [revision], $position: 0, $slice: 20 } } },
    { upsert: true }
  );
  invalidateSite("/robots.txt");
  return { before: before.content, after: content };
}
