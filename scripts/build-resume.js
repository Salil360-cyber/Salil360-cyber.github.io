/* Builds the ATS-friendly resume from data/resume.js.
   Output: assets/Salil_Gokhale_AI_Generalist_Resume.docx (+ .pdf via LibreOffice)

   Usage (from the project root):
     node scripts/build-resume.js
   Requires: npm package "docx" (npm install docx). The PDF step needs LibreOffice
   ("soffice") on your PATH; without it, open the .docx in Word and Save As PDF.
*/
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { execFileSync } = require("child_process");
const {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink, AlignmentType, TabStopType,
  BorderStyle, LevelFormat
} = require("docx");

const root = path.join(__dirname, "..");
const ctx = { window: {} };
ctx.SITE = ctx.window.SITE = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "data/resume.js"), "utf8"), ctx);
const R = ctx.SITE.resume;

const FONT = "Arial";
const INK = "1A1A1A";
const MUTED = "444444";
const PAGE_W = 11906, MARGIN = 720;              // A4 width, 0.5in margins
const RIGHT_TAB = PAGE_W - MARGIN * 2;

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size || 20, bold: o.bold, italics: o.italics, color: o.color || INK });
const link = (text, url) => new ExternalHyperlink({ link: url, children: [new TextRun({ text, font: FONT, size: 19, color: INK, underline: {} })] });

function heading(text) {
  return new Paragraph({
    spacing: { before: 120, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "999999", space: 2 } },
    children: [run(text.toUpperCase(), { bold: true, size: 21 })]
  });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 20 },
    children: [run(text, { size: 19 })]
  });
}
function titleLine(left, right, sub) {
  const kids = [run(left, { bold: true, size: 20 })];
  if (sub) kids.push(run(" — " + sub, { size: 20, color: MUTED, italics: true }));
  if (right) kids.push(new TextRun({ text: "\t" + right, font: FONT, size: 19, color: MUTED }));
  return new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }], spacing: { before: 60, after: 20 }, children: kids });
}

const C = R.contact;
const contact1 = [C.location, C.phone, C.email].filter(Boolean);
const children = [];

children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 20 }, children: [run(R.name.toUpperCase(), { bold: true, size: 36 })] }));
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [run(R.headline, { size: 20, bold: true, color: MUTED })] }));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 10 },
  children: contact1.flatMap((t, i) => {
    const parts = [];
    if (i) parts.push(run("  |  ", { size: 19, color: MUTED }));
    parts.push(t === C.email ? link(t, "mailto:" + t) : run(t, { size: 19 }));
    return parts;
  })
}));
const webLinks = [
  C.linkedin && ["LinkedIn: " + C.linkedin, "https://www." + C.linkedin.replace(/^www\./, "")],
  C.github && ["GitHub: " + C.github, "https://" + C.github],
  C.portfolio && ["Portfolio: " + C.portfolio, /^https?:/.test(C.portfolio) ? C.portfolio : "https://" + C.portfolio]
].filter(Boolean);
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 40 },
  children: webLinks.flatMap((l, i) => (i ? [run("  |  ", { size: 19, color: MUTED })] : []).concat([link(l[0], l[1])]))
}));

children.push(heading("Professional Summary"));
children.push(new Paragraph({ spacing: { after: 20 }, children: [run(R.summary, { size: 20 })] }));

children.push(heading("Core Skills"));
R.skills.forEach(g => children.push(new Paragraph({
  spacing: { after: 20 },
  children: [run(g.label + ": ", { bold: true, size: 19 }), run(g.items.join(", "), { size: 19 })]
})));

if (R.experience && R.experience.length) {
  children.push(heading("Experience"));
  R.experience.forEach(x => {
    children.push(titleLine(x.title + ", " + x.company, (x.location ? x.location + " | " : "") + x.dates));
    (x.bullets || []).forEach(b => children.push(bullet(b)));
  });
}

children.push(heading("AI Projects"));
R.projects.forEach(p => {
  children.push(titleLine(p.name, p.date, p.context));
  p.bullets.forEach(b => children.push(bullet(b)));
});

children.push(heading("Certifications & Job Simulations"));
R.certifications.forEach(c => {
  children.push(titleLine(c.title + " | " + c.issuer, c.date));
  if (c.detail) children.push(new Paragraph({ spacing: { after: 30 }, children: [run(c.detail, { size: 19, color: MUTED })] }));
  (c.bullets || []).forEach(b => children.push(bullet(b)));
});

children.push(heading(R.languages && R.languages.length ? "Education & Languages" : "Education"));
R.education.forEach(e => children.push(titleLine(e.degree, e.date, e.school)));

if (R.languages && R.languages.length) {
  children.push(new Paragraph({ spacing: { before: 60 }, children: [run("Languages: ", { bold: true, size: 19 }), run(R.languages.join(", "), { size: 19 })] }));
}

const doc = new Document({
  creator: R.name,
  title: R.name + " — AI Generalist Resume",
  description: "Resume of " + R.name + ", AI Generalist",
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 300, hanging: 220 } } } }]
    }]
  },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: 600, bottom: 560, left: MARGIN, right: MARGIN } } },
    children
  }]
});

const outDocx = path.join(root, R.files.docx);
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outDocx, buf);
  console.log("Wrote", path.relative(root, outDocx));
  try {
    execFileSync("soffice", ["--headless", "--convert-to", "pdf", "--outdir", path.dirname(outDocx), outDocx], { stdio: "ignore" });
    console.log("Wrote", R.files.pdf);
  } catch (e) {
    console.log("LibreOffice not found: open the .docx in Word and Save As PDF to update the PDF.");
  }
});
