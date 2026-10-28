/* robot-spline.js — the hero's robot guide: the "Interactive 3D" Spline robot
   (scene kZDDjO5HuC9GJUM2) with a soft spotlight that follows the cursor.
   - The robot's own scene makes it look toward the cursor; global events are on,
     so it follows the cursor anywhere on the page, not only over the robot.
   - Introduces Salil sentence by sentence in a speech bubble, with an optional
     natural voice (Web Speech API). No extra hand gestures.
   - Performance: loads after the page, renders at 1x pixel ratio, and pauses off screen.
   - Needs an internet connection (the robot loads from Spline). If it can't load, or
     WebGL is missing, the Desk Monitor stays in place. */
(function () {
  const RUNTIME = "https://unpkg.com/@splinetool/runtime@2.0.66/build/runtime.js";
  const SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";
  const PIXEL_RATIO_CAP = 1;    // max render resolution (see below)

  const wrap = document.querySelector(".robot");
  if (!wrap) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const stage = wrap.querySelector(".robot__stage");
  const canvas = wrap.querySelector(".robot__canvas");
  const bubble = wrap.querySelector(".robot__bubble");
  const say = wrap.querySelector(".robot__say");
  const voiceBtn = wrap.querySelector(".robot__voice");
  const voiceLabel = wrap.querySelector(".robot__voice-label");
  const hero = document.getElementById("home") || stage;

  // WebGL check before downloading anything
  try { const t = document.createElement("canvas"); if (!(t.getContext("webgl2") || t.getContext("webgl"))) return; } catch (e) { return; }

  const INTRO = [
    { text: "Hello, I'm the AI guide to Salil Gokhale's portfolio.", pause: 450 },
    { text: "Salil is an AI Generalist: an AI Researcher, an AI Practitioner, and an AI Explorer.", pause: 450 },
    { text: "He researches, tests, and builds with AI, from applications and workflows to AI-powered analytics.", pause: 750 },
    { text: "His flagship project is SBMA AI, a published AI data analysis command center.", pause: 450 },
    { text: "In SBMA AI, a deterministic engine computes every number, and Gemini only explains the results.", pause: 750 },
    { text: "His way of working is simple: learn, explore, experiment, build, analyze, and apply.", pause: 450 },
    { text: "AI tools assist his work. The direction, the testing, and the decisions are his.", pause: 750 },
    { text: "Explore his AI work below, or open his resume for the short version.", pause: 0 }
  ];

  /* ---------------- voice (Web Speech API; needs a click before the browser allows sound) */
  let voiceOn = false, voice = null;
  function pickVoice() {
    const list = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    const en = list.filter((v) => /^en/i.test(v.lang));
    const prefs = [/Natural/i, /Online/i, /Google UK English Male/i, /Google US English/i, /Microsoft (Guy|Ryan|Andrew|Brian|George|Ravi)/i, /en-GB/i, /en-IN/i, /en-US/i];
    for (const p of prefs) { const v = en.find((x) => p.test(x.name) || p.test(x.lang)); if (v) { voice = v; return; } }
    voice = en[0] || null;
  }
  if ("speechSynthesis" in window) { pickVoice(); speechSynthesis.addEventListener && speechSynthesis.addEventListener("voiceschanged", pickVoice); }

  /* ---------------- introduction: bubble text + voice, sentence by sentence */
  let step = -1, typing = 0, stepTimer = 0, hideTimer = 0, started = false, playing = false, ready = false;
  function typeOut(text) {
    clearInterval(typing);
    bubble.classList.add("is-on"); bubble.classList.remove("is-done");
    if (reduce) { say.textContent = text; bubble.classList.add("is-done"); return; }
    let n = 0; say.textContent = "";
    typing = setInterval(() => { n += 2; say.textContent = text.slice(0, n); if (n >= text.length) { clearInterval(typing); say.textContent = text; bubble.classList.add("is-done"); } }, 32);
  }
  function playStep(i) {
    clearTimeout(stepTimer); clearTimeout(hideTimer);
    if (i >= INTRO.length) { finish(); return; }
    step = i; playing = true;
    const s = INTRO[i];
    typeOut(s.text);
    let advanced = false;
    const goOn = () => { if (advanced || step !== i) return; advanced = true; stepTimer = setTimeout(() => playStep(i + 1), s.pause); };
    if (voiceOn && "speechSynthesis" in window) {
      try {
        const u = new SpeechSynthesisUtterance(s.text);
        if (voice) u.voice = voice;
        u.rate = 0.97; u.pitch = 1; u.volume = 1;
        u.onend = goOn; u.onerror = goOn;
        speechSynthesis.speak(u);
        stepTimer = setTimeout(goOn, 4000 + s.text.length * 110);   // safety net if the browser never reports the end
      } catch (e) { goOn(); }
    } else {
      stepTimer = setTimeout(goOn, 900 + s.text.length * 48);        // a comfortable reading pace
    }
  }
  function finish() { playing = false; hideTimer = setTimeout(() => bubble.classList.remove("is-on"), 6000); }
  function startIntro(from) {
    if (!ready) return;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    started = true; playStep(from || 0);
  }
  function activity() { if (!started && ready) { started = true; setTimeout(() => startIntro(0), 350); } }
  stage.addEventListener("click", (e) => { if (e.target.closest(".robot__voice")) return; startIntro(playing ? step + 1 : 0); });
  if (voiceBtn && "speechSynthesis" in window) {
    voiceBtn.addEventListener("click", () => {
      voiceOn = !voiceOn;
      voiceBtn.setAttribute("aria-pressed", String(voiceOn));
      voiceLabel.textContent = voiceOn ? "Turn off voice" : "Turn on voice";
      if (voiceOn) startIntro(playing ? step : 0);
      else { speechSynthesis.cancel(); if (playing) playStep(step + 1); }
    });
  }

  /* ---------------- spotlight that follows the cursor */
  let sx = 0, sy = 0, tx = 0, ty = 0, raf = 0;
  function moveSpot() {
    sx += (tx - sx) * 0.18; sy += (ty - sy) * 0.18;
    stage.style.setProperty("--sx", sx.toFixed(1) + "px"); stage.style.setProperty("--sy", sy.toFixed(1) + "px");
    raf = Math.abs(tx - sx) + Math.abs(ty - sy) > 0.5 ? requestAnimationFrame(moveSpot) : 0;
  }
  function placeSpot(clientX, clientY) {
    const r = stage.getBoundingClientRect();
    // keep the light inside the stage, so it never gets cut off at the stage's edge
    tx = Math.min(r.width * 0.82, Math.max(r.width * 0.18, clientX - r.left));
    ty = Math.min(r.height * 0.62, Math.max(r.height * 0.12, clientY - r.top));
    if (!raf) raf = requestAnimationFrame(moveSpot);
  }
  function centerSpot() {
    const r = stage.getBoundingClientRect();
    tx = r.width / 2; ty = r.height * 0.28;
    if (!raf) raf = requestAnimationFrame(moveSpot);
  }
  hero.addEventListener("pointermove", (e) => {
    if (!ready) return;
    if (!reduce) {
      wrap.classList.add("robot--lit");
      placeSpot(e.clientX, e.clientY);
    }
    if (finePointer || e.pointerType === "touch") activity();
  }, { passive: true });
  hero.addEventListener("pointerleave", () => { wrap.classList.remove("robot--lit"); centerSpot(); });

  /* ---------------- load the Spline robot
     Performance: the robot loads only after the page has finished loading (so scrolling
     and first paint stay smooth), and it renders only while the hero is on screen.
     Off screen or in a background tab, the scene is paused and costs nothing. */
  wrap.classList.add("robot--loading");
  const fail = () => { wrap.classList.remove("robot--loading", "robot--ready"); };
  let giveUp = 0, app = null, onScreen = true, playing3d = true;
  function setRunning(run) {
    if (!app || reduce || run === playing3d) return;
    playing3d = run;
    try { run ? app.play() : app.stop(); } catch (e) {}
    try { app.setGlobalEvents(run); } catch (e) {}
  }
  const syncRunning = () => setRunning(onScreen && !document.hidden);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((e) => { onScreen = e[0].isIntersecting; syncRunning(); }, { rootMargin: "120px 0px" }).observe(stage);
  }
  document.addEventListener("visibilitychange", syncRunning);

  function boot() {
    giveUp = setTimeout(fail, 45000);                  // slow or blocked network: keep the Desk Monitor
    import(RUNTIME).then(({ Application }) => {
      app = new Application(canvas);
      // Render at no more than 1x pixel ratio: on laptop/phone screens (1.25x–3x) this cuts the
      // robot's GPU work by 1.5–9x, which is what keeps scrolling and the cursor smooth.
      try { app._getPixelRatio = () => Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP); } catch (e) {}
      return app.load(SCENE).then(() => { try { app.setGlobalEvents(true); } catch (e) {} return app; });
    }).then(() => {
      clearTimeout(giveUp);
      ready = true;
      wrap.classList.remove("robot--loading");
      wrap.classList.add("robot--ready");
      // the stage changes size when it swaps in for the Desk Monitor: let the scene re-fit
      requestAnimationFrame(() => { window.dispatchEvent(new Event("resize")); sx = tx; sy = ty; });
      centerSpot();
      if (voiceBtn && "speechSynthesis" in window) voiceBtn.hidden = false;
      if (reduce) { try { app.stop && app.stop(); } catch (e) {} say.textContent = INTRO[0].text; bubble.classList.add("is-on", "is-done"); }
      else {
        syncRunning();                                  // already scrolled away? pause straight away
        if (!finePointer && "IntersectionObserver" in window) {
          new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { o.disconnect(); setTimeout(() => startIntro(0), 1200); } }).observe(stage);
        }
      }
    }).catch(() => { clearTimeout(giveUp); fail(); });
  }
  // start after the page has loaded and the browser is idle
  const later = () => ("requestIdleCallback" in window ? requestIdleCallback(boot, { timeout: 2500 }) : setTimeout(boot, 800));
  if (document.readyState === "complete") later(); else window.addEventListener("load", later, { once: true });
})();
