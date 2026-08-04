export const aiMlSolutionsFaqs: { question: string; answer: string }[] = [
  { question: "Do we need a large dataset to build a custom model?", answer: "It depends on the problem, but we'll assess your data during discovery and recommend techniques like transfer learning if your dataset is smaller than ideal." },
  { question: "How do you make sure the model keeps working after launch?", answer: "We set up drift monitoring and a retraining cadence so accuracy issues get caught and addressed before they affect your business." },
  { question: "Can you take over a model we already built?", answer: "Yes, we regularly audit and take over existing models, including performance and bias reviews before proposing changes." },
  { question: "How do you handle bias and fairness in models?", answer: "We include bias and fairness review as a standard step in model validation, not an optional add-on, especially for models affecting individual users." },
  { question: "What's the difference between this and the AI Agent service?", answer: "AI/ML Solutions focuses on the predictive or generative models themselves; AI Agent focuses on autonomous systems that take multi-step actions, often using models like these as one component." },
];
