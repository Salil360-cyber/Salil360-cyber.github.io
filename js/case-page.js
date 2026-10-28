/* case-page.js — shared behaviour for standalone case-study pages (projects/*.html):
   theme toggle (same "desk-theme" setting as the home page), mobile menu,
   nav border on scroll, reading progress bar and the footer year. */
(function () {
  var root = document.documentElement;
  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* theme */
  var themeBtn = document.getElementById("themeToggle");
  function effectiveTheme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  function syncThemeLabel() { if (themeBtn) themeBtn.setAttribute("aria-label", effectiveTheme() === "dark" ? "Switch to light mode" : "Switch to dark mode"); }
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = effectiveTheme() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    store("desk-theme", next);
    syncThemeLabel();
  });
  syncThemeLabel();

  /* mobile menu */
  var menu = document.getElementById("mobileMenu"), burger = document.getElementById("menuOpen");
  function setMenu(open) {
    if (!menu || !burger) return;
    menu.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("is-locked", open);
  }
  if (burger) burger.addEventListener("click", function () { setMenu(menu.hidden); });
  if (menu) menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu && !menu.hidden) { setMenu(false); burger.focus(); } });
  window.addEventListener("resize", function () { if (window.innerWidth > 1180 && menu && !menu.hidden) setMenu(false); });

  /* nav border + reading progress */
  var nav = document.getElementById("nav"), bar = document.getElementById("readProgress");
  function onScroll() {
    var y = window.scrollY, max = root.scrollHeight - window.innerHeight;
    if (nav) nav.classList.toggle("is-scrolled", y > 8);
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
