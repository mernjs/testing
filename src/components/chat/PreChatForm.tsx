"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Loader2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat, type PreChatFieldMode } from "@/components/chat/ChatProvider";

const FIELD_META: { key: "name" | "email" | "phone" | "company"; label: string; type: string; placeholder: string }[] = [
  { key: "name", label: "Name", type: "text", placeholder: "Jane Doe" },
  { key: "email", label: "Email", type: "email", placeholder: "jane@company.com" },
  { key: "phone", label: "Phone", type: "tel", placeholder: "+91 98765 43210" },
  { key: "company", label: "Company", type: "text", placeholder: "Acme Inc." },
];

export function PreChatForm({ wide = false }: { wide?: boolean }) {
  const { config, identify } = useChat();
  const preChat = config?.preChat;
  const [values, setValues] = React.useState({ name: "", email: "", phone: "", company: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);

  if (!preChat) return null;

  const visibleFields = FIELD_META.filter((f) => preChat.fields[f.key] !== "off");

  function set(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    // Light client-side check; the server is authoritative.
    const localErrors: Record<string, string> = {};
    for (const f of visibleFields) {
      const mode = preChat!.fields[f.key] as PreChatFieldMode;
      if (mode === "required" && !values[f.key].trim()) localErrors[f.key] = `${f.label} is required.`;
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      localErrors.email = "Enter a valid email address.";
    }
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }

    setSubmitting(true);
    const res = await identify(values);
    setSubmitting(false);
    if (!res.ok) setErrors(res.fieldErrors ?? { email: "Something went wrong. Please try again." });
  }

  return (
    <div className="flex flex-1 items-center justify-center overflow-y-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "w-full rounded-2xl border border-border/60 bg-background/70 p-5 shadow-lg shadow-black/5 backdrop-blur-xl sm:p-6",
          wide ? "max-w-md" : "max-w-full"
        )}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-yashorbit-coral text-white shadow-sm">
            <Bot className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">{preChat.title}</h3>
            {preChat.description && (
              <p className="text-xs leading-snug text-muted-foreground">{preChat.description}</p>
            )}
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {visibleFields.map((f) => {
            const required = preChat.fields[f.key] === "required";
            return (
              <div key={f.key} className="flex flex-col gap-1">
                <label htmlFor={`prechat-${f.key}`} className="text-xs font-medium text-foreground">
                  {f.label}
                  {required && <span className="ml-0.5 text-primary">*</span>}
                </label>
                <input
                  id={`prechat-${f.key}`}
                  type={f.type}
                  value={values[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.key, e.target.value)}
                  aria-invalid={Boolean(errors[f.key])}
                  className={cn(
                    "h-9 rounded-lg border bg-background/80 px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:ring-3 focus-visible:ring-primary/15",
                    errors[f.key] ? "border-destructive focus-visible:border-destructive" : "border-border/60 focus-visible:border-primary/50"
                  )}
                />
                {errors[f.key] && <p className="text-[11px] text-destructive">{errors[f.key]}</p>}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
            Start chat
          </button>

          {preChat.consentText && (
            <p className="flex items-start gap-1.5 pt-1 text-[10px] leading-tight text-muted-foreground/70">
              <ShieldCheck className="mt-px size-3 flex-none" />
              {preChat.consentText}
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
