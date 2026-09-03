export interface InternshipRole {
  slug: string;
  title: string;
  category: string;
  summary: string;
  duration: string;
  location: string;
  stipend: string;
  responsibilities: string[];
  qualifications: string[];
  skills: string[];
  datePosted: string;
}

export const internshipRoles: InternshipRole[] = [
  {
    slug: "mern-stack",
    title: "MERN Stack Developer Intern",
    category: "Engineering & Development",
    summary: "A paid, 8–12 week MERN Stack internship — work inside a live MongoDB, Express, React, and Node.js codebase on real feature tickets, under a dedicated mentor.",
    duration: "8–12 Weeks",
    location: "Noida, India · Hybrid",
    stipend: "Performance-based Stipend + Certificate",
    responsibilities: [
      "Develop responsive UI components in React and Tailwind CSS.",
      "Build RESTful API endpoints with Node.js and Express.",
      "Write unit tests and debug full-stack feature tickets.",
      "Participate in daily standups and code reviews with senior engineers.",
    ],
    qualifications: [
      "Familiarity with HTML, CSS, JavaScript, and React basics.",
      "Basic understanding of Node.js and MongoDB fundamentals.",
      "Enthusiasm to learn and work on production codebases.",
    ],
    skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB", "Git"],
    datePosted: "2026-01-15T09:00:00+05:30",
  },
  {
    slug: "mean-stack",
    title: "MEAN Stack Developer Intern",
    category: "Engineering & Development",
    summary: "A paid, 8–12 week MEAN Stack internship — build enterprise features with MongoDB, Express, Angular, and Node.js with 1-on-1 mentorship.",
    duration: "8–12 Weeks",
    location: "Noida, India · Hybrid",
    stipend: "Performance-based Stipend + Certificate",
    responsibilities: [
      "Build dynamic Angular components and TypeScript services.",
      "Integrate backend REST APIs with Express and Node.js.",
      "Participate in database schema modeling and query optimization.",
      "Collaborate with senior developers on real client projects.",
    ],
    qualifications: [
      "Basic knowledge of TypeScript, Angular, and Node.js.",
      "Understanding of REST API concepts.",
      "Strong problem-solving mindset.",
    ],
    skills: ["TypeScript", "Angular", "Node.js", "Express", "MongoDB", "Git"],
    datePosted: "2026-01-15T09:00:00+05:30",
  },
  {
    slug: "generative-ai",
    title: "Generative AI Developer Intern",
    category: "Artificial Intelligence & ML",
    summary: "Work on live LLM features, prompt pipelines, and RAG architectures in production applications under expert AI engineering mentors.",
    duration: "8–12 Weeks",
    location: "Noida, India · Hybrid",
    stipend: "Performance-based Stipend + Certificate",
    responsibilities: [
      "Build and evaluate prompt templates and RAG retrieval pipelines.",
      "Integrate vector databases and OpenAI / Anthropic APIs.",
      "Test model outputs for accuracy, latency, and hallucination reduction.",
      "Collaborate with product team on AI feature prototypes.",
    ],
    qualifications: [
      "Proficiency in Python and basic understanding of ML concepts.",
      "Experience or side projects building with LLM APIs.",
      "Eagerness to explore the bleeding edge of AI.",
    ],
    skills: ["Python", "LLM APIs", "LangChain", "RAG", "Vector Databases", "FastAPI"],
    datePosted: "2026-01-15T09:00:00+05:30",
  },
  {
    slug: "agentic-ai",
    title: "Agentic AI Developer Intern",
    category: "Artificial Intelligence & ML",
    summary: "Hands-on internship building autonomous tool-using agents, multi-agent frameworks, and workflow automation under senior AI mentors.",
    duration: "8–12 Weeks",
    location: "Noida, India · Hybrid",
    stipend: "Performance-based Stipend + Certificate",
    responsibilities: [
      "Develop custom tools and function-calling modules for AI agents.",
      "Build multi-agent graph workflows using LangGraph / AutoGen.",
      "Test agent decision-making loops and memory persistence.",
      "Document agent architectures and API interfaces.",
    ],
    qualifications: [
      "Strong Python programming foundation.",
      "Familiarity with agentic frameworks or tool-use paradigms.",
      "Curious and self-driven learner.",
    ],
    skills: ["Python", "LangGraph", "AutoGen", "Function Calling", "Vector DBs"],
    datePosted: "2026-01-15T09:00:00+05:30",
  },
  {
    slug: "conversational-ai",
    title: "Conversational AI Intern",
    category: "Artificial Intelligence & ML",
    summary: "Build, train, and test 24/7 conversational chatbots and voice agents integrated with messaging platforms and web applications.",
    duration: "8–12 Weeks",
    location: "Noida, India · Hybrid",
    stipend: "Performance-based Stipend + Certificate",
    responsibilities: [
      "Design conversation flows, intent recognition, and entity extraction.",
      "Integrate chatbots with WhatsApp, Web, and backend services.",
      "Analyze conversation logs to improve intent matching accuracy.",
      "Test voice AI integrations and speech-to-text pipelines.",
    ],
    qualifications: [
      "Basic programming knowledge in Python or JavaScript.",
      "Interest in NLP, speech technologies, and chatbot design.",
      "Clear communication skills.",
    ],
    skills: ["Python", "NLP", "Dialogflow / Rasa", "WhatsApp API", "REST APIs"],
    datePosted: "2026-01-15T09:00:00+05:30",
  },
  {
    slug: "computer-vision",
    title: "Computer Vision Intern",
    category: "Artificial Intelligence & ML",
    summary: "Work on computer vision models for object detection, image classification, and real-time video analytics on live projects.",
    duration: "8–12 Weeks",
    location: "Noida, India · Hybrid",
    stipend: "Performance-based Stipend + Certificate",
    responsibilities: [
      "Annotate and preprocess image datasets for model training.",
      "Train and evaluate object detection and OCR models.",
      "Optimize model inference speeds for web and edge deployment.",
      "Support senior engineers with model benchmarking.",
    ],
    qualifications: [
      "Python programming skills with OpenCV or PyTorch experience.",
      "Understanding of basic image processing and CNN architectures.",
      "Analytical mindset.",
    ],
    skills: ["Python", "OpenCV", "PyTorch", "YOLO", "OCR", "Image Processing"],
    datePosted: "2026-01-15T09:00:00+05:30",
  },
];

export function getInternshipBySlug(slug: string): InternshipRole | undefined {
  return internshipRoles.find((r) => r.slug === slug);
}
