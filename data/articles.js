/* =========================================================================
   articles.js — AI Writing & Insights.
   ⚠  Every article below is a SAMPLE DRAFT (sample: true). Samples are hidden
      from visitors (see SITE.showSampleArticles). Replace them with your real articles, or set
      sample: false once an article is genuinely yours and published.

   Fields
     slug        unique, lowercase, letters/digits/hyphens (used in the URL hash)
     title, dek  headline and one-paragraph summary
     category    one of the filter categories (see CATEGORY ORDER in app.js)
     topics      ids from topics.js
     date        "YYYY-MM-DD"
     featured    true on ONE story to show it in the Featured slot
     image       optional path/URL to a hero image; omit for generated cover art
     tags        short keywords
     body        array of blocks:
                   "plain string"            → paragraph
                   { h: "Heading" }          → section heading
                   { quote: "…", by: "…" }   → pull quote
                   { list: ["…", "…"] }      → bullet list
                   { note: "…" }             → editor's note box
     sources     [{ label, url }]  — url may be null while you're drafting
     externalUrl optional: link to where the story is published
   Reading time is calculated automatically from the body.
   ========================================================================= */
window.SITE = window.SITE || {};

/* Sample drafts (sample: true) are hidden from visitors. Set this to true only
   to preview them locally; publish an article by setting its sample: false. */
SITE.showSampleArticles = false;

SITE.articles = [
  {
    slug: "how-to-read-an-ai-leaderboard",
    sample: true,
    featured: true,
    title: "The Benchmark Problem: How to Read an AI Leaderboard Without Getting Fooled",
    dek: "Every model launch arrives with a chart showing it on top. Here is what those scores measure, what they leave out, and the five questions to ask before you repeat one.",
    category: "AI Research",
    topics: ["research", "ai", "genai"],
    date: "2026-09-24",
    tags: ["benchmarks", "evaluation", "verification"],
    body: [
      "A new AI model rarely launches without a bar chart. The model's bar is tallest, the competitors trail behind, and the headline writes itself. But a benchmark score is a measurement taken under specific conditions, and most coverage drops the conditions and keeps the number.",
      { h: "What a benchmark actually is" },
      "A benchmark is a fixed set of tasks with known answers: exam questions, coding problems, reading-comprehension passages. A model answers them and gets a score. That makes benchmarks useful for comparison, because everyone is graded on the same test. It also makes them fragile, because a fixed test can be studied for.",
      { h: "Three ways scores mislead" },
      { list: [
        "Contamination: if test questions leaked into a model's training data, a high score may reflect memory rather than skill.",
        "Saturation: once top models all score near the ceiling, small differences stop meaning much.",
        "Self-reporting: a lab running its own evaluation chooses the settings, the prompts and which results to show."
      ] },
      { quote: "A benchmark score is a measurement taken under specific conditions. Report the conditions, not just the number." },
      { h: "Five questions before you repeat a score" },
      { list: [
        "Who ran the evaluation: the company itself or an independent group?",
        "Which version of the benchmark, and with what prompting setup?",
        "Is the margin over competitors larger than normal run-to-run variation?",
        "Does the benchmark resemble the task readers care about?",
        "Has anyone reproduced the result?"
      ] },
      "None of this means benchmarks are useless. It means they are evidence, and evidence needs context. The honest version of the story is often less dramatic: a model improved on certain tasks, under certain conditions, according to certain tests. That sentence is less exciting than 'beats everyone'. It is also true.",
      { note: "Sample draft. Replace with your published version and add the specific benchmarks and launches you analyzed." }
    ],
    sources: []
  },
  {
    slug: "what-a-context-window-really-is",
    sample: true,
    title: "What a Context Window Really Is, and Why Bigger Isn't Automatically Better",
    dek: "Context windows keep growing. Here is what the number means in practice, and why a model that can read a whole book may still miss the sentence you needed.",
    category: "Generative AI",
    topics: ["genai", "ai", "tools", "emerging"],
    date: "2026-09-17",
    tags: ["LLMs", "tokens", "explainer"],
    body: [
      "When a language model reads your prompt, it doesn't see words. It sees tokens: chunks of text, often pieces of words. The context window is the maximum number of tokens the model can consider at once, counting your instructions, any documents you paste in, the conversation so far and its own reply.",
      { h: "Why the number grew so fast" },
      "Early chat models could hold a few pages. Newer ones advertise windows large enough for long reports or entire codebases. That is a real engineering achievement, and it changes what people can do: summarize a long contract, compare several papers, or ask questions about a full transcript.",
      { h: "Capacity is not attention" },
      "Fitting text into the window is different from using it well. Researchers have documented that models can be less reliable at retrieving details buried in the middle of very long inputs than at the beginning or end. Performance also varies by model and by task. So 'it can read a book' should be followed by a second question: how well does it find and use what's inside?",
      { list: [
        "Put the most important instructions where they are easy to find, at the start or end.",
        "For long documents, ask the model to quote the passage it relied on, then check it.",
        "Longer inputs usually cost more and take longer to process."
      ] },
      "For reporters and readers, the takeaway is simple. Treat a context-window figure like a hard-drive size: necessary, not sufficient. What matters is whether the system answers correctly about the material you gave it.",
      { note: "Sample draft. Add a hands-on test of two or three tools with your own long document." }
    ],
    sources: [
      { label: "Liu et al., 'Lost in the Middle: How Language Models Use Long Contexts' (2023)", url: null }
    ]
  },
  {
    slug: "hallucination-is-a-reporting-problem-too",
    sample: true,
    title: "Hallucination Is a Reporting Problem Too",
    dek: "AI tools can produce confident, fluent, wrong answers. For journalists that's not just a model flaw. It's a new verification burden.",
    category: "AI Ethics",
    topics: ["ethics", "genai", "tools"],
    date: "2026-09-10",
    tags: ["verification", "newsrooms", "accuracy"],
    body: [
      "'Hallucination' is the industry's word for when a model produces text that sounds right but isn't: an invented citation, a wrong date, a quote nobody said. The word is imperfect, but the problem is real, and it lands hardest on people whose job is accuracy.",
      { h: "Why fluent text is risky" },
      "Language models generate the most plausible continuation of text. Plausible and true often overlap, which is why these tools are useful. But when they diverge, the output doesn't flag itself. A fake reference is formatted exactly like a real one.",
      { h: "A verification routine that works" },
      { list: [
        "Never publish a fact that exists only in an AI answer. Trace it to a primary source.",
        "Open every citation. Check that it exists and that it says what the summary claims.",
        "Be most suspicious of specifics: numbers, names, dates and direct quotes.",
        "Log which tools you used for research, so editors can review your process."
      ] },
      { quote: "AI can speed up research. It cannot take responsibility for a sentence." },
      "Used carefully, AI tools can help a reporter read faster and spot leads. Used carelessly, they turn errors into confident prose. The difference is the verification step, which stays human.",
      { note: "Sample draft. Add real examples you've caught, with screenshots and the corrected facts." }
    ],
    sources: []
  },
  {
    slug: "ai-agents-explained-without-the-hype",
    sample: true,
    title: "AI Agents, Explained Without the Hype",
    dek: "'Agent' has become the word of the moment. Underneath it is a fairly simple loop, and a set of practical questions about reliability and control.",
    category: "AI Tools",
    topics: ["tools", "genai", "business", "emerging"],
    date: "2026-09-03",
    tags: ["agents", "automation", "explainer"],
    body: [
      "Strip away the marketing and most AI agents follow the same pattern. A language model is given a goal and a set of tools: search, a browser, a code runner, an email client. It decides which tool to use, looks at the result, and decides what to do next. Repeat until done.",
      { h: "The loop" },
      { list: [
        "Plan: break the goal into steps.",
        "Act: call a tool, such as a search or a file edit.",
        "Observe: read what came back.",
        "Decide: continue, change course or stop."
      ] },
      { h: "Where it gets hard" },
      "Every step in that loop can go wrong, and errors compound. A misread search result early on can steer the whole task. That is why reliability over many steps matters more than how impressive a single step looks in a demo.",
      "The other question is control. An agent that can send messages, spend money or change files needs limits: what it may do on its own, what needs a human's approval, and how mistakes are reversed.",
      "When you read about a new agent, ask three things. What tools can it use? What does it do without asking? And how was it tested on tasks like yours?",
      { note: "Sample draft. Replace with a hands-on review of an agent product you tested." }
    ],
    sources: []
  },
  {
    slug: "indian-languages-and-the-ai-gap",
    sample: true,
    title: "Who Gets Left Out of the Training Data? Indian Languages and the AI Gap",
    dek: "Most large AI models learned mostly from English text. For hundreds of millions of people who live in other languages, that shapes what AI can do for them.",
    category: "AI & Society",
    topics: ["ethics", "ai", "future"],
    date: "2026-08-27",
    tags: ["languages", "India", "inclusion"],
    body: [
      "AI language models learn from text, and the web's text is unevenly distributed. English dominates. Many Indian languages, spoken by tens of millions of people each, have far less written material online in forms that are easy to collect.",
      { h: "What that changes for users" },
      "Less training data tends to mean weaker performance: clumsier phrasing, more factual errors and less cultural context. Scripts add another layer. Tokenizers built mainly around English can split text in other scripts into many more pieces, which can make the same request slower or costlier to process.",
      { h: "What's being done" },
      "Government programmes, universities and startups in India are building datasets, speech corpora and models aimed at Indian languages. Global labs have also expanded multilingual support. The open question is quality: how well these systems handle everyday use in each language, not just headline demos.",
      { quote: "An AI system is only as inclusive as the language it was taught in." },
      "This is a story that needs reporters who can test in the languages themselves. Translation of a benchmark is not the same as a native speaker asking real questions.",
      { note: "Sample draft. Add your own side-by-side tests in Marathi, Hindi, Gujarati, Tamil, Telugu or Kannada, and cite the specific initiatives you cover." }
    ],
    sources: []
  },
  {
    slug: "future-of-work-tasks-not-jobs",
    sample: true,
    title: "The Future-of-Work Story Is About Tasks, Not Jobs",
    dek: "Headlines ask which jobs AI will replace. A more useful question is which tasks inside a job change, and who decides.",
    category: "Future of Work",
    topics: ["future", "business", "ai"],
    date: "2026-08-20",
    tags: ["work", "automation", "economy"],
    body: [
      "'Will AI take my job?' is the question people ask. It's an understandable question and a hard one to answer, because jobs are bundles of tasks. A reporter interviews, researches, writes, edits and builds relationships. AI may change some of those tasks a great deal and others hardly at all.",
      { h: "A better frame" },
      { list: [
        "Which tasks in this role can AI tools do well today?",
        "Which tasks still depend on judgment, trust or physical presence?",
        "Who captures the time saved: the worker, the employer or the customer?"
      ] },
      "Thinking in tasks makes coverage more concrete. Instead of predicting the end of a profession, you can show what a workday looks like before and after a tool arrives, and where the friction is.",
      "It also makes the stakes clearer. When routine tasks shrink, what's left often requires more skill. Whether workers are trained, paid and credited for that shift is a choice made by people, not by the technology.",
      { note: "Sample draft. Strengthen with interviews and a specific workplace you observed." }
    ],
    sources: []
  },
  {
    slug: "covering-an-ai-startup-launch",
    sample: true,
    title: "How to Cover an AI Startup Launch Responsibly",
    dek: "A slick demo, a big funding round and a bold claim. A checklist for turning a launch announcement into an actual story.",
    category: "AI Startups",
    topics: ["startups", "business", "ethics"],
    date: "2026-08-13",
    tags: ["startups", "checklist", "verification"],
    body: [
      "Startup launches are designed to be covered. The press release is ready, the demo is polished, and the founders are available for interviews. That makes it easy to write the company's story instead of the reader's.",
      { h: "Before you write" },
      { list: [
        "Use the product yourself. A demo shows the best case.",
        "Ask what model it's built on. Many products wrap a third-party model.",
        "Ask how it was evaluated, on what data, and who checked.",
        "Ask what happens to user data.",
        "Find a customer or independent expert who isn't on the company's list."
      ] },
      { h: "In the story" },
      "Attribute claims clearly: 'the company says' is doing real work in that sentence. Separate what you observed from what you were told. If you couldn't verify a capability, say so.",
      "Good launch coverage can still be positive. It just earns the positivity by showing evidence.",
      { note: "Sample draft. Apply this checklist to a real launch and publish the result." }
    ],
    sources: []
  },
  {
    slug: "reading-an-ai-tools-privacy-policy",
    sample: true,
    title: "What to Look For in an AI Tool's Privacy Policy",
    dek: "Before you paste a document into an AI tool, it's worth five minutes with the policy. The four sections that matter most.",
    category: "AI Tools",
    topics: ["tools", "ethics", "business"],
    date: "2026-08-06",
    tags: ["privacy", "data", "guide"],
    body: [
      "Privacy policies are long on purpose. But for AI tools, a few sections answer most of what users need to know, especially if you work with sensitive material like sources, client files or unpublished drafts.",
      { h: "The four sections" },
      { list: [
        "Training: are your inputs used to train or improve models, and can you opt out?",
        "Retention: how long are your conversations and files stored?",
        "Access: who can see your data, including staff reviewers and third-party providers?",
        "Plans: do business or enterprise tiers have different terms from free accounts?"
      ] },
      "Settings matter as much as policy text. Many tools have toggles for history, training use or data deletion, and the defaults vary.",
      "For journalists, the rule of thumb is cautious: don't put anything into a consumer AI tool that you wouldn't be comfortable explaining to a source.",
      { note: "Sample draft. Turn into a comparison of the specific tools you use, with links to each policy and the date you read it." }
    ],
    sources: []
  },
  {
    slug: "verified-ai-news-brief-template",
    sample: true,
    title: "The Verified Brief: How I Track What Actually Changed in AI This Week",
    dek: "A weekly format for AI news that separates confirmed developments from claims, rumours and announcements still waiting on evidence.",
    category: "AI News",
    topics: ["ai", "research", "startups"],
    date: "2026-09-29",
    tags: ["news", "weekly brief", "format"],
    body: [
      "AI news moves fast and much of it is announcement rather than evidence. This brief sorts each item into one of three buckets, so readers can see at a glance how solid it is.",
      { h: "The three buckets" },
      { list: [
        "Confirmed: released, documented and checked against a primary source.",
        "Claimed: announced by a company or researcher, not yet independently verified.",
        "Watching: early signals, reports or rumours worth following, clearly labelled."
      ] },
      { h: "This week" },
      { list: [
        "[Confirmed] Add a verified development, with a link to the primary source.",
        "[Claimed] Add an announcement and note what evidence is still missing.",
        "[Watching] Add an early signal and why it could matter."
      ] },
      { note: "This is a template, not real news. Fill the items with verified developments each week." }
    ],
    sources: []
  }
];
