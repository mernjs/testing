export const visionIntelligenceFaqs: { question: string; answer: string }[] = [
  { question: "Do you need our historical camera footage to build the model?", answer: "Yes, ideally — real footage or images from your environment produce far more reliable models than generic public datasets. We'll help you collect a suitable sample if you don't have enough yet." },
  { question: "Can this run without a reliable internet connection?", answer: "Yes, we regularly deploy optimized models directly to edge hardware or on-site servers for locations with limited connectivity." },
  { question: "How accurate will detection be?", answer: "It depends on your specific use case and data quality, but we validate against a held-out test set and share honest precision and recall numbers before rollout, not just an average accuracy figure." },
  { question: "Can you help extract data from scanned paper documents, not just digital images?", answer: "Yes, OCR pipelines for scanned or photographed documents are a core part of this service." },
  { question: "What happens if the model starts missing new types of defects or objects?", answer: "We set up monitoring and a retraining cadence so the model adapts as new patterns show up in the real world." },
];
