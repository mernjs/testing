import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { jobs } from "@/app/(site)/careers/jobs-data";
import { getDb } from "@/lib/mongodb";

/**
 * Idempotent upsert of job_positions from the static job listings in
 * jobs-data.ts. Re-run any time a role is added, removed, or its status
 * changes in code — never deletes positions missing from code (a closed
 * role should stay referenceable by any past application), only upserts
 * by slug and flips `isOpen` when a role's status changed.
 */
export async function POST() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const collection = db.collection("job_positions");
  await collection.createIndex({ slug: 1 }, { unique: true });

  const now = new Date();
  let upserted = 0;
  for (const job of jobs) {
    const isOpen = (job.status ?? "published") === "published";
    await collection.updateOne(
      { slug: job.slug },
      {
        $set: { slug: job.slug, title: job.title, category: job.category, isOpen, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
    upserted += 1;
  }

  return NextResponse.json({ upserted });
}
