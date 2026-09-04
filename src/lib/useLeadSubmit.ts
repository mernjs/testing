"use client";

import { useEffect, useState } from "react";
import type { CategorySlug } from "@/lib/categories";

type Status = "idle" | "submitting" | "success" | "error";

export const SUCCESS_AUTO_HIDE_MS = 30_000;

export interface LeadFormData {
  name: string;
  email?: string;
  phone: string;
  message?: string;
  subService?: string;
  resume?: File | null;
  source?: string;
}

export function useLeadSubmit() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function submit(category: CategorySlug, data: LeadFormData) {
    setStatus("submitting");
    setError(null);
    setFieldErrors({});

    const body = new FormData();
    body.set("name", data.name);
    if (data.email) body.set("email", data.email);
    body.set("phone", data.phone);
    if (data.message) body.set("message", data.message);
    if (data.subService) body.set("subService", data.subService);
    if (data.resume) body.set("resume", data.resume);
    if (data.source) body.set("source", data.source);

    try {
      const res = await fetch(`/api/leads/${category}`, {
        method: "POST",
        body,
      });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setStatus("error");
        setFieldErrors(json?.fields ?? {});
        setError(json?.error ?? "Something went wrong. Please try again.");
        return false;
      }

      setStatus("success");
      return true;
    } catch {
      setStatus("error");
      setError("Network error. Please check your connection and try again.");
      return false;
    }
  }

  function reset() {
    setStatus("idle");
    setError(null);
    setFieldErrors({});
  }

  // Auto-dismiss the success state after a while so the form is ready for another submission.
  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => {
      setStatus("idle");
      setError(null);
      setFieldErrors({});
    }, SUCCESS_AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [status]);

  return { status, error, fieldErrors, submit, reset };
}
