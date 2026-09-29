"use server";

import { redirect } from "next/navigation";
import { getCurrentHubUser } from "@/lib/hub-auth";
import { applyStructure, completeTeamStep, saveModules, saveProfile, skipOnboarding, type ProfileInput, type StepResult } from "@/lib/platform/onboarding/state";
import { inviteTeammate, revokeInvitation } from "@/lib/platform/invitations";
import { requestOrigin } from "@/lib/platform/request";
import type { DepartmentTemplate } from "@/lib/platform/onboarding/catalog";

/** Every step is the company owner's (Super Admin's) call — checked on each action, not just the page. */
async function requireOwner() {
  const user = await getCurrentHubUser();
  if (!user) redirect("/workspace/login");
  if (!user.roles.includes("super_admin")) redirect("/workspace");
  return user;
}

export async function saveProfileAction(input: ProfileInput): Promise<StepResult> {
  const user = await requireOwner();
  return saveProfile(input, user.id);
}

export async function applyStructureAction(departments: DepartmentTemplate[]): Promise<{ created: number }> {
  const user = await requireOwner();
  const clean = (Array.isArray(departments) ? departments : []).map((d) => ({
    name: String(d?.name ?? ""),
    code: String(d?.code ?? ""),
    designations: Array.isArray(d?.designations) ? d.designations.map(String) : [],
  }));
  return applyStructure(clean, user.id);
}

export interface InviteRow {
  email: string;
  name: string;
  preset: string;
  departmentId?: string | null;
}

export async function inviteAction(rows: InviteRow[]): Promise<{ sent: string[]; errors: string[] }> {
  const user = await requireOwner();
  const { origin } = await requestOrigin();
  const sent: string[] = [];
  const errors: string[] = [];
  for (const row of (Array.isArray(rows) ? rows : []).slice(0, 50)) {
    if (!row?.email?.trim()) continue;
    const res = await inviteTeammate({ email: row.email, name: row.name ?? "", preset: row.preset, departmentId: row.departmentId ?? null }, { id: user.id, email: user.email }, origin);
    if (res.ok) sent.push(res.email);
    else errors.push(res.error);
  }
  return { sent, errors };
}

export async function revokeInviteAction(id: string): Promise<void> {
  await requireOwner();
  await revokeInvitation(id);
}

export async function finishTeamStepAction(): Promise<void> {
  await requireOwner();
  await completeTeamStep();
}

export async function saveModulesAction(keys: string[]): Promise<void> {
  await requireOwner();
  await saveModules(Array.isArray(keys) ? keys.map(String) : []);
}

export async function skipOnboardingAction(): Promise<void> {
  await requireOwner();
  await skipOnboarding();
  redirect("/workspace");
}
