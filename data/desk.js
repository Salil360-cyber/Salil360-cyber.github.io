/* =========================================================================
   desk.js — scripted responses for "Ask Salil's AI Desk".
   Each intent has keywords (matched against the visitor's question) and an
   answer() that can read the rest of SITE data so answers stay current.
   To connect a real model later, see js/ai-desk.js → AIDesk.provider.
   ========================================================================= */
window.SITE = window.SITE || {};

SITE.desk = {
  greeting:
    "AI Desk online. I'm a scripted assistant built from this site's own content — not a live AI model. Pick a question below or type your own.",
  suggestions: [
    "What does Salil work on?",
    "What is an AI Generalist?",
    "What projects has Salil worked on?",
    "What topics does Salil research?",
    "How can I collaborate?"
  ],
  intents: [
    {
      id: "about",
      keywords: ["work on", "focus", "explore", "what does salil do", "who is", "about salil", "cover"],
      answer: function (S) {
        return "Salil is an AI Generalist and researcher. He explores " +
          S.topics.slice(0, 6).map(function (t) { return t.name; }).join(", ") +
          " and more, applying AI across research, analytics, automation and content.";
      }
    },
    {
      id: "generalist",
      keywords: ["ai generalist", "what is an ai generalist", "generalist"],
      answer: function () {
        return "An AI Generalist works across many areas of AI rather than one tool: generative AI, prompt engineering, research, AI tools and agents, automation, data analytics, content creation and app building. Salil's approach is Learn → Explore → Experiment → Build → Analyze → Apply, with AI output always checked by a human.";
      }
    },
    {
      id: "projects",
      keywords: ["project", "built", "worked on", "portfolio", "experiment"],
      answer: function (S) {
        var shown = S.projects.filter(function (p) { return p.status !== "Planned" || S.showPlannedProjects; });
        return "Current projects: " + shown.map(function (p) { return p.name + " (" + p.status + ")"; }).join("; ") + ". See the Projects section for details.";
      }
    },
    {
      id: "research",
      keywords: ["research", "investigat", "study", "studies"],
      answer: function (S) {
        return "Research: " + S.research.filter(function (r) { return r.visibility !== "hidden"; }).map(function (r) { return "“" + r.title + "” — " + r.status; }).join("; ") + ". Findings are published only once the work is complete.";
      }
    },
    {
      id: "topics",
      keywords: ["topic", "what topics", "subjects", "areas", "interests"],
      answer: function (S) {
        return "Salil's focus areas: " + S.topics.map(function (t) { return t.name; }).join(" · ") + ". Tap any topic in “What I Explore” to filter projects, research and writing.";
      }
    },
    {
      id: "collab",
      keywords: ["collab", "contact", "hire", "work with", "email", "reach", "commission", "freelance"],
      answer: function (S) {
        return "Salil is open to AI projects, research, experimentation, AI applications and problem-solving collaborations. Email: " + S.profile.contact.email + ". Or use the Contact section to start a conversation.";
      }
    },
    {
      id: "tools",
      keywords: ["tool", "chatgpt", "claude", "gemini", "perplexity", "notebooklm", "copilot", "use ai"],
      answer: function () {
        return "Salil works hands-on with ChatGPT, Claude, Gemini, Perplexity, NotebookLM and Microsoft Copilot, and has explored Google AI Studio and Google Workspace AI. He tests tools before relying on them and never shares AI output without checking it.";
      }
    }
  ],
  fallback:
    "I don't have a scripted answer for that yet. Try one of the suggested questions, or email Salil directly from the Contact section."
};
