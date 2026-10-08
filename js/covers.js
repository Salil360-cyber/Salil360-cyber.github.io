/* =========================================================================
   covers.js — generated editorial cover art.
   Used whenever a story has no `image`. Each cover is deterministic (same
   slug → same art) and drawn from theme colors, so it works in light and
   dark mode with zero image downloads.
   ========================================================================= */
(function () {
  var counter = 0;

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var W = 800, H = 500;
  var A = "var(--accent)", V = "var(--violet)", L = "var(--line-strong)", M = "var(--muted)";

  var patterns = {
    rings: function (r) {
      var cx = 480 + r() * 160, cy = 200 + r() * 120, s = "";
      for (var i = 1; i < 14; i++) {
        var rad = i * 34;
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + rad + '" fill="none" stroke="' + (i === 5 ? A : L) + '" stroke-width="' + (i === 5 ? 1.6 : 0.8) + '"' + (i % 3 === 0 ? ' stroke-dasharray="2 6"' : "") + "/>";
      }
      for (var x = 40; x < 340; x += 22) for (var y = 300; y < 480; y += 22)
        s += '<circle cx="' + x + '" cy="' + y + '" r="1.3" fill="' + (r() > 0.9 ? A : M) + '" opacity="' + (0.35 + r() * 0.5) + '"/>';
      s += '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="' + V + '"/>';
      return s;
    },
    waves: function (r) {
      var s = "";
      for (var i = 0; i < 22; i++) {
        var amp = 18 + r() * 40, f = 0.006 + r() * 0.01, ph = r() * 6, y0 = 60 + i * 18, d = "M0 " + y0;
        for (var x = 0; x <= W; x += 16) d += " L" + x + " " + (y0 + Math.sin(x * f + ph) * amp * Math.sin(x / W * Math.PI)).toFixed(1);
        s += '<path d="' + d + '" fill="none" stroke="' + (i === 11 ? A : i === 14 ? V : L) + '" stroke-width="' + (i === 11 || i === 14 ? 1.8 : 0.8) + '"/>';
      }
      return s;
    },
    balance: function (r) {
      var s = "", mid = W / 2;
      for (var i = 0; i < 26; i++) {
        var h = 30 + r() * 220, x = 40 + i * 28;
        var col = i === 7 ? A : i === 18 ? V : L;
        s += '<rect x="' + x + '" y="' + (H / 2 - h / 2) + '" width="2" height="' + h.toFixed(0) + '" fill="' + col + '"/>';
      }
      s += '<line x1="20" y1="' + H / 2 + '" x2="' + (W - 20) + '" y2="' + H / 2 + '" stroke="' + M + '" stroke-width="0.8"/>';
      s += '<circle cx="' + mid + '" cy="' + H / 2 + '" r="9" fill="none" stroke="' + A + '" stroke-width="1.6"/>';
      return s;
    },
    grid: function (r) {
      var s = "";
      for (var x = 0; x < 20; x++) for (var y = 0; y < 12; y++) {
        var v = r(), px = 30 + x * 38, py = 26 + y * 38;
        var fill = v > 0.94 ? A : v > 0.9 ? V : "none";
        s += '<rect x="' + px + '" y="' + py + '" width="26" height="26" rx="4" fill="' + fill + '" fill-opacity="' + (fill === "none" ? 0 : 0.85) + '" stroke="' + L + '" stroke-width="0.7"/>';
      }
      return s;
    },
    nodes: function (r) {
      var pts = [], s = "";
      for (var i = 0; i < 34; i++) pts.push([40 + r() * (W - 80), 40 + r() * (H - 80)]);
      for (var a = 0; a < pts.length; a++) for (var b = a + 1; b < pts.length; b++) {
        var dx = pts[a][0] - pts[b][0], dy = pts[a][1] - pts[b][1], d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150) s += '<line x1="' + pts[a][0].toFixed(0) + '" y1="' + pts[a][1].toFixed(0) + '" x2="' + pts[b][0].toFixed(0) + '" y2="' + pts[b][1].toFixed(0) + '" stroke="' + L + '" stroke-width="0.8"/>';
      }
      pts.forEach(function (p, i) {
        s += '<circle cx="' + p[0].toFixed(0) + '" cy="' + p[1].toFixed(0) + '" r="' + (i === 3 ? 7 : i === 9 ? 5 : 2.6) + '" fill="' + (i === 3 ? A : i === 9 ? V : M) + '"/>';
      });
      return s;
    },
    steps: function (r) {
      var s = "", x = 40, y = 420;
      for (var i = 0; i < 12; i++) {
        var w = 40 + r() * 30, h = 16 + r() * 26;
        s += '<rect x="' + x + '" y="' + (y - h) + '" width="' + w.toFixed(0) + '" height="' + (H - y + h) + '" fill="none" stroke="' + (i === 8 ? A : L) + '" stroke-width="' + (i === 8 ? 1.6 : 0.8) + '"/>';
        x += w + 8; y -= h * 0.9;
      }
      s += '<circle cx="' + (x - 20) + '" cy="' + (y - 20) + '" r="8" fill="' + V + '"/>';
      return s;
    },
    rays: function (r) {
      var s = "", ox = 120 + r() * 80, oy = 420;
      for (var i = 0; i < 40; i++) {
        var ang = -Math.PI / 2 - 0.9 + i * 0.045, len = 300 + r() * 360;
        s += '<line x1="' + ox + '" y1="' + oy + '" x2="' + (ox + Math.cos(ang + 0.6) * len).toFixed(0) + '" y2="' + (oy + Math.sin(ang + 0.6) * len).toFixed(0) + '" stroke="' + (i === 22 ? A : i === 30 ? V : L) + '" stroke-width="' + (i === 22 || i === 30 ? 1.6 : 0.7) + '"/>';
      }
      s += '<circle cx="' + ox + '" cy="' + oy + '" r="7" fill="' + A + '"/>';
      return s;
    },
    wire: function (r) {
      var s = "";
      for (var i = 0; i < 16; i++) {
        var y = 50 + i * 26, x = 40, hl = i === 4 || i === 9;
        while (x < W - 60) {
          var w = 20 + r() * 90;
          s += '<rect x="' + x.toFixed(0) + '" y="' + y + '" width="' + w.toFixed(0) + '" height="6" rx="3" fill="' + (hl && r() > 0.4 ? (i === 4 ? A : V) : L) + '"/>';
          x += w + 10;
        }
      }
      return s;
    }
  };

  var byCategory = {
    "AI Research": "rings", "Generative AI": "waves", "AI Ethics": "balance", "AI Tools": "grid",
    "AI & Society": "nodes", "Future of Work": "steps", "AI Startups": "rays", "AI News": "wire",
    "AI & Business": "steps"
  };

  window.Covers = {
    svg: function (slug, category, label) {
      var r = rng(hash(slug));
      var kind = byCategory[category] || "nodes";
      var id = "cg" + (++counter);
      return '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + (label ? label.replace(/"/g, "&quot;") : "Cover illustration") + '">' +
        '<defs><radialGradient id="' + id + '" cx="' + (0.3 + r() * 0.4) + '" cy="' + (0.3 + r() * 0.3) + '" r="0.8">' +
        '<stop offset="0" stop-color="' + V + '" stop-opacity="0.22"/><stop offset="0.5" stop-color="' + A + '" stop-opacity="0.06"/><stop offset="1" stop-color="' + A + '" stop-opacity="0"/></radialGradient></defs>' +
        '<rect width="' + W + '" height="' + H + '" fill="var(--bg-2)"/><rect width="' + W + '" height="' + H + '" fill="url(#' + id + ')"/>' +
        patterns[kind](r) + "</svg>";
    }
  };
})();
