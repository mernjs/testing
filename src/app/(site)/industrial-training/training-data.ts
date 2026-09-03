export interface TrainingCourse {
  slug: string;
  title: string;
  category: string;
  summary: string;
  duration: string;
  workload: string; // ISO 8601 duration string, e.g. "P6W"
  mode: string[];
  credential: string;
  topics: string[];
}

export const trainingCourses: TrainingCourse[] = [
  {
    slug: "mern-stack",
    title: "MERN Stack Industrial Training",
    category: "Full Stack Web Development",
    summary: "Hands-on MERN Stack training covering MongoDB, Express, React, and Node.js — build and deploy real full-stack applications with mentor-led, project-based learning.",
    duration: "6–12 Weeks",
    workload: "P6W",
    mode: ["Online", "Offline"],
    credential: "Industrial Training Certificate of Completion",
    topics: ["MongoDB", "Express.js", "React.js", "Node.js", "REST APIs", "Tailwind CSS", "Git & Deployment"],
  },
  {
    slug: "mean-stack",
    title: "MEAN Stack Industrial Training",
    category: "Full Stack Web Development",
    summary: "Master enterprise web app development with MongoDB, Express, Angular, and Node.js — structured, mentor-guided industrial training built around real client workflows.",
    duration: "6–12 Weeks",
    workload: "P6W",
    mode: ["Online", "Offline"],
    credential: "Industrial Training Certificate of Completion",
    topics: ["MongoDB", "Express.js", "Angular", "Node.js", "TypeScript", "RxJS", "Enterprise Architecture"],
  },
  {
    slug: "generative-ai",
    title: "Generative AI Industrial Training",
    category: "Artificial Intelligence & ML",
    summary: "Learn to build production-grade GenAI apps — from LLM prompt pipelines and RAG systems to fine-tuning open-source models with mentor guidance.",
    duration: "6–12 Weeks",
    workload: "P6W",
    mode: ["Online", "Offline"],
    credential: "Industrial Training Certificate of Completion",
    topics: ["Python", "LLM APIs", "LangChain", "RAG Pipelines", "Vector Databases", "Prompt Engineering", "FastAPI"],
  },
  {
    slug: "agentic-ai",
    title: "Agentic AI Industrial Training",
    category: "Artificial Intelligence & ML",
    summary: "Master building autonomous AI agents — learn tool-use, multi-agent coordination, memory architectures, and production deployment with hands-on projects.",
    duration: "6–12 Weeks",
    workload: "P6W",
    mode: ["Online", "Offline"],
    credential: "Industrial Training Certificate of Completion",
    topics: ["Python", "LangGraph", "AutoGen", "Tool Calling", "Memory Architecture", "Multi-Agent Workflows"],
  },
  {
    slug: "conversational-ai",
    title: "Conversational AI Industrial Training",
    category: "Artificial Intelligence & ML",
    summary: "Build intelligent chatbots and voice assistants — from NLP foundations to deployment on web, mobile, and messaging platforms with real project mentorship.",
    duration: "6–12 Weeks",
    workload: "P6W",
    mode: ["Online", "Offline"],
    credential: "Industrial Training Certificate of Completion",
    topics: ["NLP", "Voice AI", "Rasa / Dialogflow", "Twilio / WhatsApp API", "Speech Recognition", "Intent Recognition"],
  },
  {
    slug: "computer-vision",
    title: "Computer Vision Industrial Training",
    category: "Artificial Intelligence & ML",
    summary: "Learn to build image and video intelligence systems — object detection, segmentation, optical character recognition, and real-time edge processing.",
    duration: "6–12 Weeks",
    workload: "P6W",
    mode: ["Online", "Offline"],
    credential: "Industrial Training Certificate of Completion",
    topics: ["OpenCV", "PyTorch / TensorFlow", "YOLO Object Detection", "OCR", "Image Segmentation", "Edge AI"],
  },
];

export function getCourseBySlug(slug: string): TrainingCourse | undefined {
  return trainingCourses.find((c) => c.slug === slug);
}
