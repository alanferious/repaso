(() => {
  "use strict";

  /* ═══════════════════════ storage ═══════════════════════ */

  const KEY = "repaso-ib-spanish-v1";
  const DEFAULTS = {
    mastery: {},      // item id -> 0..5
    misses: {},       // item id -> times answered wrong
    stats: { points: 0, answered: 0, correct: 0, days: {}, runs: {} },
    settings: {
      accents: "strict", vosotros: true, sound: true, speak: true, theme: "dark",
      exams: [{ name: "Paper 1", date: "2026-10-29" }, { name: "Paper 2", date: "2026-10-30" }],
      direction: "en-es", mode: "type", size: "20",
      tenses: ["present", "preterite"], groups: ["ar", "er", "ir", "stem", "irreg", "refl"], exVerbs: [],
      showEnglish: true, verbMode: "type", verbSize: "20", accentPopup: true,
      smart: { dir: "en-es", mode: "type" },
    },
  };
  const clone = (o) => JSON.parse(JSON.stringify(o));
  function load() {
    const s = clone(DEFAULTS);
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      if (d) {
        Object.assign(s.mastery, d.mastery);
        Object.assign(s.misses, d.misses);
        Object.assign(s.stats, d.stats);
        Object.assign(s.settings, d.settings);
        // progress saved before the metro redesign had "auto" as the default look; move it to midnight
        if (!(d.settings && d.settings.exams) && s.settings.theme === "auto") s.settings.theme = "dark";
      }
    } catch (e) { /* private window or blocked storage: start fresh */ }
    return s;
  }
  let S = load();
  let storageWarned = false;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {
      if (!storageWarned) { storageWarned = true; toast("This browser window can't save progress (storage is blocked)"); }
    }
  }
  const today = () => new Date().toLocaleDateString("en-CA");
  function streak() {
    let n = 0;
    const d = new Date();
    if (!S.stats.days[today()]) d.setDate(d.getDate() - 1);
    while (S.stats.days[d.toLocaleDateString("en-CA")] > 0) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  /* ═══════════════════════ text helpers ═══════════════════════ */

  // KM0 wordmark, generated from brand/ geometry: letters take currentColor, the Zero is lit amber and the origin dot takes the ink
  const KM0_MARK = `<svg class="km0" viewBox="0 0 225.43 100" role="img" aria-hidden="true"><g fill="currentColor"><path transform="translate(0.00 100) scale(0.14286 -0.14286)" d="M44 12V688Q44 693 47.5 696.5Q51 700 56 700H173Q178 700 181.5 696.5Q185 693 185 688V436Q185 432 187.5 431.5Q190 431 191 435L320 691Q325 700 334 700H458Q465 700 467.5 696.5Q470 693 467 686L319 398Q318 394 318 392L475 14Q476 12 476 8Q476 0 466 0H341Q330 0 327 9L223 271Q222 274 220.0 273.5Q218 273 216 271L187 219Q185 215 185 213V12Q185 7 181.5 3.5Q178 0 173 0H56Q51 0 47.5 3.5Q44 7 44 12Z"/><path transform="translate(72.14 100) scale(0.14286 -0.14286)" d="M379 700H495Q500 700 503.5 696.5Q507 693 507 688V12Q507 7 503.5 3.5Q500 0 495 0H378Q373 0 369.5 3.5Q366 7 366 12V461Q366 465 364.0 465.0Q362 465 360 462L282 324Q277 316 274 316Q271 316 266 324L188 462Q186 465 184.0 465.0Q182 465 182 461V12Q182 7 178.5 3.5Q175 0 170 0H53Q48 0 44.5 3.5Q41 7 41 12V688Q41 693 44.5 696.5Q48 700 53 700H168Q178 700 183 692L272 533Q275 529 278 533L364 692Q368 700 379 700Z"/></g><path fill="var(--amber)" fill-rule="evenodd" d="M192.43,0.00 A33.00,33.00 0 0 1 225.43,33.00 V67.00 A33.00,33.00 0 0 1 159.43,67.00 V33.00 A33.00,33.00 0 0 1 192.43,0.00Z M192.43,19.00 A14.00,14.00 0 0 1 206.43,33.00 V67.00 A14.00,14.00 0 0 1 178.43,67.00 V33.00 A14.00,14.00 0 0 1 192.43,19.00Z"/><circle cx="192.43" cy="50.00" r="8.00" fill="currentColor"/></svg>`;

  // Line icons, one stroke weight throughout
  const ICONS = {
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    flame: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.4-5.4 3.7-7.8.4 1.8 1.4 2.9 2.4 3.4C12 7.2 13.5 4.6 15.6 3c-.3 3 3 5.1 3 9.4 0 4.6-2.8 8.6-6.6 8.6z"/>',
    speaker: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
    slow: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    arrow: '<path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5"/>',
    up: '<path d="M12 19V6M6.5 11.5L12 6l5.5 5.5"/>',
    down: '<path d="M12 5v13M6.5 12.5L12 18l5.5-5.5"/>',
    x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/>',
    upload: '<path d="M12 15.5v-11M7 9l5-5 5 5M5 19.5h14"/>',
    loop: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5M20 4v4.5h-4.5M20 12a8 8 0 0 1-13.7 5.6L4 15.5M4 20v-4.5h4.5"/>',
    book: '<path d="M12 6.5c-1.8-1.3-4.3-2-7.5-2v13c3.2 0 5.7.7 7.5 2 1.8-1.3 4.3-2 7.5-2v-13c-3.2 0-5.7.7-7.5 2zM12 6.5v13"/>',
  };
  const ic = (name) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const withHints = (s) => esc(s).replace(/\[([^\]]+)\]/g, '<span class="hint">($1)</span>');
  const stripAcc = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC");
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fmtTime = (ms) => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

  function normEs(s) {
    return s.normalize("NFC").toLowerCase().replace(/[¿¡?!.,;:"«»]/g, " ").replace(/\s+/g, " ").trim();
  }
  const CONTRACTIONS = {
    "it's": "it is", "that's": "that is", "i'm": "i am", "don't": "do not", "doesn't": "does not", "can't": "cannot",
    "won't": "will not", "isn't": "is not", "aren't": "are not", "didn't": "did not", "i'd": "i would", "what's": "what is",
    "there's": "there is", "he's": "he is", "she's": "she is", "you're": "you are", "we're": "we are", "they're": "they are",
    "wasn't": "was not", "weren't": "were not", "i've": "i have", "let's": "let us",
  };
  function normEn(s) {
    s = stripAcc(s.toLowerCase()).replace(/[’‘`]/g, "'");
    s = s.replace(/[a-z]+'[a-z]+/g, (w) => CONTRACTIONS[w] || w);
    s = s.replace(/[.,!?;:"()]/g, " ").replace(/'/g, "").replace(/-/g, " ").replace(/\s+/g, " ").trim();
    while (/^(to|the|a|an) ./.test(s)) s = s.replace(/^(to|the|a|an) /, "");
    return s;
  }

  // "(to) eat" -> ["to eat", "eat"]
  function expandOpt(s) {
    const m = s.match(/\(([^)]*)\)/);
    if (!m) return [s];
    const a = s.slice(0, m.index), b = s.slice(m.index + m[0].length);
    return [...expandOpt(a + m[1] + b), ...expandOpt((a + b).replace(/\s+/g, " "))];
  }
  // "el/la profesor/a" -> ["el profesor", "la profesora"]
  function expandGender(s) {
    const slashA = /([^\s/]+)\/a(?=[\s,]|$)/g;
    if (!slashA.test(s) && !/(el\/la|un\/una|los\/las)/.test(s)) return [s];
    const masc = s.replace(/el\/la/g, "el").replace(/un\/una/g, "un").replace(/los\/las/g, "los").replace(slashA, "$1");
    const fem = s.replace(/el\/la/g, "la").replace(/un\/una/g, "una").replace(/los\/las/g, "las")
      .replace(slashA, (m, w) => (/[oe]$/.test(w) ? w.slice(0, -1) + "a" : w + "a"));
    return masc === fem ? [masc] : [masc, fem];
  }
  function accepted(raw, lang) {
    const out = new Set();
    for (let alt of raw.split(";")) {
      alt = alt.replace(/\[[^\]]*\]/g, "").trim();
      for (const o of expandOpt(alt)) {
        const forms = lang === "es" ? expandGender(o) : [o];
        for (const f of forms) out.add(lang === "es" ? normEs(f) : normEn(f));
        if (lang === "es") out.add(normEs(o));
      }
    }
    out.delete("");
    return [...out];
  }
  // Keys for matching meanings between words. Unlike answer checking, "to show" and "show" stay distinct.
  function meaningKeys(raw, lang) {
    return raw.split(";").map((alt) => {
      const t = stripAcc(alt.toLowerCase()).replace(/[\[\]()¿¡?!.,:"]/g, " ").replace(/[’']/g, "").replace(/\s+/g, " ").trim();
      return lang === "en" ? t.replace(/^(the|a|an) /, "") : t;
    }).filter(Boolean);
  }
  const display = (raw) => raw.split(";").map((x) => x.trim()).join(", ");
  // Prompts and options show the first two ways of saying it; every alternative is still accepted
  const displayShort = (raw) => raw.split(";").slice(0, 2).map((x) => x.trim()).join(", ");
  function speakText(es) {
    const first = es.split(";")[0].replace(/\[[^\]]*\]/g, "").trim();
    return expandGender(expandOpt(first)[0])[0];
  }

  function editDistance(a, b) {
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return dp[a.length][b.length];
  }
  // Marks which characters of a and b belong to their longest common subsequence
  function lcsMarks(a, b) {
    const n = a.length, m = b.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--)
      for (let j = m - 1; j >= 0; j--)
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const am = new Array(n).fill(false), bm = new Array(m).fill(false);
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { am[i] = bm[j] = true; i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
      else j++;
    }
    return [am, bm];
  }
  const markup = (s, mask, cls) => [...s].map((c, i) => (mask[i] ? esc(c) : `<mark class="${cls}">${esc(c)}</mark>`)).join("");

  /* ═══════════════════════ data ═══════════════════════ */

  const THEME_MAP = Object.fromEntries(THEMES.map((t) => [t.id, t]));
  const TOPIC_MAP = {};
  for (const t of TOPICS) {
    t.items = t.raw.split("\n").map((l) => l.trim()).filter((l) => l && l.includes("|")).map((line) => {
      const k = line.indexOf("|");
      const es = line.slice(0, k).trim(), en = line.slice(k + 1).trim();
      return {
        kind: "vocab", id: `v:${t.id}:${es}`, topic: t.id, es, en,
        esAcc: accepted(es, "es"), enAcc: accepted(en, "en"), say: speakText(es),
        enKeys: meaningKeys(en, "en"), esKeys: meaningKeys(es, "es"),
      };
    });
    TOPIC_MAP[t.id] = t;
  }
  const ALL_VOCAB = TOPICS.flatMap((t) => t.items);
  // Meaning index across every list: an English prompt accepts the Spanish of any word with the
  // same meaning (and vice versa). Hints stay in the key, so "hot [spicy]" never matches plain "hot".
  const MEANING = { en: new Map(), es: new Map() };
  for (const it of ALL_VOCAB) for (const lang of ["en", "es"]) for (const k of it[lang + "Keys"]) {
    if (!MEANING[lang].has(k)) MEANING[lang].set(k, []);
    MEANING[lang].get(k).push(it);
  }
  const ITEM_BY_ID = Object.fromEntries(ALL_VOCAB.map((i) => [i.id, i]));
  const VERB_MAP = Object.fromEntries(VERBS.map((v) => [v.inf, v]));
  const TENSE_MAP = Object.fromEntries(TENSES.map((t) => [t.key, t]));

  function verbItem(v, tense, p) {
    return {
      kind: "verb", id: `c:${v.inf}:${tense}:${p}`, v, tense, p,
      acc: VerbEngine.forms(v, tense, p), en: VerbEngine.english(v, tense, p),
    };
  }
  function verbItemFromId(id) {
    const [, inf, tense, p] = id.split(":");
    return VERB_MAP[inf] && TENSE_MAP[tense] ? verbItem(VERB_MAP[inf], tense, +p) : null;
  }
  const mastery = (id) => S.mastery[id] || 0;
  const pct = (items) => (items.length ? Math.round((items.reduce((a, i) => a + mastery(i.id), 0) / (items.length * 5)) * 100) : 0);
  const lineChip = (th) => `<span class="lchip" style="--c:${th.color};--on:${th.on}">${th.line}</span>`;
  const mdots = (id) => `<span class="mdots" role="img" aria-label="Mastery ${mastery(id)} of 5">${[1, 2, 3, 4, 5].map((k) => `<i class="${k <= mastery(id) ? "on" : ""}"></i>`).join("")}</span>`;

  /* ═══════════════════════ audio ═══════════════════════ */

  let esVoice = null;
  const hasTTS = "speechSynthesis" in window;
  function pickVoice() {
    const vs = speechSynthesis.getVoices();
    esVoice = vs.find((v) => /^es[-_]ES/i.test(v.lang)) || vs.find((v) => /^es/i.test(v.lang)) || null;
  }
  if (hasTTS) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function say(text, slow) {
    if (!hasTTS || !text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = esVoice ? esVoice.lang : "es-ES";
    if (esVoice) u.voice = esVoice;
    u.rate = slow ? 0.6 : 0.92;
    speechSynthesis.speak(u);
  }
  let actx = null;
  function beep(ok) {
    if (!S.settings.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const t = actx.currentTime;
      (ok ? [660, 990] : [233, 175]).forEach((f, k) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = ok ? "sine" : "triangle";
        o.frequency.value = f;
        const t0 = t + k * 0.09;
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
        o.connect(g).connect(actx.destination);
        o.start(t0); o.stop(t0 + 0.2);
      });
    } catch (e) { /* no audio */ }
  }

  /* ═══════════════════════ shell ═══════════════════════ */

  const app = document.getElementById("app");
  const top = document.getElementById("top");
  let screen = "home";
  let timerId = null;
  const selected = new Set();   // topics picked for a custom list

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", S.settings.theme);
  }

  // Polite live region: feedback after each answer is read out without moving focus
  function announce(text) {
    const el = document.getElementById("sr");
    el.textContent = "";
    setTimeout(() => (el.textContent = text), 30);
  }

  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove("show"), 1800);
  }

  function renderTop() {
    const nav = [["home", "Vocabulary", "Vocab"], ["verbs", "Verb drills", "Verbs"], ["guide", "Tense guide", "Guide"], ["progress", "Progress", "Progress"]];
    const navOn = screen === "list" ? "home" : screen;
    top.innerHTML = `
      <button class="brand" data-go="home" aria-label="KM0 home">${KM0_MARK}<small>Spanish<br>ab initio</small></button>
      <nav class="nav">${nav.map(([k, l, sh]) => `<button data-go="${k}" class="${navOn === k ? "on" : ""}" ${navOn === k ? 'aria-current="page"' : ""}><span class="l-long">${l}</span><span class="l-short" aria-hidden="true">${sh}</span></button>`).join("")}</nav>
      <div class="hstats">
        <span class="pill" title="Day streak">${ic("flame")}<b>${streak()}</b> day streak</span>
        <span class="pill" title="Total points">${ic("star")}<b>${S.stats.points.toLocaleString()}</b> pts</span>
      </div>`;
    top.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => go(b.dataset.go)));
  }

  function go(name, arg) {
    clearInterval(timerId);
    if (hasTTS) speechSynthesis.cancel();
    screen = name;
    document.body.classList.toggle("focus", name === "session");
    renderTop();
    window.scrollTo(0, 0);
    app.classList.remove("km-screen"); void app.offsetWidth; app.classList.add("km-screen");
    const where = { home: "", verbs: "Verb drills", guide: "Tense guide", progress: "Progress", results: "Results" }[name];
    document.title = name === "home" ? "KM0 · IB Spanish ab initio" : `${where ?? (arg && arg.title) ?? (sess && sess.title) ?? ""} · KM0`;
    ({ home: renderHome, list: renderList, verbs: renderVerbs, guide: renderGuide, progress: renderProgress, session: renderSession, results: renderResults })[name](arg);
  }

  /* ═══════════════════════ home ═══════════════════════ */

  function renderHome() {
    const missCount = Object.keys(S.misses).filter((id) => ITEM_BY_ID[id] && S.misses[id] > 0).length;
    const due = dueWords();
    const themePct = (th) => pct(TOPICS.filter((t) => t.theme === th.id).flatMap((t) => t.items));
    const welcome = !S.settings.onboarded && !S.stats.answered;
    app.innerHTML = `
      <h1 class="sr-only">KM0: IB Spanish ab initio practice</h1>
      ${welcome ? `<section class="welcome" aria-labelledby="welcome-h">
        <div class="welcome-top"><h2 id="welcome-h">Bienvenido a KM0 · How it works</h2><button class="link" id="hideWelcome">Got it, hide this</button></div>
        <ol class="wstops">
          <li><span class="dot"></span><b>Press Enter at Sol</b><span>Smart review picks the words you are weakest on, from every list. The map fills in as you go.</span></li>
          <li><span class="dot"></span><b>Retype what you miss</b><span>A wrong answer has to be retyped before you move on, and it comes back later in the session.</span></li>
          <li><span class="dot"></span><b>Accents in two keys</b><span>Type a, e, i, o, u or n, then press <kbd>1</kbd> or <kbd>2</kbd> for á, ñ, ü and the rest.</span></li>
        </ol>
        <p class="welcome-note">Progress is saved in this browser only: to switch devices, copy it from the Progress page and paste it into KM0 on the other device. The lists follow the ab initio themes, so check them against your teacher's lists too.</p>
      </section>` : ""}
      <div class="home">
        <section class="board" aria-label="Today">
          <div class="exams">${examRows()}</div>
          <div class="due">
            <h2>Words due <span>${due.length ? due.length.toLocaleString() : "none yet"}</span></h2>
            ${due.length ? tonightPlan(due.length) : ""}
            ${due.length ? `<ul class="dep">${due.slice(0, 6).map((i) => {
              const th = THEME_MAP[TOPIC_MAP[i.topic].theme];
              return `<li>${lineChip(th)}<b lang="es">${withHints(display(i.es))}</b><small>${esc(STATION_NAMES[i.topic])}</small></li>`;
            }).join("")}</ul>` : `<p class="dep-empty">Nothing due yet. Start at Sol: Smart review picks words from every line.</p>`}
            <div class="actions">
              <button class="btn primary big" id="smart" aria-describedby="smartSet">Smart review ${ic("arrow")}<kbd>Enter</kbd></button>
              <div class="smart-set"><span id="smartSet">${smartSummary()}</span><button class="link" id="smartChange" aria-expanded="${smartOptsOpen}" aria-controls="smartOpts">Change</button></div>
              <div class="smart-opts" id="smartOpts" ${smartOptsOpen ? "" : "hidden"}>
                ${seg("smartDir", [["en-es", `English ${ic("arrow")} Spanish`], ["es-en", `Spanish ${ic("arrow")} English`], ["mixed", "Mixed"]], S.settings.smart.mode === "listen" ? "" : S.settings.smart.dir, S.settings.smart.mode === "listen" ? ["en-es", "es-en", "mixed"] : [])}
                ${seg("smartMode", [["type", "Type"], ["mc", "Multiple choice"], ["listen", "Listening"]], S.settings.smart.mode)}
              </div>
              <div class="row">
                ${missCount ? `<button class="btn" id="mist">Mistakes (${missCount})</button>` : ""}
                <button class="btn" data-go="verbs">Verb drills</button>
              </div>
            </div>
          </div>
        </section>
        <section class="net-wrap" aria-label="Network map of the vocabulary lists">
          <div class="net-head">
            <h2>Red de vocabulario · ${ALL_VOCAB.length.toLocaleString()} words</h2>
            <div class="net-key"><span><i></i>Not started</span><span><i class="p"></i>In progress</span><span><i class="f"></i>70%+ mastered</span></div>
          </div>
          <div class="net ${mapDrawn ? "" : "intro"}">${networkMap()}</div>
          <ul class="legend">${THEMES.map((th) => `<li>${lineChip(th)}<span>${esc(th.name)}</span><span>${themePct(th)}%</span></li>`).join("")}</ul>
        </section>
        ${platformCard()}
      </div>
      <div class="custom ${customOpen() ? "open" : ""}">
        <div class="sec-title"><button class="custom-toggle" id="customToggle" aria-expanded="${customOpen()}" aria-controls="customLines">${ic("arrow")}All lines · build a custom session</button></div>
        <p class="custom-hint">Tick the stations you want, then practise them together.</p>
        <div class="lines" id="customLines">${THEMES.map(lineStrip).join("")}</div>
      </div>
      <div class="sec-title">Grammar</div>
      <div class="xrow">
        <button class="feature" data-go="verbs"><span class="ic">${ic("loop")}</span><span><span class="f-h">Verb drills</span><span class="f-p">Conjugate across all ab initio tenses</span></span></button>
        <button class="feature" data-go="guide"><span class="ic">${ic("book")}</span><span><span class="f-h">Tense guide</span><span class="f-p">Endings, irregulars, when to use each tense</span></span></button>
      </div>
      ${selected.size ? `<div class="selbar"><span>${selected.size} list${selected.size > 1 ? "s" : ""} selected</span>
        <button class="btn" id="clearSel">Clear</button><button class="btn primary" id="useSel">Practise together ${ic("arrow")}</button></div>` : ""}`;

    app.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => go(b.dataset.go)));
    app.querySelectorAll("[data-topic]").forEach((c) => (c.onclick = () => {
      const t = TOPIC_MAP[c.dataset.topic], th = THEME_MAP[t.theme];
      go("list", { title: STATION_NAMES[t.id], es: t.es, theme: th, items: t.items, note: STATION_NAMES[t.id] !== t.name ? `IB topic: ${t.name}` : "" });
    }));
    app.querySelectorAll("[data-pick]").forEach((b) => (b.onclick = () => {
      const id = b.dataset.pick;
      selected.has(id) ? selected.delete(id) : selected.add(id);
      customOpenState = true;
      renderHome();
      refocus(`[data-pick="${id}"]`);
    }));
    document.getElementById("smart").onclick = startSmart;
    document.getElementById("smartChange").onclick = () => { smartOptsOpen = !smartOptsOpen; renderHome(); refocus("#smartChange"); };
    bindSeg(app, (k, v) => {
      if (k === "smartDir") S.settings.smart.dir = v;
      if (k === "smartMode") S.settings.smart.mode = v;
      save(); renderHome();
    });
    document.getElementById("customToggle").onclick = () => { customOpenState = !customOpen(); renderHome(); refocus("#customToggle"); };
    const hideW = document.getElementById("hideWelcome");
    if (hideW) hideW.onclick = () => { S.settings.onboarded = true; save(); renderHome(); };
    app.querySelector(".sol").onclick = startSmart;
    // The intro plays once; dropping the class afterwards guarantees the finished map even if a browser skips the animation
    if (!mapDrawn) setTimeout(() => app.querySelector(".net")?.classList.remove("intro"), 2400);
    mapDrawn = true;
    bindPlatform();
    const setEx = document.getElementById("setExams");
    if (setEx) setEx.onclick = () => go("progress");
    const PLANS = { weak: () => startWeakVerbs(), smart: () => startSmart({ dir: "en-es", mode: "type" }), listen: () => startSmart({ mode: "listen" }), read: () => startSmart({ dir: "es-en", mode: "type" }) };
    app.querySelectorAll("[data-plan]").forEach((b) => (b.onclick = PLANS[b.dataset.plan]));
    const mist = document.getElementById("mist");
    if (mist) mist.onclick = () => {
      const items = ALL_VOCAB.filter((i) => S.misses[i.id] > 0).sort((a, b) => S.misses[b.id] - S.misses[a.id]).slice(0, 60);
      go("list", { title: "Mistakes", es: "Mis errores", theme: { color: "var(--lc)" }, items, note: "Words you've got wrong most often.", mistakes: true });
    };
    if (selected.size) {
      document.getElementById("clearSel").onclick = () => { selected.clear(); renderHome(); };
      document.getElementById("useSel").onclick = () => {
        const tops = [...selected].map((id) => TOPIC_MAP[id]);
        go("list", { title: "Custom list", es: tops.map((t) => STATION_NAMES[t.id]).join(" · "), theme: { color: "var(--lc)" }, items: tops.flatMap((t) => t.items) });
      };
    }
    refocus("#smart");
  }

  // Próxima estación: a word from the lines you haven't mastered, like the next stop on the platform screen
  let nextWord = null, nextShown = false;
  function pickNextWord() {
    const pool = ALL_VOCAB.filter((i) => mastery(i.id) < 4 && i.id !== (nextWord && nextWord.id));
    const from = pool.length ? pool : ALL_VOCAB;
    nextWord = from[Math.floor(Math.random() * from.length)];
    nextShown = false;
  }
  function platformCard() {
    if (!nextWord || !ITEM_BY_ID[nextWord.id]) pickNextWord();
    const it = nextWord, t = TOPIC_MAP[it.topic], th = THEME_MAP[t.theme];
    return `<div class="platform" id="platform" style="--c:${th.color}">
      <h2>Próxima estación <span>${lineChip(th)}${esc(STATION_NAMES[it.topic])}</span></h2>
      <div class="pf-main">
        <div class="pf-text">
          <p class="pf-word"><span lang="es">${withHints(displayShort(it.es))}</span>${hasTTS ? ` <button class="spk" id="pfSay" aria-label="Listen to ${esc(it.say)}">${ic("speaker")}</button>` : ""}</p>
          <p class="pf-en" id="pfEn" ${nextShown ? "" : "hidden"}>${withHints(displayShort(it.en))}</p>
        </div>
        <div class="pf-actions">
          <button class="btn" id="pfShow" aria-expanded="${nextShown}" aria-controls="pfEn">${nextShown ? "Hide meaning" : "Show meaning"}</button>
          <button class="btn" id="pfNext">Siguiente ${ic("arrow")}</button>
        </div>
      </div>
    </div>`;
  }
  function bindPlatform() {
    const card = document.getElementById("platform");
    const redraw = (focusSel) => { card.outerHTML = platformCard(); bindPlatform(); refocus(focusSel); };
    const sayBtn = document.getElementById("pfSay");
    if (sayBtn) sayBtn.onclick = () => say(nextWord.say);
    document.getElementById("pfShow").onclick = () => { nextShown = !nextShown; redraw("#pfShow"); };
    document.getElementById("pfNext").onclick = () => {
      pickNextWord(); redraw("#pfNext");
      announce(`Próxima estación: ${displayShort(nextWord.es).replace(/\[[^\]]*\]/g, "")}`);
    };
  }

  let smartOptsOpen = false;
  let customOpenState = null;   // null until toggled: open by default on narrow screens, where there is no map
  const customOpen = () => customOpenState !== null ? customOpenState : (selected.size > 0 || !window.matchMedia("(min-width: 821px)").matches);
  function smartSummary() {
    const sm = S.settings.smart;
    const dir = sm.mode === "listen" ? "Listening" : { "en-es": `English ${ic("arrow")} Spanish`, "es-en": `Spanish ${ic("arrow")} English`, mixed: "Mixed directions" }[sm.dir];
    const mode = { type: "Type", mc: "Multiple choice", listen: "" }[sm.mode];
    return ["20 weakest", dir, mode].filter(Boolean).join(" · ");
  }
  // "564 due" becomes something to do tonight: a few runs of the 20 weakest, with stations for the runs done
  function tonightPlan(dueCount) {
    const plan = Math.min(3, Math.ceil(dueCount / 20));
    const done = Math.min(plan, (S.stats.runs || {})[today()] || 0);
    const dots = Array.from({ length: plan }, (_, i) => `<i class="${i < done ? "on" : ""}"></i>`).join("");
    const text = done >= plan ? "Tonight's plan is done. Extra runs still help." : `Tonight: ${plan} ${plan === 1 ? "run" : "runs"} of your 20 weakest · ${done} of ${plan} done`;
    return `<p class="plan"><span class="plan-dots" aria-hidden="true">${dots}</span>${text}</p>`;
  }

  // One theme as a line: each topic a station (hollow / ringed / filled), turning vertical on narrow screens
  function stationState(t) {
    if (!t.items.some((i) => S.mastery[i.id] !== undefined)) return "";
    return pct(t.items) >= 70 ? "full" : "prog";
  }
  function lineStrip(th) {
    const tops = TOPICS.filter((t) => t.theme === th.id);
    const themePct = pct(tops.flatMap((t) => t.items));
    return `<section class="lstrip" style="--c:${th.color};--n:${tops.length}">
      <div class="line-h">${lineChip(th)}<h3>${esc(th.name)}</h3><span class="es" lang="es">${esc(th.es)}</span><span class="pc">${themePct}%</span></div>
      <ol class="stops">${tops.map((t) => `
        <li class="tcard-wrap ${stationState(t)}">
          <button class="tcard ${selected.has(t.id) ? "sel" : ""}" data-topic="${t.id}">
            <span class="dot"></span>
            <span class="t-name">${esc(STATION_NAMES[t.id])}</span>
            <span class="t-es" lang="es">${esc(t.es)}</span>
            <span class="t-meta">${t.items.length} words · ${pct(t.items)}%</span>
          </button>
          <button class="tpick ${selected.has(t.id) ? "on" : ""}" data-pick="${t.id}" aria-pressed="${selected.has(t.id)}" aria-label="Add ${esc(STATION_NAMES[t.id])} to a custom list" title="Add to a custom list">${selected.has(t.id) ? ic("check") : ""}</button>
        </li>`).join("")}
      </ol></section>`;
  }

  // Seen words that still need work, weakest first
  function dueWords() {
    return ALL_VOCAB.filter((i) => (S.mastery[i.id] !== undefined && mastery(i.id) < 3) || S.misses[i.id] > 0)
      .sort((a, b) => mastery(a.id) - mastery(b.id) || (S.misses[b.id] || 0) - (S.misses[a.id] || 0));
  }
  function startSmart(over) {
    // weakest words first: seen-but-shaky, then most-missed, then new; straight into a session
    const seen = ALL_VOCAB.filter((i) => S.mastery[i.id] !== undefined || S.misses[i.id]);
    const pool = seen.length >= 10 ? seen : ALL_VOCAB;
    const items = shuffle([...pool]).sort((a, b) => mastery(a.id) - mastery(b.id) || (S.misses[b.id] || 0) - (S.misses[a.id] || 0)).slice(0, 40);
    const sm = { ...S.settings.smart, ...over };
    startSession({ kind: "vocab", title: "Smart review", items, dir: sm.dir, mode: sm.mode, size: "20", back: "home", smart: true });
  }

  // What to do today for the next paper: one line, each step a button that starts it
  function examPlan(name) {
    if (/paper\s*1/i.test(name)) return `<p class="exam-plan"><b>Hoy</b> <button class="link" data-plan="weak">Weak verb forms</button>, then <button class="link" data-plan="smart">Smart review</button>. Writing: accents and spelling count.</p>`;
    if (/paper\s*2/i.test(name)) return `<p class="exam-plan"><b>Hoy</b> <button class="link" data-plan="listen">Smart review by ear</button>, then <button class="link" data-plan="read">Spanish to English</button>. Listening and reading.</p>`;
    return "";
  }

  function examRows() {
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const ahead = (S.settings.exams || []).filter((e) => e.date)
      .map((e) => ({ e, n: Math.round((new Date(e.date + "T00:00") - start) / 864e5) })).filter((x) => !isNaN(x.n) && x.n >= 0);
    const next = ahead.reduce((a, b) => (!a || b.n < a.n ? b : a), null);
    const rows = ahead.map(({ e, n }) => {
      const d = new Date(e.date + "T00:00");
      const when = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
      const days = n === 0 ? `HOY<span>today</span>` : `${n}<span>${n === 1 ? "día" : "días"}</span>`;
      const plan = next && next.e === e ? examPlan(e.name || "") : "";
      return `<div class="exam"><div><b>${esc(e.name || "Exam")}</b><small>${when}</small></div><div class="days">${days}</div>${plan}</div>`;
    }).join("");
    return rows || `<span class="exam-set">No upcoming exam dates. <button id="setExams">Set dates</button></span>`;
  }

  // The network: every theme is a line out of Sol (Smart review), every topic a station.
  // Coordinates live in a 1000×600 box; arms run outward from Sol so "travelled" fills from the centre.
  const STATION_NAMES = {
    attributes: "Attributes", relationships: "Relationships", food: "Food & drink", wellbeing: "Wellbeing",
    routine: "Routine", leisure: "Leisure", holidays: "Holidays", festivals: "Festivals",
    transport: "Transport", entertainment: "Entertainment", media: "Media", technology: "Technology",
    neighbourhood: "Neighbourhood", education: "Education", workplace: "Workplace", issues: "Social issues",
    climate: "Climate", geography: "Geography", environment: "Environment", global: "Global issues",
    questions: "Questions", time: "Time markers", opinions: "Opinions", numbers: "Numbers", calendar: "Calendar",
  };
  const NETWORK = [
    { theme: "identities", d: "M500 300 L290 90 L40 90", stops: [[345, 145, "sw", "attributes"], [250, 90, "n", "relationships"], [145, 90, "s", "food"], [45, 90, "n", "wellbeing"]] },
    { theme: "experiences", d: "M500 300 L710 90 L960 90", stops: [[655, 145, "e", "routine"], [750, 90, "n", "leisure"], [855, 90, "s", "holidays"], [955, 90, "n", "festivals"]] },
    { theme: "ingenuity", d: "M500 300 L290 510 L40 510", stops: [[345, 455, "nw", "transport"], [250, 510, "s", "entertainment"], [145, 510, "n", "media"], [45, 510, "s", "technology"]] },
    { theme: "social", d: "M500 300 L710 510 L960 510", stops: [[655, 455, "ne", "neighbourhood"], [750, 510, "s", "education"], [855, 510, "n", "workplace"], [955, 510, "s", "issues"]] },
    { theme: "planet", d: "M500 300 L40 300", stops: [[210, 300, "n", "climate"], [80, 300, "n", "geography"]] },
    { theme: "planet", d: "M500 300 L960 300", stops: [[870, 300, "s", "environment"], [945, 300, "n", "global"]] },
    { theme: "core", d: "M500 180 A120 120 0 0 1 500 420 A120 120 0 0 1 500 180", stops: [[500, 180, "n", "questions"], [611, 254, "e", "time"], [611, 346, "e", "opinions"], [500, 420, "s", "numbers"], [389, 346, "w", "calendar"]] },
  ];
  // How far along its line (0–1) a station sits, so it lights up as the track drawing reaches it
  function arrival(arm, x, y, k) {
    if (arm.theme === "core") return 0.35 + k * 0.13;
    const pts = arm.d.match(/\d+ \d+/g).map((p) => p.split(" ").map(Number));
    let total = 0, at = 0;
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], len = Math.hypot(bx - ax, by - ay);
      const onSeg = Math.abs(Math.hypot(x - ax, y - ay) + Math.hypot(bx - x, by - y) - len) < 1;
      if (onSeg && !at) at = total + Math.hypot(x - ax, y - ay);
      total += len;
    }
    return at / total;
  }
  let mapDrawn = false;
  function networkMap() {
    const linePct = {};
    for (const th of THEMES) linePct[th.id] = pct(TOPICS.filter((t) => t.theme === th.id).flatMap((t) => t.items));
    const svg = `<svg viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
      ${NETWORK.map((a) => `<path class="trk" d="${a.d}" pathLength="100" stroke="${THEME_MAP[a.theme].color}"/>`).join("")}
      ${NETWORK.map((a) => `<path class="run" d="${a.d}" pathLength="100" stroke-dasharray="${linePct[a.theme]} 100" style="--p:${linePct[a.theme]}" stroke="${THEME_MAP[a.theme].color}"/>`).join("")}
    </svg>`;
    const stops = NETWORK.flatMap((a) => a.stops.map(([x, y, at, id], k) => {
      const t = TOPIC_MAP[id], th = THEME_MAP[t.theme], p = pct(t.items);
      return `<button class="stn ${stationState(t)}" data-topic="${id}" data-at="${at}" style="left:${x / 10}%;top:${y / 6}%;--c:${th.color};--d:${Math.round(arrival(a, x, y, k) * 900)}ms"
        aria-label="${esc(STATION_NAMES[id])}, ${th.line}, ${p}% mastered"><span class="dot"></span><span class="lbl">${esc(STATION_NAMES[id])}<small>${p}%</small></span></button>`;
    })).join("");
    return svg + stops + `<button class="sol" style="left:50%;top:50%" aria-label="Sol: start Smart review"><span class="lbl" aria-hidden="true">Sol</span><span class="tip" aria-hidden="true">Km 0 · Smart review</span></button>`;
  }

  /* ═══════════════════════ list preview + setup ═══════════════════════ */

  let listCfg = null;
  // Re-renders replace the DOM, so put keyboard focus back on the control that was used
  function refocus(sel) {
    const el = sel && app.querySelector(sel);
    if (el && !el.disabled) el.focus({ preventScroll: true });
  }
  const focusLost = () => !document.activeElement || document.activeElement === document.body;
  function seg(name, opts, value, disabled = []) {
    return `<div class="seg" data-seg="${name}">${opts.map(([v, l]) => `<button data-v="${v}" class="${v === value ? "on" : ""}" aria-pressed="${v === value}" ${disabled.includes(v) ? "disabled" : ""}>${l}</button>`).join("")}</div>`;
  }
  function bindSeg(root, onChange) {
    root.querySelectorAll("[data-seg]").forEach((sg) => sg.querySelectorAll("button").forEach((b) => (b.onclick = () => {
      onChange(sg.dataset.seg, b.dataset.v);
      refocus(`[data-seg="${sg.dataset.seg}"] [data-v="${b.dataset.v}"]`);
    })));
  }

  function renderList(cfg) {
    if (cfg) listCfg = cfg;
    cfg = listCfg;
    const st = S.settings;
    const listen = st.mode === "listen";
    app.innerHTML = `
      <div class="crumb"><button data-go="home">Vocabulary</button> / ${esc(cfg.theme.name || cfg.title)}</div>
      <div class="list-head" style="--c:${cfg.theme.color}">
        <div class="grow"><h1>${cfg.theme.line ? `<span class="lchip" style="--c:${cfg.theme.color};--on:${cfg.theme.on}">${cfg.theme.line}</span> ` : ""}${esc(cfg.title)}</h1><div class="es" lang="es">${esc(cfg.es || "")}</div>${cfg.note ? `<div class="muted">${esc(cfg.note)}</div>` : ""}</div>
        <div style="min-width:200px"><div class="muted" style="font-size:13px;font-weight:600;margin-bottom:4px">${cfg.items.length} words · ${pct(cfg.items)}% mastered</div><div class="mbar"><span style="width:${pct(cfg.items)}%"></span></div></div>
      </div>
      <div class="card setup">
        <div class="field"><span class="lbl">Direction</span>${seg("direction", [["en-es", `English ${ic("arrow")} Spanish`], ["es-en", `Spanish ${ic("arrow")} English`], ["mixed", "Mixed"]], listen ? "" : st.direction, listen ? ["en-es", "es-en", "mixed"] : [])}</div>
        <div class="field"><span class="lbl">Mode</span>${seg("mode", [["type", "Type"], ["mc", "Multiple choice"], ["listen", "Listening"]], st.mode)}</div>
        <div class="field"><span class="lbl">Words per session</span>${seg("size", [["10", "10"], ["20", "20"], ["all", "All"]], st.size)}</div>
        <button class="btn primary big" id="start" ${cfg.items.length ? "" : "disabled"}>Start ${ic("arrow")}</button>
      </div>
      ${listen && !esVoice ? `<div class="notice">No Spanish voice found on this device yet. Listening mode needs one: in Chrome or Edge it's usually built in; on Linux Firefox, install a Spanish voice for speech-dispatcher.</div>` : ""}
      <div class="card wordlist">
        <div class="wl-tools"><input class="search" id="q" placeholder="Search this list…" autocomplete="off"><span class="muted" style="font-size:14px">Dots show mastery, 0 to 5</span></div>
        <div class="scrollx"><table class="wl"><thead><tr><th style="width:36px"></th><th>Spanish</th><th>English</th><th style="width:90px">Mastery</th></tr></thead>
        <tbody id="rows"></tbody></table></div>
      </div>`;
    const rows = document.getElementById("rows");
    const drawRows = (q = "") => {
      const n = stripAcc(q.toLowerCase());
      const shown = cfg.items.filter((i) => !n || stripAcc((i.es + " " + i.en).toLowerCase()).includes(n));
      if (!shown.length) {
        rows.innerHTML = `<tr><td colspan="4" class="muted">No words in this list match “${esc(q)}”. <button class="link" id="clearQ">Clear the search</button></td></tr>`;
        document.getElementById("clearQ").onclick = () => { const qi = document.getElementById("q"); qi.value = ""; drawRows(); qi.focus(); };
        return;
      }
      rows.innerHTML = shown.map((i) => `
        <tr><td><button class="spk" data-say="${esc(i.say)}" aria-label="Listen to ${esc(i.say)}">${ic("speaker")}</button></td>
        <td class="es" lang="es">${withHints(display(i.es))}</td><td>${withHints(display(i.en))}</td><td>${mdots(i.id)}</td></tr>`).join("");
      rows.querySelectorAll("[data-say]").forEach((b) => (b.onclick = () => say(b.dataset.say)));
    };
    drawRows();
    document.getElementById("q").oninput = (e) => drawRows(e.target.value);
    app.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => go(b.dataset.go)));
    bindSeg(app, (k, v) => { S.settings[k] = v; save(); renderList(); });
    document.getElementById("start").onclick = () => startSession({
      kind: "vocab", title: cfg.title, items: cfg.items, dir: st.direction, mode: st.mode, size: st.size, back: "list",
    });
    if (focusLost()) refocus("#start");   // Enter starts straight away
  }

  /* ═══════════════════════ session engine ═══════════════════════ */

  let sess = null;

  function startSession(cfg) {
    let pool = shuffle([...cfg.items]).sort((a, b) => mastery(a.id) - mastery(b.id));
    if (cfg.size !== "all") pool = pool.slice(0, +cfg.size);
    shuffle(pool);
    sess = {
      ...cfg, pool, all: cfg.items,
      queue: pool.map((item) => ({ item, need: 1, missed: false, near: false })),
      total: pool.length, cleared: 0, points: 0, right: 0, wrong: 0,
      missed: new Map(), start: Date.now(), q: null, state: "ask", clearedLog: [],
      before: new Map(pool.map((i) => [i.id, mastery(i.id)])), listPctBefore: pct(cfg.items), leftBefore: cfg.items.filter((i) => mastery(i.id) < 4).length,
      combo: 0, best: 0, bestBefore: S.stats.bestCombo || 0,
    };
    // A session drawn from one theme runs on that line; anything mixed runs on the grey Circular
    const themes = new Set(pool.map((i) => (i.kind === "vocab" ? TOPIC_MAP[i.topic].theme : "core")));
    sess.line = themes.size === 1 && cfg.kind === "vocab" ? THEME_MAP[[...themes][0]] : null;
    go("session");
  }

  const ARTICLE = /^(el|la|los|las|un|una|unos|unas) (.+)$/;
  const SUBJ_PRONOUN = /^(yo|tú|tu|él|el|ella|usted|nosotros|nosotras|vosotros|vosotras|ellos|ellas|ustedes) /;

  function buildQuestion(item) {
    if (item.kind === "verb") {
      const acc = new Set(item.acc.map(normEs));
      return { item, lang: "es", accepted: acc, answerRaw: item.acc[0], options: sess.mode === "mc" ? verbOptions(item) : null };
    }
    let dir = sess.mode === "listen" ? "listen" : sess.dir === "mixed" ? (Math.random() < 0.5 ? "en-es" : "es-en") : sess.dir;
    const toEs = dir !== "es-en";
    const acc = new Set(toEs ? item.esAcc : item.enAcc);
    // Same meaning anywhere in the app (e.g. "personality", "lunch", "school")? accept any of those words.
    if (dir !== "listen") for (const k of toEs ? item.enKeys : item.esKeys) {
      for (const o of MEANING[toEs ? "en" : "es"].get(k) || []) (toEs ? o.esAcc : o.enAcc).forEach((a) => acc.add(a));
    }
    return {
      item, dir, lang: toEs ? "es" : "en", accepted: acc,
      prompt: toEs ? item.en : item.es, answerRaw: toEs ? item.es : item.en,
      options: sess.mode === "mc" ? vocabOptions(item, toEs) : null,
    };
  }

  // verb ("to …"), noun (has an article) or anything else: options of the same kind can't be guessed by form
  const wordKind = (i) => (/^\(?to\b/.test(i.en) ? "verb" : /^(el|la|los|las|un|una|unos|unas)(\/\S+)? /.test(i.es.split(";")[0].trim()) ? "noun" : "other");
  function vocabOptions(item, toEs) {
    const side = (i) => (toEs ? i.es : i.en);
    const kind = wordKind(item);
    const seen = new Set([displayShort(side(item))]);
    const opts = [item];
    // same kind from this list first, then the same kind from anywhere, then anything
    const tiers = [sess.all.filter((o) => wordKind(o) === kind), ALL_VOCAB.filter((o) => wordKind(o) === kind), sess.all, ALL_VOCAB];
    for (const src of tiers) for (const o of shuffle([...src])) {
      if (opts.length >= 4) break;
      const d = displayShort(side(o));
      if (!seen.has(d) && o.en !== item.en) { seen.add(d); opts.push(o); }
    }
    return shuffle(opts.map((o) => ({ text: displayShort(side(o)), right: o === item })));
  }
  function verbOptions(item) {
    const right = item.acc[0];
    const cands = new Set();
    for (const p of VerbEngine.personsFor(item.tense, S.settings.vosotros)) if (p !== item.p) cands.add(VerbEngine.forms(item.v, item.tense, p)[0]);
    for (const t of S.settings.tenses) if (t !== item.tense && t !== "imperative") cands.add(VerbEngine.forms(item.v, t, item.p)[0]);
    for (const t of TENSES) if (cands.size < 4 && t.key !== "imperative") cands.add(VerbEngine.forms(item.v, t.key, item.p)[0]);
    cands.delete(right);
    const picks = shuffle([...cands]).slice(0, 3);
    return shuffle([{ text: right, right: true }, ...picks.map((t) => ({ text: t, right: false }))]);
  }

  function grade(input, q) {
    let u = q.lang === "es" ? normEs(input) : normEn(input);
    if (!u) return { r: "wrong" };
    if (q.item.kind === "verb") u = u.replace(SUBJ_PRONOUN, "");
    if (q.accepted.has(u)) return { r: "correct" };
    if (q.lang === "es") {
      const ua = stripAcc(u);
      for (const a of q.accepted) if (stripAcc(a) === ua) return { r: S.settings.accents === "lenient" ? "correct-accent" : "accent", target: a };
      // missing or wrong article: "personalidad" / "el personalidad" for "la personalidad"
      const um = u.match(ARTICLE);
      for (const a of q.accepted) {
        const m = a.match(ARTICLE);
        if (m && (stripAcc(m[2]) === ua || (um && stripAcc(um[2]) === stripAcc(m[2])))) return { r: "article", target: a };
      }
    }
    return { r: "wrong" };
  }
  function closest(u, q) {
    let best = null, bd = Infinity;
    for (const a of q.accepted) { const d = editDistance(u, a); if (d < bd) { bd = d; best = a; } }
    return best;
  }

  function renderSession() {
    app.innerHTML = `
      <div class="session">
        <div class="s-top">
          <button class="btn" id="quit" title="End session (Esc)">${ic("x")} End</button>
          <div class="s-title"><span>${sess.line ? `<span class="lchip" style="--c:${sess.line.color};--on:${sess.line.on}">${sess.line.line}</span> ` : ""}${esc(sess.title)}</span><small>${sess.kind === "verb" ? "Verb conjugation" : sess.mode === "listen" ? "Listening" : { "en-es": `English ${ic("arrow")} Spanish`, "es-en": `Spanish ${ic("arrow")} English`, mixed: "Mixed directions" }[sess.dir]}${sess.mode === "mc" ? " · multiple choice" : ""}</small></div>
          <span class="s-stat combo" id="combo" hidden></span>
          <span class="s-stat" id="timer">0:00</span>
          <span class="s-stat" title="Points this session">${ic("star")}<span id="spts">${sess.points}</span></span>
          <div class="endbar" id="endbar" role="alertdialog" aria-label="End session?">
            <span>End this session?</span>
            <span class="keyhint"><kbd>Enter</kbd> end · <kbd>Esc</kbd> keep going</span>
          </div>
        </div>
        <div class="tunnel strip" aria-hidden="true"><i class="ribs"></i><i class="lamps"></i></div>
        ${sessionLine()}
        <div class="s-count"><span id="count"></span><span id="acc"></span></div>
        <div class="qcard" id="qcard"></div>
      </div>`;
    document.getElementById("quit").onclick = finish;
    sess.confirming = false;
    showCombo();
    timerId = setInterval(() => {
      const el = document.getElementById("timer");
      if (el) el.textContent = fmtTime(Date.now() - sess.start);
    }, 1000);
    nextQuestion();
  }

  // One station per word; on the results screen it is drawn at its final state
  function sessionLine() {
    const at = (sess.cleared / sess.total) * 100;
    return `<div class="sline" id="sline" role="progressbar" aria-label="Words learnt" aria-valuemin="0" aria-valuemax="${sess.total}" aria-valuenow="${sess.cleared}" style="--c:${sess.line ? sess.line.color : "var(--lc)"}">
      <span class="trk"></span><span class="run" style="width:${at}%"></span>
      ${sess.total <= 60 ? sess.pool.map((_, i) => `<span class="tk ${i < sess.cleared ? "done" : ""} ${sess.clearedLog[i] ? "miss" : ""}" style="left:${((i + 1) / sess.total) * 100}%;--t:${(i + 1) / sess.total}"></span>`).join("") : ""}
      <span class="pos" style="left:${at}%"></span>
    </div>`;
  }

  function updateBar() {
    // The interchange circle is you: one station per word learnt, missed words keep their mark
    const line = document.getElementById("sline");
    const at = `${(sess.cleared / sess.total) * 100}%`;
    line.querySelector(".run").style.width = at;
    line.querySelector(".pos").style.left = at;
    line.querySelectorAll(".tk").forEach((tk, i) => {
      tk.classList.toggle("done", i < sess.cleared);
      tk.classList.toggle("miss", !!sess.clearedLog[i]);
    });
    line.setAttribute("aria-valuenow", sess.cleared);
    document.getElementById("count").textContent = `${sess.cleared} of ${sess.total} learnt`;
    const n = sess.right + sess.wrong;
    document.getElementById("acc").textContent = n ? `${Math.round((sess.right / n) * 100)}% correct first time` : "";
    document.getElementById("spts").textContent = sess.points;
  }

  function nextQuestion() {
    updateBar();
    const card = sess.queue[0];
    if (!card) return finish();
    sess.q = buildQuestion(card.item);
    sess.state = "ask";
    sess.shownAt = Date.now();
    if (window.scrollY > 0) window.scrollTo(0, 0);
    drawCard();
    document.getElementById("qcard").classList.add("arrive");
  }

  function promptHTML(q) {
    const it = q.item;
    if (it.kind === "verb") {
      const t = TENSE_MAP[it.tense];
      return `
        <div class="q-prompt"><span lang="es">${esc(it.v.inf)}</span> <button class="spk" data-say="${esc(it.v.inf)}" aria-label="Listen to ${esc(it.v.inf)}">${ic("speaker")}</button></div>
        <div class="q-sub"><span class="verb-tag">${esc(PERSONS[it.p])}</span><span class="verb-tag">${esc(t.en)}</span> <span class="muted" lang="es">${esc(t.name)}</span></div>
        ${S.settings.showEnglish ? `<div class="q-en">${withHints(it.en)}</div>` : ""}`;
    }
    if (q.dir === "listen") {
      return `
        <div class="listen"><button class="play" id="play" aria-label="Play again">${ic("play")}</button><button class="btn" id="slow">${ic("slow")} Slow</button>
        <span class="keyhint"><kbd>Shift</kbd>+<kbd>Enter</kbd> play again (twice for slow)</span></div>`;
    }
    const toEs = q.dir === "en-es";
    return `
      ${sess.dir === "mixed" ? `<div class="q-dir"><span class="tag">${toEs ? "English" : "Spanish"}</span>${ic("arrow")}<span class="tag">${toEs ? "Spanish" : "English"}</span></div>` : ""}
      <div class="q-prompt"><span${toEs ? "" : ' lang="es"'}>${withHints(displayShort(q.prompt))}</span>${toEs ? "" : ` <button class="spk" data-say="${esc(it.say)}" aria-label="Listen to ${esc(it.say)}">${ic("speaker")}</button>`}</div>`;
  }

  const ACCENTS = ["á", "é", "í", "ó", "ú", "ñ", "ü", "¿", "¡"];
  const ACCENT_MAP = { a: ["á"], e: ["é"], i: ["í"], o: ["ó"], u: ["ú", "ü"], n: ["ñ"], "?": ["¿"], "!": ["¡"] };

  let measureCtx = null;
  function textWidth(text, el) {
    measureCtx = measureCtx || document.createElement("canvas").getContext("2d");
    const cs = getComputedStyle(el);
    measureCtx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    return measureCtx.measureText(text).width;
  }

  // After typing a letter with accented forms, a pop-up sits above it:
  // press 1 (or 2) to swap the letter for that form, or keep typing to ignore it.
  function attachAccentPopup(input) {
    const pop = document.createElement("div");
    pop.className = "acc-pop";
    input.parentNode.appendChild(pop);
    let state = null;   // { pos, options }
    const hide = () => { state = null; pop.classList.remove("show"); };
    const choose = (k) => {
      const { pos, options } = state;
      input.value = input.value.slice(0, pos) + options[k] + input.value.slice(pos + 1);
      input.setSelectionRange(pos + 1, pos + 1);
      hide();
    };
    input.addEventListener("input", (e) => {
      hide();
      if (!S.settings.accentPopup || e.inputType !== "insertText" || !e.data || e.data.length !== 1) return;
      const lower = e.data.toLowerCase();
      const pos = input.selectionStart - 1;
      if (!ACCENT_MAP[lower] || input.value[pos] !== e.data) return;
      const options = ACCENT_MAP[lower].map((c) => (e.data === lower ? c : c.toUpperCase()));
      state = { pos, options };
      pop.innerHTML = options.map((c, k) => `<button data-k="${k}" tabindex="-1"><kbd>${k + 1}</kbd>${c}</button>`).join("");
      pop.querySelectorAll("button").forEach((b) => (b.onmousedown = (ev) => { ev.preventDefault(); choose(+b.dataset.k); }));
      const cs = getComputedStyle(input);
      const x = input.offsetLeft + parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft)
        + textWidth(input.value.slice(0, pos), input) + textWidth(e.data, input) / 2 - input.scrollLeft;
      pop.style.left = `${Math.max(20, Math.min(x, input.offsetLeft + input.offsetWidth - 20))}px`;
      pop.style.top = `${input.offsetTop}px`;
      pop.classList.add("show");
    });
    input.addEventListener("keydown", (e) => {
      if (!state) return;
      const k = +e.key - 1;
      if (/^[1-9]$/.test(e.key) && k < state.options.length) { e.preventDefault(); e.stopPropagation(); return choose(k); }
      if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); return hide(); }
      if (!["Shift", "Control", "Alt", "Meta", "CapsLock", "AltGraph"].includes(e.key)) hide();
    });
    input.addEventListener("blur", hide);
    input.addEventListener("click", hide);
  }

  function drawCard(fbHTML = "", cls = "") {
    const q = sess.q;
    const qc = document.getElementById("qcard");
    qc.className = "qcard " + cls;
    const asking = sess.state === "ask";
    const retype = sess.state === "retype";
    let body;
    if (q.options) {
      // Answer area first, feedback slot below: the options never move when feedback appears
      body = `<div class="mc">${q.options.map((o, i) => `<button data-opt="${i}" class="${!asking && o.right ? "right" : ""} ${!asking && o.picked && !o.right ? "wrong" : ""}" ${asking ? "" : "disabled"}><span class="n">${!asking && o.right ? ic("check") : !asking && o.picked ? ic("x") : i + 1}</span><span${q.lang === "es" ? ' lang="es"' : ""}>${withHints(o.text)}</span></button>`).join("")}</div>
        <div class="fb-slot">${fbHTML}</div>
        <div class="q-actions">${asking ? `<span class="keyhint">Press <kbd>1</kbd>–<kbd>4</kbd> · <kbd>Enter</kbd> I don't know</span><button class="btn" id="idk">I don't know</button>` : `<span class="keyhint"><kbd>Enter</kbd> to continue</span><button class="btn primary" id="cont">Continue</button>`}</div>`;
    } else {
      const done = sess.state === "done";
      const ph = retype ? "Retype the correct answer…" : q.lang === "es" ? "Type the Spanish…" : "Type the English…";
      // The accent row keeps its space once answered so nothing below it shifts
      body = `
        <div class="answer"><input id="ans" placeholder="${ph}" aria-label="${esc(answerLabel(q, retype))}" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" ${done ? "disabled" : ""}></div>
        ${q.lang === "es" ? `<div class="accents ${done ? "idle" : ""}">${ACCENTS.map((a) => `<button data-acc="${a}" tabindex="-1">${a}</button>`).join("")}${S.settings.accentPopup ? `<span class="acc-tip">Tip: type <b>a</b>, <b>n</b>, <b>u</b>… then press <kbd>1</kbd> or <kbd>2</kbd></span>` : ""}</div>` : ""}
        <div class="fb-slot">${fbHTML}</div>
        <div class="q-actions">
          ${asking ? `<span class="keyhint"><kbd>Enter</kbd> to submit · blank <kbd>Enter</kbd> = I don't know</span><button class="btn" id="idk">I don't know</button><button class="btn primary" id="submit">Submit</button>`
          : retype ? `<span class="keyhint">Retype the correct answer to continue</span><button class="btn primary" id="submit">Check</button>`
          : `<span class="keyhint"><kbd>Enter</kbd> to continue</span><button class="btn primary" id="cont">Next</button>`}
        </div>`;
    }
    qc.innerHTML = promptHTML(q) + body;

    qc.querySelectorAll("[data-say]").forEach((b) => (b.onclick = () => say(b.dataset.say)));
    if (q.dir === "listen") {
      document.getElementById("play").onclick = () => { say(q.item.say); focusInput(); };
      document.getElementById("slow").onclick = () => { say(q.item.say, true); focusInput(); };
      if (asking) setTimeout(() => say(q.item.say), 150);
    }
    const input = document.getElementById("ans");
    qc.querySelectorAll("[data-acc]").forEach((b) => (b.onmousedown = (e) => {
      e.preventDefault();
      const ch = e.shiftKey ? b.dataset.acc.toUpperCase() : b.dataset.acc;
      const s = input.selectionStart, en = input.selectionEnd;
      input.value = input.value.slice(0, s) + ch + input.value.slice(en);
      input.setSelectionRange(s + 1, s + 1);
      input.focus();
    }));
    const idk = document.getElementById("idk");
    if (idk) idk.onclick = () => (q.options ? pickOption(-1) : submit(true));
    const sub = document.getElementById("submit");
    if (sub) sub.onclick = () => submit();
    const cont = document.getElementById("cont");
    if (cont) cont.onclick = advance;
    const ovr = document.getElementById("override");
    if (ovr) ovr.onclick = overrideCorrect;
    qc.querySelectorAll("[data-opt]").forEach((b) => (b.onclick = () => pickOption(+b.dataset.opt)));
    if (input) {
      input.onkeydown = (e) => {
        if (e.key !== "Enter" || sess.confirming) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey && q.dir === "listen") return replay(q);
        if (sess.state === "ask" && !input.value.trim()) return dontKnowKey(e, () => submit(true));
        sess.state === "done" ? advance() : submit();
      };
      if (q.lang === "es") attachAccentPopup(input);
      focusInput();
    }
    // On short laptop screens, bring a tall feedback panel into view without moving the card
    const fb = qc.querySelector(".fb");
    if (fb) {
      fb.scrollIntoView({ block: "nearest" });
      // Read the heading and each labelled row as sentences; the points badge and conjugation table stay visual
      const head = fb.querySelector(".fb-h");
      const pts = head.querySelector(".pts");
      const parts = [head.textContent.replace(pts ? pts.textContent : "", "").trim()];
      fb.querySelectorAll(".fb-row").forEach((r) => parts.push([...r.children].map((c) => c.textContent.trim()).join(": ")));
      if (sess.state === "retype") parts.push("Retype the correct answer to continue");
      announce(parts.filter(Boolean).map((t) => (/[.!?…]$/.test(t) ? t : t + ".")).join(" "));
    }
  }
  function answerLabel(q, retype) {
    const it = q.item;
    const plain = (t) => displayShort(t).replace(/\[([^\]]+)\]/g, "($1)");
    const what = it.kind === "verb" ? `${it.v.inf}, ${PERSONS[it.p]}, ${TENSE_MAP[it.tense].en}: type the Spanish form`
      : q.dir === "listen" ? "Type the Spanish word you heard"
      : `${q.lang === "es" ? "Spanish" : "English"} for ${plain(q.prompt)}`;
    return (retype ? "Retype the correct answer. " : "") + what;
  }

  // A blank Enter reveals the answer, but not from a key held down or a double-press onto a fresh card
  function dontKnowKey(e, reveal) {
    if (!e.repeat && Date.now() - sess.shownAt > 700) reveal();
  }
  function replay(q) {
    const slow = Date.now() - (sess.lastReplay || 0) < 4000;
    sess.lastReplay = slow ? 0 : Date.now();
    say(q.item.say, slow);
  }
  function focusInput() {
    const i = document.getElementById("ans");
    if (i && !i.disabled) i.focus({ preventScroll: true });
  }

  function addPoints(n) {
    sess.points += n;
    S.stats.points += n;
    S.stats.days[today()] = (S.stats.days[today()] || 0) + n;
    const el = document.getElementById("spts");
    if (el) {
      el.textContent = sess.points;
      const stat = el.parentElement;
      stat.classList.remove("bump"); void stat.offsetWidth; stat.classList.add("bump");
    }
  }

  // Record the first attempt at the card currently on screen
  function record(result) {
    const card = sess.queue[0];
    const id = card.item.id;
    S.stats.answered++;
    if (result === "correct" || result === "correct-accent") {
      S.stats.correct++;
      sess.right++;
      addPoints(result === "correct" ? 10 : 5);
      card.need--;
      bumpCombo();
      cabinMove(1400);
    } else {
      sess.combo = 0;
      showCombo();
      sess.wrong++;
      sess.missed.set(id, card.item);
      if (result === "wrong") {
        if (!card.missed) { card.prevM = mastery(id); S.mastery[id] = Math.max(0, mastery(id) - 2); }
        card.missed = true;
        S.misses[id] = (S.misses[id] || 0) + 1;
        card.need = 2;
      } else {
        card.near = true;
        card.need = Math.max(card.need, 1);
      }
    }
    save();
    updateBar();
  }

  function bumpCombo() {
    sess.combo++;
    sess.best = Math.max(sess.best, sess.combo);
    const record = sess.combo > sess.bestBefore && sess.bestBefore >= 5 && !sess.recordShown;
    if (sess.combo > (S.stats.bestCombo || 0)) S.stats.bestCombo = sess.combo;
    if (record) { sess.recordShown = true; announce(`Nuevo récord: ${sess.combo} in a row.`); }
    else if (sess.combo % 5 === 0) announce(`Racha de ${sess.combo}.`);
    showCombo(record || sess.combo % 5 === 0);
  }
  // The chip appears from 3 in a row; milestones and a new record make it jump
  function showCombo(jump) {
    const el = document.getElementById("combo");
    if (!el) return;
    el.hidden = sess.combo < 3;
    el.classList.toggle("rec", sess.recordShown && sess.combo > sess.bestBefore);
    el.innerHTML = `${ic("up")}<span>Racha</span><b>${sess.combo}</b>`;
    el.title = `${sess.combo} right first time in a row · best ${Math.max(sess.best, sess.bestBefore)}`;
    if (jump) { el.classList.remove("jump"); void el.offsetWidth; el.classList.add("jump"); }
  }

  function speakAnswer() {
    if (!S.settings.speak) return;
    const it = sess.q.item;
    say(it.kind === "verb" ? it.acc[0] : it.say);
  }

  function feedbackHTML(kind, user, q) {
    const it = q.item;
    const head = {
      ok: `${ic("check")} Correcto`, okAccent: `${ic("check")} Correcto · check the accents`,
      accent: `Casi · check the accents`, article: `Casi · check the article (el / la / los / las)`,
      bad: user ? `${ic("x")} Incorrecto` : `La respuesta`,
    }[kind];
    const cls = kind === "ok" || kind === "okAccent" ? "ok" : kind === "bad" ? "bad" : "near";
    const pts = kind === "ok" ? 10 : kind === "okAccent" ? 5 : 0;
    let rows = "";
    const esAttr = q.lang === "es" ? ' lang="es"' : "";
    if (kind !== "ok") {
      const u = q.lang === "es" ? normEs(user) : normEn(user);
      const best = closest(u, q) || "";
      // only show a letter-by-letter diff when the attempt was close
      if (u && best && editDistance(u, best) <= Math.max(u.length, best.length) / 2) {
        const [um, bm] = lcsMarks(u, best);
        rows += `<div class="fb-row"><span class="lbl">You typed</span><span class="yours"${esAttr}>${markup(u, um, "bad")}</span></div>`;
        rows += `<div class="fb-row"><span class="lbl">Correct answer</span><span class="ans"${esAttr}>${markup(best, bm, "good")}</span></div>`;
      } else {
        if (u) rows += `<div class="fb-row"><span class="lbl">You typed</span><span class="yours"${esAttr}>${esc(u)}</span></div>`;
        rows += `<div class="fb-row"><span class="lbl">Correct answer</span><span class="ans"${esAttr}>${withHints(display(q.answerRaw))}</span></div>`;
      }
      if (u && best && display(q.answerRaw) !== best && it.kind !== "verb")
        rows += `<div class="fb-row"><span class="lbl">Word list</span><span>${withHints(display(q.answerRaw))}</span></div>`;
    }
    if (it.kind === "vocab" && q.dir === "listen") rows += `<div class="fb-row"><span class="lbl">Meaning</span><span>${withHints(display(it.en))}</span></div>`;
    if (it.kind === "verb" && kind !== "ok") rows += conjTable(it);
    const override = kind === "bad" && user && it.kind === "vocab" ? `<div class="fb-extra"><button class="link" id="override">I was right, count it as correct</button></div>` : "";
    return `<div class="fb ${cls}"><div class="fb-h">${head}${pts ? `<span class="pts">+${pts}</span>` : ""}</div>${rows}${override}</div>`;
  }

  // Classic two-column paradigm (yo | nosotros, tú | vosotros, él | ellos) with the asked person highlighted
  const PERSON_SHORT = ["yo", "tú", "él / ella", "nosotros", "vosotros", "ellos / ellas"];
  function conjTable(it) {
    const cell = (p) => `<td class="${p === it.p ? "hl" : ""}"><span class="pn">${PERSON_SHORT[p]}</span><span lang="es">${esc(VerbEngine.forms(it.v, it.tense, p)[0])}</span></td>`;
    if (it.tense === "imperative") return `<table class="ctable"><tr>${cell(1)}</tr></table>`;
    return `<table class="ctable">${[[0, 3], [1, 4], [2, 5]].map(([a, b]) => `<tr>${cell(a)}${cell(b)}</tr>`).join("")}</table>`;
  }

  function submit(dontKnow = false) {
    const q = sess.q;
    const input = document.getElementById("ans");
    const val = dontKnow ? "" : input.value;
    if (sess.state === "retype") {
      const ok = q.accepted.has(q.lang === "es" ? normEs(val).replace(q.item.kind === "verb" ? SUBJ_PRONOUN : /$^/, "") : normEn(val));
      if (ok) { beep(true); requeue(); return nextQuestion(); }
      input.classList.remove("shake"); void input.offsetWidth; input.classList.add("shake");
      return;
    }
    if (!dontKnow && !val.trim()) return;
    const g = grade(val, q);
    sess.lastInput = val;
    record(g.r);
    if (g.r === "correct" || g.r === "correct-accent") {
      beep(true);
      speakAnswer();
      sess.state = "done";
      drawCard(feedbackHTML(g.r === "correct" ? "ok" : "okAccent", val, q), "ok");
      document.getElementById("ans").value = val;
      clearTimeout(sess.auto);
      if (g.r === "correct") sess.auto = setTimeout(() => { if (sess.state === "done" && sess.q === q && !sess.confirming) advance(); }, 750);
    } else {
      beep(false);
      sess.state = "retype";
      const kind = g.r === "wrong" ? "bad" : g.r;
      drawCard(feedbackHTML(kind, val, q), kind === "bad" ? "bad" : "near");
    }
  }

  function pickOption(i) {
    const q = sess.q;
    if (sess.state !== "ask") return;
    const o = q.options[i];
    if (o) o.picked = true;
    const ok = o && o.right;
    record(ok ? "correct" : "wrong");
    beep(ok);
    if (ok) speakAnswer();
    sess.state = "done";
    sess.mcWrong = !ok;
    drawCard(ok ? feedbackHTML("ok", "", q) : `<div class="fb bad"><div class="fb-h">${o ? `${ic("x")} Incorrecto` : "La respuesta"}</div><div class="fb-row"><span class="lbl">Correct answer</span><span class="ans">${withHints(q.options.find((x) => x.right).text)}</span></div>${q.item.kind === "verb" ? conjTable(q.item) : ""}</div>`, ok ? "ok" : "bad");
    clearTimeout(sess.auto);
    if (ok) sess.auto = setTimeout(() => { if (sess.state === "done" && sess.q === q && !sess.confirming) advance(); }, 700);
  }

  // Move the current card back into the queue or mark it learnt
  function requeue() {
    const card = sess.queue.shift();
    if (card.need <= 0) {
      sess.cleared++;
      sess.clearedLog.push(card.missed || card.near);
      if (!card.missed && !card.near) S.mastery[card.item.id] = Math.min(5, mastery(card.item.id) + 1);
      else if (S.mastery[card.item.id] === undefined) S.mastery[card.item.id] = 0;
      save();
    } else {
      const gap = card.missed || card.near ? 3 + Math.floor(Math.random() * 3) : 5 + Math.floor(Math.random() * 3);
      sess.queue.splice(Math.min(gap, sess.queue.length), 0, card);
    }
  }

  function advance() {
    clearTimeout(sess.auto);
    requeue();
    nextQuestion();
  }

  function overrideCorrect() {
    // Undo the wrong mark for the card on screen and count it as correct
    const card = sess.queue[0];
    const id = card.item.id;
    sess.wrong--; sess.right++;
    S.stats.correct++;
    S.misses[id] = Math.max(0, (S.misses[id] || 1) - 1);
    sess.missed.delete(id);
    if (card.prevM !== undefined) S.mastery[id] = card.prevM;
    card.missed = false; card.need = 0;
    addPoints(10);
    save();
    toast("Counted as correct");
    advance();
  }

  function setConfirm(on) {
    sess.confirming = on;
    document.getElementById("endbar").classList.toggle("show", on);
  }

  function finish() {
    sess.confirming = false;
    if (sess.right + sess.wrong > 0 && !S.settings.onboarded) { S.settings.onboarded = true; save(); }
    if (sess.smart && sess.right + sess.wrong > 0) {
      S.stats.runs = S.stats.runs || {};
      S.stats.runs[today()] = (S.stats.runs[today()] || 0) + 1;
      save();
    }
    clearInterval(timerId);
    clearTimeout(sess.auto);
    sess.elapsed = Date.now() - sess.start;
    go("results");
  }

  document.addEventListener("keydown", (e) => {
    if (screen !== "session" || !sess) return;
    if (sess.confirming) {
      if (e.key === "Enter") { e.preventDefault(); return finish(); }
      if (e.key === "Escape") e.preventDefault();
      if (!["Shift", "Control", "Alt", "Meta"].includes(e.key)) setConfirm(false);
      return;
    }
    if (e.key === "Escape") { e.preventDefault(); return setConfirm(true); }
    if (sess.q && sess.q.options) {
      if (sess.state === "ask" && /^[1-4]$/.test(e.key)) pickOption(+e.key - 1);
      else if (sess.state === "ask" && e.key === "Enter") { e.preventDefault(); dontKnowKey(e, () => pickOption(-1)); }
      else if (sess.state === "done" && e.key === "Enter") { e.preventDefault(); advance(); }
    } else if (sess.state === "done" && e.key === "Enter" && document.activeElement?.id !== "ans") {
      e.preventDefault(); advance();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || screen === "session" || screen === "home") return;
    if (e.target.matches && e.target.matches("input") && e.target.value) {
      e.target.value = "";
      e.target.dispatchEvent(new Event("input"));
      return;
    }
    go(screen === "results" ? sess.back : "home");
  });

  /* ═══════════════════════ results ═══════════════════════ */

  function renderResults() {
    const n = sess.right + sess.wrong;
    const acc = n ? Math.round((sess.right / n) * 100) + "%" : "—";
    const done = sess.cleared === sess.total;
    const missed = [...sess.missed.values()];
    const pctRight = n ? (sess.right / n) * 100 : 0;
    const msg = !n ? "Sin respuestas" : done ? "Trayecto completo" : "Trayecto parcial";
    if (n) cabinMove(2600);
    app.innerHTML = `
      <div class="results">
        <h1>${msg}</h1>
        <div class="muted">${esc(sess.title)} · ${done ? "session complete" : `${sess.cleared} of ${sess.total} learnt`}</div>
        <div class="journey ${done && n ? "arrive" : ""}">${sessionLine()}${sess.clearedLog.some(Boolean) ? `<p class="journey-key"><i aria-hidden="true"></i>Amber stations are words you missed first time</p>` : ""}</div>
        ${changesList()}
        <table class="arrivals">
          <thead><tr><th>Journey</th><th>Learnt</th><th>First time</th><th>Answers</th><th>Points</th><th>Time</th></tr></thead>
          <tbody><tr><td class="lead">${sess.line ? lineChip(sess.line) : lineChip(THEME_MAP.core)}<span>${esc(sess.title)}</span></td><td data-l="Learnt">${sess.cleared} / ${sess.total}</td><td data-l="First time">${acc}</td><td data-l="Answers">${n}</td><td data-l="Points">+${sess.points}</td><td data-l="Time">${fmtTime(sess.elapsed)}</td></tr></tbody>
        </table>
        ${missed.length ? `<div class="card missed"><h3>To review (${missed.length})</h3><table class="wl"><tbody>${missed.map((i) => i.kind === "verb"
          ? `<tr><td class="es" lang="es">${esc(i.acc[0])}</td><td>${esc(i.v.inf)} · ${esc(PERSONS[i.p])} · ${esc(TENSE_MAP[i.tense].en)}</td></tr>`
          : `<tr><td class="es">${lineChip(THEME_MAP[TOPIC_MAP[i.topic].theme])} <span lang="es">${withHints(display(i.es))}</span></td><td>${withHints(display(i.en))}</td></tr>`).join("")}</tbody></table></div>` : ""}
        <div class="row" style="justify-content:center">
          ${missed.length ? `<button class="btn primary big" id="again-missed">Practise mistakes</button>` : ""}
          <button class="btn big" id="again">Go again</button>
          <button class="btn big" id="back">${{ verbs: "Verb drills", list: "Back to list", home: "Home" }[sess.back]}</button>
        </div>
      </div>`;
    const cfg = { kind: sess.kind, title: sess.title, dir: sess.dir, mode: sess.mode, size: sess.size, back: sess.back };
    const missedBtn = document.getElementById("again-missed");
    if (missedBtn) missedBtn.onclick = () => startSession({ ...cfg, items: missed, size: "all", title: sess.title + " · mistakes" });
    document.getElementById("again").onclick = () => startSession({ ...cfg, items: sess.all });
    document.getElementById("back").onclick = () => go(sess.back);
    refocus(missed.length ? "#again-missed" : "#again");
  }

  // What the session moved: words up or back, the list's mastery, words newly mastered, the streak
  function changesList() {
    const up = sess.pool.filter((i) => mastery(i.id) > sess.before.get(i.id));
    const back = sess.pool.filter((i) => mastery(i.id) < sess.before.get(i.id));
    const newly = sess.pool.filter((i) => i.kind === "vocab" && mastery(i.id) >= 4 && sess.before.get(i.id) < 4);
    const left = sess.all.filter((i) => mastery(i.id) < 4).length;
    const rows = [
      `<li><span class="chg up">${ic("up")}</span><span><b>${up.length}</b> ${up.length === 1 ? "word" : "words"} moved up${back.length ? ` · <b>${back.length}</b> slipped back` : ""}</span></li>`,
      sess.kind === "vocab" ? `<li><span class="chg">${sess.line ? lineChip(sess.line) : lineChip(THEME_MAP.core)}</span><span>${esc(sess.title)}: <b>${left}</b> ${left === 1 ? "word" : "words"} left to master${sess.leftBefore !== left ? ` (was ${sess.leftBefore})` : ""}</span></li>` : "",
      newly.length ? `<li><span class="chg up">${ic("check")}</span><span>Now mastered: ${newly.slice(0, 6).map((i) => `<b lang="es">${withHints(display(i.es))}</b>`).join(", ")}${newly.length > 6 ? ` and ${newly.length - 6} more` : ""}</span></li>` : "",
      sess.best >= 3 ? `<li><span class="chg up">${ic("up")}</span><span>Mejor racha <b>${sess.best}</b> right in a row${sess.best > sess.bestBefore && sess.bestBefore >= 5 ? ` · <b class="rec">nuevo récord</b>` : ""}</span></li>` : "",
      `<li><span class="chg flame">${ic("flame")}</span><span>Day streak <b>${streak()}</b></span></li>`,
    ];
    return `<ul class="changes">${rows.join("")}</ul>`;
  }

  /* ═══════════════════════ verb drills ═══════════════════════ */

  function verbPool() {
    const st = S.settings;
    const verbs = VERBS.filter((v) => st.groups.includes(v.g) && !st.exVerbs.includes(v.inf));
    const items = [];
    for (const t of st.tenses)
      for (const v of verbs) {
        if (t === "imperative" && v.noImp) continue;
        for (const p of VerbEngine.personsFor(t, st.vosotros)) items.push(verbItem(v, t, p));
      }
    return items;
  }
  function tenseMastery(t) {
    let sum = 0, n = 0;
    for (const v of VERBS) {
      if (t === "imperative" && v.noImp) continue;
      for (const p of VerbEngine.personsFor(t, S.settings.vosotros)) { sum += mastery(`c:${v.inf}:${t}:${p}`); n++; }
    }
    return n ? Math.round((sum / (n * 5)) * 100) : 0;
  }

  function renderVerbs() {
    const st = S.settings;
    const pool = verbPool();
    const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    app.innerHTML = `
      <div class="list-head"><div class="grow"><h1>Verb drills</h1><div class="es" lang="es">Conjugación</div></div></div>
      <div class="card weak">
        <div class="grow"><h2>Weak forms</h2><p>${weakVerbItems().length >= 10 ? "20 verb forms you've missed or barely know, from every tense." : "Nothing weak yet, so this starts with present, preterite, imperfect and near future."}</p></div>
        <button class="btn primary big" id="weak">Drill weak forms ${ic("arrow")}<kbd>Enter</kbd></button>
      </div>
      <div class="sec-title">Or build your own drill</div>
      <div class="card">
        <div class="vsec"><div class="lbl">Tenses <button class="link" id="tAll">all</button><button class="link" id="tNone">none</button></div>
          <div class="chips">${TENSES.map((t) => `<button class="chip ${st.tenses.includes(t.key) ? "on" : ""}" data-tense="${t.key}" aria-pressed="${st.tenses.includes(t.key)}">
            ${t.stretch ? `<span class="stretch">Stretch</span>` : ""}${esc(t.en)}<small>${esc(t.name)}</small><span class="cbar"><span style="width:${tenseMastery(t.key)}%"></span></span></button>`).join("")}</div></div>
        <div class="vsec"><div class="lbl">Verb groups</div>
          <div class="chips">${GROUPS.map((g) => `<button class="chip ${st.groups.includes(g.id) ? "on" : ""}" data-group="${g.id}" aria-pressed="${st.groups.includes(g.id)}">${esc(g.name)}<small>${VERBS.filter((v) => v.g === g.id).length} verbs</small></button>`).join("")}</div></div>
        <details class="vsec verbs-pick" ${verbsOpen ? "open" : ""}><summary class="lbl">${ic("arrow")}Customise verbs (${VERBS.filter((v) => st.groups.includes(v.g) && !st.exVerbs.includes(v.inf)).length} of ${VERBS.filter((v) => st.groups.includes(v.g)).length}) <span style="text-transform:none;letter-spacing:0;font-weight:500">click a verb to leave it out</span></summary>
          <div class="chips">${VERBS.filter((v) => st.groups.includes(v.g)).map((v) => `<button class="vchip ${st.exVerbs.includes(v.inf) ? "off" : ""}" data-verb="${v.inf}" aria-pressed="${!st.exVerbs.includes(v.inf)}">${v.inf}</button>`).join("")}</div></details>
        <div class="setup" style="margin:0">
          <div class="field"><span class="lbl">Mode</span>${seg("verbMode", [["type", "Type"], ["mc", "Multiple choice"]], st.verbMode)}</div>
          <div class="field"><span class="lbl">Questions</span>${seg("verbSize", [["20", "20"], ["50", "50"], ["100", "100"]], st.verbSize)}</div>
          <div class="field">
            <label class="toggle"><input type="checkbox" id="vos" ${st.vosotros ? "checked" : ""}> Include vosotros</label>
            <label class="toggle"><input type="checkbox" id="eng" ${st.showEnglish ? "checked" : ""}> Show English meaning</label>
          </div>
          <button class="btn primary big" id="vstart" ${pool.length ? "" : "disabled"}>Start ${ic("arrow")}</button>
        </div>
        <div class="muted" style="margin-top:10px;font-size:14px">${pool.length ? `${pool.length.toLocaleString()} possible questions with these settings.` : "Pick at least one tense and one verb group to start a drill."}</div>
      </div>`;
    const rerender = (focusSel) => { save(); renderVerbs(); refocus(focusSel); };
    app.querySelectorAll("[data-tense]").forEach((b) => (b.onclick = () => { st.tenses = toggle(st.tenses, b.dataset.tense); rerender(`[data-tense="${b.dataset.tense}"]`); }));
    app.querySelectorAll("[data-group]").forEach((b) => (b.onclick = () => { st.groups = toggle(st.groups, b.dataset.group); rerender(`[data-group="${b.dataset.group}"]`); }));
    app.querySelectorAll("[data-verb]").forEach((b) => (b.onclick = () => { st.exVerbs = toggle(st.exVerbs, b.dataset.verb); rerender(`[data-verb="${b.dataset.verb}"]`); }));
    document.getElementById("tAll").onclick = () => { st.tenses = TENSES.map((t) => t.key); rerender(); };
    document.getElementById("tNone").onclick = () => { st.tenses = []; rerender(); };
    document.getElementById("vos").onchange = (e) => { st.vosotros = e.target.checked; rerender("#vos"); };
    document.getElementById("eng").onchange = (e) => { st.showEnglish = e.target.checked; save(); };
    bindSeg(app, (k, v) => { st[k] = v; rerender(); });
    document.getElementById("vstart").onclick = startVerbSession;
    document.getElementById("weak").onclick = startWeakVerbs;
    app.querySelector(".verbs-pick").addEventListener("toggle", (e) => { verbsOpen = e.target.open; });
    if (focusLost()) refocus("#weak");
  }
  let verbsOpen = false;
  // Verb forms already met that need work: missed, or below mastery 3; weakest first
  function weakVerbItems() {
    const ids = new Set([...Object.keys(S.mastery), ...Object.keys(S.misses)].filter((id) => id.startsWith("c:")));
    return [...ids].filter((id) => mastery(id) < 3 || S.misses[id] > 0).map(verbItemFromId).filter(Boolean)
      .sort((a, b) => mastery(a.id) - mastery(b.id) || (S.misses[b.id] || 0) - (S.misses[a.id] || 0));
  }
  function startWeakVerbs() {
    let items = weakVerbItems();
    if (items.length < 10) {
      // nothing weak yet: the core exam tenses, every group
      for (const t of ["present", "preterite", "imperfect", "nearfuture"])
        for (const v of VERBS) for (const p of VerbEngine.personsFor(t, S.settings.vosotros)) items.push(verbItem(v, t, p));
    }
    startSession({ kind: "verb", title: "Weak forms", items, mode: S.settings.verbMode, size: "20", back: "verbs" });
  }
  function startVerbSession() {
    const st = S.settings;
    const pool = verbPool();
    if (!pool.length) return go("verbs");
    const names = st.tenses.map((t) => TENSE_MAP[t].en);
    startSession({
      kind: "verb", title: names.length > 3 ? `${names.length} tenses` : names.join(" + "),
      items: pool, mode: st.verbMode, size: st.verbSize, back: "verbs",
    });
  }

  /* ═══════════════════════ tense guide ═══════════════════════ */

  let guideTab = "present";
  function conjGrid(verbs, tense) {
    const ps = VerbEngine.personsFor(tense, true);
    return `<div class="scrollx"><table class="conj"><thead><tr><th></th>${verbs.map((v) => `<th>${esc(v.inf)}</th>`).join("")}</tr></thead><tbody>
      ${ps.map((p) => `<tr><td>${esc(PERSONS[p])}</td>${verbs.map((v) => `<td lang="es">${esc(VerbEngine.forms(v, tense, p)[0])}</td>`).join("")}</tr>`).join("")}
    </tbody></table></div>`;
  }
  function renderGuide(tab) {
    if (tab) guideTab = tab;
    const t = TENSE_MAP[guideTab];
    let body;
    if (guideTab === "conjugator") {
      const cur = S.settings.conjVerb || "tener";
      const v = VERB_MAP[cur];
      body = `<h2>Conjugator</h2><p class="muted">Every tense for any verb in the app.</p>
        <select class="sel" id="cverb">${GROUPS.map((g) => `<optgroup label="${g.name}">${VERBS.filter((x) => x.g === g.id).map((x) => `<option ${x.inf === cur ? "selected" : ""}>${x.inf}</option>`).join("")}</optgroup>`).join("")}</select>
        <span class="muted" style="margin-left:10px">${withHints(`to ${v.en.split(",")[0]} ${v.en.split("|")[1] || ""}`)}</span>
        ${TENSES.map((tt) => `<h3>${esc(tt.en)} · ${esc(tt.name)}</h3>${tt.key === "imperative" ? `<div>${esc(VerbEngine.forms(v, "imperative", 1)[0])}</div>` : conjGrid([v], tt.key)}`).join("")}`;
    } else {
      const g = GUIDE[guideTab];
      const sample = ["hablar", "comer", "vivir"].map((x) => VERB_MAP[x]);
      const irr = ["ser", "ir", "tener", "hacer"].map((x) => VERB_MAP[x]);
      body = `
        <div class="g-head"><h2>${esc(t.en)} <span class="muted" style="font-weight:500">· <span lang="es">${esc(t.name)}</span></span></h2><button class="btn" id="drillTop">Drill this tense ${ic("arrow")}</button></div>
        <p>${esc(g.use)}</p>
        <h3>Key time markers</h3><p>${esc(g.markers)}</p>
        <h3>How to form it</h3>
        <div class="endings">${Object.entries(g.endings).map(([k, e]) => `<div><b>${k === "all" ? "All verbs" : "-" + k + " verbs"}</b>${esc(e)}</div>`).join("")}</div>
        <h3>Regular examples</h3>${guideTab === "imperative" ? `<p>${sample.map((v) => `<b>${v.inf}</b> → ${esc(VerbEngine.forms(v, "imperative", 1)[0])}`).join(" · ")}</p>` : conjGrid(sample, guideTab)}
        <h3>Watch out for</h3><ul>${g.watch.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>
        <h3>Common irregulars</h3>${guideTab === "imperative" ? `<p>${["decir", "hacer", "ir", "poner", "salir", "ser", "tener", "venir"].map((x) => `<b>${x}</b> → ${esc(VerbEngine.forms(VERB_MAP[x], "imperative", 1)[0])}`).join(" · ")}</p>` : conjGrid(irr, guideTab)}
        <h3>Examples</h3>${g.examples.map((e) => `<div class="example"><span lang="es">${esc(e)}</span><button class="spk" data-say="${esc(e)}" aria-label="Listen">${ic("speaker")}</button></div>`).join("")}
        <div style="margin-top:20px"><button class="btn primary" id="drill">Drill this tense ${ic("arrow")}</button></div>`;
    }
    app.innerHTML = `
      <div class="list-head"><div class="grow"><h1>Tense guide</h1><div class="es">Guía de tiempos verbales</div></div></div>
      <div class="guide">
        <div class="card gnav">${TENSES.map((x) => `<button data-tab="${x.key}" class="${x.key === guideTab ? "on" : ""}">${esc(x.en)}<small>${esc(x.name)}</small></button>`).join("")}
          <button data-tab="conjugator" class="${guideTab === "conjugator" ? "on" : ""}">Conjugator<small>Look up any verb</small></button></div>
        <div class="card gbody">${body}</div>
      </div>`;
    app.querySelectorAll("[data-tab]").forEach((b) => (b.onclick = () => renderGuide(b.dataset.tab)));
    app.querySelectorAll("[data-say]").forEach((b) => (b.onclick = () => say(b.dataset.say)));
    const cv = document.getElementById("cverb");
    if (cv) cv.onchange = () => { S.settings.conjVerb = cv.value; save(); renderGuide(); };
    const dr = document.getElementById("drill");
    if (dr) dr.onclick = () => { S.settings.tenses = [guideTab]; save(); startVerbSession(); };
    const drTop = document.getElementById("drillTop");
    if (drTop) drTop.onclick = () => dr.click();
  }

  /* ═══════════════════════ progress + settings ═══════════════════════ */

  function renderProgress() {
    const st = S.settings;
    const seen = ALL_VOCAB.filter((i) => S.mastery[i.id] !== undefined).length;
    const solid = ALL_VOCAB.filter((i) => mastery(i.id) >= 4).length;
    const acc = S.stats.answered ? Math.round((S.stats.correct / S.stats.answered) * 100) + "%" : "—";
    app.innerHTML = `
      <div class="list-head"><div class="grow"><h1>Progress</h1><div class="es">Tu progreso</div></div></div>
      <table class="arrivals">
        <thead><tr><th>Record</th><th>Points</th><th>Day streak</th><th>Words mastered</th><th>Accuracy</th><th>Answers</th></tr></thead>
        <tbody>
          <tr><td class="lead"><span>Today</span></td><td>${(S.stats.days[today()] || 0).toLocaleString()}</td><td>${streak()}</td><td>—</td><td>—</td><td>—</td></tr>
          <tr><td class="lead"><span>All time</span></td><td>${S.stats.points.toLocaleString()}</td><td>${streak()}</td><td>${solid.toLocaleString()} / ${ALL_VOCAB.length.toLocaleString()}</td><td>${acc}</td><td>${S.stats.answered.toLocaleString()}</td></tr>
        </tbody>
      </table>
      <div class="sec-title">Vocabulary by theme</div>
      <div class="card">${THEMES.map((th) => {
        const items = TOPICS.filter((t) => t.theme === th.id).flatMap((t) => t.items);
        return `<div class="tm-row" style="--c:${th.color}"><b>${lineChip(th)}${esc(th.name)}</b><div class="mbar"><span style="width:${pct(items)}%"></span></div><span class="muted">${pct(items)}%</span></div>`;
      }).join("")}
      <div class="muted" style="font-size:13px;margin-top:8px">${seen.toLocaleString()} of ${ALL_VOCAB.length.toLocaleString()} words practised so far.</div></div>
      <div class="sec-title">Tenses</div>
      <div class="card">${Object.keys(S.mastery).some((id) => id.startsWith("c:"))
        ? TENSES.map((t) => `<div class="tm-row"><b>${esc(t.en)}</b><div class="mbar"><span style="width:${tenseMastery(t.key)}%"></span></div><span class="muted">${tenseMastery(t.key)}%</span></div>`).join("")
        : `<div class="row"><span class="grow muted">No verb drills yet. Your progress in each tense shows up here after your first drill.</span><button class="btn" data-go="verbs">Start a verb drill ${ic("arrow")}</button></div>`}</div>
      <div class="sec-title">Keyboard</div>
      <div class="card">${keysTable()}</div>
      <div class="sec-title">Settings</div>
      <div class="card settings-list">
        <div class="field"><span class="lbl">Accents</span>${seg("accents", [["strict", "Strict: retype if wrong"], ["lenient", "Lenient: half points"]], st.accents)}</div>
        <div class="field"><span class="lbl">Exam dates (for the countdown on Home)</span>
          <div class="exam-edit">${(st.exams || []).map((e, i) => `<label>${esc(e.name || "Exam")}<input type="date" data-exam="${i}" value="${esc(e.date || "")}"></label>`).join("")}</div></div>
        <div class="field"><span class="lbl">Look</span>${seg("theme", [["dark", "Midnight"], ["light", "Porcelain (bright rooms)"], ["auto", "Match system"]], st.theme)}</div>
        <label class="toggle"><input type="checkbox" id="snd" ${st.sound ? "checked" : ""}> Sound effects</label>
        <label class="toggle"><input type="checkbox" id="spk" ${st.speak ? "checked" : ""}> Read Spanish answers aloud after a correct answer</label>
        <label class="toggle"><input type="checkbox" id="accpop" ${st.accentPopup ? "checked" : ""}> Accent pop-up (type a letter, then press 1 or 2 for á, ñ, ü…)</label>
        <div class="muted" style="font-size:13px">Spanish voice: ${esVoice ? esc(esVoice.name + " (" + esVoice.lang + ")") : "none found"}</div>
      </div>
      <div class="sec-title">Your data</div>
      <div class="card">
        <p class="muted" style="margin-top:0">Progress is saved in this browser only. To move it to another device, copy it here and paste it into KM0 there.</p>
        <div class="row">
          <button class="btn" id="copyProg">${ic("upload")} Copy progress</button>
          <button class="btn" id="pasteProg">${ic("download")} Paste progress</button>
          <label class="btn">Load from file<input type="file" id="imp" accept="application/json,.json" hidden></label>
          <button class="btn" id="reset">Reset everything</button>
        </div>
        <div class="transfer" id="transfer" hidden>
          <label for="transferText" id="transferLbl"></label>
          <textarea id="transferText" rows="4" spellcheck="false"></textarea>
          <div class="row"><button class="btn primary" id="transferGo">Load this progress</button><button class="btn" id="transferClose">Close</button></div>
        </div>
      </div>`;
    bindSeg(app, (k, v) => { st[k] = v; save(); applyTheme(); renderProgress(); });
    app.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => go(b.dataset.go)));
    document.getElementById("snd").onchange = (e) => { st.sound = e.target.checked; save(); };
    document.getElementById("spk").onchange = (e) => { st.speak = e.target.checked; save(); };
    app.querySelectorAll("[data-exam]").forEach((inp) => (inp.onchange = () => { st.exams[+inp.dataset.exam].date = inp.value; save(); }));
    document.getElementById("accpop").onchange = (e) => { st.accentPopup = e.target.checked; save(); };
    // Moving progress between devices: copy/paste text works everywhere, including where downloads are blocked
    const transfer = document.getElementById("transfer");
    const tText = document.getElementById("transferText");
    const tLbl = document.getElementById("transferLbl");
    const tGo = document.getElementById("transferGo");
    const showTransfer = (label, text, canLoad) => {
      transfer.hidden = false;
      tLbl.textContent = label;
      tText.value = text;
      tText.readOnly = !canLoad;
      tGo.hidden = !canLoad;
      tText.focus();
      if (text) tText.select();
    };
    document.getElementById("copyProg").onclick = () => {
      const text = JSON.stringify(S);
      const fallback = () => showTransfer("Copy this text (Ctrl+C), then paste it into KM0 on your other device.", text, false);
      try {
        navigator.clipboard.writeText(text).then(() => toast("Progress copied. Paste it into KM0 on your other device"), fallback);
      } catch (e) { fallback(); }
    };
    document.getElementById("pasteProg").onclick = () => showTransfer("Paste the progress you copied from your other device, then load it. This replaces the progress in this browser.", "", true);
    document.getElementById("transferClose").onclick = () => { transfer.hidden = true; };
    tGo.onclick = () => importProgress(tText.value);
    document.getElementById("imp").onchange = async (e) => {
      const f = e.target.files[0];
      if (f) importProgress(await f.text());
    };
    const reset = document.getElementById("reset");
    reset.onclick = () => {
      // Two clicks within a few seconds, so a stray click never wipes progress
      if (!reset.dataset.armed) {
        reset.dataset.armed = "1";
        reset.textContent = "Click again to delete everything";
        reset.classList.add("danger");
        setTimeout(() => { if (reset.isConnected) { delete reset.dataset.armed; reset.textContent = "Reset everything"; reset.classList.remove("danger"); } }, 4000);
        return;
      }
      S = clone(DEFAULTS);
      save();
      applyTheme();
      toast("Progress reset");
      go("progress");
    };
  }

  function importProgress(text) {
    try {
      const d = JSON.parse(text);
      if (!d.mastery || !d.stats) throw new Error("not a KM0 export");
      localStorage.setItem(KEY, JSON.stringify(d));
      S = load();
      applyTheme();
      toast("Progress loaded");
      go("progress");
    } catch (err) {
      toast("That isn't KM0 progress. Copy it again from the other device");
    }
  }

  /* ═══════════════════════ product shell: footer, shortcuts, install ═══════════════════════ */

  const VERSION = "1.5";
  const KEY_ROWS = [
    ["<kbd>Enter</kbd>", "Submit an answer, go to the next card, or start from a setup screen"],
    ["blank <kbd>Enter</kbd>", "I don't know: shows the answer"],
    ["<kbd>1</kbd>–<kbd>4</kbd>", "Pick an option in multiple choice"],
    ["<kbd>a</kbd> <kbd>e</kbd> <kbd>i</kbd> <kbd>o</kbd> <kbd>u</kbd> <kbd>n</kbd>, then <kbd>1</kbd> / <kbd>2</kbd>", "Swap the letter you just typed for á, é, í, ó, ú, ü or ñ"],
    ["<kbd>Shift</kbd>+<kbd>Enter</kbd>", "Listening: play the word again (twice for slow)"],
    ["<kbd>Esc</kbd>", "In a session: asks before ending. Elsewhere: back one screen"],
    ["<kbd>?</kbd>", "Show these shortcuts"],
  ];
  const keysTable = () => `<table class="keys"><tbody>${KEY_ROWS.map(([k, d]) => `<tr><td>${k}</td><td>${d}</td></tr>`).join("")}</tbody></table>`;

  // Older cached copies of index.html have no footer or dialog slot; create them so a fresh app.js never breaks
  const slot = (tag, id, cls) => document.getElementById(id) || document.body.insertBefore(Object.assign(document.createElement(tag), { id, className: cls }), document.getElementById("toast"));
  const keysDlg = slot("dialog", "keysDlg", "keys-dlg");
  keysDlg.setAttribute("aria-labelledby", "keysH");
  keysDlg.innerHTML = `<div class="kd-head"><h2 id="keysH">Keyboard shortcuts</h2><button class="kd-x" id="keysX" aria-label="Close">${ic("x")}</button></div>${keysTable()}`;
  // Keys pressed inside the sheet stay inside it, so Enter or Esc never reach a session underneath
  keysDlg.addEventListener("keydown", (e) => e.stopPropagation());
  keysDlg.addEventListener("click", (e) => { if (e.target === keysDlg) keysDlg.close(); });
  document.getElementById("keysX").onclick = () => keysDlg.close();
  keysDlg.addEventListener("close", () => { if (keysDlg.returnTo) keysDlg.returnTo.focus({ preventScroll: true }); });
  function openKeys() {
    if (keysDlg.open) return;
    keysDlg.returnTo = document.activeElement;
    keysDlg.showModal();
    document.getElementById("keysX").focus();
  }
  document.addEventListener("keydown", (e) => {
    if (e.key !== "?" || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.matches && e.target.matches("input, textarea, select")) return;
    e.preventDefault();
    openKeys();
  });

  // The carriage around the screen, drawn from photos of Madrid Metro cars: moulded wall panels, a slatted ceiling light,
  // ad frames in the cove, a steel handrail, deep window surrounds, bench seats and steel poles. One 600px bay repeats;
  // the windows are holes in it, so the tunnel behind shows through. The tunnel only moves when you make progress.
  const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
  const GLASS = rr(72, 220, 456, 186, 23);
  const seat = (x) => `<path d="${rr(x, 352, 188, 86, 18)}" fill="#F2F1EC" stroke="#C9C8C2" stroke-width="2"/><path d="${rr(x + 12, 362, 164, 68, 12)}" fill="#6B2A34"/><rect x="${x + 24}" y="366" width="140" height="3" rx="1.5" fill="#83404B"/>`;
  const BAY = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="470" viewBox="0 0 600 470">
    <defs><linearGradient id="bv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C4C3BD"/><stop offset="1" stop-color="#EDECE7"/></linearGradient>
    <linearGradient id="pl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8E9292"/><stop offset=".45" stop-color="#EEF0EF"/><stop offset="1" stop-color="#A3A7A7"/></linearGradient></defs>
    <path fill-rule="evenodd" fill="#E1E2DE" d="M0 0H600V470H0Z${GLASS}"/>
    <rect width="600" height="18" fill="#F8F7F3"/><path stroke="#D6D5CF" stroke-width="2" d="${Array.from({ length: 50 }, (_, i) => `M${i * 12 + 6} 0V18`).join("")}"/>
    <rect y="18" width="600" height="6" fill="#C6C5BF"/><rect y="24" width="600" height="146" fill="#D7D8D4"/>
    <rect y="170" width="600" height="6" fill="#F2F1EC"/><rect y="176" width="600" height="4" fill="#BBBAB4"/>
    <path d="${rr(80, 32, 440, 128, 6)}" fill="#BAB9B3"/><path d="${rr(86, 38, 428, 116, 3)}" fill="#1A1814"/>
    <rect x="118" y="180" width="7" height="14" fill="#9C9F9F"/><rect x="475" y="180" width="7" height="14" fill="#9C9F9F"/>
    <rect y="192" width="600" height="9" fill="#B6B9B8"/><rect y="193" width="600" height="2" fill="#E8EAE9"/><rect y="201" width="600" height="3" fill="#CDCCC6"/>
    <path fill-rule="evenodd" fill="url(#bv)" d="${rr(52, 206, 496, 214, 40)}${rr(66, 214, 468, 198, 29)}"/>
    <path fill-rule="evenodd" fill="#2A2824" d="${rr(66, 214, 468, 198, 29)}${GLASS}"/>
    ${seat(96)}${seat(316)}
    <rect x="86" y="436" width="428" height="16" rx="6" fill="#F2F1EC"/><rect x="92" y="452" width="416" height="18" fill="#57544E"/><rect x="92" y="452" width="416" height="4" fill="#B5B4AE"/>
    <rect x="-8" width="16" height="470" fill="url(#pl)"/><rect x="592" width="16" height="470" fill="url(#pl)"/>
    <rect x="-11" y="18" width="22" height="10" rx="2" fill="#9C9F9F"/><rect x="589" y="18" width="22" height="10" rx="2" fill="#9C9F9F"/>
  </svg>`;
  const svgUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\n\s*/g, ""))}")`;
  document.documentElement.style.setProperty("--bay", svgUrl(BAY));
  // beside the screen the cove has no frames: the ads there hang whole in the gaps, or not at all
  document.documentElement.style.setProperty("--bay-plain", svgUrl(BAY.replace(`<path d="${rr(80, 32, 440, 128, 6)}" fill="#BAB9B3"/><path d="${rr(86, 38, 428, 116, 3)}" fill="#1A1814"/>`, "")));

  // The ads in the cove: original, and all about the syllabus. The fine print is the English.
  const ADS = [
    `<figure class="ad ad-estar"><b>Inmobiliaria Estar</b><span>Pisos para estar un rato.</span><small lang="es">¿Busca algo para siempre? Eso es cosa de Ser, S.L.</small><em lang="en">Estar: temporary states and places. Ser: what something is.</em></figure>`,
    `<figure class="ad ad-seat"><svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="7" r="4.5"/><path d="M14 15h12l3 11h-6l1 10h-8l1-10h-6z"/></svg><div><b>Cede el asiento a los verbos irregulares</b><span>Ir, ser y tener ya cargan bastante.</span><em lang="en">Give up your seat for irregular verbs. Ir, ser and tener carry enough already.</em></div></figure>`,
    `<figure class="ad ad-km0"><b>Próxima parada: Paper 1</b><span>Tu palabra más débil viaja contigo. Pulsa Enter en Sol.</span><em lang="en">Your weakest word rides with you. Press Enter at Sol.</em></figure>`,
    `<figure class="ad ad-pret"><b>Academia Pretérito</b><span>Lo que pasó, pasó.</span><small lang="es">Lo que pasaba, también lo enseñamos.</small><em lang="en">Preterite: finished actions. Imperfect: background and habits.</em></figure>`,
  ];
  const scene = (start) => `<div class="tunnel"><i class="ribs"></i><i class="lamps"></i></div><div class="bays"></div>
    <div class="ads">${Array.from({ length: 9 }, (_, i) => ADS[(i + start) % ADS.length]).join("")}</div>`;
  const cabin = document.createElement("div");
  cabin.className = "cabin";
  cabin.setAttribute("aria-hidden", "true");
  cabin.innerHTML = `<div class="scene">${scene(1)}</div><div class="side-ad l">${ADS[1]}</div><div class="side-ad r">${ADS[3]}</div><div class="floor"></div>`;
  document.body.prepend(cabin);
  const carriage = document.createElement("div");
  carriage.className = "carriage";
  carriage.setAttribute("aria-hidden", "true");
  carriage.innerHTML = `<div class="scene">${scene(0)}</div><div class="floor"></div>`;
  const calm = matchMedia("(prefers-reduced-motion: reduce)");
  function cabinMove(ms) {
    if (calm.matches || !document.body.animate) return;
    // pull away, run, brake: whole lamp spacings only, so the view ends where it started
    const run = { duration: ms, easing: "cubic-bezier(.45, 0, .25, 1)" }, d = `${-380 * Math.round(ms / 140)}px`;
    document.querySelectorAll(".tunnel i").forEach((el) => el.animate([{ backgroundPositionX: "0px" }, { backgroundPositionX: d }], run));
  }

  let installPrompt = null;
  const foot = slot("footer", "foot", "foot");
  foot.after(carriage);
  function renderFoot() {
    foot.innerHTML = `
      <div class="foot-id"><span class="foot-mark">${KM0_MARK}</span><span lang="es">Todo empieza en cero.</span></div>
      <nav class="foot-links" aria-label="About KM0">
        <button id="footKeys">Keyboard shortcuts <kbd>?</kbd></button>
        <button data-foot="progress">Back up progress</button>
        <a href="brand.html">Brand</a>
        ${installPrompt ? `<button id="footInstall">${ic("download")} Install app</button>` : ""}
        <span class="foot-ver">v${VERSION}</span>
      </nav>
      <p class="foot-note">Privacy: no accounts, no tracking. Your progress is saved in this browser only and never sent anywhere. The word lists follow the IB Spanish ab initio themes; KM0 is not an official IB resource.</p>`;
    document.getElementById("footKeys").onclick = openKeys;
    foot.querySelector("[data-foot]").onclick = () => go("progress");
    const inst = document.getElementById("footInstall");
    if (inst) inst.onclick = async () => {
      installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
      renderFoot();
    };
  }
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installPrompt = e; renderFoot(); });
  window.addEventListener("appinstalled", () => { installPrompt = null; renderFoot(); toast("KM0 is installed"); });
  // Offline copy for the hosted site; opening the folder from disk works offline already
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  /* ═══════════════════════ boot ═══════════════════════ */

  window.repaso = { session: () => sess, go };  // handy for debugging in the console
  applyTheme();
  renderFoot();
  go("home");
})();
