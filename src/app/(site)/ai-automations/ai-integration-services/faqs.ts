export const integrationFaqs = [
  {
    question: "Do we need to replace our existing software to add AI capabilities?",
    answer: "No. Our AI Integration Services are specifically designed to add AI capabilities to your existing applications without requiring platform replacement. We build an integration layer that connects AI APIs and services to your current systems through their existing APIs — whether that's Salesforce, Zendesk, a custom ERP, or a proprietary application.",
  },
  {
    question: "How do you ensure the AI gives accurate answers about our specific products and policies?",
    answer: "We use Retrieval-Augmented Generation (RAG) — indexing your actual documentation, product data, and policies into a vector database. Before an LLM generates a response, the relevant content is retrieved and provided as context. This grounds the AI's answers in your real data rather than the model's general training knowledge, dramatically reducing hallucination risk.",
  },
  {
    question: "What AI providers do you work with?",
    answer: "We work with all major LLM providers — OpenAI (GPT models), Anthropic (Claude), Google (Gemini), Meta (Llama), and Mistral — as well as domain-specific AI APIs for vision, speech, and structured prediction. We recommend the provider and model best suited to your use case, latency requirements, and budget — and design the integration to be provider-portable where future flexibility matters.",
  },
  {
    question: "How do you handle data privacy when connecting business data to AI APIs?",
    answer: "We design data handling with privacy as a core constraint. This includes PII masking before data leaves your environment, data minimisation in prompts (sending only the minimum context needed), compliant API data handling under the provider's enterprise agreements, and options for self-hosted or private cloud model deployment where regulatory requirements preclude use of third-party API services.",
  },
  {
    question: "How do you control LLM API costs at scale?",
    answer: "We instrument API usage from the start and design prompt architectures that minimise token consumption without sacrificing output quality. We also implement caching for repeated queries, smart routing to cost-efficient models for simpler tasks, and cost dashboards that give you visibility into spend by feature and user segment — so costs scale predictably as usage grows.",
  },
  {
    question: "Can you integrate AI into a system that doesn't have a public API?",
    answer: "For systems without a public API, there are several options depending on the situation: direct database integration for read/write access, UI automation for systems with no integration path, or webhook-based event capture. We assess the available integration methods during discovery and recommend the most reliable and maintainable approach.",
  },
];
