export const healthcareFaqs: { question: string; answer: string }[] = [
  { question: "How do you ensure HIPAA compliance?", answer: "We design data flows to minimize PHI exposure, encrypt data in transit and at rest, and build with HIPAA's technical, administrative, and physical safeguards in mind from the first architecture review." },
  { question: "Can you integrate with our existing EHR/EMR system?", answer: "Yes, we build HL7/FHIR-based integration layers that connect to most major EHR/EMR systems, so you don't need a full replacement to modernize." },
  { question: "How reliable is your telehealth infrastructure?", answer: "We build on a CDN-backed WebRTC architecture with automatic quality adaptation, tested against real-world network conditions, not just ideal lab environments." },
  { question: "How is patient data secured?", answer: "PHI is encrypted end-to-end, access is role-based down to the individual record, and every access event is logged for audit purposes." },
  { question: "Do you provide post-launch support?", answer: "Yes, we offer SLA-backed support including incident response, monitoring, and ongoing compliance reviews after launch." },
];