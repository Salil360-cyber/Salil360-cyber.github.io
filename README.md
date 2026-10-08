# The AI Desk — Salil Gokhale

Personal portfolio for **Salil Gokhale — AI Generalist** (AI Researcher • AI Practitioner • AI Explorer).
An editorial-style site: featured AI work, projects, case studies, research, workflow, principles, toolkit, certifications, journey, resume, contact, an article system (AI Writing & Insights), global search, and a scripted "Ask Salil's AI Desk" assistant.

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

---

## 1. Run it

**Quickest:** double-click `index.html`. Everything works straight from your disk.

**With a local server** (closer to how it behaves online):

```bash
cd salil-ai-newsroom
python -m http.server 8000
# open http://localhost:8000
```

On Windows you can also use the VS Code "Live Server" extension.

---

## 2. Project structure

```
salil-ai-newsroom/
├── index.html          Page structure, SEO + Open Graph + JSON-LD
├── css/
│   └── styles.css      Design tokens (dark + light), layout, components, animation
├── js/
│   ├── app.js          Renders everything from /data and wires up interactions
│   ├── covers.js       Generated cover art for articles and projects without an image
│   └── ai-desk.js      AI Desk engine + the integration point for a real model
├── data/               ← YOU EDIT THESE
│   ├── profile.js      Bio, contact, socials, stats, timeline, skills, principles, workflow
│   ├── topics.js       The 10 beats in "What I Cover"
│   ├── articles.js     AI Writing & Insights (samples hidden)
│   ├── research.js     Research & Investigations
│   ├── projects.js     AI Projects + Case Studies
│   ├── certifications.js  AI Certifications (add future certificates here)
│   ├── resume.js       Resume content (site viewer + PDF/DOCX source)
│   └── desk.js         Scripted answers for the AI Desk
├── scripts/
│   └── build-resume.js Rebuilds the resume PDF + DOCX from data/resume.js
└── assets/
    ├── favicon.svg
    ├── salil-gokhale.jpg
    ├── Salil_Gokhale_AI_Generalist_Resume.pdf
    └── Salil_Gokhale_AI_Generalist_Resume.docx
```

You should never need to touch `app.js` to add content.

---

## 3. Unfinished content: hidden until it's real

The site never invents credentials, numbers or results, and it never shows unfinished notes to visitors. Missing information is hidden, not faked.

| Where | How it behaves | What to do |
|---|---|---|
| `data/articles.js` | All 9 articles are **sample drafts** (`sample: true`) and are **hidden**. The Insights section shows "Articles are in progress" until a real one exists. | Publish an article by writing it in your words and setting `sample: false`. `SITE.showSampleArticles = true` previews samples locally only. |
| `data/projects.js` | Projects with `status: "Planned"` are **hidden** (grid, search, topic counts, AI Desk). Buttons (GitHub, Live Demo, Case Study) appear **only** when a real link is set in `links`. | Add real `links.github` / `links.demo` URLs when they exist. Add real screenshots to `/assets` and list them in `screenshots`. |
| `data/projects.js → featured` | FitAI is in the **Featured AI Work** slot (`featured: true`). | Move `featured: true` to another real project to change it. |
| `data/projects.js → caseStudies` | Sections: challenge, role, approach, stack, implementation, testing, outcome, lessons, remaining ("Still open"), next. Any set to `null` is **hidden**. | Fill `lessons` / `next` with real information when you have it; update `remaining` as work is finished. |
| `data/profile.js → stats` | Stats with `value: null` are hidden; with none filled in, the whole panel is hidden. | Add real counts only. |
| `data/profile.js → socials` | Entries with `url: null` (Medium/Substack, X) are hidden. | Add a URL to show one. |
| `data/profile.js → skills` | Levels are `Core / Working / Learning`. | Adjust them honestly. |
| `data/certifications.js` | A **Verify credential** button appears only when `credentialUrl` is a real URL; otherwise no button is shown. | Add the Google, be10x and Forage verification links. |
| `data/research.js` | Status is `Completed`, `In progress` or `Planned`. Findings, key insights and conclusions are shown **only** for `Completed` studies; other studies show their `statusNote`. Empty fields are hidden. `visibility: "hidden"` keeps a study off the site (the news-media study). | Fill findings only when the work is done, then set `status: "Completed"`. Add `reportUrl` for PDFs. |
| `index.html` | The `SITE URL CONFIG` comment holds the canonical / social tags until the domain is known. | See section 8. |

Also: any text field starting with `[` is treated as a placeholder and hidden automatically.

---

## 4. Adding a new article

Open `data/articles.js` and add an object to the `SITE.articles` array:

```js
{
  slug: "my-new-article",                 // lowercase-with-hyphens, unique
  title: "Headline",
  dek: "One-paragraph summary.",
  category: "Generative AI",            // AI News | AI Research | Generative AI | AI Ethics |
                                        // AI Startups | AI Tools | Future of Work | AI & Business | AI & Society
  topics: ["genai", "tools"],           // ids from topics.js — powers the topic explorer
  date: "2026-10-15",
  sample: false,                        // true = draft, hidden from visitors
  image: "assets/my-hero.jpg",          // optional; omit for generated cover art
  tags: ["LLMs", "explainer"],
  body: [
    "A paragraph.",
    { h: "A section heading" },
    { list: ["Point one", "Point two"] },
    { quote: "A pull quote.", by: "Optional attribution" },
    { note: "Editor's note." }
  ],
  sources: [{ label: "Source name", url: "https://…" }],
  externalUrl: "https://…"              // optional: where it was published
}
```

Reading time, filters, topic counts, search and related articles update automatically.
Each article has its own link: `yoursite.com/#story-my-new-article`.

Research, projects, certifications and topics follow the same pattern — the comment at the top of each data file lists the fields.

---

## 5. Features

- **Hero** with a live desk monitor (canvas signal map + illustrative workflow loop) and IST clock
- **Sticky nav** with active-section highlight, search, dark/light toggle, Resume button, mobile menu
- **Featured AI Work** slot (FitAI); **AI Writing & Insights** with category filters and an **article reader** (progress bar, byline, sources, share links, related articles)
- **Research** cards that expand to context, methodology, findings, visualisation slot, sources, report link
- **Projects** (problem, solution, AI used, role, outcome, tools) + **Case studies** that open in the reader
- **Topic explorer (What I Explore)** — clicking a topic filters projects, research and articles together
- **Workflow pipeline** (Discover → Publish), keyboard-navigable, auto-advances until you interact
- **Principles**, **Toolkit** (no percentages), **Journey** timeline, **Stats** (shown only when real)
- **Global search**: `Ctrl/⌘ + K` or `/`, arrow keys + Enter
- **Ask Salil's AI Desk**: scripted, clearly labelled demo mode
- Dark-first with a full light theme; follows the system setting until the visitor chooses
- `prefers-reduced-motion` respected (animations and canvas stop)

---

## 6. Connecting a real AI model to the Desk

Open `js/ai-desk.js`. Replace `AIDesk.provider` with a function that calls **your own server-side endpoint** (a free Netlify, Vercel or Cloudflare function). Never put an API key in browser JavaScript — anyone can read it. Then change the "Demo mode · scripted answers" label in `index.html`.

---

## 7. Deploy (free)

**GitHub Pages**
1. Create a repo (e.g. `ai-desk`) and upload the folder contents.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Site goes live at `https://<username>.github.io/ai-desk/`.

**Netlify**: drag the folder onto app.netlify.com/drop.

After deploying, finish the SEO setup in section 8 (it takes two minutes).

---

## 8. SEO notes

- **Already set:** title, meta description, Open Graph and Twitter/X title + description, favicon, apple-touch icon, `robots.txt`. Fonts load only the weights the CSS uses.
- **Structured data:** `Person` JSON-LD (with the three credentials as `hasCredential`) in the head; `Article` JSON-LD is injected when an article opens.
- **Live address:** https://salil360-cyber.github.io (GitHub Pages). The canonical, `og:url`, `og:image` and `twitter:image` tags in `index.html`, the `url` in the JSON-LD, `sitemap.xml` and the `Sitemap:` line in `robots.txt` all use it. If you move to a custom domain, change it in those places.
- **Social preview image:** `assets/og-image.png` (1200×630) is ready, built from your name, photo and the site colours.
- One `h1`, semantic `section`/`article`/`nav`/`footer`, labelled landmarks
- Content is rendered by JavaScript. Google indexes it, but for the strongest SEO on individual articles, a later step could be generating one static HTML page per article.

---

## 9. What was tested

Checked in headless Chromium at 1440, 1180, 820 and 390 px wide, dark and light:
layout (no horizontal scroll), navigation and mobile menu, category filters, topic filtering across sections,
research expand, article open/close (Esc and Back), case studies, search (Ctrl+K, Enter), theme toggle,
AI Desk, workflow stages, reduced motion. No JavaScript errors.

Fonts (Newsreader, Hanken Grotesk, JetBrains Mono) load from Google Fonts, with system fallbacks if offline.

---

## 10. Resume

- **On the site:** the nav "Resume" button and "View Resume" (Contact section) open the resume in the reader panel; "Download Resume" downloads the PDF.
- **Edit:** change `data/resume.js` (keep it valid JSON), then rebuild the files:
  ```bash
  npm install docx          # once
  node scripts/build-resume.js
  ```
  This writes the .docx and, if LibreOffice is installed, the .pdf. Without LibreOffice, open the .docx in Word and Save As PDF with the same file name.
- **Portfolio URL:** `contact.portfolio` is `null` until the site is live; set it and rebuild so it appears on the resume.

---

## 11. Projects

- **Cards** show what it is, the problem, what was built, AI used, tools, status and real buttons only. Clicking a card (or **View Project**) opens the full detail in the reader: status, problem, approach, AI used, tools, role, current state, evidence, links, screenshots and case study. Only fields with real content are shown.
- **Direct link** to a project: `yoursite.com/#project-<slug>` (e.g. `#project-fitai`).
- **Status filter** chips group projects as Built (Live, Published, Completed), In progress (Prototype, In development) and Experiments.
- **Featured AI Work** shows the project with `featured: true` (currently FitAI).

---

## 12. Recruiter path (how the page is ordered)

- **Hero buttons:** *Explore AI Work* (jumps to the projects) and *View Resume* (opens the resume viewer).
- **Page order:** About → Featured AI Work (FitAI) → AI Projects & Experiments (+ case studies) → Research → Workflow → Topics → Principles → Toolkit → Certifications → Journey → Insights → Contact.
- **Navigation:** Home, About, AI Work, Research, Topics, Toolkit, Certifications, Contact. *Insights* appears in the nav and footer automatically once a real article is published (`sample: false`).
- **Case-study list:** shows FitAI and SBMA AI. The portfolio's own case study has `listed: false`, so it's reachable from the portfolio project instead of being featured twice.
- **Toolkit:** each item can have `use` (why it's used) and `evidence` (in-page links to the project, certification or research where it was used), e.g. `{ label: "Corporate Data Analyzer", href: "#project-corporate-data-analyzer" }`. Only link real work.
- **Contact:** *Email Salil*, plus LinkedIn and GitHub buttons that appear only when those profiles are set in `profile.js → socials`.
