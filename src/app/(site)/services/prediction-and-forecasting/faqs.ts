export const predictionForecastingFaqs: { question: string; answer: string }[] = [
  { question: "How much historical data do we need for accurate forecasts?", answer: "It varies by use case, but we typically look for at least one to two full seasonal cycles of historical data — we'll assess what you have during the data audit phase." },
  { question: "Can you forecast without perfectly clean data?", answer: "Yes, part of our process is auditing and handling data quality issues; we'll tell you upfront if gaps are severe enough to limit accuracy." },
  { question: "How accurate will our forecasts be?", answer: "Accuracy depends heavily on your data and business volatility — we validate models against historical holdout periods and share honest accuracy metrics before rollout, not just optimistic estimates." },
  { question: "Do forecasts need to be retrained over time?", answer: "Yes, we set up monitoring and a retraining cadence so your models stay accurate as your business and data evolve." },
  { question: "Can this integrate with our existing BI tools?", answer: "Yes, forecasts are typically exposed via API or database views so they plug into dashboards like Grafana, Metabase, or Power BI." },
];
