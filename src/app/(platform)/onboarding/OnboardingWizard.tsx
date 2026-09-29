"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Loader2, Plus, Trash2, X } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  COMPANY_SIZES,
  CURRENCIES,
  DEFAULT_MODULES,
  DEPARTMENT_TEMPLATES,
  INDUSTRIES,
  MODULES,
  ONBOARDING_STEPS,
  ROLE_PRESETS,
  type DepartmentTemplate,
  type Industry,
  type OnboardingStep,
} from "@/lib/platform/onboarding/catalog";
import type { ProfileInput } from "@/lib/platform/onboarding/state";
import type { StoredBranding } from "@/lib/platform/branding/types";
import BrandingForm from "@/components/platform/BrandingForm";
import { saveBrandingAction, uploadLogoAction } from "../settings/branding/actions";
import { applyStructureAction, finishTeamStepAction, inviteAction, revokeInviteAction, saveModulesAction, saveProfileAction, skipOnboardingAction, type InviteRow } from "./actions";

const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30";

interface Props {
  companyName: string;
  completedSteps: OnboardingStep[];
  profile: ProfileInput;
  existingDepartments: { id: string; name: string }[];
  invitations: { id: string; email: string; name: string; preset: string }[];
  enabledModules: string[] | null;
  timezones: string[];
  branding: StoredBranding;
}

export default function OnboardingWizard(props: Props) {
  const firstOpen = ONBOARDING_STEPS.findIndex((s) => !props.completedSteps.includes(s.key));
  const [step, setStep] = useState(firstOpen === -1 ? ONBOARDING_STEPS.length : firstOpen);
  const [industry, setIndustry] = useState<Industry | "">((props.profile.industry as Industry) || "");
  const done = step >= ONBOARDING_STEPS.length;
  const next = () => setStep((s) => s + 1);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Set up {props.companyName}</h1>
            <p className="text-sm text-muted-foreground">A few quick steps — everything can be changed later.</p>
          </div>
          {!done && (
            <form action={skipOnboardingAction}>
              <Button type="submit" variant="ghost" size="sm">
                Skip for now
              </Button>
            </form>
          )}
        </div>

        <ol className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-5" aria-label="Setup steps">
          {ONBOARDING_STEPS.map((s, i) => (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => setStep(i)}
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  i === step ? "border-primary bg-primary/5 font-semibold" : "border-border text-muted-foreground hover:bg-muted/50",
                )}
              >
                <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full text-xs", i < step || props.completedSteps.includes(s.key) ? "bg-primary text-primary-foreground" : "bg-muted")}>
                  {i < step || props.completedSteps.includes(s.key) ? <Check className="size-3" /> : i + 1}
                </span>
                {s.label}
              </button>
            </li>
          ))}
        </ol>

        {step === 0 && <ProfileStep initial={props.profile} timezones={props.timezones} onIndustry={setIndustry} onDone={next} />}
        {step === 1 && <StructureStep industry={industry || "software_services"} existing={props.existingDepartments} onDone={next} />}
        {step === 2 && <TeamStep departments={props.existingDepartments} invitations={props.invitations} onDone={next} />}
        {step === 3 && (
          <StepCard title="Branding" description="Your logo, name and colour — shown across every panel, sign-in page, email and PDF.">
            <BrandingForm initial={props.branding} companyName={props.companyName} actions={{ save: saveBrandingAction, uploadLogo: uploadLogoAction }} submitLabel="Save & continue" onSaved={next} />
          </StepCard>
        )}
        {step === 4 && <ModulesStep industry={industry || "software_services"} enabled={props.enabledModules} onDone={next} />}
        {done && <DoneStep />}
      </div>
    </div>
  );
}

function StepCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <GlassCard>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </GlassCard>
  );
}

function Field({ label, error, children, htmlFor }: { label: string; error?: string; children: React.ReactNode; htmlFor: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// ── Step 1 ───────────────────────────────────────────────────────────────────

function ProfileStep({ initial, timezones, onIndustry, onDone }: { initial: ProfileInput; timezones: string[]; onIndustry: (i: Industry) => void; onDone: () => void }) {
  const [v, setV] = useState<ProfileInput>({ ...initial, country: initial.country || "India", timezone: initial.timezone || "Asia/Kolkata" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, start] = useTransition();
  const set = (k: keyof ProfileInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setV((p) => ({ ...p, [k]: e.target.value }));

  return (
    <StepCard title="Company profile" description="Used on invoices, payslips, letters and your website.">
      <form
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const res = await saveProfileAction(v);
            if (res.ok) {
              onIndustry(v.industry as Industry);
              onDone();
            } else setErrors(res.errors);
          });
        }}
      >
        <Field label="Company name" htmlFor="ob-name" error={errors.name}>
          <Input id="ob-name" value={v.name} onChange={set("name")} required />
        </Field>
        <Field label="Legal name (optional)" htmlFor="ob-legal">
          <Input id="ob-legal" value={v.legalName} onChange={set("legalName")} placeholder="As registered" />
        </Field>
        <Field label="What does your company do?" htmlFor="ob-industry" error={errors.industry}>
          <select id="ob-industry" className={selectClass} value={v.industry} onChange={set("industry")} required>
            <option value="">Choose…</option>
            {INDUSTRIES.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Team size" htmlFor="ob-size" error={errors.size}>
          <select id="ob-size" className={selectClass} value={v.size} onChange={set("size")} required>
            <option value="">Choose…</option>
            {COMPANY_SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Country" htmlFor="ob-country" error={errors.country}>
          <Input id="ob-country" value={v.country} onChange={set("country")} autoComplete="country-name" />
        </Field>
        <Field label="Currency" htmlFor="ob-currency" error={errors.currency}>
          <select id="ob-currency" className={selectClass} value={v.currency} onChange={set("currency")}>
            {CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Time zone" htmlFor="ob-tz" error={errors.timezone}>
          <select id="ob-tz" className={selectClass} value={v.timezone} onChange={set("timezone")}>
            {timezones.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Website (optional)" htmlFor="ob-web" error={errors.website}>
          <Input id="ob-web" value={v.website} onChange={set("website")} placeholder="https://" inputMode="url" />
        </Field>
        <Field label="Contact email (optional)" htmlFor="ob-email" error={errors.email}>
          <Input id="ob-email" type="email" value={v.email} onChange={set("email")} />
        </Field>
        <Field label="Phone (optional)" htmlFor="ob-phone">
          <Input id="ob-phone" type="tel" value={v.phone} onChange={set("phone")} />
        </Field>
        <div className="sm:col-span-2 flex justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <>Save & continue <ArrowRight className="size-4" /></>}
          </Button>
        </div>
      </form>
    </StepCard>
  );
}

// ── Step 2 ───────────────────────────────────────────────────────────────────

interface DeptRow extends DepartmentTemplate {
  selected: boolean;
  designationsText: string;
}

function StructureStep({ industry, existing, onDone }: { industry: Industry; existing: { id: string; name: string }[]; onDone: () => void }) {
  const router = useRouter();
  const existingNames = useMemo(() => new Set(existing.map((d) => d.name.toLowerCase())), [existing]);
  const [rows, setRows] = useState<DeptRow[]>(() => DEPARTMENT_TEMPLATES[industry].map((d) => ({ ...d, selected: true, designationsText: d.designations.join(", ") })));
  const [pending, start] = useTransition();
  const update = (i: number, patch: Partial<DeptRow>) => setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  return (
    <StepCard title="Departments & designations" description="A starting structure for your industry. Untick what you don't need, rename anything, add your own.">
      <div className="space-y-2">
        {rows.map((row, i) => {
          const exists = existingNames.has(row.name.trim().toLowerCase());
          return (
            <div key={i} className={cn("rounded-lg border p-3", !row.selected && "opacity-60")}>
              <div className="flex items-center gap-2">
                <input type="checkbox" aria-label={`Include ${row.name}`} checked={row.selected} onChange={(e) => update(i, { selected: e.target.checked })} className="size-4 accent-primary" />
                <Input value={row.name} onChange={(e) => update(i, { name: e.target.value })} aria-label="Department name" className="h-8 font-medium" />
                {exists && <span className="shrink-0 text-xs text-muted-foreground">already set up</span>}
              </div>
              <Input value={row.designationsText} onChange={(e) => update(i, { designationsText: e.target.value })} aria-label={`Designations in ${row.name}`} className="mt-2 h-8 text-xs" placeholder="Designations, comma separated" />
            </div>
          );
        })}
        <Button type="button" variant="outline" size="sm" onClick={() => setRows((r) => [...r, { name: "", code: "", designations: [], selected: true, designationsText: "" }])}>
          <Plus className="size-4" /> Add department
        </Button>
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          disabled={pending}
          onClick={() =>
            start(async () => {
              const chosen = rows
                .filter((r) => r.selected && r.name.trim())
                .map((r) => ({ name: r.name, code: r.code, designations: r.designationsText.split(",").map((s) => s.trim()).filter(Boolean) }));
              await applyStructureAction(chosen);
              router.refresh();
              onDone();
            })
          }
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <>Create & continue <ArrowRight className="size-4" /></>}
        </Button>
      </div>
    </StepCard>
  );
}

// ── Step 3 ───────────────────────────────────────────────────────────────────

function TeamStep({ departments, invitations, onDone }: { departments: { id: string; name: string }[]; invitations: Props["invitations"]; onDone: () => void }) {
  const router = useRouter();
  const blank = (): InviteRow => ({ email: "", name: "", preset: "developer", departmentId: "" });
  const [rows, setRows] = useState<InviteRow[]>([blank(), blank()]);
  const [result, setResult] = useState<{ sent: string[]; errors: string[] } | null>(null);
  const [pending, start] = useTransition();
  const update = (i: number, patch: Partial<InviteRow>) => setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  return (
    <StepCard title="Invite your team" description="Each person gets an email to set their password. Their role decides which panels they see — you can fine-tune it later in Users & Roles.">
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
            <Input type="email" placeholder="email@company.com" aria-label="Email" value={row.email} onChange={(e) => update(i, { email: e.target.value })} />
            <Input placeholder="Name (optional)" aria-label="Name" value={row.name} onChange={(e) => update(i, { name: e.target.value })} />
            <select className={selectClass} aria-label="Role" value={row.preset} onChange={(e) => update(i, { preset: e.target.value })}>
              {ROLE_PRESETS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <select className={selectClass} aria-label="Department" value={row.departmentId ?? ""} onChange={(e) => update(i, { departmentId: e.target.value })}>
              <option value="">No department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <Button type="button" variant="ghost" size="icon" aria-label="Remove row" onClick={() => setRows((r) => r.filter((_, j) => j !== i))}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => setRows((r) => [...r, blank()])}>
          <Plus className="size-4" /> Add person
        </Button>
      </div>

      {result && (
        <div className="mt-4 space-y-1 text-sm" aria-live="polite">
          {result.sent.length > 0 && <p className="text-emerald-600">Invited {result.sent.join(", ")}.</p>}
          {result.errors.map((e) => (
            <p key={e} className="text-destructive">
              {e}
            </p>
          ))}
        </div>
      )}

      {invitations.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold">Pending invitations</p>
          <ul className="divide-y rounded-lg border text-sm">
            {invitations.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="truncate">
                  {inv.email} <span className="text-muted-foreground">· {ROLE_PRESETS.find((p) => p.value === inv.preset)?.label}</span>
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Cancel invitation for ${inv.email}`}
                  onClick={() =>
                    start(async () => {
                      await revokeInviteAction(inv.id);
                      router.refresh();
                    })
                  }
                >
                  <X className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <Button
          variant="outline"
          disabled={pending || rows.every((r) => !r.email.trim())}
          onClick={() =>
            start(async () => {
              const res = await inviteAction(rows);
              setResult(res);
              if (res.sent.length) {
                setRows((r) => r.filter((row) => !res.sent.includes(row.email.trim().toLowerCase())));
                router.refresh();
              }
            })
          }
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : "Send invitations"}
        </Button>
        <Button
          disabled={pending}
          onClick={() =>
            start(async () => {
              await finishTeamStepAction();
              onDone();
            })
          }
        >
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </StepCard>
  );
}

// ── Step 4 ───────────────────────────────────────────────────────────────────

function ModulesStep({ industry, enabled, onDone }: { industry: Industry; enabled: string[] | null; onDone: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(enabled ?? DEFAULT_MODULES[industry]));
  const [pending, start] = useTransition();
  const toggle = (key: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });

  return (
    <StepCard title="Choose your panels" description="Turn on what your company uses. Everything else stays out of your team's way — switch panels on or off any time.">
      <div className="grid gap-2 sm:grid-cols-2">
        {MODULES.map((m) => {
          const on = m.core || selected.has(m.key);
          return (
            <label key={m.key} className={cn("flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors", on ? "border-primary/50 bg-primary/5" : "hover:bg-muted/50", m.core && "cursor-default")}>
              <input type="checkbox" className="mt-0.5 size-4 accent-primary" checked={on} disabled={m.core} onChange={() => toggle(m.key)} />
              <span>
                <span className="block text-sm font-semibold">
                  {m.label} {m.core && <span className="text-xs font-normal text-muted-foreground">· always on</span>}
                </span>
                <span className="block text-xs text-muted-foreground">{m.description}</span>
              </span>
            </label>
          );
        })}
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          disabled={pending}
          onClick={() =>
            start(async () => {
              await saveModulesAction([...selected]);
              onDone();
            })
          }
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <>Finish setup <Check className="size-4" /></>}
        </Button>
      </div>
    </StepCard>
  );
}

function DoneStep() {
  return (
    <StepCard title="You're all set" description="Your workspace is ready. Invited teammates will appear as they accept.">
      <Button render={<Link href="/workspace" />} nativeButton={false}>
        Go to your workspace <ArrowRight className="size-4" />
      </Button>
    </StepCard>
  );
}
