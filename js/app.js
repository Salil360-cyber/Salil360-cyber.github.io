/* =========================================================================
   app.js — renders the site from window.SITE and wires up interactions.
   You shouldn't need to edit this file to add content: edit /data/*.js.
   ========================================================================= */
(function () {
  "use strict";

  var S = window.SITE;
  var P = S.profile;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------- utils */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmtDate(iso) {
    var p = String(iso || "").split("-");
    if (p.length !== 3) return esc(iso || "");
    return parseInt(p[2], 10) + " " + MONTHS[parseInt(p[1], 10) - 1] + " " + p[0];
  }
  function bodyText(a) {
    return (a.body || []).map(function (b) {
      if (typeof b === "string") return b;
      if (b.h) return b.h;
      if (b.quote) return b.quote;
      if (b.list) return b.list.join(" ");
      return "";
    }).join(" ");
  }
  function readingTime(a) {
    var words = (a.title + " " + a.dek + " " + bodyText(a)).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200)) + " min read";
  }
  function topicById(id) { return S.topics.filter(function (t) { return t.id === id; })[0]; }
  function isPh(s) { return /^\s*\[/.test(s || ""); } // text that starts with "[" = placeholder
  function storyHref(a) { return "#story-" + a.slug; }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3200);
  }
  function copyText(text, okMsg) {
    var done = function () { toast(okMsg || "Copied"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text) ? done() : toast(text); });
    } else { fallbackCopy(text) ? done() : toast(text); }
  }
  function fallbackCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }
  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }
  function istTime(d) {
    try {
      return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(d || new Date());
    } catch (e) {
      var x = d || new Date();
      return String(x.getHours()).padStart(2, "0") + ":" + String(x.getMinutes()).padStart(2, "0");
    }
  }

  /* ---------------------------------------------------- state & filtering */
  var CATEGORY_ORDER = ["AI News", "AI Research", "Generative AI", "AI Ethics", "AI Startups", "AI Tools", "Future of Work", "AI & Business", "AI & Society"];
  var SHORT = { "AI Research": "Research", "AI Ethics": "Ethics", "AI Startups": "Startups", "AI Tools": "Tools" };
  var state = { category: "All", topic: null, stage: "all" };
  // Sample/draft articles stay in data/articles.js but are hidden from visitors
  // unless SITE.showSampleArticles is true. Planned projects work the same way.
  var articles = S.articles.filter(function (a) { return !a.sample || S.showSampleArticles; })
    .sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  var projects = S.projects.filter(function (p) { return p.status !== "Planned" || S.showPlannedProjects; });
  var STATUS_RANK = { "Completed": 0, "In progress": 1, "Planned": 2 };
  var research = S.research.filter(function (r) { return r.visibility !== "hidden"; })
    .sort(function (a, b) { return (STATUS_RANK[a.status] || 9) - (STATUS_RANK[b.status] || 9); });
  var featuredProject = projects.filter(function (p) { return p.featured; })[0] || null;
  var featured = featuredProject ? null : (articles.filter(function (a) { return a.featured; })[0] || null);

  function matchTopic(item) { return !state.topic || (item.topics || []).indexOf(state.topic) !== -1; }

  /* ------------------------------------------------------------------ hero */
  function renderHero() {
    $("#heroSub").textContent = P.heroSub;
    $("#heroIntro").textContent = P.heroIntro;
    var d = new Date();
    var day = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(d);
    $("#heroDateline").textContent = "The AI Desk · " + day;

    var clock = $("#deskClock");
    var tick = function () { clock.textContent = istTime() + " IST"; };
    tick(); setInterval(tick, 30000);

    // Ticker: topics + principles
    var items = S.topics.map(function (t) { return t.name; }).concat(P.principles.slice(0, 4).map(function (p) { return p.title; }));
    var html = items.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
    $("#ticker").innerHTML = html + html; // duplicated for a seamless loop

    startFeed();
    startSignal();
  }

  // Illustrative loop of the story workflow (not live activity)
  function startFeed() {
    var feed = $("#deskFeed");
    var lines = [
      ["DISCOVER", "Scanning new model releases and AI tools"],
      ["RESEARCH", "Reading the documentation, not the thread"],
      ["EXPERIMENT", "Trying a new prompting approach"],
      ["BUILD", "Wiring a tool into a small workflow"],
      ["TEST", "Checking outputs for accuracy and reliability"],
      ["ANALYZE", "Comparing results against the baseline"],
      ["APPLY", "Putting what worked into real use"]
    ];
    var i = 0;
    function push() {
      var l = lines[i % lines.length]; i++;
      var li = document.createElement("li");
      li.innerHTML = '<span class="t">' + istTime() + '</span><span class="k">' + l[0] + "</span><span>" + esc(l[1]) + "</span>";
      feed.appendChild(li);
      while (feed.children.length > 4) feed.removeChild(feed.firstChild);
    }
    for (var k = 0; k < 4; k++) push();
    if (!reduceMotion) setInterval(function () { if (!document.hidden) push(); }, 3200);
  }

  // Desk monitor canvas: six labeled signals with drifting particles and pulses
  function startSignal() {
    var canvas = $("#signalCanvas");
    var ctx = canvas.getContext("2d");
    var labels = ["AI", "Research", "Technology", "Ethics", "Innovation", "Future"];
    var colors = {};
    var W = 0, H = 0, dpr = 1, nodes = [], dust = [], pulses = [], running = false, visible = true, raf;

    function readColors() {
      var cs = getComputedStyle(document.documentElement);
      colors.accent = cs.getPropertyValue("--accent").trim() || "#5ccff4";
      colors.violet = cs.getPropertyValue("--violet").trim() || "#a093ff";
      colors.fg = cs.getPropertyValue("--fg").trim() || "#edf1f6";
      colors.muted = cs.getPropertyValue("--muted").trim() || "#7f8a98";
    }
    function rgba(hex, a) {
      var h = hex.replace("#", "");
      if (h.length === 3) h = h.split("").map(function (c) { return c + c; }).join("");
      var n = parseInt(h, 16);
      return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
    }
    function size() {
      var r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var cx = W / 2, cy = H / 2, rx = Math.min(W * 0.27, W / 2 - 100), ry = H * 0.34;
      nodes = labels.map(function (l, i) {
        var a = -Math.PI / 2 + (i / labels.length) * Math.PI * 2;
        return { label: l, bx: cx + Math.cos(a) * rx, by: cy + Math.sin(a) * ry, x: 0, y: 0, ph: Math.random() * 6.28 };
      });
      nodes.push({ label: "", bx: cx, by: cy, x: cx, y: cy, ph: 0, core: true });
      dust = [];
      for (var i = 0; i < 38; i++) dust.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18 });
    }
    function spawnPulse() {
      var a = Math.floor(Math.random() * 6), b = Math.random() > 0.4 ? 6 : Math.floor(Math.random() * 6);
      if (a === b) b = 6;
      pulses.push({ a: a, b: b, t: 0, c: Math.random() > 0.5 ? "accent" : "violet" });
    }
    function draw(time) {
      var t = (time || 0) / 1000;
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(function (n) {
        if (n.core) { n.x = n.bx; n.y = n.by; return; }
        n.x = n.bx + Math.sin(t * 0.5 + n.ph) * 6; n.y = n.by + Math.cos(t * 0.4 + n.ph) * 5;
      });
      // dust
      dust.forEach(function (p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.fillStyle = rgba(colors.muted, 0.35);
        ctx.fillRect(p.x, p.y, 1.4, 1.4);
      });
      // edges
      ctx.lineWidth = 0.8;
      for (var i = 0; i < nodes.length; i++) for (var j = i + 1; j < nodes.length; j++) {
        var adj = nodes[j].core || j === i + 1 || (i === 0 && j === 5);
        ctx.strokeStyle = rgba(colors.muted, adj ? 0.32 : 0.1);
        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
      }
      // pulses
      pulses = pulses.filter(function (p) { return p.t <= 1; });
      pulses.forEach(function (p) {
        p.t += 0.012;
        var A = nodes[p.a], B = nodes[p.b];
        var x = A.x + (B.x - A.x) * p.t, y = A.y + (B.y - A.y) * p.t;
        var g = ctx.createRadialGradient(x, y, 0, x, y, 12);
        g.addColorStop(0, rgba(colors[p.c], 0.9)); g.addColorStop(1, rgba(colors[p.c], 0));
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 12, 0, 6.29); ctx.fill();
      });
      // core
      var pr = 14 + Math.sin(t * 1.6) * 3;
      var cg = ctx.createRadialGradient(nodes[6].x, nodes[6].y, 0, nodes[6].x, nodes[6].y, pr * 3);
      cg.addColorStop(0, rgba(colors.violet, 0.5)); cg.addColorStop(1, rgba(colors.violet, 0));
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(nodes[6].x, nodes[6].y, pr * 3, 0, 6.29); ctx.fill();
      ctx.fillStyle = colors.fg; ctx.beginPath(); ctx.arc(nodes[6].x, nodes[6].y, 3.5, 0, 6.29); ctx.fill();
      // labeled nodes
      ctx.font = "500 11px 'JetBrains Mono', ui-monospace, monospace";
      ctx.textBaseline = "middle";
      nodes.forEach(function (n, i) {
        if (n.core) return;
        ctx.fillStyle = colors.accent;
        ctx.beginPath(); ctx.arc(n.x, n.y, 4, 0, 6.29); ctx.fill();
        ctx.strokeStyle = rgba(colors.accent, 0.35); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(n.x, n.y, 9 + Math.sin(t * 2 + i) * 1.5, 0, 6.29); ctx.stroke();
        var label = n.label.toUpperCase();
        var centered = Math.abs(n.bx - W / 2) < 4;
        var right = n.bx > W / 2;
        ctx.textAlign = centered ? "center" : right ? "left" : "right";
        var lx = centered ? n.x : right ? n.x + 16 : n.x - 16;
        var ly = centered ? (n.by < H / 2 ? n.y - 20 : n.y + 22) : n.y;
        var tw = ctx.measureText(label).width;
        if (!centered && right) lx = Math.min(lx, W - tw - 6);
        if (!centered && !right) lx = Math.max(lx, tw + 6);
        ctx.fillStyle = colors.fg; ctx.fillText(label, lx, ly);
      });
    }
    function loop(time) {
      if (!running) return;
      if (Math.random() < 0.03 && pulses.length < 6) spawnPulse();
      draw(time);
      raf = requestAnimationFrame(loop);
    }
    function start() { if (running || reduceMotion || !visible || document.hidden) return; running = true; raf = requestAnimationFrame(loop); }
    function stop() { running = false; cancelAnimationFrame(raf); }

    readColors(); size(); draw(0);
    if (reduceMotion) return;
    start();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; visible ? start() : stop(); }).observe(canvas);
    }
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { size(); draw(0); }, 150); });
    document.addEventListener("themechange", function () { readColors(); draw(0); });
  }

  /* ----------------------------------------------------------------- about */
  function renderAbout() {
    var A = P.about;
    $("#aboutLead").textContent = A.lead;
    $("#aboutBody").innerHTML = A.paragraphs.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var pos = $("#aboutPositioning");
    if (A.positioning && A.positioning.length) pos.innerHTML = A.positioning.map(esc).join(' <i aria-hidden="true">•</i> ');
    else pos.hidden = true;
    var ap = $("#aboutApproach");
    if (A.approach && A.approach.length) {
      ap.innerHTML = '<span class="about__approach-label mono">' + esc(A.approachLabel || "My approach") + '</span><span class="approach">' +
        A.approach.map(function (a) { return "<span>" + esc(a) + "</span>"; }).join('<i aria-hidden="true">→</i>') + "</span>";
    } else ap.hidden = true;
    var ints = $("#aboutInterests");
    if (A.interests && A.interests.length) ints.innerHTML = A.interests.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("");
    else { ints.hidden = true; ints.previousElementSibling.hidden = true; }
    if (A.strengthsLabel) $("#strengths").previousElementSibling.textContent = A.strengthsLabel;
    $("#strengths").innerHTML = A.strengths.map(function (s) {
      return "<li><b>" + esc(s.title) + "</b><span>" + esc(s.text) + "</span></li>";
    }).join("");
    var c = A.card;
    $("#profileCard").innerHTML =
      (P.photo
        ? '<figure class="profile-card__photo"><img src="' + esc(P.photo.src) + '" alt="' + esc(P.photo.alt || P.name) + '" width="' + (P.photo.width || 640) + '" height="' + (P.photo.height || 800) + '" loading="lazy" decoding="async"></figure>'
        : "") +
      '<div class="profile-card__head">' + (P.photo ? "" : '<div class="avatar" aria-hidden="true">SG</div>') + '<div>' +
      '<p class="profile-card__name">' + esc(P.name) + '</p><p class="mono profile-card__id">AI GENERALIST PROFILE</p></div></div>' +
      '<dl class="profile-card__rows" style="display:grid;gap:20px;margin:0">' +
      '<div class="profile-row"><dt>Role</dt><dd class="big">' + esc(c.role) + "</dd></div>" +
      '<div class="profile-row"><dt>Focus</dt><dd>' + esc(c.focus) + "</dd></div>" +
      '<div class="profile-row"><dt>Interests</dt><dd class="chip-row">' + c.interests.map(function (i) { return "<span>" + esc(i) + "</span>"; }).join("") + "</dd></div>" +
      '<div class="profile-row"><dt>Approach</dt><dd class="approach">' + c.approach.map(function (a) { return "<span>" + esc(a) + "</span>"; }).join("<i aria-hidden=\"true\">→</i>") + "</dd></div>" +
      "</dl>" +
      '<p class="profile-card__status"><span class="pulse" aria-hidden="true"></span>' + esc(P.availability) + "</p>";
    $("#differentiators").hidden = !(A.differentiators && A.differentiators.length);
    $("#differentiators").innerHTML = (A.differentiators || []).map(function (d) {
      return '<div class="diff__item reveal"><p>Why this desk</p><h3>' + esc(d.title) + "</h3><p>" + esc(d.text) + "</p></div>";
    }).join("");
  }

  /* ------------------------------------------------------------ cover art */
  function coverHTML(a, extra) {
    var inner = a.image
      ? '<img src="' + esc(a.image) + '" alt="" loading="lazy" decoding="async">'
      : Covers.svg(a.slug, a.category, "Illustration for " + a.title);
    return '<div class="cover' + (extra ? " " + extra : "") + '">' + inner + "</div>";
  }
  function sampleBadge(a) { return a.sample ? '<span class="pill pill--sample" title="Sample draft — replace with published work">Sample</span>' : ""; }

  /* ---------------------------------------------------------- featured */
  function renderFeatured() {
    if (featuredProject) return renderFeaturedProject(featuredProject);
    var a = featured;
    if (!a) { $("#featured").hidden = true; return; }
    $("#featuredStory").innerHTML =
      '<article class="featured reveal">' +
      '<a href="' + storyHref(a) + '" tabindex="-1" aria-hidden="true">' + coverHTML(a) + "</a>" +
      "<div>" +
      '<div class="featured__label"><span class="pulse" aria-hidden="true"></span><span class="mono">Featured Article</span><span class="cat">' + esc(a.category) + "</span>" + sampleBadge(a) + "</div>" +
      '<h2><a href="' + storyHref(a) + '">' + esc(a.title) + "</a></h2>" +
      '<p class="featured__dek">' + esc(a.dek) + "</p>" +
      '<p class="meta"><span>' + fmtDate(a.date) + "</span><span>" + readingTime(a) + "</span><span>" + esc(a.category) + "</span></p>" +
      '<a class="btn btn--primary" href="' + storyHref(a) + '">Read Full Story <span aria-hidden="true">→</span></a>' +
      "</div></article>";
  }

  function renderFeaturedProject(p) {
    var art = { slug: p.slug, category: p.coverStyle || "AI Tools", title: p.name, image: (p.screenshots && p.screenshots[0] && p.screenshots[0].src) || null };
    $("#featured").setAttribute("aria-label", "Featured AI work");
    $("#featuredStory").innerHTML =
      '<article class="featured reveal">' +
      '<a href="' + projectHref(p) + '" tabindex="-1" aria-hidden="true">' + coverHTML(art) + "</a>" +
      "<div>" +
      '<div class="featured__label"><span class="pulse" aria-hidden="true"></span><span class="mono">Featured AI Work</span><span class="cat">AI Project</span>' + statusPill(p.status) + "</div>" +
      '<h2><a href="' + projectHref(p) + '">' + esc(p.name) + "</a></h2>" +
      (p.problem ? '<p class="featured__dek featured__problem"><b>Problem.</b> ' + esc(p.problem) + "</p>" : "") +
      '<p class="featured__dek">' + esc(p.featuredSummary || p.solution) + "</p>" +
      (p.role ? '<p class="featured__dek featured__problem"><b>My role.</b> ' + esc(p.role) + "</p>" : "") +
      '<p class="meta">' + p.tools.slice(0, 4).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</p>" +
      '<div class="featured__actions">' + projectActions(p, { detail: true, primaryDetail: true }) + "</div>" +
      "</div></article>";
  }

  /* ----------------------------------------------------------- stories */
  function renderStoryFilters() {
    var cats = CATEGORY_ORDER.filter(function (c) { return articles.some(function (a) { return a.category === c; }); });
    articles.forEach(function (a) { if (cats.indexOf(a.category) === -1) cats.push(a.category); });
    var all = ["All"].concat(cats);
    $("#storyFilters").innerHTML = all.map(function (c) {
      var n = c === "All" ? articles.length : articles.filter(function (a) { return a.category === c; }).length;
      return '<button class="chip" type="button" data-cat="' + esc(c) + '" aria-pressed="' + (state.category === c) + '">' + esc(SHORT[c] || c) + '<span class="n">' + n + "</span></button>";
    }).join("");
  }

  function storyCard(a) {
    return '<article class="story reveal" data-href="' + storyHref(a) + '">' +
      '<a href="' + storyHref(a) + '" tabindex="-1" aria-hidden="true">' + coverHTML(a) + "</a>" +
      '<div class="story__top"><span class="cat">' + esc(a.category) + "</span>" + sampleBadge(a) + "</div>" +
      '<h3><a href="' + storyHref(a) + '">' + esc(a.title) + "</a></h3>" +
      '<p class="story__dek">' + esc(a.dek) + "</p>" +
      '<div class="story__foot">' +
      '<div class="story__tags">' + (a.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
      '<div class="story__row"><p class="meta"><span>' + fmtDate(a.date) + "</span><span>" + readingTime(a) + "</span></p>" +
      '<a class="btn btn--link" href="' + storyHref(a) + '" aria-label="Read article: ' + esc(a.title) + '">Read article <span aria-hidden="true">→</span></a></div>' +
      "</div></article>";
  }

  function renderStories(animate) {
    var list = articles.filter(function (a) {
      var catOk = state.category === "All" || a.category === state.category;
      return catOk && matchTopic(a);
    });
    if (state.category === "All" && !state.topic) list = list.filter(function (a) { return a !== featured; });
    var grid = $("#storyGrid");
    grid.classList.toggle("is-filtering", !!animate);
    grid.innerHTML = list.map(storyCard).join("");
    var emptyEl = $("#storyEmpty");
    emptyEl.hidden = list.length > 0;
    if (!articles.length) {
      $("#storyFilters").hidden = true;
      emptyEl.className = "pending";
      emptyEl.textContent = "Articles are in progress. Write-ups from my AI projects, experiments and research will be published here.";
    } else if (!list.length) {
      emptyEl.className = "empty";
      emptyEl.textContent = state.topic ? "No articles on this topic yet." : "No articles in this category yet.";
    }
    $$(".chip", $("#storyFilters")).forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.cat === state.category)); });
    if (!animate) observeReveal(grid);
  }

  /* ---------------------------------------------------------- research */
  function researchCard(r) {
    var done = r.status === "Completed";
    var pillCls = done ? "pill--live" : r.status === "In progress" ? "pill--progress" : "";
    var list = function (arr) { return (arr || []).filter(function (x) { return x && !isPh(x); }); };
    var block = function (title, html, wide) { return html ? '<div class="rblock' + (wide ? " rblock--wide" : "") + '"><h4>' + title + "</h4>" + html + "</div>" : ""; };
    var ul = function (arr) { var a = list(arr); return a.length ? "<ul>" + a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" : ""; };
    var sources = (r.sources || []).filter(function (s) { return s.label && !isPh(s.label); }).map(function (s) {
      return "<li>" + (s.url ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>" : esc(s.label)) + "</li>";
    }).join("");
    // Findings, insights and conclusions only ever appear on completed studies
    var findings = done ? ul(r.findings) : "";
    var insights = done ? ul(r.keyInsights) : "";
    var conclusion = done ? list(r.conclusion).map(function (c) { return "<p>" + esc(c) + "</p>"; }).join("") : "";
    var visual = r.visual && r.visual.src ? '<img src="' + esc(r.visual.src) + '" alt="' + esc(r.visual.alt || "") + '" loading="lazy">' : "";
    var report = r.reportUrl ? '<div class="rcard__links"><a class="btn btn--small btn--primary" href="' + esc(r.reportUrl) + '" target="_blank" rel="noopener">Open PDF report <span aria-hidden="true">↗</span></a></div>' : "";
    var note = !done && r.statusNote ? '<p class="pending">' + esc(r.statusNote) + "</p>" : "";

    return '<details class="rcard reveal" id="r-' + esc(r.slug) + '">' +
      "<summary>" +
      "<div>" +
      '<div class="rcard__meta"><span class="pill ' + pillCls + '">' + esc(r.status) + "</span>" +
      (r.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
      "<h3>" + esc(r.title) + "</h3>" +
      '<p class="rcard__q"><b>Question</b>' + esc(r.question) + "</p>" +
      "</div>" +
      '<span class="rcard__toggle" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M8 2v12M2 8h12"/></svg></span>' +
      "</summary>" +
      '<div class="rcard__body">' +
      block("Context", r.context ? "<p>" + esc(r.context) + "</p>" : "") +
      block("Method", list(r.methodology).length ? "<ol>" + list(r.methodology).map(function (m) { return "<li><span>" + esc(m) + "</span></li>"; }).join("") + "</ol>" : "") +
      block("Status", note, true) +
      block("Findings", findings) +
      block("Key insights", insights) +
      block("Conclusion", conclusion, true) +
      block("Visualizations", visual, true) +
      block("Sources", sources ? "<ul>" + sources + "</ul>" : "") +
      block("Report", report) +
      "</div></details>";
  }
  function renderResearch() {
    var list = research.filter(matchTopic);
    $("#researchList").innerHTML = list.map(researchCard).join("");
    $("#researchEmpty").hidden = list.length > 0;
    observeReveal($("#researchList"));
  }

  /* ---------------------------------------------------------- projects */
  function statusPill(s) {
    var cls = (s === "Live" || s === "Published" || s === "Completed") ? "pill--live" : (s === "In development" || s === "Prototype") ? "pill--dev" : "";
    return '<span class="pill ' + cls + '">' + esc(s) + "</span>";
  }
  // Status groups used by the project filter chips
  var STAGES = [
    { id: "built", label: "Built", statuses: ["Live", "Published", "Completed"] },
    { id: "progress", label: "In progress", statuses: ["Prototype", "In development"] },
    { id: "experiments", label: "Experiments", statuses: ["Experiment"] }
  ];
  function stageOf(p) { var g = STAGES.filter(function (x) { return x.statuses.indexOf(p.status) !== -1; })[0]; return g ? g.id : "other"; }
  function caseById(slug) { return slug ? (S.caseStudies || []).filter(function (c) { return c.slug === slug; })[0] : null; }
  function projectHref(p) { return "#project-" + p.slug; }
  function realUrl(u) { return typeof u === "string" && /^https?:\/\//.test(u); }
  // Action buttons — only for destinations that really exist
  function projectActions(p, opts) {
    var L = p.links || {}, out = [], small = opts.small ? " btn--small" : "";
    if (opts.detail) out.push('<a class="btn' + small + ' ' + (opts.primaryDetail ? "btn--primary" : "btn--ghost") + '" href="' + projectHref(p) + '">View Project <span aria-hidden="true">→</span></a>');
    var cs = caseById(L.caseStudy);
    if (cs && !opts.noCase) out.push('<a class="btn' + small + ' btn--ghost" href="#' + esc(cs.slug) + '">Read Case Study</a>');
    if (L.internal && L.internal.href && L.internal.href.charAt(0) === "#" && L.internal.href.length > 1) out.push('<a class="btn' + small + ' btn--ghost" href="' + esc(L.internal.href) + '">' + esc(L.internal.label || "Open") + "</a>");
    if (realUrl(L.demo)) out.push('<a class="btn' + small + ' btn--ghost" href="' + esc(L.demo) + '" target="_blank" rel="noopener">Live Demo <span aria-hidden="true">↗</span></a>');
    if (realUrl(L.github)) out.push('<a class="btn' + small + ' btn--ghost" href="' + esc(L.github) + '" target="_blank" rel="noopener">GitHub <span aria-hidden="true">↗</span></a>');
    return out.join("");
  }
  function projectCard(p) {
    var row = function (label, val) {
      if (!val || isPh(val)) return "";
      return "<div><dt>" + label + "</dt><dd>" + esc(val) + "</dd></div>";
    };
    return '<article class="project reveal" id="p-' + esc(p.slug) + '" data-href="' + projectHref(p) + '">' +
      '<div class="project__head"><h3><a href="' + projectHref(p) + '">' + esc(p.name) + "</a></h3>" + statusPill(p.status) + "</div>" +
      (p.tagline ? '<p class="project__tagline">' + esc(p.tagline) + "</p>" : "") +
      "<dl>" + row("Problem", p.problem) + row("What I built", p.solution) + row("My role", p.role) + row("AI used", (p.ai || []).join(" · ")) + "</dl>" +
      '<div class="project__tools">' + p.tools.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>" +
      '<div class="project__actions">' + projectActions(p, { detail: true, small: true }) + "</div>" +
      "</article>";
  }
  function renderProjectFilters() {
    var groups = STAGES.filter(function (g) { return projects.some(function (p) { return stageOf(p) === g.id; }); });
    var bar = $("#projectFilters");
    if (groups.length < 2) { bar.hidden = true; return; }
    bar.innerHTML = [{ id: "all", label: "All" }].concat(groups).map(function (g) {
      var n = g.id === "all" ? projects.length : projects.filter(function (p) { return stageOf(p) === g.id; }).length;
      return '<button class="chip" type="button" data-stage="' + g.id + '" aria-pressed="' + (state.stage === g.id) + '">' + esc(g.label) + '<span class="n">' + n + "</span></button>";
    }).join("");
  }
  function renderProjects(animate) {
    var list = projects.filter(function (p) { return matchTopic(p) && (state.stage === "all" || stageOf(p) === state.stage); });
    var grid = $("#projectGrid");
    grid.classList.toggle("is-filtering", !!animate);
    grid.innerHTML = list.map(projectCard).join("");
    $("#projectEmpty").hidden = list.length > 0;
    $$("#projectFilters .chip").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.stage === state.stage)); });
    var cases = (S.caseStudies || []).filter(function (c) { return c.listed !== false && matchTopic(c); });
    var CASE_LABELS = [["challenge", "Problem"], ["role", "Role"], ["approach", "Approach"], ["implementation", "Build"], ["stack", "AI / tools"], ["testing", "Testing"], ["outcome", "Status"], ["lessons", "Learning"], ["remaining", "Still open"], ["next", "Next step"]];
    $("#caseGrid").innerHTML = cases.map(function (c) {
      var steps = CASE_LABELS.filter(function (l) { var v = c.sections[l[0]]; return v && (!Array.isArray(v) || v.length) && !isPh(Array.isArray(v) ? v.join(" ") : v); })
        .map(function (l) { return "<span>" + l[1] + "</span>"; }).join("");
      return '<article class="case reveal"><p class="kicker">Case study</p><h3>' + esc(c.title) + "</h3><p>" + esc(c.summary) + "</p>" +
        '<p class="case__steps">' + steps + "</p>" +
        '<a class="btn btn--small btn--primary" href="#' + esc(c.slug) + '">Read Case Study <span aria-hidden="true">→</span></a></article>';
    }).join("");
    $("#caseTitle").hidden = cases.length === 0;
    observeReveal($("#projectGrid")); observeReveal($("#caseGrid"));
  }

  /* ------------------------------------------------------------- topics */
  function topicCounts(id) {
    var has = function (x) { return (x.topics || []).indexOf(id) !== -1; };
    return { s: articles.filter(has).length, r: research.filter(has).length, p: projects.filter(has).length + (S.caseStudies || []).filter(has).length };
  }
  function renderTopics() {
    $("#topicGrid").innerHTML = S.topics.map(function (t) {
      var c = topicCounts(t.id);
      var total = c.s + c.r + c.p;
      return '<button class="topic reveal" type="button" data-topic="' + esc(t.id) + '" aria-pressed="' + (state.topic === t.id) + '">' +
        '<span class="topic__icon" aria-hidden="true">' + t.icon + "</span>" +
        '<span class="topic__name">' + esc(t.name) + "</span>" +
        '<span class="topic__blurb">' + esc(t.blurb) + "</span>" +
        '<span class="topic__count">' + (total ? total + (total === 1 ? " item" : " items") : "Exploring") + "</span></button>";
    }).join("");
  }
  function topicBarHTML(label) {
    var t = topicById(state.topic);
    return '<span class="mono">Topic</span><b>' + esc(t.icon + " " + t.name) + '</b><span class="mono">' + label + "</span>" +
      '<button class="btn btn--small btn--ghost" type="button" data-clear-topic>Clear filter</button>';
  }
  function renderTopicBars() {
    var bars = [
      [$("#activeTopicBar"), function () { var n = articles.filter(matchTopic).length; return n + (n === 1 ? " article" : " articles"); }],
      [ensureBar("research", $("#researchList")), function () { var n = research.filter(matchTopic).length; return n + (n === 1 ? " research study" : " research studies"); }],
      [ensureBar("projects", $("#projectGrid")), function () { var n = projects.filter(matchTopic).length; return n + (n === 1 ? " project" : " projects"); }]
    ];
    bars.forEach(function (b, i) {
      // no topic bar above the Insights section while it has no published articles
      b[0].hidden = !state.topic || (i === 0 && !articles.length);
      if (state.topic) b[0].innerHTML = topicBarHTML(b[1]());
    });
    $$(".topic").forEach(function (el) { el.setAttribute("aria-pressed", String(el.dataset.topic === state.topic)); });
  }
  function ensureBar(key, before) {
    var id = "topicBar-" + key, el = document.getElementById(id);
    if (!el) {
      el = document.createElement("div");
      el.id = id; el.className = "topic-filter-bar"; el.hidden = true;
      before.parentNode.insertBefore(el, before);
    }
    return el;
  }
  function setTopic(id, scroll) {
    state.topic = state.topic === id ? null : id;
    renderStories(true); renderResearch(); renderProjects(); renderTopicBars();
    if (state.topic && scroll) {
      // jump to the first section (in page order) that has matches for this topic
      var target = projects.some(matchTopic) ? "projects" : research.some(matchTopic) ? "research" : "stories";
      document.getElementById(target).scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      var t = topicById(id); toast("Showing everything on " + t.name);
    }
  }

  /* ----------------------------------------------------------- workflow */
  var stageIndex = 0, stageAuto = null;
  function renderWorkflow() {
    var wf = P.workflow;
    $("#pipeline").setAttribute("role", "tablist");
    $("#pipeline").setAttribute("aria-label", "AI workflow stages");
    $("#pipeline").innerHTML = wf.map(function (s, i) {
      var n = String(i + 1).padStart(2, "0");
      return '<button class="stage" type="button" role="tab" id="stage-' + i + '" aria-controls="pipelineDetail" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '" data-i="' + i + '">' +
        '<span class="stage__node">' + n + '</span><span class="stage__name">' + esc(s.key) + "</span></button>";
    }).join("");
    $("#pipelineDetail").setAttribute("role", "tabpanel");
    selectStage(0, false);
    if (!reduceMotion && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (e) {
        if (e[0].isIntersecting && stageAuto === null) {
          stageAuto = setInterval(function () { selectStage((stageIndex + 1) % wf.length, false); }, 3800);
        } else if (!e[0].isIntersecting && stageAuto) { clearInterval(stageAuto); stageAuto = null; }
      }, { threshold: 0.4 });
      io.observe($("#pipeline"));
      var stopAuto = function () { if (stageAuto) clearInterval(stageAuto); stageAuto = false; io.disconnect(); };
      $("#pipeline").addEventListener("pointerdown", stopAuto);
      $("#pipeline").addEventListener("keydown", stopAuto);
    }
  }
  function renderPromptLoop() {
    var L = P.promptLoop, box = $("#promptLoop");
    if (!L || !box) { if (box) box.hidden = true; return; }
    box.innerHTML =
      '<h3 class="mini-head">' + esc(L.title) + "</h3>" +
      '<p class="approach prompt-loop__chain">' + L.steps.map(function (st) { return "<span>" + esc(st) + "</span>"; }).join('<i aria-hidden="true">→</i>') + "</p>" +
      (L.text ? '<p class="prompt-loop__text">' + esc(L.text) + "</p>" : "") +
      (L.applied ? '<p class="prompt-loop__applied"><span class="mono">' + esc(L.applied.label) + "</span> " + esc(L.applied.text) +
        (L.applied.href ? ' <a class="btn btn--link" href="' + esc(L.applied.href) + '">' + esc(L.applied.linkLabel || "See details") + ' <span aria-hidden="true">→</span></a>' : "") + "</p>" : "");
  }
  function selectStage(i, focus) {
    var s = P.workflow[i]; stageIndex = i;
    $$(".stage").forEach(function (b, k) {
      b.setAttribute("aria-selected", String(k === i)); b.tabIndex = k === i ? 0 : -1;
      if (k === i && focus) b.focus();
    });
    $("#pipelineDetail").setAttribute("aria-labelledby", "stage-" + i);
    $("#pipelineDetail").innerHTML =
      '<div class="num">' + String(i + 1).padStart(2, "0") + "</div>" +
      "<div><h3>" + esc(s.key) + "</h3><p>" + esc(s.text) + "</p></div>" +
      '<div class="check"><span>The question at this stage</span><p>' + esc(s.check) + "</p></div>";
  }

  /* ------------------------------------------------------ certifications */
  function chainHTML(steps) {
    return '<span class="approach">' + steps.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join('<i aria-hidden="true">→</i>') + "</span>";
  }
  function certCard(c) {
    var meta = (c.latest ? '<span class="pill pill--live">Latest</span>' : "") +
      (c.type ? '<span class="pill">' + esc(c.type) + "</span>" : "") +
      '<span class="mono cert__issuer">' + esc(c.issuer) + (c.platform ? " · via " + esc(c.platform) : "") + "</span>" +
      '<span class="mono cert__date">Completed ' + fmtDate(c.date) + "</span>";

    var main = "";
    (c.description || []).forEach(function (p) { main += '<p class="cert__desc">' + esc(p) + "</p>"; });
    if (c.framework) main += '<div class="cert__block"><h4>' + esc(c.framework.label) + "</h4>" + chainHTML(c.framework.steps) + "</div>";
    if (c.lists && c.lists.length) {
      main += '<div class="cert__lists">' + c.lists.map(function (l) {
        return '<div class="cert__block"><h4>' + esc(l.label) + '</h4><ul class="cert__ul">' + l.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>" +
          (l.note ? '<p class="cert__note">' + esc(l.note) + "</p>" : "") + "</div>";
      }).join("") + "</div>";
    }
    if (c.modules && c.modules.length) {
      main += '<details class="cert__more"><summary><span>' + esc(c.modulesLabel || "Program coverage") + '</span><span class="mono">' + c.modules.length + ' areas</span><span class="rcard__toggle" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M8 2v12M2 8h12"/></svg></span></summary>' +
        '<ul class="module-grid">' + c.modules.map(function (m) { return "<li><b>" + esc(m.title) + "</b><span>" + esc(m.text) + "</span></li>"; }).join("") + "</ul></details>";
    }

    var side = "";
    if (c.tools && c.tools.length) side += '<div class="cert__block"><h4>Tools Explored</h4><div class="project__tools cert__tools">' + c.tools.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div></div>";
    if (c.skills && c.skills.length) side += '<div class="cert__block"><h4>' + esc(c.skillsLabel || "Skills") + '</h4><div class="chip-row">' + c.skills.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("") + "</div></div>";
    if (c.focus && c.focus.length) side += '<div class="cert__block"><h4>Applied Focus</h4><ul class="cert__ul cert__ul--cols">' + c.focus.map(function (f) { return "<li>" + esc(f) + "</li>"; }).join("") + "</ul></div>";
    if (c.takeaway) {
      side += '<div class="cert__takeaway"><p class="cert__takeaway-label mono">' + esc(c.takeaway.label || "Key Takeaway") + "</p>" +
        (c.takeaway.lead ? "<p>" + esc(c.takeaway.lead) + "</p>" : "") +
        (c.takeaway.chain ? chainHTML(c.takeaway.chain) : "") +
        (c.takeaway.text ? "<p>" + esc(c.takeaway.text) + "</p>" : "") + "</div>";
    }
    // Verification button only when a real credential URL exists
    if (c.credentialUrl && /^https?:\/\//.test(c.credentialUrl)) side += '<div><a class="btn btn--small btn--ghost" href="' + esc(c.credentialUrl) + '" target="_blank" rel="noopener">Verify credential <span aria-hidden="true">↗</span></a></div>';

    return '<article class="cert reveal' + (c.latest ? " cert--latest" : "") + '" id="c-' + esc(c.slug) + '">' +
      '<div class="cert__main"><div class="cert__meta">' + meta + "</div><h3>" + esc(c.title) + "</h3>" + (c.program ? '<p class="cert__program mono">' + esc(c.program) + "</p>" : "") + main + "</div>" +
      '<aside class="cert__side" aria-label="' + esc(c.title) + ' details">' + side + "</aside></article>";
  }
  function renderCertifications() {
    var list = (S.certifications || []).slice().sort(function (a, b) {
      if (a.latest !== b.latest) return a.latest ? -1 : 1;
      return a.date < b.date ? 1 : -1;
    });
    var sec = document.getElementById("certifications");
    if (!list.length) { sec.hidden = true; return; }
    $("#certList").innerHTML = list.map(certCard).join("");
    observeReveal($("#certList"));
  }

  /* -------------------------------------------- principles, skills, etc. */
  function renderPrinciples() {
    var tick = '<span class="principle__mark" aria-hidden="true"><svg viewBox="0 0 12 12"><path d="M2.5 6.2 5 8.5l4.5-5"/></svg></span>';
    $("#principleList").innerHTML = P.principles.map(function (p) {
      return '<div class="principle reveal' + (p.lead ? " principle--lead" : "") + '">' + tick + "<h3>" + esc(p.title) + "</h3><p>" + esc(p.text) + "</p></div>";
    }).join("");
  }
  function renderSkills() {
    var L = { Core: 3, Working: 2, Learning: 1 };
    $("#skillGrid").innerHTML = P.skills.map(function (g) {
      return '<div class="skill-group reveal"><h3>' + esc(g.group) + "</h3><ul>" + g.items.map(function (it) {
        var l = L[it.level] || 1;
        var ev = (it.evidence || []).filter(function (e) { return e && e.label && e.href && e.href.charAt(0) === "#" && e.href.length > 1; });
        var detail = (it.use ? '<small class="skill__use">' + esc(it.use) + "</small>" : "") +
          (ev.length ? '<small class="skill__ev">Used in: ' + ev.map(function (e) { return '<a href="' + esc(e.href) + '">' + esc(e.label) + "</a>"; }).join(", ") + "</small>" : "");
        return '<li><span class="skill__name">' + esc(it.name) + detail + '</span><span class="meter" data-l="' + l + '" title="' + esc(it.level) + '"><i></i><i></i><i></i><span class="sr-only">' + esc(it.level) + "</span></span></li>";
      }).join("") + "</ul></div>";
    }).join("");
  }
  function renderTimeline() {
    $("#timeline").innerHTML = P.timeline.map(function (t) {
      return '<li class="tl reveal"><p class="tl__year">' + esc(t.year) + "</p><h3>" + esc(t.title) + "</h3><p>" + esc(t.text) + "</p>" +
        (t.note && !isPh(t.note) ? '<p class="pending note">' + esc(t.note) + "</p>" : "") + "</li>";
    }).join("");
  }
  function renderStats() {
    // Only real figures are shown. A stat with value null stays hidden;
    // with no real figures, the whole stats panel is hidden.
    var real = (P.stats || []).filter(function (s) { return s.value !== null && s.value !== undefined && s.value !== ""; });
    var panel = $(".stats");
    if (!real.length) { panel.hidden = true; $("#journey .journey").classList.add("journey--solo"); return; }
    $("#stats").innerHTML = real.map(function (s) {
      return '<div class="stat"><dt>' + esc(s.label) + "</dt><dd>" + esc(s.value) + "</dd></div>";
    }).join("");
    $("#statsNote").textContent = "";
  }

  /* ------------------------------------------------------------ contact */
  function renderContact() {
    var C = P.contact;
    var mail = "mailto:" + C.email;
    $("#contactSub").textContent = (P.contactLine || "I'm open to AI projects, research, experimentation and collaboration.") + " Based in " + P.location + ", working in " + P.timezone + ".";
    var start = $("#startConvo");
    if (C.conversationUrl) { start.href = C.conversationUrl; start.target = "_blank"; start.rel = "noopener"; }
    else start.href = mail + "?subject=" + encodeURIComponent("Collaboration idea");
    ["linkedin", "github"].forEach(function (key) {
      var btn = $("#" + key + "Btn"), soc = P.socials.filter(function (x) { return x.label.toLowerCase() === key && x.url; })[0];
      if (!soc) { btn.hidden = true; return; }
      btn.href = soc.url; btn.target = "_blank"; btn.rel = "noopener me";
      btn.setAttribute("aria-label", soc.label + " profile (opens in a new tab)");
    });
    $("#emailText").textContent = C.email;
    $("#copyEmail").addEventListener("click", function () { copyText(C.email, "Email address copied"); });

    // Profiles already shown as buttons (LinkedIn, GitHub) or as the email line aren't repeated here
    var shown = ["linkedin", "github", "email"];
    var extra = P.socials.filter(function (s) { return s.url && shown.indexOf(s.label.toLowerCase()) === -1; });
    $("#socials").hidden = !extra.length;
    $("#socials").innerHTML = extra.map(function (s) {
      var ext = s.url.indexOf("http") === 0;
      return '<li><a href="' + esc(s.url) + '"' + (ext ? ' target="_blank" rel="noopener me"' : "") + ">" + esc(s.label) + " <small>" + esc(s.handle) + "</small></a></li>";
    }).join("");
    $("#footerSocials").innerHTML = P.socials.filter(function (s) { return s.url; }).map(function (s) {
      var ext = s.url.indexOf("http") === 0;
      return '<li><a href="' + esc(s.url) + '"' + (ext ? ' target="_blank" rel="noopener me"' : "") + ">" + esc(s.label) + "</a></li>";
    }).join("");
    $("#footerTag").textContent = P.tagline;
    $("#year").textContent = new Date().getFullYear();

    [$("#resumeBtn"), $("#resumeBtnMobile")].forEach(function (b) {
      if (S.resume) return; // opens the resume viewer (#resume)
      if (C.resumeUrl) { b.href = C.resumeUrl; b.target = "_blank"; b.rel = "noopener"; }
      else b.addEventListener("click", function (e) { e.preventDefault(); toast("Resume available on request. Email me from the Contact section."); });
    });
    var rBox = $(".contact__resume");
    if (!S.resume) rBox.hidden = true;
    else $("#downloadResume").href = (S.resume.files && S.resume.files.pdf) || C.resumeUrl;
  }

  /* -------------------------------------------------------------- resume */
  function openResume() {
    var R = S.resume, C = R.contact;
    var contactBits = [C.location, C.phone, C.email, C.linkedin, C.github, C.portfolio].filter(Boolean)
      .map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
    var sec = function (title, html) { return '<section class="cv-sec"><h2>' + esc(title) + "</h2>" + html + "</section>"; };
    var item = function (name, sub, date, bullets, detail) {
      return '<div class="cv-item"><div class="cv-item__head"><h3>' + esc(name) + (sub ? ' <span>— ' + esc(sub) + "</span>" : "") + "</h3>" +
        (date ? '<span class="mono">' + esc(date) + "</span>" : "") + "</div>" +
        (detail ? '<p class="cv-detail">' + esc(detail) + "</p>" : "") +
        (bullets && bullets.length ? "<ul>" + bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" : "") + "</div>";
    };
    var files = R.files || {};
    var html =
      '<header class="rd-head cv-head">' +
      '<span class="cat">Resume</span>' +
      '<h1 class="rd-title" id="readerTitle">' + esc(R.name) + "</h1>" +
      '<p class="rd-dek">' + esc(R.headline) + "</p>" +
      '<p class="cv-contact mono">' + contactBits + "</p>" +
      '<div class="cv-actions">' +
      (files.pdf ? '<a class="btn btn--small btn--primary" href="' + esc(files.pdf) + '" download>Download PDF <span aria-hidden="true">↓</span></a>' : "") +
      (files.docx ? '<a class="btn btn--small btn--ghost" href="' + esc(files.docx) + '" download>Download Word (.docx)</a>' : "") +
      "</div></header>" +
      '<div class="cv-body">' +
      sec("Professional Summary", '<p class="cv-summary">' + esc(R.summary) + "</p>") +
      sec("Core Skills", '<dl class="cv-skills">' + R.skills.map(function (g) {
        return "<div><dt>" + esc(g.label) + "</dt><dd>" + g.items.map(esc).join(", ") + "</dd></div>";
      }).join("") + "</dl>") +
      (R.experience && R.experience.length ? sec("Experience", R.experience.map(function (x) {
        return item(x.title, x.company + (x.location ? ", " + x.location : ""), x.dates, x.bullets);
      }).join("")) : "") +
      sec("AI Projects", R.projects.map(function (p) { return item(p.name, p.context, p.date, p.bullets); }).join("")) +
      sec("Certifications & Job Simulations", R.certifications.map(function (c) { return item(c.title, c.issuer, c.date, c.bullets, c.detail); }).join("")) +
      sec("Education", R.education.map(function (e) { return item(e.degree, e.school, e.date); }).join("") +
        (R.languages && R.languages.length ? '<p class="cv-detail"><b>Languages:</b> ' + R.languages.map(esc).join(", ") + "</p>" : "")) +
      "</div>";
    $("#readerCrumb").textContent = "Resume / " + R.name;
    $("#readerArticle").innerHTML = html;
    document.title = R.name + " — Resume";
    showReader();
  }

  function syncArticleLinks() {
    $$("[data-needs-articles]").forEach(function (a) {
      var li = a.closest("li");
      (li || a).hidden = !articles.length;
    });
  }

  /* -------------------------------------------------------------- reveal */
  var revealIO = ("IntersectionObserver" in window && !reduceMotion)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-in"); revealIO.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px 0px 0px", threshold: 0 })
    : null;
  function observeReveal(root) {
    if (!revealIO) return;
    $$(".reveal:not(.is-in)", root).forEach(function (el) {
      // Elements already on screen stay as they are (no hide-then-show flash)
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      revealIO.observe(el);
    });
  }

  /* ---------------------------------------------------------- dialogs */
  var lastFocus = null;
  function trapFocus(container, e) {
    if (e.key !== "Tab") return;
    var f = $$('a[href],button:not([disabled]),input,[tabindex]:not([tabindex="-1"]),summary', container).filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function lock(on) { document.body.classList.toggle("is-locked", on); }

  /* -------------------------------------------------------------- reader */
  var reader = $("#reader"), readerOpenedByHash = false, baseTitle = document.title;

  function blockHTML(b) {
    if (typeof b === "string") return "<p>" + esc(b) + "</p>";
    if (b.h) return "<h2>" + esc(b.h) + "</h2>";
    if (b.quote) return "<blockquote><p>" + esc(b.quote) + "</p>" + (b.by ? "<cite>" + esc(b.by) + "</cite>" : "") + "</blockquote>";
    if (b.list) return "<ul>" + b.list.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + "</ul>";
    if (b.note) return '<p class="rd-note">' + esc(b.note) + "</p>";
    return "";
  }
  function related(a) {
    return articles.filter(function (x) { return x !== a; }).map(function (x) {
      var overlap = (x.topics || []).filter(function (t) { return (a.topics || []).indexOf(t) !== -1; }).length;
      return { x: x, score: overlap + (x.category === a.category ? 1 : 0) };
    }).sort(function (p, q) { return q.score - p.score; }).slice(0, 3).map(function (o) { return o.x; });
  }
  function shareLinks(a) {
    var url = location.href.split("#")[0] + storyHref(a);
    return '<div class="share">' +
      '<button class="btn btn--small btn--ghost" type="button" data-copy="' + esc(url) + '">Copy link</button>' +
      '<a class="btn btn--small btn--ghost" target="_blank" rel="noopener" href="https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url) + '">Share on LinkedIn ↗</a>' +
      '<a class="btn btn--small btn--ghost" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(a.title) + "&url=" + encodeURIComponent(url) + '">Share on X ↗</a>' +
      '<a class="btn btn--small btn--ghost" href="mailto:?subject=' + encodeURIComponent(a.title) + "&body=" + encodeURIComponent(url) + '">Email</a>' +
      "</div>";
  }
  function setArticleLD(a) {
    var old = $("#articleLd"); if (old) old.remove();
    if (!a) return;
    var s = document.createElement("script");
    s.type = "application/ld+json"; s.id = "articleLd";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.dek,
      datePublished: a.date, author: { "@type": "Person", name: P.name }, articleSection: a.category, keywords: (a.tags || []).join(", ")
    });
    document.head.appendChild(s);
  }

  function openArticle(a) {
    var rel = related(a);
    $("#readerCrumb").textContent = "Insights / " + a.category;
    $("#readerArticle").innerHTML =
      '<header class="rd-head">' +
      '<span class="cat">' + esc(a.category) + "</span>" +
      '<h1 class="rd-title" id="readerTitle">' + esc(a.title) + "</h1>" +
      '<p class="rd-dek">' + esc(a.dek) + "</p>" +
      '<div class="byline"><div class="avatar" aria-hidden="true">SG</div>' +
      '<div class="byline__who"><b>' + esc(P.name) + '</b><span class="mono" style="color:var(--muted)">' + esc(P.primaryRole) + "</span></div>" +
      '<p class="meta"><span>' + fmtDate(a.date) + "</span><span>" + readingTime(a) + "</span></p>" + sampleBadge(a) + "</div>" +
      "</header>" +
      '<figure class="rd-cover" style="margin-inline:0">' + coverHTML(a) + "</figure>" +
      '<div class="rd-body">' + a.body.map(blockHTML).join("") + "</div>" +
      (a.externalUrl ? '<div class="rd-section"><a class="btn btn--primary" href="' + esc(a.externalUrl) + '" target="_blank" rel="noopener">Read at the original publication ↗</a></div>' : "") +
      (function () {
        var src = (a.sources || []).filter(function (s) { return s.label && !isPh(s.label); });
        return src.length ? '<section class="rd-section"><h2>Sources</h2><ol class="rd-sources">' + src.map(function (s) {
          return "<li><span>" + (s.url ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a>" : esc(s.label)) + "</span></li>";
        }).join("") + "</ol></section>" : "";
      })() +
      '<section class="rd-section"><h2>Tags</h2><div class="story__tags">' + (a.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div></section>" +
      '<section class="rd-section"><h2>Share this article</h2>' + shareLinks(a) + "</section>" +
      (rel.length ? '<section class="rd-section rd-related"><h2>Related articles</h2><div class="related-grid">' + rel.map(storyCard).join("") + "</div></section>" : "");
    document.title = a.title + " — " + P.name;
    setArticleLD(a);
    showReader();
  }

  function openProject(p) {
    var row = function (label, html) { return html ? '<div class="cs-row"><h2>' + label + "</h2>" + html + "</div>" : ""; };
    var para = function (v) { return v && !isPh(v) ? "<p>" + esc(v) + "</p>" : ""; };
    var cs = caseById((p.links || {}).caseStudy);
    var evidence = (p.evidence || []).filter(function (e) { return e && !isPh(e); });
    var shots = (p.screenshots || []).filter(function (x) { return x && x.src; });
    var actions = projectActions(p, { detail: false });
    $("#readerCrumb").textContent = "Projects / " + p.name;
    $("#readerArticle").innerHTML =
      '<header class="rd-head">' +
      '<div class="featured__label"><span class="cat">AI Project</span>' + statusPill(p.status) + (p.date ? '<span class="mono" style="color:var(--muted)">' + esc(p.date) + "</span>" : "") + "</div>" +
      '<h1 class="rd-title" id="readerTitle">' + esc(p.name) + "</h1>" +
      (p.solution ? '<p class="rd-dek">' + esc(p.featuredSummary || p.solution) + "</p>" : "") +
      (actions ? '<div class="cv-actions">' + actions + "</div>" : "") +
      "</header>" +
      (shots.length ? '<div class="proj-shots">' + shots.map(function (x) {
        return '<figure><div class="cover"><img src="' + esc(x.src) + '" alt="' + esc(x.alt || p.name) + '"' + (x.width && x.height ? ' width="' + (+x.width) + '" height="' + (+x.height) + '"' : "") + ' loading="lazy" decoding="async"></div>' + (x.caption ? "<figcaption class=\"mono\">" + esc(x.caption) + "</figcaption>" : "") + "</figure>";
      }).join("") + "</div>" : "") +
      '<div class="cs-grid">' +
      row("Status", "<p>" + esc(p.status) + "</p>") +
      row("Problem", para(p.problem)) +
      row("Approach", para(p.solution)) +
      row("AI used", (p.ai || []).length ? "<p>" + p.ai.map(esc).join(" · ") + "</p>" : "") +
      row("Tools", p.tools.length ? '<div class="project__tools proj-tools">' + p.tools.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div>" : "") +
      row("My role", para(p.role)) +
      row("Current state", para(p.outcome)) +
      row("Evidence", evidence.length ? '<ul class="cert__ul">' + evidence.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>" : "") +
      row("Case study", cs ? '<p><a class="btn btn--small btn--primary" href="#' + esc(cs.slug) + '">' + esc(cs.title) + ' <span aria-hidden="true">→</span></a></p>' : "") +
      "</div>";
    document.title = p.name + " — " + P.name;
    showReader();
  }

  function openCase(c) {
    var sec = c.sections;
    var row = function (label, val) {
      var txt = Array.isArray(val) ? val.join(" · ") : val;
      if (!txt || isPh(txt)) return "";
      return '<div class="cs-row"><h2>' + label + "</h2><p>" + esc(txt) + "</p></div>";
    };
    var proj = c.project && projects.filter(function (x) { return x.slug === c.project; })[0];
    $("#readerCrumb").textContent = "Case Studies / " + c.title;
    $("#readerArticle").innerHTML =
      '<header class="rd-head"><span class="cat">Case Study</span>' +
      '<h1 class="rd-title" id="readerTitle">' + esc(c.title) + "</h1>" +
      '<p class="rd-dek">' + esc(c.summary) + "</p>" +
      (proj ? '<div class="cv-actions"><a class="btn btn--small btn--ghost" href="' + projectHref(proj) + '">View Project <span aria-hidden="true">→</span></a></div>' : "") +
      "</header>" +
      '<div class="cs-grid">' +
      row("Problem", sec.challenge) + row("My role", sec.role) + row("Approach", sec.approach || sec.research) +
      row("What I built", sec.implementation || sec.process) + row("AI / tools", sec.stack || sec.tools) + row("Testing", sec.testing) +
      row("Result / current status", sec.outcome || sec.result) + row("What I learned", sec.lessons) + row("Still open", sec.remaining) + row("Next step", sec.next) +
      "</div>";
    document.title = c.title + " — " + P.name;
    showReader();
  }

  function showReader() {
    if (reader.hidden) lastFocus = document.activeElement;
    reader.hidden = false; lock(true);
    $("#readerScroll").scrollTop = 0;
    $("#readerProgress").style.transform = "scaleX(0)";
    observeReveal(reader);
    $$(".reveal", reader).forEach(function (el) { el.classList.remove("reveal"); });
    $("#readerClose").focus({ preventScroll: true });
  }
  function hideReader() {
    reader.hidden = true; lock(false);
    document.title = baseTitle; setArticleLD(null);
    if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  function closeReader() {
    if (readerOpenedByHash && history.length > 1) { history.back(); return; }
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {}
    hideReader();
  }
  $("#readerClose").addEventListener("click", closeReader);
  $("#readerScroll").addEventListener("scroll", function () {
    var el = this, max = el.scrollHeight - el.clientHeight;
    $("#readerProgress").style.transform = "scaleX(" + (max > 0 ? el.scrollTop / max : 0) + ")";
  }, { passive: true });
  reader.addEventListener("keydown", function (e) { trapFocus(reader, e); });
  reader.addEventListener("click", function (e) {
    var c = e.target.closest("[data-copy]");
    if (c) copyText(c.getAttribute("data-copy"), "Link copied");
  });

  /* ------------------------------------------------------------- routing */
  function route(fromNav) {
    var h = decodeURIComponent(location.hash.slice(1));
    if (h === "resume" && S.resume) { readerOpenedByHash = !!fromNav; openResume(); return; }
    if (h.indexOf("story-") === 0) {
      var a = articles.filter(function (x) { return x.slug === h.slice(6); })[0];
      if (a) { readerOpenedByHash = !!fromNav; openArticle(a); return; }
    }
    if (h.indexOf("project-") === 0) {
      var pj = projects.filter(function (x) { return x.slug === h.slice(8); })[0];
      if (pj) { readerOpenedByHash = !!fromNav; openProject(pj); return; }
    }
    var c = (S.caseStudies || []).filter(function (x) { return x.slug === h; })[0];
    if (c) { readerOpenedByHash = !!fromNav; openCase(c); return; }
    if (!reader.hidden) hideReader();
    if (h.indexOf("r-") === 0) openResearch(h.slice(2));
  }
  window.addEventListener("hashchange", function () { route(true); });

  function openResearch(slug) {
    var d = document.getElementById("r-" + slug);
    if (!d) { state.topic = null; renderResearch(); renderTopicBars(); d = document.getElementById("r-" + slug); }
    if (!d) return;
    d.open = true;
    d.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  /* -------------------------------------------------------------- search */
  var searchEl = $("#search"), searchInput = $("#searchInput"), searchActive = -1;
  var index = [];
  function buildIndex() {
    articles.forEach(function (a) {
      index.push({ type: "Articles", title: a.title, sub: a.category + " · " + fmtDate(a.date), text: [a.title, a.dek, a.category, (a.tags || []).join(" "), bodyText(a)].join(" "), href: storyHref(a) });
    });
    research.forEach(function (r) {
      index.push({ type: "Research", title: r.title, sub: r.status + " · " + r.question, text: [r.title, r.question, r.context, (r.tags || []).join(" ")].join(" "), href: "#r-" + r.slug });
    });
    projects.forEach(function (p) {
      index.push({ type: "Projects", title: p.name, sub: p.status + " · " + p.solution, text: [p.name, p.status, p.problem, p.solution, p.role || "", p.outcome || "", (p.evidence || []).join(" "), p.tools.join(" "), (p.ai || []).join(" ")].join(" "), href: projectHref(p) });
    });
    (S.caseStudies || []).forEach(function (c) {
      index.push({ type: "Projects", title: c.title, sub: "Case study · " + c.summary, text: [c.title, c.summary].join(" "), href: "#" + c.slug });
    });
    (S.certifications || []).forEach(function (c) {
      index.push({ type: "Certifications", title: c.title, sub: c.issuer + (c.platform ? " · " + c.platform : "") + " · " + fmtDate(c.date), text: [c.title, c.program || "", c.issuer, c.platform || "", c.type || "", (c.description || []).join(" "), (c.modules || []).map(function (m) { return m.title + " " + m.text; }).join(" "), (c.lists || []).map(function (l) { return l.items.join(" "); }).join(" "), (c.skills || []).join(" "), (c.tools || []).join(" "), (c.focus || []).join(" ")].join(" "), action: function () {
        var el = document.getElementById("c-" + c.slug);
        if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      } });
    });
    var goto = function (id) { return function () { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); }; };
    (P.about.strengths || []).forEach(function (c) {
      index.push({ type: "Capabilities", title: c.title, sub: c.text, text: [c.title, c.text].join(" "), action: goto("about") });
    });
    (P.skills || []).forEach(function (g) {
      g.items.forEach(function (it) {
        index.push({ type: "Toolkit", title: it.name, sub: g.group + " · " + it.level + (it.use ? " · " + it.use : ""), text: [it.name, g.group, it.use || "", (it.evidence || []).map(function (e) { return e.label; }).join(" ")].join(" "), action: goto("skills") });
      });
    });
    S.topics.forEach(function (t) {
      index.push({ type: "Topics", title: t.icon + " " + t.name, sub: t.blurb, text: [t.name, t.blurb].join(" "), action: function () { if (state.topic !== t.id) setTopic(t.id, true); else document.getElementById("topics").scrollIntoView(); } });
    });
  }
  function highlight(text, terms) {
    var out = esc(text);
    terms.forEach(function (t) {
      if (t.length < 2) return;
      out = out.replace(new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>");
    });
    return out;
  }
  function runSearch() {
    var q = searchInput.value.trim().toLowerCase();
    var box = $("#searchResults");
    searchActive = -1;
    if (!q) {
      box.innerHTML = '<p class="sr-hint">Search across ' + projects.length + " projects, " + research.length + " research studies, " + (S.certifications || []).length + " certifications" + (articles.length ? ", " + articles.length + " articles" : "") + " and " + S.topics.length + " topics. Try “FitAI”, “prompt” or “Gemini”.</p>";
      return;
    }
    var terms = q.split(/\s+/).filter(Boolean);
    var hits = index.map(function (it) {
      var hay = it.text.toLowerCase(), title = it.title.toLowerCase(), score = 0;
      for (var i = 0; i < terms.length; i++) {
        if (hay.indexOf(terms[i]) === -1) return null;
        score += title.indexOf(terms[i]) !== -1 ? 3 : 1;
      }
      return { it: it, score: score };
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score; });
    if (!hits.length) { box.innerHTML = '<p class="sr-empty">No results for “' + esc(q) + "”. Try a broader word.</p>"; return; }
    var groups = {};
    hits.forEach(function (h) { (groups[h.it.type] = groups[h.it.type] || []).push(h.it); });
    var n = 0;
    box.innerHTML = ["Projects", "Research", "Certifications", "Capabilities", "Toolkit", "Articles", "Topics"].filter(function (g) { return groups[g]; }).map(function (g) {
      return '<div class="sr-group"><h3>' + g + " · " + groups[g].length + "</h3>" + groups[g].slice(0, 6).map(function (it) {
        var i = index.indexOf(it); n++;
        return '<button class="sr-item" type="button" data-idx="' + i + '"><b>' + highlight(it.title, terms) + "</b><span>" + highlight(it.sub, terms) + "</span></button>";
      }).join("") + "</div>";
    }).join("");
  }
  function openSearch() {
    lastFocus = document.activeElement;
    closeMenu();
    searchEl.hidden = false; lock(true);
    searchInput.value = ""; runSearch();
    setTimeout(function () { searchInput.focus(); }, 30);
  }
  function closeSearch(restore) {
    searchEl.hidden = true;
    if (reader.hidden) lock(false);
    if (restore !== false && lastFocus) lastFocus.focus({ preventScroll: true });
  }
  function chooseResult(btn) {
    var it = index[+btn.dataset.idx];
    closeSearch(false);
    if (it.href) {
      if (location.hash === it.href) route(true); else location.hash = it.href;
    } else if (it.action) it.action();
  }
  $("#searchOpen").addEventListener("click", openSearch);
  $("#searchClose").addEventListener("click", function () { closeSearch(); });
  searchInput.addEventListener("input", runSearch);
  searchEl.addEventListener("click", function (e) {
    if (e.target === searchEl) { closeSearch(); return; }
    var b = e.target.closest(".sr-item"); if (b) chooseResult(b);
  });
  searchEl.addEventListener("keydown", function (e) {
    var items = $$(".sr-item", searchEl);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!items.length) return;
      e.preventDefault();
      searchActive = e.key === "ArrowDown" ? Math.min(items.length - 1, searchActive + 1) : Math.max(0, searchActive - 1);
      items.forEach(function (it, i) { it.classList.toggle("is-active", i === searchActive); });
      items[searchActive].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter" && document.activeElement === searchInput) {
      e.preventDefault();
      var pick = items[searchActive >= 0 ? searchActive : 0];
      if (pick) chooseResult(pick);
    } else trapFocus(searchEl.querySelector(".search__panel"), e);
  });

  /* ---------------------------------------------------------------- nav */
  var menu = $("#mobileMenu"), burger = $("#menuOpen");
  function openMenu() { menu.hidden = false; burger.setAttribute("aria-expanded", "true"); burger.setAttribute("aria-label", "Close menu"); lock(true); }
  function closeMenu() { if (menu.hidden) return; menu.hidden = true; burger.setAttribute("aria-expanded", "false"); burger.setAttribute("aria-label", "Open menu"); if (reader.hidden && searchEl.hidden) lock(false); }
  burger.addEventListener("click", function () { menu.hidden ? openMenu() : closeMenu(); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  window.addEventListener("resize", function () { if (window.innerWidth > 1180) closeMenu(); });

  var nav = $("#nav"), bar = $("#readProgress");
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle("is-scrolled", y > 8);
    bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  if ("IntersectionObserver" in window) {
    var links = $$(".nav__links a");
    var map = { home: "home", about: "about", featured: "projects", stories: "stories", research: "research", workflow: "research", projects: "projects", topics: "topics", principles: "topics", skills: "skills", certifications: "certifications", journey: "certifications", contact: "contact" };
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var key = map[e.target.id];
        links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === "#" + key); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* -------------------------------------------------------------- theme */
  var themeBtn = $("#themeToggle");
  function effectiveTheme() {
    var t = document.documentElement.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  function syncThemeLabel() { themeBtn.setAttribute("aria-label", effectiveTheme() === "dark" ? "Switch to light mode" : "Switch to dark mode"); }
  themeBtn.addEventListener("click", function () {
    var next = effectiveTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    store("desk-theme", next);
    syncThemeLabel();
    document.dispatchEvent(new Event("themechange"));
  });
  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", function () { syncThemeLabel(); document.dispatchEvent(new Event("themechange")); });
  syncThemeLabel();

  /* ------------------------------------------------------------- AI desk */
  var desk = $("#desk"), launch = $("#deskLaunch"), log = $("#deskLog"), greeted = false, busy = false;
  function deskMsg(who, text, typed) {
    var m = document.createElement("div");
    m.className = "msg msg--" + (who === "you" ? "you" : "desk");
    m.innerHTML = '<span class="msg__who">' + (who === "you" ? "&gt; You" : "Desk") + '</span><span class="msg__text"></span>';
    log.appendChild(m);
    var t = m.querySelector(".msg__text");
    if (!typed || reduceMotion) { t.textContent = text; log.scrollTop = log.scrollHeight; return Promise.resolve(); }
    t.classList.add("is-typing");
    return new Promise(function (res) {
      var i = 0, step = Math.max(1, Math.round(text.length / 120));
      (function go() {
        i += step; t.textContent = text.slice(0, i); log.scrollTop = log.scrollHeight;
        if (i < text.length) setTimeout(go, 14); else { t.classList.remove("is-typing"); res(); }
      })();
    });
  }
  function deskAsk(q) {
    q = (q || "").trim();
    if (!q || busy) return;
    busy = true;
    deskMsg("you", q, false);
    AIDesk.ask(q).then(function (ans) { return deskMsg("desk", ans, true); }).then(function () { busy = false; });
  }
  function openDesk() {
    desk.hidden = false; launch.setAttribute("aria-expanded", "true");
    if (!greeted) { greeted = true; deskMsg("desk", S.desk.greeting, true); }
    $("#deskInput").focus({ preventScroll: true });
  }
  function closeDesk() { desk.hidden = true; launch.setAttribute("aria-expanded", "false"); launch.focus({ preventScroll: true }); }
  $("#deskChips").innerHTML = S.desk.suggestions.map(function (s) { return '<button type="button">' + esc(s) + "</button>"; }).join("");
  $("#deskChips").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) deskAsk(b.textContent); });
  $("#deskForm").addEventListener("submit", function (e) { e.preventDefault(); var i = $("#deskInput"); deskAsk(i.value); i.value = ""; });
  launch.addEventListener("click", openDesk);
  $("#deskClose").addEventListener("click", closeDesk);

  /* ---------------------------------------------------- global delegation */
  document.addEventListener("click", function (e) {
    var chip = e.target.closest("#storyFilters .chip");
    if (chip) { state.category = chip.dataset.cat; renderStories(true); return; }
    var pchip = e.target.closest("#projectFilters .chip");
    if (pchip) { state.stage = pchip.dataset.stage; renderProjects(true); renderTopicBars(); return; }
    var topic = e.target.closest(".topic[data-topic]");
    if (topic) { setTopic(topic.dataset.topic, true); return; }
    if (e.target.closest("[data-clear-topic]")) { setTopic(state.topic, false); return; }
    var internal = e.target.closest("a[href='#desk']");
    if (internal) {
      e.preventDefault();
      if (!reader.hidden) { try { history.replaceState(null, "", location.pathname + location.search); } catch (err) {} hideReader(); }
      openDesk(); return;
    }
    // whole story card is clickable
    var card = e.target.closest(".story[data-href], .project[data-href]");
    if (card && !e.target.closest("a,button")) { location.hash = card.dataset.href; }
  });

  $("#pipeline").addEventListener("click", function (e) {
    var b = e.target.closest(".stage"); if (b) selectStage(+b.dataset.i, false);
  });
  $("#pipeline").addEventListener("keydown", function (e) {
    var n = P.workflow.length, i = stageIndex;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") i = (i + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") i = (i - 1 + n) % n;
    else if (e.key === "Home") i = 0; else if (e.key === "End") i = n - 1; else return;
    e.preventDefault(); selectStage(i, true);
  });

  document.addEventListener("keydown", function (e) {
    var k = e.key;
    if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === "k") { e.preventDefault(); searchEl.hidden ? openSearch() : closeSearch(); return; }
    if (k === "/" && searchEl.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); return; }
    if (k === "Escape") {
      if (!searchEl.hidden) closeSearch();
      else if (!reader.hidden) closeReader();
      else if (!menu.hidden) { closeMenu(); burger.focus(); }
      else if (!desk.hidden) closeDesk();
    }
  });

  /* --------------------------------------------------------------- boot */
  renderHero();
  renderAbout();
  renderFeatured();
  renderStoryFilters();
  renderStories(false);
  renderResearch();
  renderWorkflow();
  renderPromptLoop();
  renderProjectFilters();
  renderProjects();
  renderTopics();
  renderPrinciples();
  renderSkills();
  renderCertifications();
  renderTimeline();
  renderStats();
  renderContact();
  syncArticleLinks();
  buildIndex();
  observeReveal(document);
  if (location.hash) route(false);
})();
