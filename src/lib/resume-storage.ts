import "server-only";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// Deliberately outside `public/` — resumes contain applicant PII and must
// only ever be served through the admin-authenticated download route, never
// as a static, unauthenticated file.
const RESUME_DIR = path.join(process.cwd(), "uploads", "resumes");

export interface StoredResume {
  storageKey: string;
  filename: string;
  contentType: string;
  size: number;
}

function extensionFor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext && /^[a-z0-9]+$/.test(ext) ? ext : "bin";
}

export async function saveResumeFile(file: File): Promise<StoredResume> {
  await mkdir(RESUME_DIR, { recursive: true });

  // storageKey is always server-generated, never derived from the client's
  // filename, so there's no path-traversal surface from user input.
  const storageKey = `${randomUUID()}.${extensionFor(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(RESUME_DIR, storageKey), buffer);

  return {
    storageKey,
    filename: file.name,
    contentType: file.type || "application/octet-stream",
    size: file.size,
  };
}

export function readResumeFile(storageKey: string) {
  return createReadStream(path.join(RESUME_DIR, storageKey));
}

export async function deleteResumeFile(storageKey: string) {
  await unlink(path.join(RESUME_DIR, storageKey)).catch(() => {});
}
