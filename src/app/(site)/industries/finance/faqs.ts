export const financeFaqs: { question: string; answer: string }[] = [
  { question: "How do you ensure PCI-DSS compliance?", answer: "We design data flows to minimize cardholder data exposure, use tokenization wherever possible, and build with PCI-DSS control requirements in mind from the first architecture review." },
  { question: "Can you integrate with our existing core banking system?", answer: "Yes, we build API and middleware layers that connect to most legacy core banking systems, so you don't need a full replacement to modernize." },
  { question: "How do you handle fraud detection at scale?", answer: "We use real-time, ML-based transaction scoring combined with configurable rule engines, so fraud teams can tune sensitivity without waiting on engineering." },
  { question: "What regions' financial regulations do you have experience with?", answer: "We've worked with PCI-DSS and KYC/AML frameworks across multiple regions — we'll run a compliance scoping session upfront for your specific markets." },
  { question: "Do you provide post-launch security support?", answer: "Yes, we offer SLA-backed support including incident response, monitoring, and ongoing compliance reviews after launch." },
];
