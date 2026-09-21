"use client";

import { CalendarPlus } from "lucide-react";

function stamp(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Real reminder, no backend needed: an .ics file (Apple/Outlook) or a Google Calendar link for the campaign start. */
export default function AddToCalendar({ name, startsAt, endsAt, description }: { name: string; startsAt: string; endsAt: string; description?: string }) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  const title = `${name} goes live — YashOrbit`;
  const details = description ?? "Limited-time offers on software, AI, training, internships and developer hiring.";
  const url = typeof window !== "undefined" ? `${window.location.origin}/offers` : "https://yashorbit.com/offers";

  function downloadIcs() {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//YashOrbit//Offers//EN",
      "BEGIN:VEVENT",
      `UID:offer-${stamp(start)}@yashorbit`,
      `DTSTAMP:${stamp(new Date())}`,
      `DTSTART:${stamp(start)}`,
      `DTEND:${stamp(new Date(Math.min(start.getTime() + 3600_000, end.getTime())))}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details}\\n${url}`,
      `URL:${url}`,
      "BEGIN:VALARM",
      "TRIGGER:-PT15M",
      "ACTION:DISPLAY",
      `DESCRIPTION:${title}`,
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    a.download = "yashorbit-offer-reminder.ics";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${stamp(start)}/${stamp(new Date(Math.min(start.getTime() + 3600_000, end.getTime())))}&details=${encodeURIComponent(details + "\n" + url)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={downloadIcs} className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary">
        <CalendarPlus className="size-4" /> Add to calendar
      </button>
      <a href={google} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-muted-foreground underline underline-offset-2 hover:text-primary">
        Google Calendar
      </a>
    </div>
  );
}
