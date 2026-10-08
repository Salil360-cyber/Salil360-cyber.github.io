/* =========================================================================
   resume.js — single source for the resume.
   Used by:
     • the "View Resume" panel on the site (js/app.js)
     • scripts/build-resume.js, which generates the ATS-friendly
       assets/Salil_Gokhale_AI_Generalist_Resume.docx and .pdf
   Keep the object below valid JSON (double quotes, no trailing commas,
   no comments inside it) so the build script can read it.
   After editing, rebuild the files:  node scripts/build-resume.js
   ========================================================================= */
window.SITE = window.SITE || {};

SITE.resume = {
  "name": "Salil Gokhale",
  "headline": "AI Generalist | AI Research & Applications | Generative AI | Prompt Engineering | AI-Powered Analytics",
  "contact": {
    "location": "Gondia, Maharashtra, India",
    "phone": "+91-7558463422",
    "email": "gokhalesalil28@gmail.com",
    "linkedin": "linkedin.com/in/salil-gokhale-analytics",
    "github": "github.com/Salil360-cyber",
    "portfolio": null
  },
  "summary": "AI Generalist who applies Generative AI, prompt engineering and AI tools to research, analytics, automation and content workflows. Certified through the Google AI Professional Certificate and the be10x AI Generalist program, with applied GenAI workflow automation practice from the Vista Equity Partners AI in Action job simulation. Builds and tests AI-assisted applications, from a fitness companion with server-side AI workout generation to a no-code Python data analysis tool, and evaluates AI output for accuracy, reliability and responsible use.",
  "skills": [
    { "label": "AI & Generative AI", "items": ["Artificial Intelligence", "Generative AI", "Prompt Engineering", "AI Research", "Responsible AI"] },
    { "label": "AI Applications", "items": ["AI Workflow Automation", "AI Agents", "AI App Building", "AI-powered Research", "AI Content Creation", "AI-assisted Data Analysis"] },
    { "label": "AI Tools", "items": ["ChatGPT", "Claude", "Gemini", "Perplexity", "NotebookLM", "Google AI Studio", "Microsoft Copilot"] },
    { "label": "Data & Analytics", "items": ["Python (Pandas, Matplotlib)", "Data Visualization", "Data Reconciliation", "Insight Summarization"] },
    { "label": "Web & Deployment (AI-assisted)", "items": ["HTML", "CSS", "JavaScript", "Node.js", "Express", "PostgreSQL", "GitHub"] },
    { "label": "Research & Thinking", "items": ["Information Research", "AI Tool Evaluation", "AI Output Verification", "Critical Thinking", "Problem Solving"] }
  ],
  "experience": [],
  "projects": [
    {
      "name": "FitAI — AI-Powered Fitness & Workout Companion",
      "context": "Self-initiated AI product",
      "date": "2026",
      "bullets": [
        "Researched user needs through UX research, competitive analysis and a live Google Forms user survey.",
        "Designed information architecture, user flows and a high-fidelity interactive prototype covering onboarding, workouts and an AI coach.",
        "Built and deployed a Node.js, Express and PostgreSQL backend on Render with authentication, progress tracking and server-side AI workout generation, using AI-assisted development."
      ]
    },
    {
      "name": "AI-Powered Corporate Data Analyzer",
      "context": "Python desktop application",
      "date": "",
      "bullets": [
        "Developed a desktop data analysis app in Python (Pandas, Tkinter, Matplotlib) through prompt engineering and AI-assisted coding.",
        "Enabled non-technical users to analyze data and create charts without code, with Excel, CSV and PNG export; packaged as a standalone executable."
      ]
    },
    {
      "name": "SBMA AI — AI-Powered Business Intelligence Command Center",
      "context": "Published AI application",
      "date": "2026",
      "bullets": [
        "Built and published an AI data analysis command center (React, TypeScript, Express, Gemini API) where a deterministic engine computes every metric and Gemini only interprets pre-calculated results.",
        "Delivered data intake, profiling, quality scoring, a plain-language query planner, AI Analyst, charts and reports; 11/11 automated diagnostics pass, including an 8,000-row benchmark."
      ]
    },
    {
      "name": "The AI Desk — AI Generalist Portfolio",
      "context": "Personal portfolio site",
      "date": "2026",
      "bullets": [
        "Designed and built a responsive, data-driven portfolio in HTML, CSS and JavaScript with Claude, featuring topic filtering, global search and dark/light themes.",
        "Built a scripted on-site assistant that answers questions from site data, with an integration point for a future LLM API."
      ]
    }
  ],
  "certifications": [
    {
      "title": "Google AI Professional Certificate",
      "issuer": "Google",
      "date": "Oct 2026",
      "detail": "Generative AI, prompt engineering, AI-powered research, AI for data analysis, AI app building and deployment, responsible AI. Tools: Gemini, NotebookLM, Google AI Studio, Google Workspace AI.",
      "bullets": []
    },
    {
      "title": "AI Generalist, AI Career Accelerator Program (Certificate of Mastery)",
      "issuer": "be10x",
      "date": "Aug 2026",
      "detail": "AI fundamentals and ecosystem, AI product building, AI in data analytics, AI agents and autonomous systems, AI branding and leadership.",
      "bullets": []
    },
    {
      "title": "Vista Equity Partners AI in Action Job Simulation",
      "issuer": "Forage (Job Simulation)",
      "date": "Feb 2026",
      "detail": "",
      "bullets": [
        "Applied a four-part prompt framework (Ask, Context, Examples, Desired Output) to turn customer NPS feedback into executive-ready insights, improving AI output clarity and relevance by more than 50% through iterative refinement.",
        "Designed and tested GenAI workflows for news aggregation, data reconciliation and qualitative insight summarization in ChatGPT and Microsoft Copilot, with guardrails for accuracy and reliability."
      ]
    }
  ],
  "education": [
    { "degree": "MBA, Data Science and Business Analytics", "school": "DY Patil University", "date": "2026 – 2028 (expected)" },
    { "degree": "B.Sc., Microbiology", "school": "Dhote Bandhu Science College, Gondia, Maharashtra", "date": "2024" }
  ],
  "languages": ["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Telugu", "Kannada"],
  "files": {
    "pdf": "assets/Salil_Gokhale_AI_Generalist_Resume.pdf",
    "docx": "assets/Salil_Gokhale_AI_Generalist_Resume.docx"
  }
};
