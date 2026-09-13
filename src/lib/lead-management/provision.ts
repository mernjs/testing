import "server-only";
import { randomInt } from "node:crypto";
import { hashPassword } from "@/lib/lms-auth";
import { externalUsers, type ExternalUserDoc } from "@/lib/portal-auth";
import { newId } from "@/lib/portal/db";
import { notifyPortalUser } from "@/lib/portal/notifications";
import { recordPortalAudit } from "@/lib/portal/audit";
import { PORTAL_ROLE_META } from "@/lib/portal-roles";
import { createLeadRecord } from "@/lib/lead-management/records";
import { recordLeadEvent } from "@/lib/lead-management/timeline";
import { LEAD_SOURCE_META } from "@/lib/lead-management/types";
import type { LeadManagementSource, LeadRecord, LeadSourceRef, LeadType } from "@/lib/lead-management/types";

/**
 * The heart of the lead-driven portal: turn any website form submission into a
 * Lead + a portal account the person is immediately logged into. Called from the
 * two public intake routes (`/api/careers/apply`, `/api/leads/[category]`) and
 * from the staff "manual lead" form.
 */

const PW_WORDS = ["Orbit", "Nova", "Comet", "Solar", "Lunar", "Pulse", "Vega", "Astra", "Photon", "Quasar"];

export function generateTempPassword(): string {
  const word = PW_WORDS[randomInt(PW_WORDS.length)];
  const n = randomInt(1000, 9999);
  const sym = "!@#$%&*"[randomInt(7)];
  return `${word}${n}${sym}`;
}

export interface ProvisionInput {
  source: LeadManagementSource;
  type?: LeadType; // defaults to LEAD_SOURCE_META[source].type
  name: string;
  email: string;
  phone: string;
  subService?: string | null;
  message?: string | null;
  sourceRef?: LeadSourceRef | null;
  applicationId?: string | null;
  actorId?: string | null; // set for manual (staff) leads
}

export interface ProvisionResult {
  leadId: string;
  leadCode: string;
  externalUserId: string;
  role: LeadType;
  tempPassword: string | null;
  isNewAccount: boolean;
}

export async function provisionLeadAndAccount(input: ProvisionInput): Promise<ProvisionResult> {
  const email = input.email.trim().toLowerCase();
  const type = input.type ?? LEAD_SOURCE_META[input.source].type;
  const users = await externalUsers();

  const existing = await users.findOne({ email });
  let externalUserId: string;
  let tempPassword: string | null = null;
  let isNewAccount = false;
  let role: LeadType;

  if (existing) {
    externalUserId = existing._id;
    role = existing.role;
  } else {
    isNewAccount = true;
    tempPassword = generateTempPassword();
    role = type;
    const now = new Date();
    const doc: ExternalUserDoc & { leadId: string | null; activeLeadId: string | null } = {
      _id: newId(),
      email,
      phone: input.phone.trim(),
      passwordHash: hashPassword(tempPassword),
      role,
      applicationId: input.applicationId ?? null,
      studentId: null,
      clientId: null,
      displayName: input.name.trim() || email.split("@")[0],
      status: "active",
      failedLoginAttempts: 0,
      lockedUntil: null,
      mustChangePassword: false,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
      leadId: null,
      activeLeadId: null,
    };
    await users.insertOne(doc);
    externalUserId = doc._id;
  }

  const lead: LeadRecord = await createLeadRecord({
    type,
    source: input.source,
    name: input.name,
    email,
    phone: input.phone,
    subService: input.subService ?? null,
    message: input.message ?? null,
    externalUserId,
    sourceRef: input.sourceRef ?? null,
    applicationId: input.applicationId ?? null,
    actorId: input.actorId ?? null,
  });

  // Point the account at this lead. First lead becomes the primary link; every
  // submission makes its lead the active one the portal dashboard renders.
  const set: Record<string, unknown> = { activeLeadId: lead._id, updatedAt: new Date() };
  if (!existing?.leadId) set.leadId = lead._id;
  if (input.applicationId && !existing?.applicationId) set.applicationId = input.applicationId;
  await users.updateOne({ _id: externalUserId }, { $set: set });

  if (isNewAccount) {
    await recordLeadEvent(lead._id, {
      kind: "account_created",
      title: "Portal account created",
      detail: `Signed in automatically from the ${LEAD_SOURCE_META[input.source].label} form.`,
      actor: "system",
      visibleToLead: true,
    });
  }
  await recordLeadEvent(lead._id, {
    kind: "lead_submitted",
    title: `${LEAD_SOURCE_META[input.source].label} submitted`,
    detail: input.subService ? `Interest: ${input.subService}` : null,
    actor: input.actorId ? "staff" : "applicant",
    actorId: input.actorId ?? null,
    visibleToLead: true,
  });

  await notifyPortalUser({
    recipientUserId: externalUserId,
    type: "welcome",
    title: isNewAccount ? `Welcome to the ${PORTAL_ROLE_META[role].portalName}` : "We received your submission",
    body: isNewAccount
      ? "Your account is ready. Track everything here — it updates live as our team progresses your request."
      : `A new request (${lead.code}) has been added to your portal.`,
    link: "/portal",
  });
  await recordPortalAudit({
    actorId: externalUserId,
    action: isNewAccount ? "register" : "lead_added",
    entity: "lead",
    entityId: lead._id,
    summary: `${input.source} · ${lead.code}`,
  });

  return {
    leadId: lead._id,
    leadCode: lead.code,
    externalUserId,
    role,
    tempPassword,
    isNewAccount,
  };
}
