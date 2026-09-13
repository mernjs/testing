import "server-only";
import { getDb } from "@/lib/mongodb";
import { newId } from "@/lib/portal/db";
import { notifyPortalUser } from "@/lib/portal/notifications";
import { recordLeadEvent } from "@/lib/lead-management/timeline";
import { getLeadRecord } from "@/lib/lead-management/records";
import type { LeadMessage, LeadMessageChannel, SerializedLeadMessage } from "@/lib/lead-management/types";

export const LEAD_MESSAGES_COLLECTION = "lead_messages";

let idx = false;

async function collection() {
  const db = await getDb();
  const c = db.collection<LeadMessage>(LEAD_MESSAGES_COLLECTION);
  if (!idx) {
    idx = true;
    await c.createIndex({ leadId: 1, createdAt: 1 }).catch(() => {});
  }
  return c;
}

export function serializeLeadMessage(m: LeadMessage): SerializedLeadMessage {
  return { ...m, createdAt: m.createdAt.toISOString() };
}

/**
 * Post to a lead's Communication Center. `internal` visibility is a staff-only
 * note; `portal` visibility is delivered to the person's portal (notification +
 * a visible timeline entry + the /portal/messages thread).
 */
export async function postLeadMessage(input: {
  leadId: string;
  body: string;
  visibility: "internal" | "portal";
  channel?: LeadMessageChannel;
  authorStaffId: string | null;
}): Promise<SerializedLeadMessage> {
  const body = input.body.trim();
  const channel: LeadMessageChannel = input.channel ?? (input.visibility === "internal" ? "note" : "message");
  const doc: LeadMessage = {
    _id: newId(),
    leadId: input.leadId,
    body,
    visibility: input.visibility,
    channel,
    authorStaffId: input.authorStaffId,
    createdAt: new Date(),
  };
  await (await collection()).insertOne(doc);

  if (input.visibility === "portal") {
    const lead = await getLeadRecord(input.leadId);
    await recordLeadEvent(input.leadId, {
      kind: channel === "document_request" ? "document_requested" : "message_sent",
      title: channel === "document_request" ? "Document requested" : "Message from YashOrbit",
      detail: body.length > 140 ? `${body.slice(0, 140)}…` : body,
      actor: "staff",
      actorId: input.authorStaffId,
      visibleToLead: true,
    });
    if (lead) {
      await notifyPortalUser({
        recipientUserId: lead.externalUserId,
        type: channel === "document_request" ? "document_request" : "message",
        title: channel === "document_request" ? "A document was requested" : "New message from YashOrbit",
        body: body.length > 160 ? `${body.slice(0, 160)}…` : body,
        link: "/portal/messages",
      });
    }
  } else {
    await recordLeadEvent(input.leadId, {
      kind: "note_added",
      title: "Internal note added",
      actor: "staff",
      actorId: input.authorStaffId,
      visibleToLead: false,
    });
  }

  return serializeLeadMessage(doc);
}

export async function listLeadMessages(
  leadId: string,
  opts: { visibility?: "internal" | "portal" | "all" } = {}
): Promise<SerializedLeadMessage[]> {
  const c = await collection();
  const filter: Record<string, unknown> = { leadId };
  if (opts.visibility && opts.visibility !== "all") filter.visibility = opts.visibility;
  const rows = await c.find(filter).sort({ createdAt: 1 }).toArray();
  return rows.map(serializeLeadMessage);
}
