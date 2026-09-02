export const chatbotFaqs = [
  {
    question: "What makes an LLM-powered chatbot different from a traditional rule-based bot?",
    answer: "Traditional chatbots follow pre-scripted decision trees and break when users phrase requests differently from what was scripted. LLM-powered bots understand natural language intent regardless of phrasing, can handle multi-turn context, and can be given tools to take real actions in connected systems — not just return pre-written answers.",
  },
  {
    question: "How do you ensure the chatbot gives accurate answers about our products and policies?",
    answer: "We use Retrieval-Augmented Generation (RAG) — the bot retrieves relevant content from your actual documentation and knowledge base before generating a response. This grounds answers in your real content rather than the model's training data, dramatically reducing hallucination risk. We also test answer accuracy across representative queries before launch.",
  },
  {
    question: "Can the chatbot integrate with our existing CRM, helpdesk, or ERP systems?",
    answer: "Yes. Through tool calling and API integration, the bot can query and update records in your existing systems. We've integrated with Salesforce, Zendesk, Freshdesk, SAP, custom APIs, and many others. The integration scope is defined during discovery and built into the bot's action layer.",
  },
  {
    question: "What channels can the bot be deployed on?",
    answer: "We can deploy across website chat widgets, WhatsApp Business, mobile in-app chat, and voice channels. We design the core conversation logic once and adapt it for each channel's interaction model — so behaviour is consistent regardless of where the user engages.",
  },
  {
    question: "How does the bot handle sensitive customer data?",
    answer: "We implement role-based access controls, data masking for PII in conversation logs, and encrypted connections to all backend systems. The bot is given only the minimum permissions required to complete its defined tasks, and all actions are logged for audit purposes.",
  },
  {
    question: "What happens when the bot can't answer a question?",
    answer: "The bot is designed with defined escalation paths for situations where it hits its confidence threshold or authority limit. It transfers to a human agent with the full conversation context — so the agent doesn't need to re-ask what the user already explained. Escalation behaviour is tunable based on your business preference.",
  },
];
