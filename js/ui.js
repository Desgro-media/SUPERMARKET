/* Shared UI helpers: icons, formatting, product card, cart controls, toasts, modal. */
(function () {
  var C = window.CONFIG, D = window.DATA, S = window.Store;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- icons (24px, stroke) ---------- */
  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/>',
    heart: '<path d="M12 21s-7-4.6-9.3-9.1C1.1 8.7 3 5 6.4 5c2 0 3.5 1.1 5.6 3.3C14.1 6.1 15.6 5 17.6 5 21 5 22.9 8.7 21.3 11.9 19 16.4 12 21 12 21z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    right: '<path d="m9 6 6 6-6 6"/>',
    left: '<path d="m15 6-6 6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    truck: '<path d="M2 6h11v10H2zM13 10h4l4 3v3h-8"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
    home: '<path d="m3 11 9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
    moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
    share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    box: '<path d="M3 8 12 3l9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.5-4M4 5v4h4M4 13a8 8 0 0 0 14.5 4M20 19v-4h-4"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    leaf: '<path d="M5 19C5 10 10 4 20 4c0 10-5 16-13 16"/><path d="M5 19c2-4 5-7 9-9"/>',
    bag: '<path d="M5.5 8h13l1 12.5H4.5z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    logout: '<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/>',
    up: '<path d="m6 15 6-6 6 6"/>',
    download: '<path d="M12 4v11M7.5 11 12 15.5 16.5 11M5 20h14"/>'
  };
  function icon(name, cls) {
    return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  /* ---------- formatting ---------- */
  var nf = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function moneyText(n) { return C.currency + ' ' + nf.format(n); }
  function money(n) { return '<span class="cur">' + C.currency + '</span> ' + nf.format(n); }
  function stars(r) {
    return '<span class="stars" style="--r:' + r + '" role="img" aria-label="Rated ' + r.toFixed(1) + ' out of 5">★★★★★</span>';
  }
  function ago(ts) {
    var d = (Date.now() - ts) / 1000;
    if (d < 60) return 'just now';
    if (d < 3600) return Math.floor(d / 60) + ' min ago';
    if (d < 86400) return Math.floor(d / 3600) + ' h ago';
    return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  /* ---------- product art ---------- */
  function art(p, variant, label) {
    var cat = D.catById[p.cat];
    var attrs = 'class="art" style="--tint:' + cat.tint + '" data-v="' + (variant || 0) + '"' + (label ? ' role="img" aria-label="' + esc(label) + '"' : ' aria-hidden="true"');
    if (p.img) return '<div ' + attrs + '><img src="' + esc(p.img) + '" alt="" loading="lazy"></div>';
    var inner = '<span class="emoji">' + p.emoji + '</span>';
    if (variant === 1) inner = '<span class="emoji e1">' + p.emoji + '</span><span class="emoji e2">' + p.emoji + '</span><span class="emoji e3">' + p.emoji + '</span>';
    if (variant === 2) inner += '<span class="art-tag">' + esc(p.brand) + '</span>';
    return '<div ' + attrs + '>' + inner + '</div>';
  }

  /* ---------- add-to-cart control (re-rendered in place by syncControls) ---------- */
  function ctl(p) {
    var q = S.qty(p.id), inner;
    if (p.stock <= 0) {
      inner = '<button class="add-btn" disabled>Sold out</button>';
    } else if (q) {
      inner = '<div class="stepper" role="group" aria-label="Quantity of ' + esc(p.name) + '">' +
        '<button data-action="dec" data-id="' + p.id + '" aria-label="Decrease quantity of ' + esc(p.name) + '">' + icon(q === 1 ? 'trash' : 'minus') + '</button>' +
        '<output aria-live="polite">' + q + '</output>' +
        '<button data-action="inc" data-id="' + p.id + '" aria-label="Increase quantity of ' + esc(p.name) + '">' + icon('plus') + '</button></div>';
    } else {
      inner = '<button class="add-btn" data-action="add" data-id="' + p.id + '" aria-label="Add ' + esc(p.name) + ' to cart">' + icon('plus') + '<span>Add</span></button>';
    }
    return '<div class="qty-ctl" data-id="' + p.id + '" data-q="' + q + '">' + inner + '</div>';
  }

  function card(p) {
    var wished = S.isWished(p.id);
    return '<article class="pcard" data-pid="' + p.id + '">' +
      '<div class="p-media">' + art(p) +
      '<div class="p-badges">' +
        (p.off ? '<span class="badge badge-sale">−' + p.off + '%</span>' : '') +
        (p.isNew ? '<span class="badge badge-new">New</span>' : '') +
        (p.stock <= 0 ? '<span class="badge badge-out">Sold out</span>' : '') +
      '</div>' +
      '<button class="wish-btn' + (wished ? ' on' : '') + '" data-action="wish" data-id="' + p.id + '" aria-pressed="' + wished + '" aria-label="' + (wished ? 'Remove ' : 'Add ') + esc(p.name) + (wished ? ' from' : ' to') + ' wishlist">' + icon('heart', wished ? 'filled' : '') + '</button>' +
      '</div>' +
      '<div class="p-body">' +
        '<span class="p-brand">' + esc(p.brand) + '</span>' +
        '<h3 class="p-name"><a href="#/product/' + p.id + '">' + esc(p.name) + '</a></h3>' +
        '<span class="p-unit">' + esc(p.unit) + '</span>' +
        '<div class="rating">' + icon('star', 'filled') + '<b>' + p.rating.toFixed(1) + '</b><span>(' + p.reviews + ')</span></div>' +
      '</div>' +
      '<div class="price-row">' +
        '<div class="prices"><span class="price num">' + money(p.price) + '</span>' + (p.was ? '<s class="old num">' + nf.format(p.was) + '</s>' : '') + '</div>' +
        ctl(p) +
      '</div></article>';
  }

  function syncControls() {
    var active = document.activeElement, keep = null;
    if (active && active.closest) {
      var host = active.closest('.qty-ctl');
      if (host) keep = { id: host.dataset.id, action: active.dataset.action };
    }
    $$('.qty-ctl').forEach(function (el) {
      var p = D.byId[el.dataset.id], q = S.qty(p.id);
      if (+el.dataset.q === q) return;
      var tmp = document.createElement('div');
      tmp.innerHTML = ctl(p);
      el.innerHTML = tmp.firstChild.innerHTML;
      el.dataset.q = q;
    });
    $$('.wish-btn').forEach(function (b) {
      var on = S.isWished(b.dataset.id);
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on);
      var ic = b.querySelector('.ico'); if (ic) ic.classList.toggle('filled', on);
    });
    if (keep) {
      var sel = '.qty-ctl[data-id="' + keep.id + '"] [data-action="' + keep.action + '"]';
      var next = $(sel) || $('.qty-ctl[data-id="' + keep.id + '"] button');
      if (next) next.focus({ preventScroll: true });
    }
  }

  /* re-render a container's HTML while keeping keyboard focus on the same control */
  function keepFocus(container, fn) {
    var a = document.activeElement, key = null;
    if (a && container.contains(a) && a.dataset && a.dataset.action) key = { action: a.dataset.action, id: a.dataset.id };
    fn();
    if (key) {
      var n = $('[data-action="' + key.action + '"][data-id="' + key.id + '"]', container) || $('.qty-ctl[data-id="' + key.id + '"] button', container);
      if (n) n.focus({ preventScroll: true });
    }
  }

  /* ---------- toast ---------- */
  function toast(msg, opts) {
    opts = opts || {};
    var root = $('#toasts');
    while (root.children.length >= 3) root.firstChild.remove();
    var el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = '<span>' + esc(msg) + '</span>' + (opts.action ? '<button type="button">' + esc(opts.action) + '</button>' : '');
    root.appendChild(el);
    var timer = setTimeout(close, opts.ms || 4200);
    function close() { clearTimeout(timer); el.classList.add('out'); setTimeout(function () { el.remove(); }, 220); }
    if (opts.action) el.querySelector('button').addEventListener('click', function () { close(); if (opts.onAction) opts.onAction(); });
  }

  /* ---------- modal ---------- */
  var modalEl = null, lastFocus = null;
  function focusables(root) {
    return $$('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', root)
      .filter(function (el) { return el.offsetParent !== null; });
  }
  function openModal(title, html, onMount) {
    closeModal();
    lastFocus = document.activeElement;
    modalEl = document.createElement('div');
    modalEl.className = 'modal';
    modalEl.innerHTML = '<div class="scrim" data-action="close-modal"></div>' +
      '<div class="modal-card" role="dialog" aria-modal="true" aria-label="' + esc(title) + '">' +
      '<button class="icon-btn modal-x" data-action="close-modal" aria-label="Close">' + icon('x') + '</button>' + html + '</div>';
    document.body.appendChild(modalEl);
    document.body.classList.add('lock');
    requestAnimationFrame(function () { modalEl.classList.add('open'); });
    var card = $('.modal-card', modalEl);
    var f = focusables(card).filter(function (el) { return !el.classList.contains('modal-x'); })[0] || card;
    setTimeout(function () { f.focus(); }, 30);
    modalEl.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var list = focusables(card); if (!list.length) return;
      var first = list[0], last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    if (onMount) onMount(card);
    return card;
  }
  function closeModal() {
    if (!modalEl) return;
    var el = modalEl; modalEl = null;
    el.classList.remove('open');
    setTimeout(function () { el.remove(); }, 200);
    if (!$('.drawer.open')) document.body.classList.remove('lock');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function modalOpen() { return !!modalEl; }

  window.UI = {
    $: $, $$: $$, esc: esc, icon: icon, money: money, moneyText: moneyText, nf: nf, stars: stars, ago: ago,
    art: art, ctl: ctl, card: card, syncControls: syncControls, keepFocus: keepFocus, toast: toast,
    openModal: openModal, closeModal: closeModal, modalOpen: modalOpen
  };
})();
