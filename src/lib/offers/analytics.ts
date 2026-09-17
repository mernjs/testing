import "server-only";
import { getDb } from "@/lib/mongodb";
import { newId } from "@/lib/offers/db";
import type { OfferEventType, DeviceType, Audience } from "@/lib/offers/constants";
import type { CategorySlug } from "@/lib/categories";

export const EVENTS_COLLECTION = "offer_analytics_events";

export interface OfferEvent {
  _id: string;
  type: OfferEventType;
  campaignId: string;
  offerId?: string;
  category?: CategorySlug;
  audience?: Audience;
  device: DeviceType;
  source: string;
  sessionId: string;
  createdAt: Date;
}

let indexesEnsured = false;

async function getCollection() {
  const db = await getDb();
  const collection = db.collection<OfferEvent>(EVENTS_COLLECTION);
  if (!indexesEnsured) {
    indexesEnsured = true;
    await Promise.all([
      collection.createIndex({ campaignId: 1, type: 1, createdAt: -1 }).catch(() => {}),
      collection.createIndex({ offerId: 1, type: 1 }).catch(() => {}),
      // Raw event log is ephemeral analytics data, not a system of record —
      // auto-expire after a year so the collection stays bounded. Aggregated
      // conversion counts remain accurate forever via the real `offer_claims`
      // collection, which this never touches or replaces.
      collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 }).catch(() => {}),
    ]);
  }
  return collection;
}

export interface RecordEventInput {
  type: OfferEventType;
  campaignId: string;
  offerId?: string;
  category?: CategorySlug;
  audience?: Audience;
  device: DeviceType;
  source: string;
  sessionId: string;
}

export async function recordOfferEvent(input: RecordEventInput): Promise<void> {
  const collection = await getCollection();
  const doc: OfferEvent = { _id: newId(), ...input, createdAt: new Date() };
  await collection.insertOne(doc);
}

// ---------------------------------------------------------------------------
// Aggregations — all live, computed from the raw event log (+ real
// `offer_claims` for conversions, never a duplicated completion event).
// ---------------------------------------------------------------------------

export interface CampaignFunnel {
  campaignViews: number;
  offerViews: number;
  offerClicks: number;
  formStarts: number;
  conversions: number;
  conversionRate: number; // conversions / offerClicks, 0 when no clicks
  whatsappClicks: number;
  callClicks: number;
}

export async function getCampaignFunnel(campaignId: string): Promise<CampaignFunnel> {
  const collection = await getCollection();
  const db = await getDb();

  const [counts, conversions] = await Promise.all([
    collection
      .aggregate<{ _id: OfferEventType; count: number }>([
        { $match: { campaignId } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ])
      .toArray(),
    db.collection("offer_claims").countDocuments({ campaignId }),
  ]);

  const byType = new Map(counts.map((c) => [c._id, c.count]));
  const offerClicks = byType.get("offer_click") ?? 0;

  return {
    campaignViews: byType.get("campaign_view") ?? 0,
    offerViews: byType.get("offer_view") ?? 0,
    offerClicks,
    formStarts: byType.get("form_start") ?? 0,
    conversions,
    conversionRate: offerClicks > 0 ? conversions / offerClicks : 0,
    whatsappClicks: byType.get("whatsapp_click") ?? 0,
    callClicks: byType.get("call_click") ?? 0,
  };
}

export interface PromoStats {
  stripImpressions: number;
  stripClicks: number;
  stripCloses: number;
  popupImpressions: number;
  popupClicks: number;
  popupCloses: number;
}

/** Top strip / popup stats, tracked separately from the main offer-card funnel above (§22). */
export async function getPromoStats(campaignId: string): Promise<PromoStats> {
  const collection = await getCollection();
  const counts = await collection
    .aggregate<{ _id: OfferEventType; count: number }>([
      { $match: { campaignId, type: { $in: ["strip_view", "strip_click", "strip_close", "popup_view", "popup_click", "popup_close"] } } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ])
    .toArray();
  const byType = new Map(counts.map((c) => [c._id, c.count]));
  return {
    stripImpressions: byType.get("strip_view") ?? 0,
    stripClicks: byType.get("strip_click") ?? 0,
    stripCloses: byType.get("strip_close") ?? 0,
    popupImpressions: byType.get("popup_view") ?? 0,
    popupClicks: byType.get("popup_click") ?? 0,
    popupCloses: byType.get("popup_close") ?? 0,
  };
}

export interface BreakdownRow {
  key: string;
  label: string;
  views: number;
  clicks: number;
}

/** Groups offer_view/offer_click events by audience, device, or source (top 8, rest folded into "Other"). */
export async function getCampaignBreakdown(
  campaignId: string,
  dimension: "audience" | "device" | "source"
): Promise<BreakdownRow[]> {
  const collection = await getCollection();
  const field = `$${dimension}`;

  const rows = await collection
    .aggregate<{ _id: { key: string; type: OfferEventType }; count: number }>([
      { $match: { campaignId, type: { $in: ["offer_view", "offer_click"] } } },
      { $group: { _id: { key: { $ifNull: [field, "unknown"] }, type: "$type" }, count: { $sum: 1 } } },
    ])
    .toArray();

  const byKey = new Map<string, { views: number; clicks: number }>();
  for (const row of rows) {
    const key = row._id.key;
    const entry = byKey.get(key) ?? { views: 0, clicks: 0 };
    if (row._id.type === "offer_view") entry.views += row.count;
    else entry.clicks += row.count;
    byKey.set(key, entry);
  }

  return Array.from(byKey.entries())
    .map(([key, v]) => ({ key, label: key, ...v }))
    .sort((a, b) => b.views + b.clicks - (a.views + a.clicks))
    .slice(0, 8);
}

export interface TrendPoint {
  date: string; // YYYY-MM-DD
  views: number;
  clicks: number;
  conversions: number;
}

/** Daily counts for the last `days` days, all on one shared "count" axis (never a dual-axis chart). */
export async function getCampaignTrend(campaignId: string, days = 14): Promise<TrendPoint[]> {
  const collection = await getCollection();
  const db = await getDb();
  const since = new Date(Date.now() - days * 86400000);

  const [eventRows, claimRows] = await Promise.all([
    collection
      .aggregate<{ _id: { date: string; type: OfferEventType }; count: number }>([
        { $match: { campaignId, createdAt: { $gte: since }, type: { $in: ["offer_view", "offer_click"] } } },
        {
          $group: {
            _id: { date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, type: "$type" },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray(),
    db
      .collection("offer_claims")
      .aggregate<{ _id: string; count: number }>([
        { $match: { campaignId, createdAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      ])
      .toArray(),
  ]);

  const byDate = new Map<string, TrendPoint>();
  function dayFor(date: string): TrendPoint {
    let point = byDate.get(date);
    if (!point) {
      point = { date, views: 0, clicks: 0, conversions: 0 };
      byDate.set(date, point);
    }
    return point;
  }
  for (const row of eventRows) {
    const point = dayFor(row._id.date);
    if (row._id.type === "offer_view") point.views += row.count;
    else point.clicks += row.count;
  }
  for (const row of claimRows) {
    dayFor(row._id).conversions += row.count;
  }

  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export interface OfferAnalytics {
  offerId: string;
  views: number;
  clicks: number;
  conversions: number;
}

/** Per-offer view/click/conversion counts for a campaign, for the campaign's offer table. */
export async function getOfferAnalyticsForCampaign(campaignId: string): Promise<Map<string, OfferAnalytics>> {
  const collection = await getCollection();
  const db = await getDb();

  const [rows, claimRows] = await Promise.all([
    collection
      .aggregate<{ _id: { offerId: string; type: OfferEventType }; count: number }>([
        { $match: { campaignId, offerId: { $exists: true }, type: { $in: ["offer_view", "offer_click"] } } },
        { $group: { _id: { offerId: "$offerId", type: "$type" }, count: { $sum: 1 } } },
      ])
      .toArray(),
    db
      .collection("offer_claims")
      .aggregate<{ _id: string; count: number }>([{ $match: { campaignId } }, { $group: { _id: "$offerId", count: { $sum: 1 } } }])
      .toArray(),
  ]);

  const map = new Map<string, OfferAnalytics>();
  function entryFor(offerId: string): OfferAnalytics {
    let entry = map.get(offerId);
    if (!entry) {
      entry = { offerId, views: 0, clicks: 0, conversions: 0 };
      map.set(offerId, entry);
    }
    return entry;
  }
  for (const row of rows) {
    const entry = entryFor(row._id.offerId);
    if (row._id.type === "offer_view") entry.views += row.count;
    else entry.clicks += row.count;
  }
  for (const row of claimRows) {
    entryFor(row._id).conversions += row.count;
  }
  return map;
}
