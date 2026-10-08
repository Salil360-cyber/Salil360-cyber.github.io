/* =========================================================================
   research.js — Research & Investigations.

   status: "Completed" | "In progress" | "Planned"
     Only "Completed" studies may have findings. Never fill findings,
     insights or conclusions ahead of the evidence.
   statusNote: one honest sentence shown while a study isn't completed
   findings / keyInsights / conclusion: arrays of strings; empty = hidden
   sources: [{ label, url }]; empty = hidden
   visual: { src, alt } real chart/image in /assets; null = hidden
   reportUrl: link to the PDF/report; null = hidden
   visibility: "hidden" keeps a study in this file but off the site
   ========================================================================= */
window.SITE = window.SITE || {};

SITE.research = [
  {
    slug: "citation-accuracy-ai-research-assistants",
    status: "In progress",
    statusNote: "Study under way. Findings, insights and sources will be published here once the testing is complete.",
    title: "Do AI Research Assistants Cite Real, Relevant Sources?",
    question: "When popular AI assistants answer research questions with citations, how often do those citations exist, and how often do they support the claim they're attached to?",
    context: "Students, analysts and professionals increasingly use AI assistants for background research. A citation that looks valid but doesn't support the claim is harder to catch than an obvious error, and it can travel straight into finished work.",
    methodology: [
      "Write a fixed set of factual questions across AI, science and current-affairs topics.",
      "Ask each assistant (ChatGPT, Claude, Gemini, Perplexity, NotebookLM where applicable) the same questions with the same wording.",
      "Open every cited source and code it: exists / does not exist; supports / partially supports / does not support the claim.",
      "Record tool version, settings and date for every run so the test can be repeated."
    ],
    findings: [],
    keyInsights: [],
    conclusion: [],
    sources: [], // add: links to the question set and coding sheet
    visual: null,
    reportUrl: null,
    topics: ["research", "tools", "ethics"],
    tags: ["AI tools", "verification", "citations"]
  },
  {
    slug: "hype-language-in-ai-launches",
    status: "Planned",
    statusNote: "Planned. The question and method are defined; data collection hasn't started yet.",
    title: "Evidence vs. Claims in AI Product Announcements",
    question: "How often do AI product announcements use superlative or unverifiable claims, and how often do those claims come with evidence?",
    context: "Announcements shape how new AI tools are first understood. If bold capability claims routinely appear without supporting data, anyone choosing or evaluating AI tools needs a habit of asking for the evidence before relying on the claim.",
    methodology: [
      "Collect a corpus of AI product announcements over a defined period.",
      "Build a word list of unverifiable claim terms (e.g. 'revolutionary', 'breakthrough', 'human-level').",
      "Tag each claim as: evidence linked / evidence described / no evidence.",
      "Visualize the share of claims with evidence by company type."
    ],
    findings: [],
    keyInsights: [],
    conclusion: [],
    sources: [], // add: corpus spreadsheet and code repository
    visual: null,
    reportUrl: null,
    topics: ["tools", "research", "startups"],
    tags: ["AI tools", "evaluation", "analysis"]
  },

  /* ---- Secondary interest (media-specific): kept, but hidden from the site ---- */
  {
    slug: "ai-disclosure-indian-news-sites",
    visibility: "hidden",
    status: "Planned",
    statusNote: "Planned. The question and method are defined; data collection hasn't started yet.",
    title: "How Indian News Websites Disclose AI-Generated Content",
    question: "Do Indian news publishers tell readers when AI was used to write, translate, illustrate or summarize their content, and how clearly?",
    context: "As news publishers adopt AI for translation, summaries and images, readers deserve to know when and how it was used. Disclosure practices are still forming, and they may differ between English and Indian-language outlets.",
    methodology: [
      "Select a sample of English and Indian-language news websites.",
      "Review each outlet's published AI policy, if any, and its article-level labels.",
      "Code disclosures by placement, wording and specificity.",
      "Compare English and Indian-language outlets."
    ],
    findings: [],
    keyInsights: [],
    conclusion: [],
    sources: [],
    visual: null,
    reportUrl: null,
    topics: ["ethics", "ai", "future"],
    tags: ["media", "transparency", "India"]
  }
];
