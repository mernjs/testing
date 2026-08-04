export const aiAgentFaqs: { question: string; answer: string }[] = [
  { question: "How do you prevent an agent from taking the wrong action?", answer: "We build confidence thresholds and human-in-the-loop checkpoints for any action with real consequences, and start every agent in a supervised shadow mode before it acts autonomously." },
  { question: "Can an agent integrate with our specific CRM or internal tools?", answer: "Yes, agents are built with function calling into the specific systems your business already uses — we scope those integrations during the discovery phase." },
  { question: "What happens when the agent doesn't know what to do?", answer: "It escalates to a human with full context, rather than guessing — where that handoff happens is a design decision we make with you upfront." },
  { question: "How do you monitor agents once they're live?", answer: "We set up logging, tracing, and cost monitoring dashboards so you can see every action an agent takes and how it's performing." },
  { question: "Is this the same as a basic chatbot?", answer: "No, a basic chatbot answers questions; the agents we build take multi-step actions inside your real systems, with oversight built in." },
];
