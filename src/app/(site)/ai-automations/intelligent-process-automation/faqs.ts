export const ipaFaqs = [
  {
    question: "What is Intelligent Process Automation (IPA) and how is it different from traditional RPA?",
    answer: "Traditional Robotic Process Automation (RPA) follows fixed rules and breaks when it encounters exceptions or variation. Intelligent Process Automation combines workflow orchestration with AI capabilities — classification, extraction, decision-making — so the system can handle context-dependent decisions, incomplete data, and edge cases that would stall a pure rules-based system.",
  },
  {
    question: "Do we need to replace our existing systems to implement IPA?",
    answer: "No. IPA is designed to work with your existing stack. We build integration connectors into your current ERP, CRM, HRMS, or custom systems. The automation layer sits on top of what you already have, coordinating actions across systems rather than replacing them.",
  },
  {
    question: "How do you handle processes that have a lot of exceptions and edge cases?",
    answer: "Exception handling is the core design challenge in any automation project. We map every known exception path during discovery, build explicit handlers for the most frequent ones, and design human-in-the-loop escalation for cases that fall outside defined confidence thresholds. The system routes exceptions to a human with full context — not to a dead-letter queue.",
  },
  {
    question: "What happens when the automation makes a mistake?",
    answer: "We build audit trails into every system we deliver, so every action is logged and reversible where the underlying systems support it. Confidence thresholds and human review gates catch ambiguous cases before they complete. We also include monitoring dashboards that surface anomalous patterns so issues are caught early.",
  },
  {
    question: "How long does it take to automate a business process?",
    answer: "A single, clearly scoped process typically takes 4–6 weeks from discovery to production. More complex multi-system processes or multi-workflow suites run 8–14 weeks. Timeline depends heavily on the number of systems involved, the complexity of exception paths, and the availability of your team for UAT and sign-off.",
  },
  {
    question: "Can you automate processes that involve legacy systems without APIs?",
    answer: "Yes. For systems without available APIs, we use UI automation techniques to interact with the application at the interface level — the same approach used in RPA. This allows us to integrate legacy ERP or desktop software into an automation workflow without requiring changes to those underlying systems.",
  },
];
