/* =========================================================================
   certifications.js — AI Certifications ("AI Knowledge & Applied Learning").
   Add future certifications as new objects in the array. Only `title`,
   `issuer` and `date` are required; every other field is optional and the
   card simply leaves that block out when it's missing.

   Fields
     slug           unique id, lowercase-with-hyphens
     title          certification name
     program        program the certification belongs to (optional)
     issuer         organization whose program/content it is
     platform       where it was completed (e.g. "Forage"), or null
     type           short label, e.g. "Professional Certificate", "Job Simulation"
     date           completion date, "YYYY-MM-DD"
     latest         true shows a small LATEST badge (use on one card)
     description    array of paragraphs
     framework      { label, steps: [] } — shown as a step chain
     modules        [{ title, text }] — program coverage, in a collapsible panel
     lists          [{ label, items: [] }] — extra bullet groups
     tools          array of tool names
     skills         array of skill tags
     skillsLabel    heading for the skill tags (default "Skills")
     image          keep null — cards never show certificate images
     focus          array — "Applied Focus" list
     takeaway       { label, lead, chain: [], text }
     credentialUrl  link to verify the credential, or null (shows "Credential link coming soon")
     topics         ids from topics.js (powers topic filtering + search)
   ========================================================================= */
window.SITE = window.SITE || {};

SITE.certifications = [
  {
    slug: "google-ai-professional-certificate",
    title: "Google AI Professional Certificate",
    issuer: "Google",
    platform: null,
    type: "Professional Certificate",
    date: "2026-10-02",
    latest: true,
    description: [
      "Completed a comprehensive AI-focused professional certificate covering practical applications of Artificial Intelligence and Generative AI."
    ],
    modules: [
      { title: "Artificial Intelligence & Generative AI", text: "Understanding practical applications of AI and Generative AI." },
      { title: "Prompt Engineering & Effective Prompting", text: "Learning effective prompting techniques for getting clearer, more useful and reliable AI outputs." },
      { title: "AI-powered Research & Insights", text: "Using AI to support research, information synthesis and insight generation." },
      { title: "AI for Brainstorming & Planning", text: "Using AI as a structured thinking partner for ideation, planning and problem solving." },
      { title: "AI for Writing & Communication", text: "Using AI to improve drafting, communication, refinement and content workflows." },
      { title: "AI-powered Content Creation", text: "Exploring AI-assisted approaches to content generation and creative workflows." },
      { title: "AI for Data Analysis", text: "Using AI to support data exploration, interpretation and analytical workflows." },
      { title: "AI App Building & Deployment", text: "Exploring how AI-powered applications can be built and deployed using modern AI development tools." },
      { title: "Responsible & Critical Use of AI", text: "Understanding the importance of evaluating AI outputs critically, recognizing limitations, and using AI responsibly." }
    ],
    modulesLabel: "Throughout the program, I developed hands-on understanding across",
    tools: ["Gemini", "NotebookLM", "Google Workspace AI", "Google AI Studio"],
    focus: [
      "AI & Generative AI",
      "Prompt Engineering",
      "AI Research",
      "AI-powered Problem Solving",
      "AI-assisted Data Analysis",
      "AI App Development",
      "AI-powered Content Creation",
      "Responsible AI"
    ],
    takeaway: {
      label: "Key Takeaway",
      lead: "AI can go beyond simply generating answers and become a powerful partner for:",
      chain: ["Thinking", "Research", "Analysis", "Creativity", "Communication", "Productivity"],
      text: "This certification strengthened my practical understanding of how AI can be integrated into real-world workflows."
    },
    credentialUrl: null, // add the Google verification link
    topics: ["ai", "genai", "tools", "ethics", "research"]
  },
  {
    slug: "be10x-ai-generalist",
    title: "AI Generalist",
    program: "AI Career Accelerator Program",
    issuer: "be10x",
    platform: null,
    type: "Certificate of Mastery", // credential type
    date: "2026-08-05",
    latest: false,
    image: null,
    description: [
      "Completed the AI Generalist track within the AI Career Accelerator Program, developing practical understanding across multiple areas of the modern AI ecosystem.",
      "The program strengthened my understanding of AI fundamentals, AI-powered product building, AI applications in data analytics, AI agents and autonomous systems, and AI branding and leadership.",
      "The certification represents a broad, cross-functional foundation in Artificial Intelligence rather than focusing on only one AI tool or technology."
    ],
    skillsLabel: "Core Expertise Gained",
    skills: [
      "AI Fundamentals & Ecosystem Mastery",
      "AI Product Building",
      "AI in Data Analytics",
      "AI Agents & Autonomous Systems",
      "AI Branding & Leadership"
    ],
    takeaway: {
      label: "Portfolio Summary",
      text: "A broad AI foundation covering the AI ecosystem, AI product building, data analytics, autonomous AI systems, and AI-driven branding and leadership."
    },
    credentialUrl: null, // add the be10x credential link
    topics: ["ai", "genai", "business", "tools"]
  },
  {
    slug: "vista-ai-in-action-job-simulation",
    title: "Vista Equity Partners AI in Action Job Simulation",
    issuer: "Vista Equity Partners",
    platform: "Forage",
    type: "Job simulation on Forage",
    date: "2026-02-19",
    latest: false,
    description: [
      "Completed a practical job simulation on Forage focused on prompt engineering and Generative AI workflow automation for Vista Equity Partners' Portfolio Operations team.",
      "Applied Vista's four-part prompt framework to synthesize customer NPS survey feedback into executive-ready insights. Through iterative prompt refinement, I improved the clarity and relevance of AI-generated outputs by more than 50%."
    ],
    framework: { label: "Four-part prompt framework", steps: ["Ask", "Context", "Examples", "Desired Output"] },
    lists: [
      { label: "Designed & tested repeatable GenAI workflows for", items: ["News aggregation", "Data reconciliation", "Qualitative insight summarization"] },
      { label: "Evaluated AI-generated outputs for", items: ["Accuracy", "Tone", "Usefulness", "Reliability"], note: "Implemented refinement techniques and guardrails to reduce errors and improve stakeholder usability." }
    ],
    tools: ["ChatGPT", "Microsoft Copilot"],
    skills: [
      "AI Development",
      "Analytical Thinking",
      "Business Acumen",
      "Contextual Understanding",
      "Information Summary",
      "Prompt Engineering",
      "Quality Assurance",
      "Risk Assessment",
      "Strategic Thinking"
    ],
    credentialUrl: null, // add the Forage completion certificate link
    topics: ["genai", "tools", "business"]
  }
];
