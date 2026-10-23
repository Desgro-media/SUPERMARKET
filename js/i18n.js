/* Languages: English, বাংলা (Bengali) and العربية (Arabic, right-to-left).
   The app is written in English. This module translates whatever English text is on screen using the dictionary in js/lang.js:
   exact phrases first, then sentence patterns with numbers/names in them, then pack sizes ("250 g", "Pack of 3").
   It watches the page, so anything rendered later (a new view, the cart drawer, a toast) is translated too, and switching
   language re-translates the page in place. Text it doesn't know stays English, so a missing translation never breaks a page.
   To add a language: add an entry to LANGS, a column to every row in js/lang.js, and (if it is right-to-left) dir: 'rtl'. */
(function () {
  var S = window.Store, L = window.LANG || { rows: [], pats: [], units: [] };

  /* ---------- flags for the language menu (inline SVG: flag emoji don't render on Windows) ---------- */
  function svg(inner) { return '<svg viewBox="0 0 24 16" width="24" height="16" aria-hidden="true" focusable="false">' + inner + '</svg>'; }
  function flagUS() {
    var stripes = '', stars = '', i, r, c;
    for (i = 0; i < 7; i++) stripes += '<rect y="' + (i * 2.4615).toFixed(2) + '" width="24" height="1.23"/>';
    for (r = 0; r < 4; r++) for (c = 0; c < 5; c++) stars += '<circle cx="' + (1.7 + c * 1.65).toFixed(2) + '" cy="' + (1.6 + r * 1.7).toFixed(2) + '" r=".42"/>';
    return svg('<rect width="24" height="16" fill="#fff"/><g fill="#b22234">' + stripes + '</g><rect width="10.4" height="8.6" fill="#3c3b6e"/><g fill="#fff">' + stars + '</g>');
  }
  function flagBD() { return svg('<rect width="24" height="16" fill="#006a4e"/><circle cx="10.6" cy="8" r="4.3" fill="#f42a41"/>'); }
  function flagAR() { return svg('<rect width="24" height="5.34" fill="#000"/><rect y="5.33" width="24" height="5.34" fill="#fff"/><rect y="10.66" width="24" height="5.34" fill="#007a3d"/><path d="M0 0 11 8 0 16z" fill="#ce1126"/>'); }

  var LANGS = [
    { id: 'en', short: 'EN', name: 'English', dir: 'ltr', flag: flagUS() },
    { id: 'bn', short: 'BN', name: 'বাংলা', dir: 'ltr', flag: flagBD() },
    { id: 'ar', short: 'AR', name: 'العربية', dir: 'rtl', flag: flagAR() }
  ];
  var byId = {};
  LANGS.forEach(function (l) { byId[l.id] = l; });

  /* ---------- dictionary ---------- */
  var COL = { bn: 1, ar: 2 };
  var DICT = { bn: Object.create(null), ar: Object.create(null) };
  L.rows.forEach(function (r) { if (r[1]) DICT.bn[r[0]] = r[1]; if (r[2]) DICT.ar[r[0]] = r[2]; });
  var PATS = L.pats.map(function (p) { return [p[0] instanceof RegExp ? p[0] : new RegExp(p[0]), p[1], p[2]]; });
  var UNITS = L.units.slice().sort(function (a, b) { return b[0].length - a[0].length; }).map(function (u) {
    return { re: new RegExp('(?<![A-Za-z])' + u[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Za-z])', 'g'), bn: u[1], ar: u[2] };
  });
  var CUR = { bn: 'SAR', ar: 'ر.س' };

  var lang = 'en', missing = Object.create(null), cache = { bn: new Map(), ar: new Map() };

  function sub(x) { var t = lookup(x); return t == null ? x : t; }

  function unitize(s) {
    if (!/\d|^Each$|^Dozen$/.test(s)) return null;
    var out = s, hit = false;
    UNITS.forEach(function (u) { out = out.replace(u.re, function () { hit = true; return u[lang]; }); });
    if (!hit || /[A-Za-z]{2,}/.test(out.replace(/SAR/g, ''))) return null;   // only when every word was understood
    return out;
  }

  function lookupRaw(core) {
    var hit = DICT[lang][core];
    if (hit != null) return hit;
    for (var i = 0; i < PATS.length; i++) {
      var m = PATS[i][0].exec(core);
      if (m) {
        var tpl = PATS[i][COL[lang]];
        if (tpl == null) continue;
        return typeof tpl === 'function' ? tpl(m, sub) : tpl.replace(/\$(\d)/g, function (_, n) { return sub(m[n]); });
      }
    }
    var u = unitize(core);
    if (u != null) return u;
    // a bare amount ("SAR 12.00") only needs its currency translated; a sentence that contains SAR must come from the dictionary
    if (/\bSAR\b/.test(core) && !/[A-Za-z]{2,}/.test(core.replace(/\bSAR\b/g, ''))) return core.replace(/\bSAR\b/g, CUR[lang]);
    return null;
  }
  function lookup(core) {
    if (lang === 'en' || !core) return null;
    var c = cache[lang], hit = c.get(core);
    if (hit !== undefined) return hit;
    var out = lookupRaw(core);
    if (out != null) out = out.replace(/\bSAR\b/g, CUR[lang]);
    c.set(core, out);
    return out;
  }
  /* page titles look like "Dairy & Eggs · NestMart": translate each part */
  function lookupTitle(core) {
    var whole = lookup(core);
    if (whole != null) return whole;
    var parts = core.split(/( · | — )/), any = false;
    var out = parts.map(function (p, i) { if (i % 2) return p; var t = lookup(p); if (t != null) any = true; return t == null ? p : t; });
    return any ? out.join('') : null;
  }

  /* ---------- translating the DOM ---------- */
  var orig = new WeakMap();   // Text -> { en, out };  Element -> { attr: { en, out } }
  var ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
  var SKIP = /^(SCRIPT|STYLE|TEXTAREA|CODE|PRE|NOSCRIPT|SVG|PATH)$/i;

  function skipped(el) { return !el || SKIP.test(el.nodeName) || (el.closest && el.closest('[translate="no"]')); }

  function tText(node) {
    var p = node.parentNode;
    if (!p || p.nodeType !== 1 || skipped(p)) return;
    var s = node.data, rec = orig.get(node), en = rec && s === rec.out ? rec.en : s;
    if (lang === 'en') { if (en !== s) node.data = en; if (rec) orig.delete(node); return; }
    var core = en.trim();
    // nothing to translate: no letters, or an ID / code / email address
    if (!core || !/[A-Za-z]/.test(core) || (/^[A-Z0-9#_.\-]+$/.test(core) && core !== 'SAR') || /^\S+@\S+$/.test(core)) { if (en !== s) node.data = en; return; }
    var out = p.nodeName === 'TITLE' ? lookupTitle(core) : lookup(core);
    if (out == null) {
      if (en !== s) node.data = en;
      if (rec) orig.delete(node);
      if (/[A-Za-z]{2,}/.test(core)) missing[core] = 1;
      return;
    }
    var lead = en.slice(0, en.indexOf(core)), res = lead + out + en.slice(lead.length + core.length);
    if (node.data !== res) node.data = res;
    orig.set(node, { en: en, out: res });
  }

  function tAttr(el, a) {
    var v = el.getAttribute(a);
    if (v == null || skipped(el)) return;
    var recs = orig.get(el) || {}, rec = recs[a], en = rec && v === rec.out ? rec.en : v;
    if (lang === 'en') { if (en !== v) el.setAttribute(a, en); delete recs[a]; return; }
    var out = lookup(en.trim());
    if (out == null) {
      if (en !== v) el.setAttribute(a, en);
      delete recs[a];
      if (/[A-Za-z]{2,}/.test(en)) missing[en.trim()] = 1;
      return;
    }
    if (v !== out) el.setAttribute(a, out);
    recs[a] = { en: en, out: out };
    orig.set(el, recs);
  }

  function tTree(root) {
    if (root.nodeType === 3) { tText(root); return; }
    if (root.nodeType !== 1 || skipped(root)) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) tText(n);
    var els = root.querySelectorAll('[placeholder],[aria-label],[title],[alt]');
    ATTRS.forEach(function (a) { if (root.hasAttribute(a)) tAttr(root, a); });
    for (var i = 0; i < els.length; i++) ATTRS.forEach(function (a) { if (els[i].hasAttribute(a)) tAttr(els[i], a); });
  }

  var obs = new MutationObserver(function (list) {
    if (lang === 'en') return;
    obs.disconnect();
    try {
      list.forEach(function (m) {
        if (m.type === 'childList') m.addedNodes.forEach(tTree);
        else if (m.type === 'characterData') tText(m.target);
        else if (m.type === 'attributes') tAttr(m.target, m.attributeName);
      });
    } finally { watch(); }
  });
  function watch() {
    obs.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  function syncControls() {
    var l = byId[lang], cur = document.getElementById('lang-cur');
    if (cur) cur.textContent = l.short;
    var items = document.querySelectorAll('[data-action="lang-set"]');
    for (var i = 0; i < items.length; i++) items[i].setAttribute('aria-selected', items[i].dataset.lang === lang);
  }

  function apply() {
    obs.disconnect();
    var l = byId[lang], root = document.documentElement;
    root.lang = l.id; root.dir = l.dir; root.dataset.lang = l.id;
    tTree(document.head); tTree(root);
    syncControls();
    watch();
  }

  function set(id) {
    if (!byId[id] || id === lang) { syncControls(); return; }
    lang = id;
    apply();
    window.dispatchEvent(new Event('i18n'));
  }

  /* the language picked by the visitor (header menu or account page): apply it and remember it */
  function choose(id) { set(id); if (S && S.state.lang !== id) S.setLang(id); }

  var fromUrl = new URLSearchParams(location.search).get('lang');
  var start = byId[fromUrl] ? fromUrl : (S && S.state.lang) || 'en';
  if (!byId[start]) start = 'en';

  window.I18N = {
    langs: LANGS, get lang() { return lang; }, set: set, choose: choose, syncControls: syncControls,
    t: function (s) { var o = lookup(String(s).trim()); return o == null ? s : o; },
    missing: missing
  };
  if (start !== 'en') { lang = start; apply(); } else { document.documentElement.dataset.lang = 'en'; watch(); }
})();
