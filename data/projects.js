/* =========================================================================
   projects.js — AI Projects & Experiments, plus detailed Case Studies.

   status (shown as a pill; grouped for the filter chips):
     "Live" | "Published" | "Completed" → Built
     "Prototype" | "In development"    → In progress
     "Experiment"                    → Experiments
     "Planned"                       → hidden from visitors (grid, search, topic
                                       counts, AI Desk) unless SITE.showPlannedProjects
   links: only REAL destinations. Every field is optional; a button appears
   only when its value is set. Never add placeholder or "#" links.
     github      repository URL
     demo        live demo URL
     caseStudy   slug of a case study below
     internal    { label, href } for an in-page destination (e.g. "#desk")
   evidence:    short factual proof points shown in the project detail
   screenshots: [{ src, alt, caption, width?, height? }] — real images in /assets only
   featured:    true on ONE real project shows it in the Featured AI Work slot
   Open a project's detail at  yoursite.com/#project-<slug>
   ========================================================================= */
window.SITE = window.SITE || {};

SITE.showPlannedProjects = false;

SITE.projects = [
  {
    slug: "corporate-data-analyzer",
    name: "AI-Powered Corporate Data Analyzer",
    status: "Completed",
    tagline: "No-code desktop data analysis app · personal project",
    problem: "Non-technical users need to analyze data and create charts without writing code.",
    solution: "Built a no-code desktop app in Python that analyzes data, creates charts and exports to Excel, CSV and PNG, using prompt engineering and AI-assisted coding.",
    ai: ["AI-assisted development (prompt engineering)"],
    role: "Built the application end to end through prompt engineering and AI-assisted coding",
    outcome: "Packaged as a standalone executable, with export to Excel, CSV and PNG.",
    evidence: [
      "Desktop interface in Tkinter; data handling in Pandas; charts in Matplotlib",
      "Exports results to Excel, CSV and PNG",
      "Packaged as a standalone executable"
    ],
    tools: ["Python", "Pandas", "Tkinter", "Matplotlib"],
    links: { github: null, demo: null },
    screenshots: [],
    topics: ["business", "tools", "ai"]
  },
  {
    slug: "sbma-ai",
    name: "SBMA AI — AI-Powered Business Intelligence Command Center",
    status: "Published",
    featured: true,
    date: "2026",
    tagline: "Published · functional AI data analysis and decision-support application",
    problem: "AI chat tools often approximate or invent numbers when asked to calculate over spreadsheet data, and sending whole files to an AI model exposes raw records.",
    solution: "Built an AI-powered data analysis command center: CSV, Excel and JSON intake, data profiling, data quality scoring, a query planner that turns plain-language questions into exact calculations, an AI Analyst, grounded AI insights, interactive charts, executive reports, workflows, alerts and system monitoring.",
    featuredSummary: "A published AI data analysis and decision-support command center. A deterministic TypeScript engine computes every number; Gemini only interprets the pre-calculated results.",
    ai: ["Gemini (narrative insights from pre-calculated results, via a server-side proxy)", "AI-assisted development"],
    role: "Directed the product concept, designed the workflow and analytical experience, built and tested the application, evaluated AI behavior and iterated, using AI tools for development assistance",
    outcome: "Published and deployed as a functional AI application. It runs in memory for a single user and is a portfolio and demonstration project, not a commercial product.",
    evidence: [
      "Deterministic analytics + AI-assisted interpretation: a TypeScript engine computes every count, rate, average and grouping; Gemini only writes the narrative from those results",
      "Query planner maps plain-language questions to exact measures, filters and groupings, and stops ID columns from being summed or averaged",
      "Automated diagnostics: 11/11 self-tests pass, runnable in the app's System Monitor, including an 8-metric benchmark over an 8,000-row aviation dataset",
      "Group-by reconciliation: flight distance by status (5,510,208 + 2,581,318 + 141,757 km) matches the 8,233,283 km total exactly",
      "AI fallback: up to 3 retries with backoff and a backup Gemini model; if AI is unavailable, the deterministic results stay on screen with a clear notice",
      "Security: Gemini API key kept server-side behind an Express proxy; raw data rows are never sent to Gemini; 20 MB request limit; no eval() or unsafe HTML injection",
      "TypeScript check passes with 0 errors and the production build succeeds"
    ],
    tools: ["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js / Express", "Gemini API", "PapaParse", "SheetJS", "Google Cloud Run"],
    links: { github: null, demo: null, caseStudy: "case-sbma" }, // demo: add the final SBMA Command Zone URL once it is set
    screenshots: [
      {
        src: "assets/sbma-command-center.jpg",
        width: 1600, height: 766,
        alt: "SBMA AI Command Center showing a Hospital Emergency Room dataset with data quality, AI insight and KPI cards, and a sidebar for data intake, data quality, AI insights, visualizations, reports, workflows, alerts and system monitoring.",
        caption: "Command Center · Hospital Emergency Room Operations dataset loaded"
      }
    ],
    topics: ["business", "tools", "genai"]
  },
  {
    slug: "brandforge-ai",
    name: "BrandForge AI",
    status: "Completed",
    date: "2026",
    tagline: "9-step pipeline · 3-tier AI fallback · ₹0 running cost",
    featuredSummary: "An AI brand identity studio that turns a business idea into a complete brand kit in minutes, built 100% on free-tier AI.",
    problem: "Building a brand identity takes weeks and costs thousands at an agency, and the original course workflow needed 6+ separate tools.",
    solution: "An AI brand identity studio that turns a business idea into a complete brand kit in minutes, built 100% on free-tier AI.",
    ai: ["Gemini API (free tier)", "Prompt engineering", "Google AI Studio (Build mode)"],
    role: "Solo builder: product idea, prompt design, architecture decisions, testing and iteration",
    outcome: "A 9-step app: brief, names, palette, logo, mockups, motion reel, content calendar, landing page and a downloadable brand kit. Built and bug-fixed over 2 days.",
    evidence: [
      "9-step flow from a short brief to PDF guidelines and a ZIP of all assets",
      "3-tier image fallback: Gemini → Pollinations.ai → rendered SVG mockups, with a badge showing the source",
      "Runs on free-tier AI only (₹0 running cost); quota errors are caught and switched to a backup",
      "Step 6 is a browser-rendered Motion Reel (HTML Canvas + MediaRecorder), not AI-generated video"
    ],
    tools: ["Gemini API", "Prompt Engineering", "Google AI Studio", "React", "TypeScript", "Canvas API"],
    links: { github: null, demo: null, caseStudy: "case-brandforge" }, // demo: add the Google AI Studio share link
    screenshots: [
      {
        src: "assets/brandforge/03-names.jpg",
        width: 1600, height: 703,
        alt: "BrandForge AI Step 2, Curated Brand Names: six AI-suggested names with taglines and strategic rationale, Jolly Beans Coffee selected.",
        caption: "Step 2 · Brand Names for the Jolly Beans Coffee preset"
      }
    ],
    topics: ["creativity", "genai", "tools"]
  },
  {
    slug: "ai-desk-portfolio",
    name: "The AI Desk — AI Generalist Portfolio",
    status: "Live",
    date: "2026",
    tagline: "This website · data-driven AI Generalist portfolio",
    problem: "Most AI portfolios look like developer sites or generic blogs. Neither shows research process or working standards.",
    solution: "Designed and built this data-driven portfolio: projects, research, certifications, search, filters and a resume generated from the same data.",
    ai: ["Claude (design and code collaboration)"],
    role: "Brand positioning, content strategy, information structure, art direction",
    outcome: "This website. Every section is driven by plain data files, so new projects, research and articles can be added in minutes.",
    evidence: [
      "The site you are viewing: responsive HTML, CSS and JavaScript with topic filtering, global search and dark/light themes",
      "ATS-friendly resume generated from the same data, viewable on the site and downloadable as PDF and Word",
      "Tested at phone, tablet and desktop widths, with keyboard navigation, reduced motion and an automated accessibility check"
    ],
    tools: ["HTML", "CSS", "JavaScript"],
    links: { github: null, demo: null, caseStudy: "case-portfolio" },
    screenshots: [],
    topics: ["tools", "creativity", "ai"]
  },
  {
    slug: "ask-the-ai-desk",
    name: "Ask Salil's AI Desk",
    status: "Experiment",
    tagline: "Scripted Q&A demo on this site · no live AI model",
    problem: "Visitors want quick answers about what I work on and how to collaborate, without reading the whole site.",
    solution: "Designed a scripted, terminal-style assistant that answers common questions from the site's own data, with an integration point for a future AI model.",
    ai: ["Scripted demo mode (no live model yet)", "Designed for a future LLM API via a server-side proxy"],
    role: "Concept, conversation design, interface design",
    outcome: "Working frontend demo, clearly labelled as scripted so visitors are never misled.",
    evidence: [
      "Try it on this page: answers come from the site's own project, research and certification data"
    ],
    tools: ["JavaScript", "Conversation design"],
    links: { github: null, demo: null, internal: { label: "Open the AI Desk", href: "#desk" } },
    screenshots: [],
    topics: ["tools", "genai"]
  },

  /* ---- Planned: hidden from visitors until built ---- */
  {
    slug: "ai-tool-evaluation-log",
    name: "AI Tool Evaluation Log",
    status: "Planned",
    problem: "Tool reviews often rely on first impressions and vendor claims.",
    solution: "A public, structured log of AI tools tested on the same tasks, with dates, versions and repeatable criteria.",
    ai: ["ChatGPT", "Claude", "Gemini", "Perplexity", "NotebookLM"],
    role: "Test design, evaluation, write-up",
    outcome: null,
    tools: ["Spreadsheet", "GitHub"],
    links: {},
    topics: ["tools", "research"]
  },
  {
    slug: "ai-research-verification-workflow",
    name: "AI Research Verification Workflow",
    status: "Planned",
    problem: "AI tools speed up research but make it easier for errors to slip into work.",
    solution: "A documented, reusable workflow for using AI in research while keeping every important claim traced to a primary source.",
    ai: ["Research assistants", "Transcription", "Summarization"],
    role: "Workflow design, documentation",
    outcome: null,
    tools: ["Notion or Docs", "Checklists"],
    links: {},
    topics: ["ethics", "tools", "research"]
  }
];

/* Case studies — opened in the reader panel. Section order:
   challenge → role → approach → stack → implementation → testing → outcome →
   lessons → remaining (what's unfinished) → next
   Any section left null is hidden. Fill them only with real information. */
SITE.caseStudies = [
  {
    slug: "case-sbma",
    project: "sbma-ai",
    title: "SBMA AI: Exact Numbers First, AI Interpretation Second",
    summary: "A published AI data analysis command center that computes every figure deterministically and uses Gemini only to explain the results.",
    topics: ["business", "tools", "genai"],
    sections: {
      challenge: "Language models are not calculators. Asked to analyze a spreadsheet, they can approximate sums, invent metrics, collapse multi-metric questions and treat ID columns as numbers. Sending whole files to an AI API also exposes raw records.",
      role: "I directed the product concept, designed the workflow and the analytical experience, built and tested the application, evaluated the AI's behavior and iterated on the system. I used AI tools for development and analysis assistance.",
      approach: "Separate computation from interpretation. A deterministic TypeScript engine profiles the data, scores its quality and runs every calculation. A rule-based query planner turns a plain-language question into exact measures, filters and groupings. Gemini receives only the calculated results, formulas and column metadata, and writes the explanation.",
      stack: ["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js / Express (server proxy)", "Gemini API (narrative layer only)", "PapaParse and SheetJS (CSV / Excel parsing)", "Native SVG charts", "Google Cloud Run"],
      implementation: "Modules: data intake (CSV, Excel with a sheet picker, JSON), data profiling (types, missing values, quartiles, distributions), data quality (0–100 score, letter grade, duplicates, IQR outliers), an AI Analyst that runs the calculation first and then shows Gemini's narrative, grounded AI insights, interactive charts (bar, line, area, donut, heatmap), executive reports with CSV and JSON export, workflows, alerts and a system monitor. Security: the Gemini API key stays on the server behind an Express proxy, raw rows are never sent to Gemini, requests are capped at 20 MB, and there is no eval() or unsafe HTML injection.",
      testing: "11/11 automated self-tests pass, runnable in the app's System Monitor. They include an 8-metric benchmark over 8,000 aviation records (8,000 flights, 2,511 delayed, 31.39% delay rate) and a group-by check where distance by flight status reconciles exactly to the 8,233,283 km total. The TypeScript check passes with 0 errors and the production build succeeds. The AI fallback (3 retries with backoff, a backup model, deterministic results when AI is offline) was tested with simulated failures. End-to-end browser tests aren't set up yet.",
      outcome: "Published and deployed as a functional AI application. It runs in memory for a single user and is a portfolio and demonstration project, not a commercial product.",
      lessons: null, // add: what you learned building it, in your words
      remaining: "On the documented roadmap, not built yet: persistent storage (PostgreSQL / Cloud SQL), user accounts with role-based access, streaming AI responses (SSE), external database connectors, scheduled email and webhook alerts, and multi-user collaboration. Today, data resets on page refresh and the app is suited to datasets of about 100,000 rows.",
      next: null
    }
  },  {
    slug: "case-brandforge",
    project: "brandforge-ai",
    page: "projects/brandforge-ai.html",   // full case study lives on its own page
    title: "BrandForge AI: A Complete Brand Kit on Free-Tier AI",
    summary: "From a short business brief to names, palette, logo, mockups, a motion reel and a downloadable brand kit, in one app at ₹0 running cost.",
    topics: ["creativity", "genai", "tools"],
    sections: {
      challenge: "A brand identity takes weeks and 6+ separate tools.",
      role: "Solo builder",
      approach: "Learn → Explore → Experiment → Build → Analyze → Apply",
      implementation: "9-step app with a 3-tier image fallback",
      stack: ["Google AI Studio", "Gemini API", "React", "TypeScript", "Canvas API"],
      testing: "Tested with a coffee brand and a SaaS brand",
      outcome: "Complete brand kit in one app at ₹0 running cost",
      lessons: "Designing for failure is what makes an AI product usable.",
      remaining: null,
      next: "Real AI video generation if a budget becomes available"
    }
  },

  {
    slug: "case-portfolio",
    project: "ai-desk-portfolio",
    listed: false, // reachable from the portfolio project; kept out of the case-study list to avoid featuring the site twice
    title: "Building an AI Generalist Portfolio",
    summary: "How this site was designed to show research process and working standards, not just finished pieces.",
    topics: ["creativity", "tools", "ai"],
    sections: {
      challenge: "Present an AI Generalist's work credibly before a large body of work exists, without inventing credentials, numbers or results.",
      role: "Positioning, content strategy, information structure and art direction. Claude assisted with design and code; I directed, reviewed and approved each phase.",
      approach: "Defined the positioning (AI Generalist × research × building × applying) and a content model covering projects, research, certifications, topics and articles, so every claim maps to real data.",
      stack: ["Claude (design and code collaboration)", "HTML", "CSS", "JavaScript"],
      implementation: "Built an editorial interface around that content model: project and research tracking, topic and status filters, site-wide search, a reader for projects and case studies, certifications, an ATS resume generated from the same data, and a scripted AI Desk. Responsive from phone to desktop, with keyboard access and reduced-motion support.",
      testing: "Tested at phone, tablet and desktop widths, with keyboard navigation, reduced motion and an automated accessibility check, after each build phase.",
      outcome: "A data-driven site where every project, study and certification is a plain JavaScript object, and unfinished work stays hidden until it's real.",
      lessons: "The strongest early signal of credibility is method: visible verification steps, labelled uncertainty and honest status labels.",
      remaining: "No articles have been published yet.",
      next: null
    }
  }
];
