export const smartSpamFilterFaqs: { question: string; answer: string }[] = [
  { question: "How is a call's spam score calculated?", answer: "Scoring is based on live calling patterns and signal data evaluated in real time, so it adapts as spam tactics change instead of relying on a static list." },
  { question: "Can I always let a specific number through?", answer: "Yes, allow-list entries always override the automatic score, so trusted numbers are never blocked." },
  { question: "Does it work if my connection drops?", answer: "As an installable PWA, core filtering rules keep working even with an intermittent connection." },
  { question: "Will legitimate customers ever get blocked by mistake?", answer: "False positives are possible with any scoring system, which is why allow-list overrides and score visibility are built in to catch and correct them quickly." },
  { question: "Can we adjust how aggressive the filtering is?", answer: "Yes, routing thresholds are configurable per account, so you can tune sensitivity to your call volume and risk tolerance." },
];