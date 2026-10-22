/* App state: cart, wishlist, orders, account, theme. Persisted to localStorage and synced across tabs. */
(function () {
  var C = window.CONFIG, D = window.DATA;
  var KEY = 'freshnest.v1';

  function blank() {
    return { cart: {}, wish: [], orders: [], user: null, recent: [], searches: [], theme: 'auto', palette: 'ocean', reviews: {}, promo: null, area: null, addr: null };
  }

  var s = blank();
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      s = Object.assign(blank(), raw ? JSON.parse(raw) : {});
    } catch (e) { s = blank(); }
    // drop anything that no longer exists in the catalogue
    Object.keys(s.cart).forEach(function (id) { if (!D.byId[id]) delete s.cart[id]; });
    s.wish = s.wish.filter(function (id) { return D.byId[id]; });
  }
  load();

  var subs = [];
  function commit() {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* private mode: keep working in memory */ }
    subs.forEach(function (fn) { fn(); });
  }
  window.addEventListener('storage', function (e) { if (e.key === KEY) { load(); subs.forEach(function (fn) { fn(); }); } });

  function maxQty(p) { return Math.max(0, Math.min(p.stock, C.maxPerItem)); }

  function lines() {
    return Object.keys(s.cart).map(function (id) {
      var p = D.byId[id], qty = s.cart[id];
      return { p: p, qty: qty, total: p.price * qty, was: (p.was || p.price) * qty };
    });
  }

  function promoState() {
    var code = s.promo, promo = code && C.promos[code];
    if (!promo) return { code: null };
    return { code: code, promo: promo };
  }

  function totals(opts) {
    opts = opts || {};
    var items = lines();
    var subtotal = 0, was = 0, count = 0;
    items.forEach(function (l) { subtotal += l.total; was += l.was; count += l.qty; });
    var ps = promoState(), discount = 0, freeShip = false, promoNote = '';
    if (ps.promo) {
      if (ps.promo.type === 'pct') discount = subtotal * ps.promo.value / 100;
      else if (ps.promo.type === 'flat') {
        if (subtotal >= (ps.promo.min || 0)) discount = ps.promo.value;
        else promoNote = 'Add ' + C.currency + ' ' + (ps.promo.min - subtotal).toFixed(2) + ' more to use ' + ps.code;
      } else if (ps.promo.type === 'ship') freeShip = true;
    }
    var delivery = 0;
    if (count) {
      var free = freeShip || subtotal >= C.freeDeliveryAt;
      delivery = free ? 0 : C.deliveryFee;
    }
    var express = opts.express && count ? C.expressFee : 0;
    return {
      items: items, count: count, subtotal: subtotal, savings: was - subtotal, discount: discount,
      delivery: delivery, express: express, total: Math.max(0, subtotal - discount + delivery + express),
      promoCode: ps.code, promoNote: promoNote, toFree: Math.max(0, C.freeDeliveryAt - subtotal), freeShip: freeShip
    };
  }

  window.Store = {
    get state() { return s; },
    subscribe: function (fn) { subs.push(fn); },
    maxQty: maxQty,
    totals: totals,

    qty: function (id) { return s.cart[id] || 0; },
    setQty: function (id, q) {
      var p = D.byId[id]; if (!p) return 0;
      q = Math.max(0, Math.min(Math.floor(q), maxQty(p)));
      if (q) s.cart[id] = q; else delete s.cart[id];
      commit();
      return q;
    },
    clearCart: function () { s.cart = {}; s.promo = null; commit(); },
    restoreCart: function (snapshot, promo) { s.cart = snapshot; s.promo = promo; commit(); },
    snapshot: function () { return { cart: Object.assign({}, s.cart), promo: s.promo }; },

    isWished: function (id) { return s.wish.indexOf(+id) > -1; },
    toggleWish: function (id) {
      id = +id;
      var i = s.wish.indexOf(id);
      if (i > -1) s.wish.splice(i, 1); else s.wish.unshift(id);
      commit();
      return i === -1;
    },

    applyPromo: function (code) {
      code = String(code || '').trim().toUpperCase();
      if (!code) return { ok: false, msg: 'Enter a promo code' };
      var promo = C.promos[code];
      if (!promo) return { ok: false, msg: 'That code is not valid' };
      s.promo = code; commit();
      return { ok: true, msg: promo.label + ' applied' };
    },
    removePromo: function () { s.promo = null; commit(); },

    pushRecent: function (id) {
      id = +id;
      s.recent = [id].concat(s.recent.filter(function (x) { return x !== id; })).slice(0, 12);
      try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
    },
    pushSearch: function (q) {
      q = String(q || '').trim(); if (!q) return;
      s.searches = [q].concat(s.searches.filter(function (x) { return x.toLowerCase() !== q.toLowerCase(); })).slice(0, 6);
      try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
    },
    clearSearches: function () { s.searches = []; commit(); },

    setTheme: function (t) { s.theme = t; commit(); },
    setPalette: function (p) { s.palette = p; commit(); },
    setArea: function (a) { s.area = a; commit(); },
    setUser: function (u) { s.user = u; commit(); },
    saveAddress: function (a) { s.addr = a; commit(); },

    addReview: function (pid, r) {
      (s.reviews[pid] = s.reviews[pid] || []).unshift(r);
      commit();
    },

    placeOrder: function (info) {
      var t = totals({ express: info.express });
      var order = {
        id: 'FN-' + Date.now().toString(36).toUpperCase().slice(-6),
        ts: Date.now(),
        items: t.items.map(function (l) { return { id: l.p.id, name: l.p.name, emoji: l.p.emoji, unit: l.p.unit, price: l.p.price, qty: l.qty }; }),
        totals: { subtotal: t.subtotal, discount: t.discount, delivery: t.delivery, express: t.express, total: t.total, promo: t.promoCode },
        customer: info.customer, address: info.address, slot: info.slot, payment: info.payment, notes: info.notes || ''
      };
      s.orders.unshift(order);
      s.cart = {}; s.promo = null;
      commit();
      return order;
    },
    order: function (id) { return s.orders.filter(function (o) { return o.id === id; })[0]; }
  };
})();
