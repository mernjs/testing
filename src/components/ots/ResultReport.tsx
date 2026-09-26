import { CheckCircle2, XCircle, MinusCircle, CircleDashed, CircleSlash } from "lucide-react";
import QuestionRenderer from "@/components/ots/QuestionRenderer";
import MarkItemForm from "@/components/ots/MarkItemForm";
import { SectionCard, Stat, Notice, Chip, PassBadge } from "@/components/ots/OtsUi";
import { SUBMIT_REASONS, fmtDuration, fmtMarks, fmtPct } from "@/lib/ots/constants";
import { formatDateTime } from "@/lib/utils";
import type { ResultView } from "@/lib/ots/attempts";

const STATUS: Record<string, { label: string; icon: React.ReactNode; tone: "green" | "rose" | "amber" | "slate" | "violet" }> = {
  correct: { label: "Correct", icon: <CheckCircle2 className="size-3.5" />, tone: "green" },
  incorrect: { label: "Incorrect", icon: <XCircle className="size-3.5" />, tone: "rose" },
  partial: { label: "Partially correct", icon: <MinusCircle className="size-3.5" />, tone: "amber" },
  unanswered: { label: "Not answered", icon: <CircleSlash className="size-3.5" />, tone: "slate" },
  pending: { label: "Pending evaluation", icon: <CircleDashed className="size-3.5" />, tone: "violet" },
};

/** One attempt's result — candidates see what the test allows; evaluators get marking controls. */
export default function ResultReport({ view, candidateName, evaluator }: { view: ResultView; candidateName?: string; evaluator?: { canEvaluate: boolean; canOverride: boolean; negatives: number[] } }) {
  const r = view.result;
  return (
    <div className="space-y-4">
      {!view.visible && <Notice>{view.hiddenReason}</Notice>}
      {view.submitReason && view.submitReason !== "MANUAL" && <Notice tone="warn">{`${SUBMIT_REASONS[view.submitReason]} (${view.submitReason}).`}</Notice>}
      {r && (
        <>
          {r.provisional && <Notice tone="warn">{`${r.pending} answer${r.pending === 1 ? " is" : "s are"} still being evaluated — the score below is provisional and pass/fail is decided once evaluation finishes.`}</Notice>}
          <SectionCard title="Result" description={`${candidateName ? `${candidateName} · ` : ""}Attempt ${view.attemptNo} · started ${formatDateTime(view.startedAt)}${view.submittedAt ? ` · submitted ${formatDateTime(view.submittedAt)}` : ""}`} action={<PassBadge passed={r.passed} provisional={r.provisional} />}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              <Stat label="Score" value={`${fmtMarks(r.finalScore)} / ${fmtMarks(r.totalMarks)}`} tone={r.provisional ? "warn" : r.passed ? "ok" : "danger"} />
              <Stat label="Percentage" value={fmtPct(r.percentage)} />
              <Stat label="Time taken" value={fmtDuration(r.timeTakenSec)} />
              <Stat label="Questions" value={r.totalQuestions} hint={`${r.attempted} attempted`} />
              <Stat label="Correct" value={r.correct} hint={r.partial ? `+${r.partial} partial` : undefined} tone="ok" />
              <Stat label="Incorrect / Skipped" value={`${r.incorrect} / ${r.unanswered}`} tone={r.incorrect ? "danger" : undefined} />
              <Stat label="Marks earned" value={fmtMarks(r.marksObtained)} />
              <Stat label="Negative marks" value={fmtMarks(r.negativeMarks)} tone={r.negativeMarks < 0 ? "danger" : undefined} />
              {r.pending > 0 && <Stat label="Pending evaluation" value={r.pending} tone="warn" />}
            </div>
          </SectionCard>
          {r.sections.length > 0 && (
            <SectionCard title="Section-wise performance">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="py-1 font-medium">Section</th>
                      <th className="py-1 text-right font-medium">Score</th>
                      <th className="py-1 text-right font-medium">Percentage</th>
                      <th className="py-1 text-right font-medium">Correct</th>
                      <th className="py-1 text-right font-medium">Incorrect</th>
                      <th className="py-1 text-right font-medium">Skipped</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.sections.map((s) => (
                      <tr key={s.index} className="border-t border-border/40">
                        <td className="py-1.5">{s.title}</td>
                        <td className="py-1.5 text-right tabular-nums">{`${fmtMarks(s.obtained)}/${fmtMarks(s.total)}`}</td>
                        <td className="py-1.5 text-right tabular-nums">
                          <span className="inline-flex items-center gap-2">
                            <span className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-muted sm:inline-block"><span className="block h-full bg-primary" style={{ width: `${Math.min(100, s.percentage)}%` }} /></span>
                            {fmtPct(s.percentage)}
                          </span>
                        </td>
                        <td className="py-1.5 text-right tabular-nums">{s.correct}</td>
                        <td className="py-1.5 text-right tabular-nums">{s.incorrect}</td>
                        <td className="py-1.5 text-right tabular-nums">{s.unanswered}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}
        </>
      )}
      {view.items.length > 0 && (
        <SectionCard title="Answers" description={view.detail === "correct" ? "Your answers with the correct answers." : "Your answers and the marks they earned."}>
          <ol className="space-y-6">
            {view.items.map((it) => {
              const st = STATUS[it.status] ?? STATUS.pending;
              return (
                <li key={it.index} className="space-y-2 border-b border-border/40 pb-5 last:border-0">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{`Q${it.index + 1}.`}</span>
                    <Chip>{it.typeLabel}</Chip>
                    <Chip tone={st.tone}>
                      <span className="mr-1">{st.icon}</span>
                      {st.label}
                    </Chip>
                    <Chip tone="blue">{`${it.awarded === null ? "—" : fmtMarks(it.awarded)} / ${fmtMarks(it.marks)}`}</Chip>
                    {view.sections.length > 1 && <span>{view.sections[it.section]}</span>}
                    {it.timeSec > 0 && <span>{`· ${fmtDuration(it.timeSec)}`}</span>}
                    {evaluator && <span className="font-mono">{it.code}</span>}
                  </div>
                  <QuestionRenderer prompt={it.prompt} media={it.media} view={it.view} response={it.response} readOnly inputId={`r-${it.index}`} />
                  {it.correctAnswer && <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-800 dark:text-emerald-300">{`Correct answer: ${it.correctAnswer}`}</p>}
                  {it.explanation && <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs whitespace-pre-wrap">{`Explanation: ${it.explanation}`}</p>}
                  {it.comment && <p className="rounded-lg bg-primary/5 px-3 py-2 text-xs">{`Evaluator: ${it.comment}`}</p>}
                  {evaluator && (evaluator.canEvaluate || evaluator.canOverride) && view.status !== "in_progress" && (
                    <MarkItemForm key={`${it.index}-${it.status}-${it.awarded}`} attemptId={view.attemptId} index={it.index} max={it.marks} min={-(evaluator.negatives[it.index] ?? 0)} current={it.awarded} comment={it.comment} pending={it.status === "pending" && evaluator.canEvaluate} override={evaluator.canOverride} />
                  )}
                </li>
              );
            })}
          </ol>
        </SectionCard>
      )}
    </div>
  );
}
