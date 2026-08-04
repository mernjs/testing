export const desktopAppDevelopmentFaqs: { question: string; answer: string }[] = [
  { question: "Should we use Electron or a fully native framework?", answer: "It depends on your performance needs, team's existing skills, and how deep your system-access requirements are — we'll assess your specific case rather than defaulting to one framework." },
  { question: "Can the app work without an internet connection?", answer: "Yes, offline-first design with local storage is one of our core patterns for desktop applications." },
  { question: "How do you handle software updates after release?", answer: "We build signed, staged auto-update pipelines so new versions roll out safely without manual reinstalls or workflow interruptions." },
  { question: "Can you modernize our existing legacy desktop application?", answer: "Yes, we regularly migrate legacy Windows Forms, MFC, or older Electron apps to modern frameworks incrementally, feature by feature." },
  { question: "Do you handle code signing and enterprise packaging?", answer: "Yes, we handle Authenticode/notarization code signing and enterprise-ready installer packaging as part of delivery." },
];
