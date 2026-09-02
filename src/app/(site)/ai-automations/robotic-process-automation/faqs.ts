export const rpaFaqs = [
  {
    question: "What is Robotic Process Automation (RPA)?",
    answer: "RPA uses software robots ('bots') to emulate human interactions with software interfaces — such as clicking buttons, logging into applications, copying and pasting data, filling out forms, and extracting tabular data. It allows you to automate repetitive tasks across desktop and web software without changing your underlying IT infrastructure.",
  },
  {
    question: "How is RPA different from API integrations?",
    answer: "API integrations connect systems at the code level using backend data protocols. RPA works at the user interface (UI) level by simulating human mouse clicks, keystrokes, and screen reading. RPA is ideal when systems do not offer APIs, when vendor software is locked, or when building custom APIs is too expensive.",
  },
  {
    question: "What happens when the application UI changes or updates?",
    answer: "Traditional RPA bots break when UI elements move. At YashOrbit, we build bots using semantic DOM matching, dynamic element selectors, and computer vision AI fallbacks. If a button moves or changes styling slightly, our bots adapt automatically. For major UI overhauls, we provide fast selector maintenance updates.",
  },
  {
    question: "Can RPA handle login credentials and passwords securely?",
    answer: "Yes. All sensitive credentials, API keys, and access tokens are stored in encrypted enterprise credential vaults (such as Azure Key Vault or AWS Secrets Manager). Bots fetch secrets securely at runtime and never log or expose passwords in plain text.",
  },
  {
    question: "What is the difference between Attended and Unattended RPA?",
    answer: "Attended bots run on an employee's local workstation and assist them with tasks on-demand (e.g. pre-filling a customer support screen). Unattended bots run autonomously 24/7 on background virtual servers according to schedules or event triggers without human intervention.",
  },
  {
    question: "How long does it take to deploy an RPA bot?",
    answer: "A straightforward task bot (e.g., scraping vendor prices or auto-populating web forms) typically takes 2–3 weeks from process recording to production deployment. Multi-app desktop workflows take 4–6 weeks.",
  },
];
