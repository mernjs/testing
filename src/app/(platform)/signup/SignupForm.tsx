"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { Check, Eye, EyeOff, Loader2, MailCheck, X } from "lucide-react";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import GlassCard from "@/components/lms/GlassCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { slugFormatError, slugFromName } from "@/lib/platform/tenancy/slug";
import { checkSlugAction, startSignupAction, type SignupState } from "./actions";

const initialState: SignupState = {};
type SlugCheck = { for: string; state: "idle" | "checking" | "ok" | "bad"; message: string | null };

export default function SignupForm({ rootDomain }: { rootDomain: string }) {
  const [state, formAction, pending] = useActionState(startSignupAction, initialState);
  const [companyName, setCompanyName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [check, setCheck] = useState<SlugCheck>({ for: "", state: "idle", message: null });
  const [showPassword, setShowPassword] = useState(false);
  const ids = { company: useId(), slug: useId(), name: useId(), email: useId(), password: useId(), terms: useId() };
  const errors = state.errors ?? {};

  // Live availability check (debounced). Format problems are answered locally without a round trip.
  useEffect(() => {
    if (!slug) return;
    const local = slugFormatError(slug);
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (local) {
        if (!cancelled) setCheck({ for: slug, state: "bad", message: local });
        return;
      }
      if (!cancelled) setCheck({ for: slug, state: "checking", message: null });
      const res = await checkSlugAction(slug).catch(() => null);
      if (cancelled) return;
      setCheck(res ? { for: slug, state: res.available ? "ok" : "bad", message: res.message } : { for: slug, state: "idle", message: null });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [slug]);

  if (state.sentTo) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <GlassCard>
          <CardHeader>
            <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <MailCheck className="size-6 text-primary" />
            </div>
            <CardTitle className="text-xl">Check your inbox</CardTitle>
            <CardDescription>
              We sent a confirmation link to <strong className="text-foreground">{state.sentTo}</strong>. Open it to create your workspace — the link works for 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Nothing there? Check spam, or submit the form again to get a new link.</CardContent>
        </GlassCard>
      </motion.div>
    );
  }

  const fieldError = (msg?: string) => (msg ? <p className="text-xs text-destructive">{msg}</p> : null);
  // A result only counts for the address it was checked against.
  const current: SlugCheck = check.for === slug ? check : { for: slug, state: "idle", message: null };
  const slugMessage = errors.slug ?? (current.state === "bad" ? current.message : null);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
      <GlassCard>
        <CardHeader>
          <CardTitle className="text-xl">Create your workspace</CardTitle>
          <CardDescription>Free to start. Set up takes about two minutes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor={ids.company}>Company name</Label>
              <Input
                id={ids.company}
                name="companyName"
                required
                autoFocus
                autoComplete="organization"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (!slugEdited) setSlug(slugFromName(e.target.value));
                }}
                aria-invalid={!!errors.companyName || undefined}
              />
              {fieldError(errors.companyName)}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={ids.slug}>Workspace address</Label>
              <div className={cn("flex items-center rounded-md border border-input focus-within:ring-2 focus-within:ring-ring/50", slugMessage && "border-destructive")}>
                <Input
                  id={ids.slug}
                  name="slug"
                  required
                  value={slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""));
                  }}
                  className="border-0 shadow-none focus-visible:ring-0"
                  aria-invalid={!!slugMessage || undefined}
                  aria-describedby={`${ids.slug}-status`}
                />
                <span className="shrink-0 pr-3 text-sm text-muted-foreground">.{rootDomain}</span>
              </div>
              <p id={`${ids.slug}-status`} className={cn("flex items-center gap-1 text-xs", slugMessage ? "text-destructive" : "text-muted-foreground")} aria-live="polite">
                {current.state === "checking" && <Loader2 className="size-3 animate-spin" />}
                {current.state === "ok" && !errors.slug && <Check className="size-3 text-emerald-600" />}
                {slugMessage && <X className="size-3" />}
                {slugMessage ?? (current.state === "ok" ? "Available" : "Your team signs in here. You can add your own domain later.")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor={ids.name}>Your name</Label>
                <Input key={`name:${state.values?.name ?? ""}`} id={ids.name} name="name" required autoComplete="name" defaultValue={state.values?.name} aria-invalid={!!errors.name || undefined} />
                {fieldError(errors.name)}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={ids.email}>Work email</Label>
                <Input key={`email:${state.values?.email ?? ""}`} id={ids.email} name="email" type="email" required autoComplete="email" defaultValue={state.values?.email} aria-invalid={!!errors.email || undefined} />
                {fieldError(errors.email)}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={ids.password}>Password</Label>
              <div className="relative">
                <Input id={ids.password} name="password" type={showPassword ? "text" : "password"} required minLength={10} autoComplete="new-password" className="pr-9" aria-invalid={!!errors.password || undefined} />
                <Button type="button" variant="ghost" size="icon-xs" onClick={() => setShowPassword((v) => !v)} className="absolute top-1/2 right-1 -translate-y-1/2" aria-label={showPassword ? "Hide password" : "Show password"} tabIndex={-1}>
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
              {fieldError(errors.password) ?? <p className="text-xs text-muted-foreground">At least 10 characters.</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor={ids.terms} className="flex items-start gap-2 text-sm text-muted-foreground">
                <input id={ids.terms} name="acceptTerms" type="checkbox" className="mt-0.5 size-4 accent-primary" />
                I agree to the Terms of Service and Privacy Policy.
              </label>
              {fieldError(errors.acceptTerms)}
            </div>

            {errors.form && (
              <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errors.form}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : "Create workspace"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Already have a workspace? Sign in at <span className="font-medium text-foreground">your-company.{rootDomain}</span>
            </p>
          </form>
        </CardContent>
      </GlassCard>
    </motion.div>
  );
}
