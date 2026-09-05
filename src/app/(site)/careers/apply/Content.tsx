"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { SUCCESS_AUTO_HIDE_MS, useCareerApplySubmit } from "@/lib/useCareerApplySubmit";
import { useStableCardHeight } from "@/lib/useStableCardHeight";
import LeadSuccessState from "@/components/sections/LeadSuccessState";

const GENERAL_APPLICATION_VALUE = "";

export default function CareerApplyContent({
  positions,
  initialPositionSlug,
}: {
  positions: { slug: string; title: string; category: string }[];
  initialPositionSlug?: string;
}) {
  const [positionSlug, setPositionSlug] = React.useState<string>(initialPositionSlug ?? GENERAL_APPLICATION_VALUE);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [coverNote, setCoverNote] = React.useState("");
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const { status, error, fieldErrors, submit, reset } = useCareerApplySubmit();
  const { ref: cardBodyRef, minHeight: cardMinHeight } = useStableCardHeight(status === "success");

  const selectedPosition = positions.find((p) => p.slug === positionSlug);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!resumeFile) return;
    const ok = await submit({
      name,
      email,
      phone,
      coverNote: coverNote || undefined,
      positionSlug: positionSlug || undefined,
      resume: resumeFile,
      source: positionSlug ? "careers-job-page" : "careers-general",
    });
    if (ok) {
      setName("");
      setEmail("");
      setPhone("");
      setCoverNote("");
      setResumeFile(null);
    }
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <section className="relative overflow-hidden bg-background pt-28 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 border-b border-border/50">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
          <div className="absolute top-[10%] right-[5%] w-[50%] h-[50%] rounded-full bg-secondary/15 blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[70%] h-[70%] rounded-full bg-[#ff8e75]/15 blur-[140px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000"></div>
        </div>

        <div className="mx-auto max-w-3xl px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/40 border border-border/50 text-sm font-medium text-foreground backdrop-blur-md mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span>Careers at YashOrbit</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-4xl font-black tracking-tight text-foreground sm:text-5xl mb-6 leading-[1.1]">
            {selectedPosition ? (
              <>Apply for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff8e75]">{selectedPosition.title}</span></>
            ) : (
              <>Let&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff8e75]">work together</span>.</>
            )}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg leading-8 text-muted-foreground">
            Upload your resume and a short note — our hiring team reviews every application personally and responds within a few business days.
          </motion.p>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-background relative">
        <div className="mx-auto max-w-xl px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="p-8 sm:p-12 rounded-3xl bg-muted/20 border border-border/50 shadow-2xl backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
              <div ref={cardBodyRef} style={{ minHeight: cardMinHeight }} className="relative flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <LeadSuccessState
                      key="success"
                      title="Application sent!"
                      description="Thanks for applying. Our hiring team will review your application and get back to you soon."
                      onDismiss={reset}
                      autoHideMs={SUCCESS_AUTO_HIDE_MS}
                    />
                  ) : (
                    <form key="form" className="relative z-10 space-y-6" onSubmit={handleSubmit} noValidate>
                      <div>
                        <label htmlFor="position" className="block text-sm font-semibold text-foreground mb-2">Position</label>
                        <select
                          id="position"
                          value={positionSlug}
                          onChange={(e) => setPositionSlug(e.target.value)}
                          className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        >
                          <option value={GENERAL_APPLICATION_VALUE}>General Application</option>
                          {positions.map((p) => (
                            <option key={p.slug} value={p.slug}>{p.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="Enter your full name" />
                        {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">Email</label>
                          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="you@example.com" />
                          {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">Phone Number</label>
                          <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors" placeholder="Enter your phone number" />
                          {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
                        </div>
                      </div>
                      <div>
                        <label htmlFor="resume" className="block text-sm font-semibold text-foreground mb-2">Resume / CV (PDF or Word)</label>
                        <input
                          type="file"
                          id="resume"
                          required
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                          className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                        />
                        {resumeFile && <p className="text-xs text-muted-foreground mt-1">Selected: {resumeFile.name}</p>}
                        {fieldErrors.resume && <p className="text-xs text-red-500 mt-1">{fieldErrors.resume}</p>}
                      </div>
                      <div>
                        <label htmlFor="coverNote" className="block text-sm font-semibold text-foreground mb-2">Cover Note (optional)</label>
                        <textarea id="coverNote" rows={4} value={coverNote} onChange={(e) => setCoverNote(e.target.value)} className="w-full rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none" placeholder="Tell us why you'd be a great fit..."></textarea>
                        {fieldErrors.coverNote && <p className="text-xs text-red-500 mt-1">{fieldErrors.coverNote}</p>}
                      </div>
                      {fieldErrors.positionSlug && <p className="text-sm text-red-500 text-center">{fieldErrors.positionSlug}</p>}
                      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                      <button type="submit" disabled={status === "submitting"} className="group w-full rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed">
                        {status === "submitting" ? (
                          <>Sending <Loader2 className="w-4 h-4 animate-spin" /></>
                        ) : (
                          <>Submit Application <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                        )}
                      </button>
                      <p className="text-xs text-center text-muted-foreground mt-4">
                        By submitting this application, you agree to our <a href="/about/privacy-policy" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
                      </p>
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
