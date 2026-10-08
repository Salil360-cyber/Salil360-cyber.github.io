/* =========================================================================
   profile.js — who Salil is, how to reach him, and site-wide content.
   Edit values here; the UI re-renders from this file. Anything wrapped in
   [square brackets] or set to null is a PLACEHOLDER for you to replace.
   ========================================================================= */
window.SITE = window.SITE || {};

SITE.profile = {
  name: "Salil Gokhale",
  // Portrait shown in the About section. Set to null to fall back to the "SG" monogram.
  photo: { src: "assets/salil-gokhale.jpg", alt: "Portrait of Salil Gokhale", width: 640, height: 800 },
  primaryRole: "AI Generalist",
  roles: ["AI Researcher", "AI Practitioner", "AI Explorer"],
  heroHeadline: ["AI Generalist.", "Researcher.", "Explorer."],
  heroSub:
    "I research, test and build with AI: applications, workflows and AI-powered analytics.",
  heroIntro:
    "I'm Salil Gokhale, an AI Generalist. I've built FitAI, an AI fitness prototype with a deployed backend, a no-code Python data analyzer, and SBMA AI, a published AI data analysis command center. AI tools assist the work; the direction, testing and decisions are mine.",
  location: "Maharashtra, India",
  timezone: "IST (UTC+05:30)",
  availability: "Open to AI projects, research and collaboration", // edit freely
  contactLine: "I'm Salil Gokhale, an AI Generalist working across AI research, AI applications, AI workflows and AI-powered analytics. I'm open to AI projects, research, experimentation and problem-solving collaborations.",

  about: {
    positioning: ["AI Generalist", "AI Researcher", "AI Practitioner", "AI Explorer"],
    lead:
      "I am an AI Generalist and AI-focused practitioner exploring how artificial intelligence can be applied across research, analytics, automation, content creation, problem solving and emerging technology.",
    paragraphs: [
      "My work focuses on understanding how AI systems, tools and innovations are changing the way people research, create, communicate, analyze information and solve problems.",
      "I enjoy exploring AI developments, experimenting with AI tools, researching emerging technologies and translating complex AI concepts into clear, useful and accessible insights."
    ],
    approachLabel: "My approach combines",
    approach: ["Learn", "Explore", "Experiment", "Build", "Analyze", "Apply"],
    interests: [
      "Artificial Intelligence",
      "Generative AI",
      "Prompt Engineering",
      "AI Research",
      "AI-powered Research & Insights",
      "AI Tools",
      "AI Agents",
      "AI Automation",
      "AI App Building",
      "AI for Data Analytics",
      "AI-powered Content Creation",
      "AI for Business",
      "Responsible AI",
      "Emerging AI Technologies"
    ],
    /* Shown under "What I Can Do". Each item is backed by a project, certification or the resume. */
    strengthsLabel: "What I Can Do",
    strengths: [
      { title: "AI Research & Exploration", text: "Following new models and tools, going to documentation and primary sources, and stating uncertainty plainly." },
      { title: "AI Experimentation", text: "Testing AI tools hands-on with different prompts and inputs, and refining them until the output holds up." },
      { title: "AI Application Building", text: "Taking AI products from research to prototype, such as FitAI with server-side AI workout generation." },
      { title: "AI Workflow Design", text: "Designing repeatable GenAI workflows with structured prompts (Ask → Context → Examples → Desired Output)." },
      { title: "AI-powered Data Analysis", text: "Using AI to support data exploration and analysis, applied in the AI-Powered Corporate Data Analyzer and SBMA AI." },
      { title: "AI Problem Solving", text: "Checking AI output for accuracy and reliability, adding guardrails where it fails, and keeping human judgment on every result." }
    ],
    /* Left empty so the About section stays AI-only. Previous entries, if you want them back:
       { title: "Science-trained", text: "B.Sc. Microbiology. Evidence, methods and caveats come before headlines." },
       { title: "Multilingual", text: "English, Hindi, Marathi, Gujarati, Tamil, Telugu and Kannada. AI work that reaches beyond English-only audiences." },
       { title: "Designer's eye", text: "Graphic and visual design background, so work is built to be read and understood." } */
    differentiators: [],
    card: {
      role: "AI Generalist",
      focus: "Artificial Intelligence & Emerging Technology",
      interests: ["AI", "Generative AI", "AI Ethics", "AI Products", "Future of Work", "Technology"],
      approach: ["Learn", "Explore", "Experiment", "Build", "Analyze", "Apply"]
    }
  },

  contact: {
    email: "gokhalesalil28@gmail.com",
    // Set to the URL of a booking page or form, or leave null to use email.
    conversationUrl: null,
    resumeUrl: "assets/Salil_Gokhale_AI_Generalist_Resume.pdf" // built from data/resume.js by scripts/build-resume.js
  },

  socials: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/salil-gokhale-analytics", handle: "salil-gokhale-analytics" },
    { label: "GitHub", url: "https://github.com/Salil360-cyber", handle: "Salil360-cyber" },
    { label: "Email", url: "mailto:gokhalesalil28@gmail.com", handle: "gokhalesalil28@gmail.com" },
    /* Entries with url: null are hidden on the site. Add a URL to show them. */
    { label: "Medium / Substack", url: null, handle: "" },
    { label: "X (Twitter)", url: null, handle: "" }
  ],

  /* Stats — only stats with a real value are shown. If none have a value, the
     stats panel is hidden. Never estimate: add a number only when it's real. */
  stats: [
    { label: "Articles & stories", value: null },
    { label: "Research projects", value: null },
    { label: "AI tools explored", value: null },
    { label: "Topics covered", value: null }
  ],

  /* Timeline — edit, add or remove entries. */
  timeline: [
    {
      year: "2024",
      title: "Foundation",
      text: "Graduated with a B.Sc. in Microbiology and began exploring AI.",
      note: null
    },
    {
      year: "2025",
      title: "Analytics & AI exploration",
      text: "Built a foundation in data analytics alongside hands-on use of AI tools.",
      note: null
    },
    {
      year: "2026",
      title: "AI Generalist development",
      text: "Completed the Vista Equity Partners AI in Action job simulation on Forage (Feb), the be10x AI Generalist program (Aug) and the Google AI Professional Certificate (Oct). Began an MBA in Data Science & Business Analytics. Built FitAI and this portfolio, and built and published SBMA AI (started Sept).",
      note: null
    },
    {
      year: "Next",
      title: "Continuous experimentation",
      text: "Deepening hands-on work across AI research, AI workflows and AI-powered analytics, and finishing the projects in progress.",
      note: null
    }
  ],

  /* Skills — level is one of: "Core", "Working", "Learning". No percentages by design.
     use: why the tool/skill is used (optional)
     evidence: [{ label, href }] in-page links to the project, certification or
       research where it was actually used (optional; only real links). */
  skills: [
    {
      group: "AI & Research",
      items: [
        { name: "AI Research", level: "Core", use: "Structured studies of how AI tools behave", evidence: [{ label: "Citation accuracy study (in progress)", href: "#r-citation-accuracy-ai-research-assistants" }] },
        { name: "Prompt Engineering", level: "Core", use: "Structured prompts, tested and refined", evidence: [{ label: "Vista job simulation", href: "#c-vista-ai-in-action-job-simulation" }, { label: "Google AI certificate", href: "#c-google-ai-professional-certificate" }] },
        { name: "AI Tool Evaluation", level: "Working", use: "Comparing tools on the same task", evidence: [{ label: "Citation accuracy study (in progress)", href: "#r-citation-accuracy-ai-research-assistants" }] },
        { name: "Information Research", level: "Core" },
        { name: "AI Output Verification", level: "Working", use: "Checking accuracy, tone and reliability", evidence: [{ label: "Vista job simulation", href: "#c-vista-ai-in-action-job-simulation" }] },
        { name: "Technology Analysis", level: "Working" }
      ]
    },
    {
      group: "AI Tools",
      items: [
        { name: "ChatGPT", level: "Core", use: "Prompt engineering and GenAI workflows", evidence: [{ label: "Vista job simulation", href: "#c-vista-ai-in-action-job-simulation" }] },
        { name: "Claude", level: "Core", use: "AI-assisted development and research", evidence: [{ label: "FitAI", href: "#project-fitai" }, { label: "This portfolio", href: "#project-ai-desk-portfolio" }] },
        { name: "Gemini", level: "Working", use: "Generative AI, research and AI app building", evidence: [{ label: "SBMA AI", href: "#project-sbma-ai" }, { label: "Google AI certificate", href: "#c-google-ai-professional-certificate" }] },
        { name: "Perplexity", level: "Working", use: "AI-assisted research with sources" },
        { name: "NotebookLM", level: "Working", use: "Research and document synthesis", evidence: [{ label: "Google AI certificate", href: "#c-google-ai-professional-certificate" }] },
        { name: "Microsoft Copilot", level: "Working", use: "GenAI workflows", evidence: [{ label: "Vista job simulation", href: "#c-vista-ai-in-action-job-simulation" }] },
        { name: "Google AI Studio", level: "Learning", use: "Explored for AI app building", evidence: [{ label: "Google AI certificate", href: "#c-google-ai-professional-certificate" }] },
        { name: "Google Workspace AI", level: "Learning", use: "Explored for writing and productivity", evidence: [{ label: "Google AI certificate", href: "#c-google-ai-professional-certificate" }] }
      ]
    },
    {
      group: "AI Applications",
      items: [
        { name: "AI Workflow Automation", level: "Working", evidence: [{ label: "Vista job simulation", href: "#c-vista-ai-in-action-job-simulation" }] },
        { name: "AI App Building", level: "Working", evidence: [{ label: "FitAI", href: "#project-fitai" }, { label: "SBMA AI", href: "#project-sbma-ai" }] },
        { name: "AI-assisted Data Analysis", level: "Working", evidence: [{ label: "Corporate Data Analyzer", href: "#project-corporate-data-analyzer" }, { label: "SBMA AI", href: "#project-sbma-ai" }] },
        { name: "AI-powered Content Creation", level: "Working", evidence: [{ label: "Google AI certificate", href: "#c-google-ai-professional-certificate" }] },
        { name: "AI Agents", level: "Learning", evidence: [{ label: "be10x AI Generalist", href: "#c-be10x-ai-generalist" }] },
        { name: "Technical Writing", level: "Working" }
      ]
    },
    {
      group: "Technology",
      items: [
        { name: "HTML", level: "Learning", evidence: [{ label: "This portfolio", href: "#project-ai-desk-portfolio" }] },
        { name: "CSS", level: "Learning", evidence: [{ label: "This portfolio", href: "#project-ai-desk-portfolio" }] },
        { name: "JavaScript", level: "Learning", evidence: [{ label: "This portfolio", href: "#project-ai-desk-portfolio" }] },
        { name: "Python (Pandas, Matplotlib)", level: "Working", use: "Data analysis and charts", evidence: [{ label: "Corporate Data Analyzer", href: "#project-corporate-data-analyzer" }] },
        { name: "Data Visualization", level: "Working", evidence: [{ label: "Corporate Data Analyzer", href: "#project-corporate-data-analyzer" }, { label: "SBMA AI", href: "#project-sbma-ai" }] },
        { name: "Node.js & PostgreSQL (AI-assisted)", level: "Learning", use: "Backend and database", evidence: [{ label: "FitAI", href: "#project-fitai" }] },
        { name: "GitHub", level: "Working" }
      ]
    }
  ],

  /* Working principles (the last one, lead: true, is shown as the large closing card) */
  principles: [
    { title: "Verify important information", text: "Numbers, benchmarks and capability claims get checked against documentation or a second, independent source." },
    { title: "Separate evidence from assumptions", text: "What I tested, what a source says and what I'm inferring are kept clearly apart." },
    { title: "Evaluate AI outputs critically", text: "AI output is a draft, not an answer. I check it for accuracy, tone, usefulness and reliability before relying on it." },
    { title: "Test and validate workflows", text: "Prompts, workflows and prototypes are tested, refined and checked again before they're used." },
    { title: "Protect privacy", text: "I don't put sensitive or personal data into an AI tool without understanding how it is stored and used." },
    { title: "Use AI responsibly", text: "I recognize the limits of AI, state uncertainty plainly and avoid overstating what a tool can do." },
    { title: "Human oversight over automated output", text: "I use AI to research and build faster. Every result I share is checked, understood and owned by me.", lead: true }
  ],

  /* Prompt engineering as a loop — shown under the workflow. The applied example
     is the Vista Equity Partners AI in Action job simulation (Forage), not employment. */
  promptLoop: {
    title: "Prompt engineering, as a loop",
    steps: ["Understand the task", "Add context", "Define the output", "Test", "Evaluate", "Refine", "Validate", "Apply"],
    text: "A prompt is a draft like any other: it gets tested against the task, evaluated for accuracy and tone, and refined until the output holds up.",
    applied: {
      label: "Applied in",
      text: "Vista Equity Partners AI in Action — Job Simulation on Forage, using the simulation's four-part prompt framework (Ask → Context → Examples → Desired Output) to turn customer NPS feedback into executive-ready insights.",
      href: "#c-vista-ai-in-action-job-simulation",
      linkLabel: "See the simulation"
    }
  },

  /* "How I Explore & Build With AI" workflow (order matters: it is a real sequence) */
  workflow: [
    { key: "Discover", text: "Spot the signal: a new model, tool, paper or a problem worth solving with AI.", check: "Is this new, and is it useful to someone?" },
    { key: "Research", text: "Go to primary material: documentation, model cards, papers and real user experience.", check: "What does the original source actually say?" },
    { key: "Experiment", text: "Try it hands-on with different prompts, inputs and settings to see how it really behaves.", check: "What happens outside the demo?" },
    { key: "Build", text: "Turn what works into something concrete: a workflow, a prototype, an automation or a small app.", check: "Does this solve a real problem?" },
    { key: "Test", text: "Check outputs for accuracy, reliability and edge cases, and add guardrails where it fails.", check: "Would I trust this output without checking it?" },
    { key: "Analyze", text: "Compare results, measure what improved, and note limits and what is still unknown.", check: "What actually changed, and what didn't?" },
    { key: "Apply", text: "Put it to real use, document what I learned, and share it clearly.", check: "Could someone else use this with confidence?" }
  ],

  tagline: "Understanding AI. Questioning AI. Applying it well."
};
