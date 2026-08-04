export const imageRecognitionSystemFaqs: { question: string; answer: string }[] = [
  { question: "How quickly is a blank capture detected?", answer: "Detection happens as part of the real-time processing pipeline, with alerts firing as soon as an issue is identified, not on a delayed batch review." },
  { question: "Does the system scale with our device fleet?", answer: "Yes, the serverless architecture scales processing capacity automatically as image volume grows or shrinks." },
  { question: "What counts as a flagged image?", answer: "Blank, obstructed, and other defective captures are flagged based on configurable detection thresholds." },
  { question: "Can we route alerts to different teams?", answer: "Yes, alert recipients and channels are configurable per device group or fleet segment." },
  { question: "Is there a historical record of processed images?", answer: "Yes, every processed image and any flagged issue is logged in an audit trail for later review." },
];