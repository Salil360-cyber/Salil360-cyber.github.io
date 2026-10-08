/* =========================================================================
   topics.js — the beats Salil covers.
   `id` is referenced from articles, research and projects (their `topics`
   arrays). Clicking a topic card filters all three sections by that id.
   ========================================================================= */
window.SITE = window.SITE || {};

SITE.topics = [
  { id: "ai",         icon: "🤖", name: "Artificial Intelligence", blurb: "How AI systems work, where they help and where they fail." },
  { id: "genai",      icon: "🧠", name: "Generative AI",           blurb: "Language, image and video models, and how to use them well." },
  { id: "research",   icon: "🔬", name: "AI Research",             blurb: "Questions, methods and evidence about AI tools and systems." },
  { id: "ethics",     icon: "⚖️", name: "Responsible AI & Ethics",  blurb: "Bias, privacy, accountability and responsible use." },
  { id: "startups",   icon: "🚀", name: "AI Startups",             blurb: "New AI products and the evidence behind their claims." },
  { id: "business",   icon: "💼", name: "AI, Data & Business",     blurb: "Using AI for data analysis, business intelligence and decisions." },
  { id: "tools",      icon: "👨‍💻", name: "AI Tools",                blurb: "Hands-on use and evaluation of everyday AI tools." },
  { id: "emerging",   icon: "🌐", name: "Emerging Technology",     blurb: "New developments in computing, data and the web." },
  { id: "creativity", icon: "🎨", name: "AI & Creativity",         blurb: "AI-assisted design, writing and creative workflows." },
  { id: "future",     icon: "🔮", name: "Future of AI",            blurb: "Where AI is heading for work and everyday life." }
];
