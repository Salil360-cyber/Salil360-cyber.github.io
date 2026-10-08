/* =========================================================================
   ai-desk.js — "Ask Salil's AI Desk"

   DEMO MODE: answers come from data/desk.js (keyword matching), not from a
   live AI model. The UI says so to visitors.

   ── Connecting a real model later ─────────────────────────────────────────
   Replace AIDesk.provider with a function that returns a Promise<string>.
   NEVER put an API key in this file — browser code is public. Instead call
   your own server-side endpoint (e.g. a Netlify/Vercel/Cloudflare function)
   that holds the key and talks to the model provider:

     AIDesk.provider = async function (question, SITE) {
       const res = await fetch("/api/desk", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ question })
       });
       if (!res.ok) throw new Error("Desk unavailable");
       const data = await res.json();
       return data.answer;
     };

   Then change the "Demo mode · scripted answers" label in index.html.
   ========================================================================= */
(function () {
  var S = window.SITE;

  function scripted(question) {
    var q = question.toLowerCase();
    var best = null, bestScore = 0;
    S.desk.intents.forEach(function (intent) {
      var score = 0;
      intent.keywords.forEach(function (k) { if (q.indexOf(k) !== -1) score += 1; });
      if (score > bestScore) { best = intent; bestScore = score; }
    });
    return Promise.resolve(best ? best.answer(S) : S.desk.fallback);
  }

  window.AIDesk = {
    provider: scripted,
    ask: function (question) {
      return AIDesk.provider(question, S).catch(function () {
        return "The desk couldn't answer just now. Please email Salil from the Contact section.";
      });
    }
  };
})();
