"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin } from "@/lib/admin-auth";
import { undoImport } from "@/lib/campaigns";
import { isValidPlatform } from "@/lib/campaign-platforms";
import { campaignKeyFor } from "@/lib/utm";
import { assignLeadsCampaign } from "@/lib/leads";
import { isValidCategory, type CategorySlug } from "@/lib/categories";

// Each action independently re-checks the session — render-time gating on the
// page is not a security boundary for the action endpoint itself.
async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Unauthorized");
  return admin;
}

export async function undoImportAction(importId: string): Promise<{ error?: string }> {
  await requireAdmin();
  const result = await undoImport(importId);
  if (result.error) return { error: result.error };
  revalidatePath("/admin/campaigns");
  revalidatePath("/admin/campaigns/leads");
  revalidatePath("/admin");
  return {};
}

export async function assignCampaignAction(
  targets: { category: string; id: string }[],
  source: string,
  campaignName: string
): Promise<{ updated: number; error?: string }> {
  await requireAdmin();
  if (!isValidPlatform(source)) return { updated: 0, error: "Unknown platform." };
  const name = campaignName.trim().slice(0, 200);
  const valid = targets.filter((t): t is { category: CategorySlug; id: string } => isValidCategory(t.category));
  if (valid.length === 0) return { updated: 0, error: "No valid leads selected." };

  const updated = await assignLeadsCampaign(valid, source, name || undefined, campaignKeyFor(name));
  revalidatePath("/admin/campaigns");
  revalidatePath("/admin/campaigns/leads");
  revalidatePath("/admin");
  return { updated };
}
