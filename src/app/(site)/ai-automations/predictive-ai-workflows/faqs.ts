export const predictiveFaqs = [
  {
    question: "What data does a predictive AI workflow require to work?",
    answer: "The minimum requirement is historical operational data related to the outcome you want to predict — transaction history, event logs, sensor readings, CRM activity, or operational records. We conduct a data availability audit during discovery to assess whether your existing data contains enough signal to support an accurate predictive model, and what feature engineering is needed to extract it.",
  },
  {
    question: "How accurate do predictive models need to be to be useful?",
    answer: "Accuracy requirements depend on the business decision the model drives. For interventions with a low cost of action (like sending a retention email), even a model that's right 60% of the time can be highly valuable. For higher-stakes decisions, the bar is higher. We calibrate model thresholds against your specific business context — including the relative cost of false positives versus missed predictions — not against an abstract accuracy benchmark.",
  },
  {
    question: "Can you build predictive workflows on top of our existing data warehouse or BI system?",
    answer: "Yes. If you have a reliable data warehouse or analytics platform, we can build the ML layer on top of your existing data infrastructure — reducing the build scope significantly. We assess the quality and structure of the existing data foundation during discovery to confirm it meets the requirements for model training.",
  },
  {
    question: "How long before a predictive model needs to be retrained?",
    answer: "It depends on how quickly the underlying data patterns change. For some business contexts — seasonal retail demand — retraining may be needed quarterly. For others — stable industrial sensor patterns — models can run for longer. We build drift detection monitoring that measures when model performance is degrading and triggers retraining automatically or alerts your team when it's needed.",
  },
  {
    question: "What does 'connected to an operational trigger' actually mean in practice?",
    answer: "When the model scores an account as high-churn risk, that score triggers a CRM task for the account's customer success manager — automatically. When the demand forecast crosses a reorder threshold, a purchase order is created in the ERP — automatically. The model output is not just a report someone reads; it fires a specific operational action through a direct integration with your business systems.",
  },
  {
    question: "How do you prevent the system from firing too many false-positive alerts?",
    answer: "We calibrate the model's confidence threshold against your business's tolerance for false positives. During testing, we tune the threshold to find the balance between catching real events and avoiding alert fatigue. We also provide a monitoring dashboard showing trigger rates, false positive rates, and outcome rates — so thresholds can be adjusted over time based on observed results.",
  },
];
