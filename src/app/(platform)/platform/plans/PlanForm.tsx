"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MODULES } from "@/lib/platform/onboarding/catalog";
import { savePlanAction } from "./actions";
import type { PlanFormErrors, PlanFormValues } from "./planForm";

const SELECTABLE = MODULES.filter((m) => !m.core);
const CORE_LABELS = MODULES.filter((m) => m.core).map((m) => m.label).join(", ");

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** Create (`mode: "create"`) or edit a plan. Prices are typed in rupees; blank limits mean unlimited. */
export default function PlanForm({ mode, initial, lockedDefault }: { mode: "create" | "update"; initial: PlanFormValues; lockedDefault?: boolean }) {
  const router = useRouter();
  const [values, setValues] = useState<PlanFormValues>(initial);
  const [errors, setErrors] = useState<PlanFormErrors>({});
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const set = <K extends keyof PlanFormValues>(key: K, value: PlanFormValues[K]) => setValues((v) => ({ ...v, [key]: value }));
  const describedBy = (id: keyof PlanFormErrors, hint = false) => (errors[id] ? `plan-${id}-error` : hint ? `plan-${id}-hint` : undefined);
  const inputProps = (id: keyof PlanFormErrors, hint = false) => ({ id: `plan-${id}`, "aria-invalid": errors[id] ? true : undefined, "aria-describedby": describedBy(id, hint) });

  function toggleModule(key: string, on: boolean) {
    setValues((v) => ({ ...v, modules: on ? [...new Set([...v.modules, key])] : v.modules.filter((m) => m !== key) }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    start(async () => {
      const res = await savePlanAction(mode, values);
      if (!res.ok) {
        setErrors(res.fieldErrors ?? {});
        setMessage({ ok: false, text: res.error });
        return;
      }
      setErrors({});
      router.push("/console/plans");
      router.refresh();
    });
  }

  const priceChanged = mode === "update" && (values.priceMonthly !== initial.priceMonthly || values.priceYearly !== initial.priceYearly);

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="plan-id" label="Plan id" hint={mode === "create" ? "Lowercase letters, digits and hyphens, e.g. starter. It can't be changed later." : "Plan ids can't be changed."} error={errors.id}>
          <Input {...inputProps("id", true)} value={values.id} onChange={(e) => set("id", e.target.value.toLowerCase())} disabled={mode === "update"} autoComplete="off" spellCheck={false} maxLength={32} required />
        </Field>
        <Field id="plan-name" label="Name" error={errors.name}>
          <Input {...inputProps("name")} value={values.name} onChange={(e) => set("name", e.target.value)} maxLength={60} required />
        </Field>
      </div>

      <Field id="plan-description" label="Description" error={errors.description}>
        <Textarea {...inputProps("description")} value={values.description} onChange={(e) => set("description", e.target.value)} maxLength={300} rows={2} />
      </Field>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-foreground">Price (₹, before GST)</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="plan-priceMonthly" label="Per month" error={errors.priceMonthly}>
            <Input {...inputProps("priceMonthly")} inputMode="decimal" value={values.priceMonthly} onChange={(e) => set("priceMonthly", e.target.value)} placeholder="0" />
          </Field>
          <Field id="plan-priceYearly" label="Per year" error={errors.priceYearly}>
            <Input {...inputProps("priceYearly")} inputMode="decimal" value={values.priceYearly} onChange={(e) => set("priceYearly", e.target.value)} placeholder="0" />
          </Field>
        </div>
        <p className={cn("text-xs", priceChanged ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground")} role={priceChanged ? "status" : undefined}>
          Price changes apply to new subscriptions only. Companies already subscribed keep paying what they signed up for until they change plan.
        </p>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-foreground">Panels</legend>
        <p className="text-xs text-muted-foreground">Always included: {CORE_LABELS}.</p>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-primary" checked={values.allModules} onChange={(e) => set("allModules", e.target.checked)} />
          Every panel (including panels added later)
        </label>
        {!values.allModules && (
          <div role="group" aria-label="Included panels" aria-describedby={errors.modules ? "plan-modules-error" : undefined} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SELECTABLE.map((m) => (
              <label key={m.key} className="flex items-start gap-2 rounded-lg border border-border p-2 text-sm">
                <input type="checkbox" className="mt-0.5 size-4 shrink-0 accent-primary" checked={values.modules.includes(m.key)} onChange={(e) => toggleModule(m.key, e.target.checked)} />
                <span className="min-w-0">
                  <span className="block font-medium">{m.label}</span>
                  <span className="block text-xs text-muted-foreground">{m.description}</span>
                </span>
              </label>
            ))}
          </div>
        )}
        {errors.modules && (
          <p id="plan-modules-error" className="text-xs text-destructive">
            {errors.modules}
          </p>
        )}
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-foreground">Limits</legend>
        <p className="text-xs text-muted-foreground">Leave a limit blank for unlimited.</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="plan-seats" label="Seats (users)" error={errors.seats}>
            <Input {...inputProps("seats")} inputMode="numeric" value={values.seats} onChange={(e) => set("seats", e.target.value)} placeholder="Unlimited" />
          </Field>
          <Field id="plan-aiTokensPerMonth" label="AI tokens per month" error={errors.aiTokensPerMonth}>
            <Input {...inputProps("aiTokensPerMonth")} inputMode="numeric" value={values.aiTokensPerMonth} onChange={(e) => set("aiTokensPerMonth", e.target.value)} placeholder="Unlimited" />
          </Field>
          <Field id="plan-storageMb" label="Storage (MB)" error={errors.storageMb}>
            <Input {...inputProps("storageMb")} inputMode="numeric" value={values.storageMb} onChange={(e) => set("storageMb", e.target.value)} placeholder="Unlimited" />
          </Field>
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="plan-trialDays" label="Free trial (days)" hint="0–90. 0 means no free trial. Applies to trials started from now on." error={errors.trialDays}>
          <Input {...inputProps("trialDays", true)} inputMode="numeric" value={values.trialDays} onChange={(e) => set("trialDays", e.target.value)} />
        </Field>
        <Field id="plan-sortOrder" label="Sort order" hint="Lower numbers are listed first." error={errors.sortOrder}>
          <Input {...inputProps("sortOrder", true)} inputMode="numeric" value={values.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} />
        </Field>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold text-foreground">Availability</legend>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="size-4 accent-primary" checked={values.active} disabled={lockedDefault} onChange={(e) => set("active", e.target.checked)} />
          Active — offered for new subscriptions
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4 accent-primary"
            checked={values.isDefault}
            disabled={lockedDefault}
            aria-describedby={errors.isDefault ? "plan-isDefault-error" : undefined}
            onChange={(e) => setValues((v) => ({ ...v, isDefault: e.target.checked, active: e.target.checked ? true : v.active }))}
          />
          Default plan for new sign-ups (replaces the current default)
        </label>
        {lockedDefault && <p className="text-xs text-muted-foreground">This is the default plan. To change that, make another plan the default.</p>}
        {errors.isDefault && (
          <p id="plan-isDefault-error" className="text-xs text-destructive">
            {errors.isDefault}
          </p>
        )}
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : mode === "create" ? "Create plan" : "Save plan"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/console/plans")} disabled={pending}>
          Cancel
        </Button>
        {message && (
          <p role="alert" className={cn("text-sm", message.ok ? "text-muted-foreground" : "text-destructive")}>
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
}
