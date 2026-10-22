/* App shell: header, search suggestions, cart drawer, router, theme and global actions. */
(function () {
  var C = window.CONFIG, D = window.DATA, S = window.Store, U = window.UI, V = window.Views;
  var esc = U.esc, icon = U.icon, money = U.money, $ = U.$, $$ = U.$$;
  var app = $('#app');
  var current = null;

  /* ================= chrome ================= */
  function buildChrome() {
    $('#announce').innerHTML = '<div class="container"><span>' + icon('truck') + ' Free delivery over ' + U.moneyText(C.freeDeliveryAt) + '</span><span class="sep" aria-hidden="true">•</span><span>Use code <b>SAVE10</b> for 10% off</span><span class="sep hide-sm" aria-hidden="true">•</span><span class="hide-sm">' + icon('clock') + ' Open ' + esc(C.contact.hours) + '</span></div>';

    $('#header').innerHTML =
      '<div class="hdr-main container">' +
        '<a class="logo" href="#/" aria-label="' + esc(C.name) + ' home"><span class="logo-mark">' + icon('bag') + '</span><span class="logo-text">' + esc(C.name) + '</span></a>' +
        '<button type="button" class="loc-btn" data-action="open-area" aria-label="Delivery city, change"><span class="loc-ico">' + icon('pin') + '</span><span class="loc-text"><small>Deliver to</small><b id="loc-label"></b></span>' + icon('down') + '</button>' +
        '<div class="search" id="search"><form id="search-form" role="search" autocomplete="off">' + icon('search') +
          '<input id="q" type="search" name="q" placeholder="Search products, brands…" aria-label="Search products" role="combobox" aria-expanded="false" aria-controls="suggest" aria-autocomplete="list" enterkeyhint="search" spellcheck="false">' +
          '<button type="submit" class="go">Search</button></form>' +
          '<div class="suggest" id="suggest" role="listbox" aria-label="Search suggestions" hidden></div></div>' +
        '<div class="hdr-actions">' +
          '<button type="button" class="install-btn" id="install-btn" data-action="install" aria-label="Install ' + esc(C.name) + ' app" title="Install the app">' + icon('download') + '<span>Install app</span></button>' +
          '<button type="button" class="icon-btn" id="theme-btn" data-action="theme" aria-label="Switch to dark mode"></button>' +
          '<a class="icon-btn" href="#/wishlist" aria-label="Wishlist">' + icon('heart') + '<span class="count" id="wish-count" hidden>0</span></a>' +
          '<a class="icon-btn acct" id="acct-btn" href="#/account" aria-label="Account">' + icon('user') + '</a>' +
          '<button type="button" class="cart-btn" id="cart-btn" data-action="open-cart" aria-label="Open cart"><span class="cart-ico">' + icon('cart') + '<span class="count" id="cart-count">0</span></span><span class="cart-total"><small>My cart</small><b class="num" id="cart-total"></b></span></button>' +
        '</div></div>' +
      '<div class="cat-nav"><div class="container">' +
        '<div class="mega-wrap"><button type="button" class="all-cats" id="mega-btn" data-action="mega" aria-expanded="false" aria-controls="mega">' + icon('menu') + ' All categories ' + icon('down') + '</button>' +
          '<div class="mega" id="mega" hidden>' + D.DEPTS.map(function (d) {
            return '<div class="mega-col"><a class="mega-head" href="#/shop?dept=' + d.id + '"><span aria-hidden="true">' + d.emoji + '</span>' + esc(d.name) + '</a>' +
              D.CATEGORIES.filter(function (c) { return c.dept === d.id; }).map(function (c) {
                return '<a href="#/shop?cat=' + c.id + '" class="mega-item"><span class="mi" style="--tint:' + c.tint + '" aria-hidden="true">' + c.emoji + '</span><span><b>' + esc(c.name) + '</b><small>' + c.count + ' items</small></span></a>';
              }).join('') + '</div>';
          }).join('') + '</div></div>' +
        '<nav class="nav-scroll" aria-label="Departments"><a class="nav-link deals" data-key="deals" href="#/shop?deal=1">🔥 Deals</a>' +
          D.DEPTS.map(function (d) { return '<a class="nav-link" data-key="' + d.id + '" href="#/shop?dept=' + d.id + '">' + esc(d.name) + '</a>'; }).join('') +
          '<a class="nav-link" data-key="new" href="#/shop?sort=new">✨ New arrivals</a></nav>' +
      '</div></div>';

    $('#cart-drawer').innerHTML =
      '<div class="scrim" data-action="close-cart"></div>' +
      '<aside class="drawer-panel" role="dialog" aria-modal="true" aria-label="Shopping cart">' +
        '<header class="dr-head"><h2>Your cart <span id="dr-count"></span></h2><button type="button" class="icon-btn" id="dr-close" data-action="close-cart" aria-label="Close cart">' + icon('x') + '</button></header>' +
        '<div class="dr-body" id="dr-body"></div><footer class="dr-foot" id="dr-foot"></footer></aside>';

    $('#footer').innerHTML =
      '<div class="container foot-grid">' +
        '<div class="foot-brand"><a class="logo" href="#/"><span class="logo-mark">' + icon('bag') + '</span><span class="logo-text">' + esc(C.name) + '</span></a><p>' + esc(C.tagline) + '. Groceries, home essentials and personal care — everything in one place, delivered fast.</p></div>' +
        '<div><h3>Shop</h3><ul>' + D.DEPTS.map(function (d) { return '<li><a href="#/shop?dept=' + d.id + '">' + esc(d.name) + '</a></li>'; }).join('') + '<li><a href="#/shop?deal=1">Deals &amp; offers</a></li><li><a href="#/shop?sort=new">New arrivals</a></li></ul></div>' +
        '<div><h3>My account</h3><ul><li><a href="#/account">Account</a></li><li><a href="#/orders">My orders</a></li><li><a href="#/wishlist">Wishlist</a></li><li><a href="#/cart">Cart</a></li></ul></div>' +
        '<div><h3>Contact</h3><ul class="contact"><li>' + icon('phone') + ' ' + esc(C.contact.phone) + '</li><li>' + icon('mail') + ' ' + esc(C.contact.email) + '</li><li>' + icon('clock') + ' ' + esc(C.contact.hours) + '</li></ul></div>' +
      '</div><div class="foot-bar"><div class="container"><span>© ' + new Date().getFullYear() + ' ' + esc(C.name) + '. Demo store — products, prices and contact details are placeholders.</span><span>Prices include VAT</span></div></div>';

    $('#bottom-nav').innerHTML =
      '<a href="#/" data-nav="home">' + icon('home') + '<span>Home</span></a>' +
      '<button type="button" data-action="categories">' + icon('grid') + '<span>Categories</span></button>' +
      '<button type="button" data-action="focus-search">' + icon('search') + '<span>Search</span></button>' +
      '<a href="#/cart" data-nav="cart"><span class="bn-cart">' + icon('cart') + '<span class="count" id="bn-count" hidden>0</span></span><span>Cart</span></a>' +
      '<a href="#/account" data-nav="account">' + icon('user') + '<span>Account</span></a>';
  }

  /* ================= theme ================= */
  var dark = window.matchMedia('(prefers-color-scheme: dark)');
  function resolvedTheme() { var t = S.state.theme; return t === 'auto' ? (dark.matches ? 'dark' : 'light') : t; }
  function applyTheme() {
    var r = resolvedTheme(), pal = S.state.palette || 'ocean';
    var root = document.documentElement;
    root.dataset.theme = r;
    if (pal === 'ocean') root.removeAttribute('data-palette'); else root.dataset.palette = pal;
    var m = $('meta[name=theme-color]');
    if (m) { var cs = getComputedStyle(root); m.content = (r === 'dark' ? cs.getPropertyValue('--bg') : cs.getPropertyValue('--brand')).trim() || '#1d4ed8'; }
    var b = $('#theme-btn');
    if (b) { b.innerHTML = icon(r === 'dark' ? 'sun' : 'moon'); b.setAttribute('aria-label', r === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); }
  }
  dark.addEventListener && dark.addEventListener('change', applyTheme);

  /* ================= header state ================= */
  function updateHeader() {
    var t = S.totals();
    $('#cart-count').textContent = t.count; $('#cart-count').hidden = !t.count;
    $('#bn-count').textContent = t.count; $('#bn-count').hidden = !t.count;
    $('#cart-total').innerHTML = money(t.subtotal);
    $('#cart-btn').setAttribute('aria-label', 'Open cart, ' + t.count + ' item' + (t.count === 1 ? '' : 's'));
    var w = S.state.wish.length; $('#wish-count').textContent = w; $('#wish-count').hidden = !w;
    $('#loc-label').textContent = S.state.area || C.areas[0];
    var u = S.state.user, a = $('#acct-btn');
    a.setAttribute('aria-label', u ? 'Account, signed in as ' + u.name : 'Account');
    a.classList.toggle('signed', !!u);
  }
  U.cartBump = function () {
    [$('#cart-btn'), $('.bn-cart')].forEach(function (el) {
      if (!el) return;
      el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
    });
  };

  /* ================= cart drawer ================= */
  var drawer = $('#cart-drawer'), drawerFrom = null;
  function renderDrawer() {
    var t = S.totals(), body = $('#dr-body'), foot = $('#dr-foot');
    $('#dr-count').textContent = t.count ? '(' + t.count + ')' : '';
    U.keepFocus(drawer, function () {
      if (!t.count) {
        body.innerHTML = '<div class="empty"><div class="empty-ico" aria-hidden="true">🛒</div><h3>Your cart is empty</h3><p>Add something you need.</p><a class="btn btn-primary" href="#/shop" data-action="close-cart">Start shopping</a></div>';
        foot.innerHTML = ''; return;
      }
      body.innerHTML = V.cartParts.meter(t) + '<ul class="cart-lines">' + t.items.map(V.cartParts.line).join('') + '</ul>';
      foot.innerHTML = '<div class="rows">' + V.cartParts.rows(t) + '</div><div class="dr-btns"><a class="btn btn-outline btn-lg" href="#/cart" data-action="close-cart">View cart</a><a class="btn btn-primary btn-lg" href="#/checkout" data-action="close-cart">Checkout ' + icon('arrow') + '</a></div>';
    });
  }
  function openCart() {
    if (drawer.classList.contains('open')) return;
    closeTransient();
    drawerFrom = document.activeElement;
    renderDrawer();
    drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    setTimeout(function () { $('#dr-close').focus({ preventScroll: true }); }, 60);
  }
  function closeCart() {
    if (!drawer.classList.contains('open')) return;
    drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true');
    if (!U.modalOpen()) document.body.classList.remove('lock');
    if (drawerFrom && drawerFrom.focus && document.contains(drawerFrom)) drawerFrom.focus({ preventScroll: true });
  }
  U.openCart = openCart;

  /* ================= search + suggestions ================= */
  var qEl, sg, form, sgIndex = -1;
  var TRENDING = ['Milk', 'Razor', 'Toothbrush', 'Shampoo', 'Batteries', 'Detergent'];
  function hl(text, q) {
    var w = q.trim().toLowerCase().split(/\s+/)[0], i = w ? text.toLowerCase().indexOf(w) : -1;
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + w.length)) + '</mark>' + esc(text.slice(i + w.length));
  }
  function suggestHtml(q) {
    q = q.trim();
    var n = 0;
    function item(href, inner) { return '<a class="sg-item" role="option" id="sg-' + (n++) + '" aria-selected="false" href="' + href + '">' + inner + '</a>'; }
    if (!q) {
      var rs = S.state.searches;
      return (rs.length ? '<div class="sg-head"><span>Recent</span><button type="button" data-action="clear-searches">Clear</button></div>' + rs.map(function (r) {
        return item('#/shop?q=' + encodeURIComponent(r), '<span class="sg-ico">' + icon('clock') + '</span><span class="sg-main">' + esc(r) + '</span>');
      }).join('') : '') +
        '<div class="sg-head"><span>Trending</span></div><div class="sg-chips">' + TRENDING.map(function (t) {
          return '<a class="chip" href="#/shop?q=' + encodeURIComponent(t) + '">' + t + '</a>';
        }).join('') + '</div>';
    }
    var prods = V.search(q, 6), ql = q.toLowerCase();
    var cats = D.CATEGORIES.filter(function (c) { return c.name.toLowerCase().indexOf(ql) > -1; }).slice(0, 2);
    if (!prods.length && !cats.length) return '<div class="sg-empty"><b>No matches for “' + esc(q) + '”</b><span>Check the spelling or try a broader word like “milk” or “bread”.</span></div>';
    return cats.map(function (c) {
      return item('#/shop?cat=' + c.id, '<span class="sg-ico cat" style="--tint:' + c.tint + '">' + c.emoji + '</span><span class="sg-main"><span class="sg-name">' + hl(c.name, q) + '</span><small>Category</small></span>');
    }).join('') + prods.map(function (p) {
      return item('#/product/' + p.id, '<span class="sg-ico" style="--tint:' + D.catById[p.cat].tint + '">' + p.emoji + '</span><span class="sg-main"><span class="sg-name">' + hl(p.name, q) + '</span><small>' + esc(p.brand) + ' · ' + esc(p.unit) + '</small></span><span class="sg-price num">' + money(p.price) + '</span>');
    }).join('') +
      item('#/shop?q=' + encodeURIComponent(q), '<span class="sg-ico">' + icon('search') + '</span><span class="sg-main">See all results for “' + esc(q) + '”</span>' + icon('arrow'));
  }
  function openSuggest() {
    sg.innerHTML = suggestHtml(qEl.value); sg.hidden = false; sgIndex = -1;
    qEl.setAttribute('aria-expanded', 'true'); qEl.removeAttribute('aria-activedescendant');
  }
  function closeSuggest() {
    if (!sg || sg.hidden) return;
    sg.hidden = true; qEl.setAttribute('aria-expanded', 'false'); qEl.removeAttribute('aria-activedescendant');
  }
  function moveSuggest(d) {
    var items = $$('.sg-item', sg); if (!items.length) return;
    sgIndex = (sgIndex + d + items.length) % items.length;
    items.forEach(function (el, i) { var on = i === sgIndex; el.classList.toggle('active', on); el.setAttribute('aria-selected', on); });
    qEl.setAttribute('aria-activedescendant', items[sgIndex].id);
    items[sgIndex].scrollIntoView({ block: 'nearest' });
  }
  function submitSearch(q) {
    q = (q || '').trim(); if (!q) { qEl.focus(); return; }
    S.pushSearch(q);
    var h = '#/shop?q=' + encodeURIComponent(q);
    closeSuggest(); qEl.blur();
    if (location.hash === h) route(); else location.hash = h;
  }
  function wireSearch() {
    qEl = $('#q'); sg = $('#suggest'); form = $('#search-form');
    qEl.addEventListener('focus', openSuggest);
    qEl.addEventListener('input', function () { sg.innerHTML = suggestHtml(qEl.value); sg.hidden = false; sgIndex = -1; qEl.setAttribute('aria-expanded', 'true'); });
    qEl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (sg.hidden) openSuggest(); moveSuggest(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveSuggest(-1); }
      else if (e.key === 'Enter' && sgIndex > -1) { e.preventDefault(); var a = $$('.sg-item', sg)[sgIndex]; if (a) { closeSuggest(); qEl.blur(); location.hash = a.getAttribute('href'); } }
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); submitSearch(qEl.value); });
    sg.addEventListener('mousedown', function (e) { if (!e.target.closest('[data-action]')) e.preventDefault(); }); // keep input focused while clicking
    sg.addEventListener('click', function (e) { if (e.target.closest('a')) closeSuggest(); });
    document.addEventListener('click', function (e) { if (!e.target.closest('#search')) closeSuggest(); });
  }

  /* ================= mega menu / sheets / modals ================= */
  function closeMega() {
    var m = $('#mega'); if (!m || m.hidden) return;
    m.hidden = true; $('#mega-btn').setAttribute('aria-expanded', 'false');
  }
  function closeTransient() { closeMega(); closeSuggest(); }

  function openAreaModal() {
    var cur = S.state.area || C.areas[0];
    U.openModal('Choose delivery city',
      '<div class="modal-body"><h2>Where should we deliver?</h2><p class="muted">Delivery times and availability depend on your city.</p><div class="area-list" role="radiogroup" aria-label="City">' +
      C.areas.map(function (a) { return '<button type="button" role="radio" aria-checked="' + (a === cur) + '" data-area="' + a + '" class="area-opt' + (a === cur ? ' on' : '') + '">' + icon('pin') + '<span>' + a + '</span>' + (a === cur ? icon('check') : '') + '</button>'; }).join('') + '</div></div>',
      function (card) {
        card.addEventListener('click', function (e) {
          var b = e.target.closest('[data-area]'); if (!b) return;
          S.setArea(b.dataset.area); U.closeModal(); U.toast('Delivering to ' + b.dataset.area);
        });
      });
  }
  function openCategorySheet() {
    U.openModal('Categories',
      '<div class="modal-body"><h2>Shop by category</h2>' +
      '<div class="sheet-cats"><a href="#/shop?deal=1" class="sheet-cat" style="--tint:#ffe1c9"><span>🔥</span><b>Deals</b></a><a href="#/shop?sort=new" class="sheet-cat" style="--tint:#fff0b8"><span>✨</span><b>New arrivals</b></a></div>' +
      D.DEPTS.map(function (d) {
        return '<section class="sheet-dept"><h3><span>' + d.emoji + ' ' + esc(d.name) + '</span><a href="#/shop?dept=' + d.id + '">See all</a></h3><div class="sheet-cats">' +
          D.CATEGORIES.filter(function (c) { return c.dept === d.id; }).map(function (c) { return '<a href="#/shop?cat=' + c.id + '" class="sheet-cat" style="--tint:' + c.tint + '"><span>' + c.emoji + '</span><b>' + esc(c.name) + '</b></a>'; }).join('') +
        '</div></section>';
      }).join('') + '</div>');
  }

  /* ================= cart actions ================= */
  function cartAdd(id, quiet) {
    var p = D.byId[id]; if (!p || p.stock <= 0) return;
    var q = S.qty(id), max = S.maxQty(p);
    if (q >= max) { U.toast('Maximum ' + max + ' per order for ' + p.name); return; }
    S.setQty(id, q + 1); U.cartBump();
    if (q === 0 && !quiet) U.toast(p.name + ' added to cart', { action: 'View cart', onAction: openCart });
  }
  function cartDec(id) {
    var p = D.byId[id], q = S.qty(id); if (!p || !q) return;
    S.setQty(id, q - 1);
    if (q === 1) U.toast('Removed ' + p.name, { action: 'Undo', onAction: function () { S.setQty(id, 1); } });
  }
  function cartRemove(id) {
    var p = D.byId[id], q = S.qty(id); if (!p || !q) return;
    S.setQty(id, 0);
    U.toast('Removed ' + p.name, { action: 'Undo', onAction: function () { S.setQty(id, q); } });
  }
  function share(title) {
    var url = location.href;
    if (navigator.share) { navigator.share({ title: title, url: url }).catch(function () { /* cancelled */ }); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { U.toast('Link copied to clipboard'); }, function () { U.toast('Copy this link: ' + url); });
    else U.toast('Copy this link: ' + url);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action]'); if (!t) return;
    var a = t.dataset.action, id = t.dataset.id ? +t.dataset.id : null;
    switch (a) {
      case 'add': cartAdd(id); break;
      case 'inc': cartAdd(id, true); break;
      case 'dec': cartDec(id); break;
      case 'remove': cartRemove(id); break;
      case 'wish':
        var on = S.toggleWish(id), p = D.byId[id];
        U.toast(on ? 'Saved ' + p.name + ' to wishlist' : 'Removed from wishlist', on ? { action: 'View', onAction: function () { location.hash = '#/wishlist'; } } : { action: 'Undo', onAction: function () { S.toggleWish(id); } });
        break;
      case 'wish-all':
        var n = 0;
        S.state.wish.forEach(function (w) { var pr = D.byId[w]; if (pr && pr.stock > 0 && !S.qty(w)) { S.setQty(w, 1); n++; } });
        if (n) { U.cartBump(); U.toast(n + ' item' + (n === 1 ? '' : 's') + ' added to cart', { action: 'View cart', onAction: openCart }); } else U.toast('Nothing new to add');
        break;
      case 'clear-cart':
        var snap = S.snapshot(); S.clearCart();
        U.toast('Cart cleared', { action: 'Undo', onAction: function () { S.restoreCart(snap.cart, snap.promo); } });
        break;
      case 'promo-remove': S.removePromo(); break;
      case 'open-cart': openCart(); break;
      case 'close-cart': closeCart(); break;
      case 'theme': S.setTheme(resolvedTheme() === 'dark' ? 'light' : 'dark'); break;
      case 'login': V.openAuth(function () { if (location.hash === '#/account') route(); }); break;
      case 'logout': S.setUser(null); U.toast('Signed out'); if (location.hash === '#/account') route(); break;
      case 'open-area': openAreaModal(); break;
      case 'mega':
        var m = $('#mega'), open = m.hidden; closeSuggest();
        m.hidden = !open; t.setAttribute('aria-expanded', open); break;
      case 'categories': openCategorySheet(); break;
      case 'focus-search': window.scrollTo(0, 0); setTimeout(function () { qEl.focus(); }, 50); break;
      case 'clear-searches': S.clearSearches(); sg.innerHTML = suggestHtml(qEl.value); break;
      case 'share': share(t.dataset.title); break;
      case 'close-modal': U.closeModal(); break;
      case 'to-top': window.scrollTo({ top: 0, behavior: 'smooth' }); break;
    }
  });
  // close the mega menu on any outside click
  document.addEventListener('click', function (e) { if (!e.target.closest('.mega-wrap')) closeMega(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (U.modalOpen()) U.closeModal();
      else if (drawer.classList.contains('open')) closeCart();
      else if (!$('#mega').hidden) { closeMega(); $('#mega-btn').focus(); }
      else if (!sg.hidden) closeSuggest();
      return;
    }
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) && !e.ctrlKey && !e.metaKey) { e.preventDefault(); qEl.focus(); }
    if (e.key === 'Tab' && drawer.classList.contains('open')) {
      var f = $$('a[href],button:not([disabled]),input,select', $('.drawer-panel', drawer)).filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ================= router ================= */
  function route() {
    var raw = location.hash.slice(1) || '/';
    if (raw.charAt(0) !== '/') return; // in-page anchors such as #app
    var qi = raw.indexOf('?'), path = qi > -1 ? raw.slice(0, qi) : raw;
    var params = new URLSearchParams(qi > -1 ? raw.slice(qi + 1) : '');
    var seg = path.split('/').filter(Boolean);

    closeTransient(); closeCart(); U.closeModal();
    if (current && current.unmount) current.unmount();
    document.body.classList.remove('lock');

    var view;
    try {
      switch (seg[0]) {
        case undefined: view = V.home(); break;
        case 'shop': view = V.shop(params); break;
        case 'product': view = V.product(seg[1]); break;
        case 'cart': view = V.cart(); break;
        case 'checkout': view = V.checkout(); break;
        case 'order': view = V.order(seg[1]); break;
        case 'orders': view = V.orders(); break;
        case 'wishlist': view = V.wishlist(); break;
        case 'account': view = V.account(); break;
        default: view = V.notFound();
      }
      current = view;
      var root = document.createElement('div');
      root.className = 'view';
      root.innerHTML = view.html;
      app.replaceChildren(root);
      if (view.mount) view.mount(root);
    } catch (err) {
      console.error(err);
      app.innerHTML = '<div class="container"><div class="empty tall"><div class="empty-ico">⚠️</div><h1>Something went wrong</h1><p>Please refresh the page.</p></div></div>';
      current = null;
    }

    if (view && view.title) document.title = (seg[0] ? view.title + ' · ' + C.name : C.name + ' — ' + C.tagline);
    if (seg[0] !== 'shop') { var q = $('#q'); if (q && document.activeElement !== q) q.value = ''; }
    markActive(seg[0], params);
    window.scrollTo(0, 0);
    U.syncControls();
    app.focus({ preventScroll: true });
  }

  function markActive(first, params) {
    var cat = params.get('cat'), key = first === 'shop' ? (params.get('deal') === '1' ? 'deals' : params.get('sort') === 'new' && !cat && !params.get('dept') ? 'new' : params.get('dept') || (cat && D.catById[cat] ? D.catById[cat].dept : '')) : null;
    $$('.nav-link').forEach(function (a) { var on = key && a.dataset.key === key; a.classList.toggle('active', !!on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    var navKey = { undefined: 'home', cart: 'cart', checkout: 'cart', account: 'account', orders: 'account' }[first];
    $$('#bottom-nav [data-nav]').forEach(function (a) { a.classList.toggle('on', a.dataset.nav === navKey); });
  }

  /* ================= boot ================= */
  buildChrome();
  applyTheme();
  updateHeader();
  wireSearch();
  renderDrawer();

  S.subscribe(function () {
    applyTheme(); updateHeader(); U.syncControls(); renderDrawer();
    if (current && current.onStore) current.onStore();
  });

  window.addEventListener('hashchange', route);
  $('.skip').addEventListener('click', function (e) { e.preventDefault(); app.focus(); });

  var toTop = $('#to-top'), bar = $('.hdr-main'), phone = window.matchMedia('(max-width: 820px)'), lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    toTop.classList.toggle('show', y > 700);
    if (!phone.matches) { bar.classList.remove('hide'); lastY = y; return; }
    var d = y - lastY;
    if (Math.abs(d) < 8) return;
    var typing = document.activeElement === qEl || !sg.hidden;
    bar.classList.toggle('hide', d > 0 && y > 160 && !typing);
    lastY = y;
  }, { passive: true });

  route();
})();
