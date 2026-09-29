"use client";

import { useRef, useState, useTransition } from "react";
import { ImageUp, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { brandInitials, type StoredBranding } from "@/lib/platform/branding/types";
import { readableOn } from "@/lib/platform/branding/theme";

const PRESETS = ["#1D428A", "#E56043", "#0F766E", "#7C3AED", "#DB2777", "#EA580C", "#16A34A", "#0891B2", "#111827"];

export interface BrandingFormActions {
  save: (input: { namePrimary: string; nameAccent: string; primaryColor: string | null; logoUrl: string | null }) => Promise<{ ok: true } | { ok: false; errors: Record<string, string> }>;
  uploadLogo: (form: FormData) => Promise<{ ok: true; url: string } | { ok: false; error: string }>;
}

/** Logo, wordmark and brand colour, with a live preview. Shared by Settings → Branding and the setup wizard. */
export default function BrandingForm({ initial, companyName, actions, submitLabel, onSaved }: { initial: StoredBranding; companyName: string; actions: BrandingFormActions; submitLabel: string; onSaved?: () => void }) {
  const [namePrimary, setNamePrimary] = useState(initial.namePrimary ?? companyName);
  const [nameAccent, setNameAccent] = useState(initial.nameAccent ?? "");
  const [color, setColor] = useState<string | null>(initial.primaryColor ?? null);
  const [logoUrl, setLogoUrl] = useState<string | null>(initial.logoUrl ?? null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [uploading, startUpload] = useTransition();
  const [saving, startSave] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const accent = color ?? "#E56043";

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_260px]">
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(false);
          startSave(async () => {
            const res = await actions.save({ namePrimary, nameAccent, primaryColor: color, logoUrl });
            if (res.ok) {
              setErrors({});
              setSaved(true);
              onSaved?.();
            } else setErrors(res.errors);
          });
        }}
      >
        <div className="space-y-2">
          <Label>Logo</Label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              aria-label="Upload logo"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.set("logo", file);
                startUpload(async () => {
                  const res = await actions.uploadLogo(fd);
                  if (res.ok) {
                    setLogoUrl(res.url);
                    setErrors((er) => ({ ...er, logoUrl: "" }));
                  } else setErrors((er) => ({ ...er, logoUrl: res.error }));
                });
                e.target.value = "";
              }}
            />
            <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => fileRef.current?.click()}>
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImageUp className="size-4" />} {logoUrl ? "Replace logo" : "Upload logo"}
            </Button>
            {logoUrl && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setLogoUrl(null)}>
                <Trash2 className="size-4" /> Remove
              </Button>
            )}
            <span className="text-xs text-muted-foreground">Square PNG, JPG or WebP, under 1 MB.</span>
          </div>
          {errors.logoUrl && <p className="text-xs text-destructive">{errors.logoUrl}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="br-primary">Name</Label>
            <Input id="br-primary" value={namePrimary} onChange={(e) => setNamePrimary(e.target.value)} maxLength={40} />
            {errors.namePrimary && <p className="text-xs text-destructive">{errors.namePrimary}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="br-accent">Accent part (optional)</Label>
            <Input id="br-accent" value={nameAccent} onChange={(e) => setNameAccent(e.target.value)} maxLength={40} placeholder="Shown in your brand colour" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="br-color">Brand colour</Label>
          <div className="flex flex-wrap items-center gap-2">
            {PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Use ${c}`}
                aria-pressed={color === c}
                onClick={() => setColor(c)}
                className="size-7 rounded-full border-2 transition-transform hover:scale-110 aria-pressed:border-foreground"
                style={{ backgroundColor: c }}
              />
            ))}
            <input id="br-color" type="color" value={accent} onChange={(e) => setColor(e.target.value)} className="h-7 w-10 cursor-pointer rounded border bg-transparent" aria-label="Custom colour" />
            {color && (
              <Button type="button" variant="ghost" size="sm" onClick={() => setColor(null)}>
                Default
              </Button>
            )}
          </div>
          {errors.primaryColor && <p className="text-xs text-destructive">{errors.primaryColor}</p>}
        </div>

        {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving || uploading}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : submitLabel}
          </Button>
          {saved && <span className="text-sm text-emerald-600" aria-live="polite">Saved — reload any open panel to see it.</span>}
        </div>
      </form>

      {/* Live preview */}
      <div className="space-y-3 rounded-xl border bg-muted/30 p-4" aria-hidden="true">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preview</p>
        <div className="flex items-center gap-2 rounded-lg bg-background p-3 text-base font-bold shadow-sm">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- uploaded logo preview
            <img src={logoUrl} alt="" className="size-7 rounded object-contain" />
          ) : (
            <span className="flex size-7 items-center justify-center rounded-md text-xs font-black" style={{ backgroundColor: accent, color: readableOn(accent) }}>
              {brandInitials(namePrimary + " " + nameAccent)}
            </span>
          )}
          <span>
            {namePrimary}
            <span style={{ color: accent }}>{nameAccent}</span>
          </span>
        </div>
        <span className="inline-block rounded-md px-3 py-1.5 text-sm font-semibold" style={{ backgroundColor: accent, color: readableOn(accent) }}>
          Primary button
        </span>
      </div>
    </div>
  );
}
