"use server";

import { getCurrentAdmin } from "@/lib/admin-auth";
import { globalAdminSearch, type GlobalSearchResult } from "@/lib/admin-search";

export async function globalAdminSearchAction(query: string): Promise<GlobalSearchResult> {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  return globalAdminSearch(query);
}
