/* Views: home, shop (search + filters), product details, not-found. */
(function () {
  var C = window.CONFIG, D = window.DATA, S = window.Store, U = window.UI;
  var esc = U.esc, icon = U.icon, money = U.money, $ = U.$, $$ = U.$$;
  var V = window.Views = window.Views || {};
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function head(title, sub, linkHtml) {
    return '<div class="section-head"><div><h2>' + title + '</h2>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (linkHtml || '') + '</div>';
  }
  function more(href, label) { return '<a class="link-more" href="' + href + '">' + (label || 'View all') + ' ' + icon('arrow') + '</a>'; }
  function byPop(a, b) { return b.pop - a.pop; }
  function cards(list) { return list.map(U.card).join(''); }

  /* ---------- search (shared with header suggestions) ---------- */
  function tokens(q) {
    return String(q).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).map(function (t) { return t.length > 3 ? t.replace(/s$/, '') : t; });
  }
  function score(p, toks) {
    var name = p.name.toLowerCase(), words = name.split(/\s+/), brand = p.brand.toLowerCase(),
      cat = D.catById[p.cat].name.toLowerCase(), blurb = p.blurb.toLowerCase(), total = 0;
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i], s = 0;
      if (words.some(function (w) { return w.indexOf(t) === 0; })) s = 6;
      else if (name.indexOf(t) > -1) s = 4;
      else if (brand.indexOf(t) > -1) s = 3;
      else if (cat.indexOf(t) > -1) s = 2;
      else if (blurb.indexOf(t) > -1) s = 1;
      if (!s) return 0;
      total += s;
    }
    return total;
  }
  V.search = function (q, limit) {
    var toks = tokens(q); if (!toks.length) return [];
    var out = D.PRODUCTS.map(function (p) { return { p: p, s: score(p, toks) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s || b.p.pop - a.p.pop; })
      .map(function (x) { return x.p; });
    return limit ? out.slice(0, limit) : out;
  };

  /* ================= HOME ================= */
  var SLIDES = [
    { cls: 's1', eyebrow: 'Everything you need', title: 'One store for your whole home', text: 'Groceries, personal care, household and more — delivered in as little as 60 minutes.', cta: 'Start shopping', href: '#/shop',
      art: [['🧴', '4%', '8%', 9, '-12deg'], ['🍎', '48%', '2%', 7.5, '14deg'], ['🪥', '20%', '48%', 8.5, '-26deg'], ['🧺', '62%', '46%', 7, '10deg']] },
    { cls: 's2', eyebrow: 'Weekly deals', title: 'Up to 30% off your favourites', text: 'Save across groceries, grooming, home and more. New prices every week.', cta: 'See all deals', href: '#/shop?deal=1',
      art: [['🛒', '6%', '14%', 10, '-8deg'], ['🪒', '52%', '4%', 7.5, '12deg'], ['🍫', '30%', '56%', 7, '-16deg'], ['🧴', '64%', '48%', 7.5, '8deg']] },
    { cls: 's3', eyebrow: 'Grooming & care', title: 'Shaving sets, brushes & personal care', text: 'Razors, trimmers, toothbrushes and everyday essentials for the whole family.', cta: 'Shop health & beauty', href: '#/shop?dept=beauty',
      art: [['🪒', '6%', '10%', 9.5, '-14deg'], ['🖌️', '50%', '6%', 8.5, '10deg'], ['🪥', '24%', '52%', 7, '-8deg'], ['🧼', '64%', '50%', 7, '14deg']] },
    { cls: 's4', eyebrow: 'Home & kitchen', title: 'Everything for a spotless, well-run home', text: 'Cleaning brushes, cookware, storage and electricals at everyday low prices.', cta: 'Shop home & living', href: '#/shop?dept=home',
      art: [['🧹', '6%', '12%', 9, '-10deg'], ['🍳', '50%', '4%', 8, '12deg'], ['💡', '22%', '52%', 7, '-6deg'], ['🧽', '64%', '50%', 7, '10deg']] }
  ];

  function heroHtml() {
    return '<div class="hero" role="region" aria-roledescription="carousel" aria-label="Featured offers"><div class="hero-track">' +
      SLIDES.map(function (s, i) {
        return '<div class="hero-slide ' + s.cls + '" role="group" aria-roledescription="slide" aria-label="' + (i + 1) + ' of ' + SLIDES.length + '">' +
          '<div class="hero-copy"><span class="eyebrow">' + s.eyebrow + '</span><h1>' + s.title + '</h1><p>' + s.text + '</p>' +
          '<a class="btn btn-light btn-lg" href="' + s.href + '">' + s.cta + ' ' + icon('arrow') + '</a></div>' +
          '<div class="hero-art" aria-hidden="true">' + s.art.map(function (a, k) {
            return '<span style="--x:' + a[1] + ';--y:' + a[2] + ';--s:' + a[3] + ';--r:' + a[4] + ';--d:' + (k * 0.6) + 's">' + a[0] + '</span>';
          }).join('') + '</div></div>';
      }).join('') +
      '</div><button class="hero-arrow prev" aria-label="Previous slide">' + icon('left') + '</button><button class="hero-arrow next" aria-label="Next slide">' + icon('right') + '</button>' +
      '<div class="hero-dots">' + SLIDES.map(function (_, i) { return '<button aria-label="Go to slide ' + (i + 1) + '"></button>'; }).join('') + '</div></div>';
  }

  function mountCarousel(root, cleanups) {
    var wrap = $('.hero', root); if (!wrap) return;
    var track = $('.hero-track', wrap), slides = $$('.hero-slide', wrap), dots = $$('.hero-dots button', wrap), i = 0, timer;
    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + i * 100 + '%)';
      dots.forEach(function (d, k) { d.setAttribute('aria-current', k === i ? 'true' : 'false'); });
      slides.forEach(function (s, k) { s.inert = k !== i; s.setAttribute('aria-hidden', k !== i); });
    }
    function stop() { clearInterval(timer); }
    function play() { if (reduceMotion) return; stop(); timer = setInterval(function () { go(i + 1); }, 6500); }
    $('.prev', wrap).addEventListener('click', function () { go(i - 1); });
    $('.next', wrap).addEventListener('click', function () { go(i + 1); });
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
    wrap.addEventListener('mouseenter', stop); wrap.addEventListener('mouseleave', play);
    wrap.addEventListener('focusin', stop); wrap.addEventListener('focusout', play);
    var x0 = null;
    wrap.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    wrap.addEventListener('touchend', function (e) {
      if (x0 != null) { var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); }
      x0 = null; play();
    });
    go(0); play();
    cleanups.push(stop);
  }

  function mountCountdown(root, cleanups) {
    var el = $('#countdown', root); if (!el) return;
    function two(n) { return String(n).padStart(2, '0'); }
    function tick() {
      var now = new Date(), end = new Date(now); end.setHours(24, 0, 0, 0);
      var s = Math.floor((end - now) / 1000);
      el.innerHTML = [['h', Math.floor(s / 3600)], ['m', Math.floor(s % 3600 / 60)], ['s', s % 60]].map(function (x) {
        return '<span class="cd"><b class="num">' + two(x[1]) + '</b><small>' + x[0] + '</small></span>';
      }).join('<i>:</i>');
    }
    tick();
    var t = setInterval(tick, 1000);
    cleanups.push(function () { clearInterval(t); });
  }

  var DEPT_CAPS = { grocery: 4, beauty: 3, home: 2, baby: 1 };
  /* a balanced "popular" list so the home page shows every department, not just food */
  function balancedPopular(n) {
    var out = [], count = {};
    D.PRODUCTS.slice().sort(byPop).forEach(function (p) {
      if (out.length < n && (count[p.dept] || 0) < (DEPT_CAPS[p.dept] || 2)) { out.push(p); count[p.dept] = (count[p.dept] || 0) + 1; }
    });
    return out;
  }
  /* new arrivals, taking one department at a time in rotation */
  function mixedNew(n) {
    var by = {};
    D.PRODUCTS.filter(function (p) { return p.isNew; }).forEach(function (p) { (by[p.dept] = by[p.dept] || []).push(p); });
    var out = [], more = true;
    while (out.length < n && more) {
      more = false;
      D.DEPTS.forEach(function (d) { var q = by[d.id]; if (q && q.length && out.length < n) { out.push(q.shift()); more = true; } });
    }
    return out;
  }

  V.home = function () {
    var deals = D.PRODUCTS.filter(function (p) { return p.off && p.stock > 0; }).sort(function (a, b) { return b.off - a.off; }).slice(0, 10);
    var fresh = mixedNew(10);
    var recent = S.state.recent.map(function (id) { return D.byId[id]; }).filter(Boolean).slice(0, 8);
    var cleanups = [];

    function popular(dept) {
      var list = dept ? D.PRODUCTS.filter(function (p) { return p.dept === dept; }).sort(byPop).slice(0, 10) : balancedPopular(10);
      return cards(list);
    }

    var html = '<div class="container">' +
      '<section class="hero-wrap">' + heroHtml() +
        '<div class="promo-side">' +
          '<a class="promo-card pc1" href="#/shop?dept=beauty"><div><span class="eyebrow">Care &amp; grooming</span><h3>Brushes, razors &amp; more</h3><span class="link-more">Shop now ' + icon('arrow') + '</span></div><span class="promo-emoji" aria-hidden="true">🪒</span></a>' +
          '<a class="promo-card pc2" href="#/shop?dept=home"><div><span class="eyebrow">Spotless home</span><h3>Cleaning &amp; kitchen</h3><span class="link-more">Shop now ' + icon('arrow') + '</span></div><span class="promo-emoji" aria-hidden="true">🧹</span></a>' +
        '</div></section>' +

      '<section class="trust" aria-label="Why shop with us">' +
        [['truck', 'Free delivery', 'On orders over ' + U.moneyText(C.freeDeliveryAt)], ['zap', '60-minute express', 'Add express at checkout'], ['refresh', 'Easy returns', 'Not happy? We replace or refund'], ['shield', 'Secure checkout', 'Cash or card on delivery']]
          .map(function (t) { return '<div class="trust-item"><span class="trust-ico">' + icon(t[0]) + '</span><div><b>' + t[1] + '</b><small>' + t[2] + '</small></div></div>'; }).join('') +
      '</section>' +

      '<section class="section">' + head('Shop by category', 'Groceries, beauty, home and more — all in one place') +
        '<div class="cat-grid">' + D.CATEGORIES.map(function (c) {
          return '<a class="cat-tile" href="#/shop?cat=' + c.id + '" style="--tint:' + c.tint + '"><span class="cat-ico" aria-hidden="true">' + c.emoji + '</span><b>' + esc(c.name) + '</b><small>' + c.count + ' items</small></a>';
        }).join('') + '</div></section>' +

      '<section class="section deals-band">' +
        '<div class="section-head"><div><h2>' + icon('zap', 'accent') + ' Today\'s deals</h2><p>Prices refresh at midnight</p></div><div class="head-right"><div class="countdown" id="countdown" aria-label="Time left on today\'s deals"></div>' + more('#/shop?deal=1') + '</div></div>' +
        '<div class="scroller">' + cards(deals) + '</div></section>' +

      '<section class="section">' + head('Popular right now', 'What your neighbours are adding to their baskets') +
        '<div class="tabs-pills" role="tablist" aria-label="Popular by department">' +
          '<button role="tab" aria-selected="true" data-tab="">All</button>' +
          D.DEPTS.map(function (d) { return '<button role="tab" aria-selected="false" data-tab="' + d.id + '">' + d.emoji + ' ' + esc(d.name) + '</button>'; }).join('') +
        '</div><div class="pgrid" id="popular" role="tabpanel">' + popular('') + '</div></section>' +

      '<section class="section"><a class="wide-promo" href="#/shop?dept=baby"><div><span class="eyebrow">Baby &amp; kids</span><h2>Everything for little ones</h2><p>Nappies, wipes, feeding essentials and toys — gentle, safe and delivered fast.</p><span class="btn btn-light">Shop baby &amp; kids ' + icon('arrow') + '</span></div><div class="wide-art" aria-hidden="true"><span>🍼</span><span>🧸</span><span>👶</span></div></a></section>' +

      '<section class="section">' + head('New arrivals', 'Just landed on our shelves', more('#/shop?sort=new')) +
        '<div class="scroller">' + cards(fresh) + '</div></section>' +

      (recent.length ? '<section class="section">' + head('Recently viewed', 'Pick up where you left off') + '<div class="scroller">' + cards(recent) + '</div></section>' : '') +

      '<section class="section">' + head('Shop by brand') +
        '<div class="brand-row">' + D.BRANDS.map(function (b) {
          return '<a class="brand-chip" href="#/shop?brand=' + encodeURIComponent(b) + '">' + esc(b) + '</a>';
        }).join('') + '</div></section>' +

      '<section class="section"><form class="newsletter" id="newsletter" novalidate>' +
        '<div><h2>Deals in your inbox</h2><p>Weekly offers across every department. No spam, unsubscribe any time.</p></div>' +
        '<div class="nl-field"><label class="sr" for="nl-email">Email address</label><input id="nl-email" type="email" placeholder="you@example.com" autocomplete="email" required><button class="btn btn-primary" type="submit">Subscribe</button></div>' +
      '</form></section>' +
    '</div>';

    return {
      title: C.tagline, html: html,
      mount: function (root) {
        mountCarousel(root, cleanups);
        mountCountdown(root, cleanups);
        var tabs = $$('[data-tab]', root), panel = $('#popular', root);
        tabs.forEach(function (t) {
          t.addEventListener('click', function () {
            tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t); });
            panel.innerHTML = popular(t.dataset.tab);
          });
        });
        $('#newsletter', root).addEventListener('submit', function (e) {
          e.preventDefault();
          var input = $('#nl-email', root);
          if (!/^\S+@\S+\.\S+$/.test(input.value)) { U.toast('Please enter a valid email address'); input.focus(); return; }
          input.value = ''; U.toast('Thanks! You\'re on the list.');
        });
      },
      unmount: function () { cleanups.forEach(function (f) { f(); }); }
    };
  };

  /* ================= SHOP ================= */
  var SORTS = [['rel', 'Best match'], ['pop', 'Popular'], ['price-asc', 'Lowest price'], ['price-desc', 'Highest price'], ['rating', 'Top rated'], ['off', 'Best discount'], ['new', 'Newest']];
  var PRICE_PRESETS = [['Under 10', '', '10'], ['10 – 25', '10', '25'], ['25 – 50', '25', '50'], ['50 – 100', '50', '100'], ['100+', '100', '']];

  V.shop = function (params) {
    var st = {
      q: (params.get('q') || '').trim(), dept: params.get('dept') || '', cat: params.get('cat') || '',
      brands: (params.get('brand') || '').split(',').filter(Boolean),
      min: params.get('min') || '', max: params.get('max') || '', deal: params.get('deal') === '1', stock: params.get('stock') === '1', rate: params.get('rate') === '1',
      sort: params.get('sort') || '', view: 'grid', page: 1
    };
    try { st.view = localStorage.getItem('freshnest.view') === 'list' ? 'list' : 'grid'; } catch (e) { /* ignore */ }
    if (!D.catById[st.cat]) st.cat = '';
    if (!D.deptById[st.dept]) st.dept = '';
    if (st.cat && st.dept && D.catById[st.cat].dept !== st.dept) st.dept = '';
    var defSort = function () { return st.q ? 'rel' : 'pop'; };
    if (!SORTS.some(function (s) { return s[0] === st.sort; }) || (st.sort === 'rel' && !st.q)) st.sort = defSort();

    /* skip = which facets to ignore, so the sidebar can show counts for the other options */
    function base(skip) {
      skip = skip || {};
      var list = st.q ? V.search(st.q) : D.PRODUCTS.slice();
      var min = parseFloat(st.min), max = parseFloat(st.max);
      return list.filter(function (p) {
        return (skip.cat || !st.cat || p.cat === st.cat) &&
          (skip.dept || !st.dept || p.dept === st.dept) &&
          (!st.brands.length || st.brands.indexOf(p.brand) > -1) &&
          (isNaN(min) || p.price >= min) && (isNaN(max) || p.price <= max) &&
          (!st.deal || p.off > 0) && (!st.stock || p.stock > 0) && (!st.rate || p.rating >= 4);
      });
    }
    function sorted(list) {
      var l = list.slice();
      switch (st.sort) {
        case 'price-asc': return l.sort(function (a, b) { return a.price - b.price; });
        case 'price-desc': return l.sort(function (a, b) { return b.price - a.price; });
        case 'rating': return l.sort(function (a, b) { return b.rating - a.rating || b.reviews - a.reviews; });
        case 'off': return l.sort(function (a, b) { return b.off - a.off; });
        case 'new': return l.sort(function (a, b) { return (b.isNew - a.isNew) || (b.id - a.id); });
        case 'pop': return l.sort(byPop);
        default: return l; // 'rel' keeps search ranking
      }
    }
    function title() {
      if (st.q) return 'Results for “' + esc(st.q) + '”';
      if (st.cat) return esc(D.catById[st.cat].name);
      if (st.dept) return esc(D.deptById[st.dept].name);
      if (st.deal) return 'Deals &amp; offers';
      if (st.brands.length === 1) return esc(st.brands[0]);
      return 'All products';
    }
    function plainTitle() {
      return st.q ? 'Search: ' + st.q : st.cat ? D.catById[st.cat].name : st.dept ? D.deptById[st.dept].name : st.deal ? 'Deals & offers' : 'Shop';
    }
    function url() {
      var p = new URLSearchParams();
      if (st.q) p.set('q', st.q);
      if (st.dept) p.set('dept', st.dept);
      if (st.cat) p.set('cat', st.cat);
      if (st.brands.length) p.set('brand', st.brands.join(','));
      if (st.min) p.set('min', st.min);
      if (st.max) p.set('max', st.max);
      if (st.deal) p.set('deal', '1');
      if (st.stock) p.set('stock', '1');
      if (st.rate) p.set('rate', '1');
      if (st.sort !== defSort()) p.set('sort', st.sort);
      var s = p.toString();
      return '#/shop' + (s ? '?' + s : '');
    }

    var catCounts = {}, deptCounts = {};
    function sum(o) { return Object.keys(o).reduce(function (n, k) { return n + o[k]; }, 0); }
    function countFacets() {
      catCounts = {}; deptCounts = {};
      base({ cat: true }).forEach(function (p) { catCounts[p.cat] = (catCounts[p.cat] || 0) + 1; });
      base({ cat: true, dept: true }).forEach(function (p) { deptCounts[p.dept] = (deptCounts[p.dept] || 0) + 1; });
    }
    function deptListHtml() {
      return '<label class="opt"><input type="radio" name="dept" value=""><span>All departments</span><em>' + sum(deptCounts) + '</em></label>' +
        D.DEPTS.map(function (d) {
          return '<label class="opt"><input type="radio" name="dept" value="' + d.id + '"><span>' + d.emoji + ' ' + esc(d.name) + '</span><em>' + (deptCounts[d.id] || 0) + '</em></label>';
        }).join('');
    }
    function catListHtml() {
      var cats = D.CATEGORIES.filter(function (c) { return !st.dept || c.dept === st.dept; });
      var total = cats.reduce(function (n, c) { return n + (catCounts[c.id] || 0); }, 0);
      return '<label class="opt"><input type="radio" name="cat" value=""><span>All categories</span><em>' + total + '</em></label>' +
        cats.map(function (c) {
          return '<label class="opt"><input type="radio" name="cat" value="' + c.id + '"><span>' + c.emoji + ' ' + esc(c.name) + '</span><em>' + (catCounts[c.id] || 0) + '</em></label>';
        }).join('');
    }
    countFacets();

    var filters = '<div class="filters-head"><h2>Filters</h2><button type="button" class="link" data-f="clear">Clear all</button><button type="button" class="icon-btn only-mobile" data-action="close-filters" aria-label="Close filters">' + icon('x') + '</button></div>' +
      '<fieldset class="fgroup"><legend>Department</legend><div id="dept-list">' + deptListHtml() + '</div></fieldset>' +
      '<fieldset class="fgroup"><legend>Category</legend><div id="cat-list">' + catListHtml() + '</div></fieldset>' +
      '<fieldset class="fgroup"><legend>Price (' + C.currency + ')</legend><div class="price-in"><input id="pmin" type="number" min="0" inputmode="decimal" placeholder="Min" aria-label="Minimum price"><span>–</span><input id="pmax" type="number" min="0" inputmode="decimal" placeholder="Max" aria-label="Maximum price"></div>' +
        '<div class="chips presets">' + PRICE_PRESETS.map(function (r) { return '<button type="button" class="chip" data-min="' + r[1] + '" data-max="' + r[2] + '">' + r[0] + '</button>'; }).join('') + '</div></fieldset>' +
      '<fieldset class="fgroup"><legend>Brand</legend>' + D.BRANDS.map(function (b) {
        return '<label class="opt"><input type="checkbox" name="brand" value="' + esc(b) + '"><span>' + esc(b) + '</span></label>';
      }).join('') + '</fieldset>' +
      '<fieldset class="fgroup"><legend>Show only</legend>' +
        '<label class="switch"><input type="checkbox" name="deal"><span class="sw"></span>On sale</label>' +
        '<label class="switch"><input type="checkbox" name="stock"><span class="sw"></span>In stock</label>' +
        '<label class="switch"><input type="checkbox" name="rate"><span class="sw"></span>Rated 4★ &amp; up</label></fieldset>' +
      '<div class="filters-foot only-mobile"><button type="button" class="btn btn-primary btn-block btn-lg" data-action="close-filters">Show <span id="fcount"></span> items</button></div>';

    var html = '<div class="container"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>' + icon('right') + '<span aria-current="page">Shop</span></nav>' +
      '<div class="shop-head"><h1 id="shop-title"></h1><p id="shop-count" aria-live="polite"></p></div>' +
      '<div class="shop" id="shop"><div class="scrim f-scrim" data-action="close-filters"></div>' +
      '<aside class="filters" id="filters" aria-label="Filters">' + filters + '</aside>' +
      '<section class="shop-main"><div class="toolbar">' +
        '<button type="button" class="btn btn-outline filter-toggle" data-action="open-filters">' + icon('filter') + ' Filters <span class="count" id="fbadge" hidden></span></button>' +
        '<div class="active-chips" id="chips"></div>' +
        '<label class="sort"><span>Sort by</span><select id="sort">' + SORTS.map(function (s) { return '<option value="' + s[0] + '">' + s[1] + '</option>'; }).join('') + '</select></label>' +
        '<div class="seg" role="group" aria-label="Layout"><button type="button" data-view="grid" aria-label="Grid view">' + icon('grid') + '</button><button type="button" data-view="list" aria-label="List view">' + icon('list') + '</button></div>' +
      '</div><div id="grid"></div><div id="more"></div></section></div></div>';

    return {
      title: plainTitle(), html: html,
      mount: function (root) {
        var shop = $('#shop', root), grid = $('#grid', root), moreEl = $('#more', root), chips = $('#chips', root), sortSel = $('#sort', root);
        var list = [], timer;

        function setUrl() { history.replaceState(null, '', url()); }
        /* department/category lists are re-rendered on every change (their counts move); keyboard focus is put back afterwards */
        function renderFacets() {
          var a = document.activeElement, key = null;
          if (a && a.matches && a.matches('input[type=radio]') && root.contains(a)) key = [a.name, a.value];
          $('#dept-list', root).innerHTML = deptListHtml();
          $('#cat-list', root).innerHTML = catListHtml();
          if (key) { var n = root.querySelector('input[name="' + key[0] + '"][value="' + key[1] + '"]'); if (n) n.focus({ preventScroll: true }); }
        }
        function syncUI() {
          $('#shop-title', root).innerHTML = title();
          $$('input[name=dept]', root).forEach(function (r) { r.checked = r.value === st.dept; });
          $$('input[name=cat]', root).forEach(function (r) { r.checked = r.value === st.cat; });
          $$('input[name=brand]', root).forEach(function (c) { c.checked = st.brands.indexOf(c.value) > -1; });
          ['deal', 'stock', 'rate'].forEach(function (k) { $('input[name=' + k + ']', root).checked = st[k]; });
          if (document.activeElement !== $('#pmin', root)) $('#pmin', root).value = st.min;
          if (document.activeElement !== $('#pmax', root)) $('#pmax', root).value = st.max;
          $$('.presets .chip', root).forEach(function (b) { b.classList.toggle('on', b.dataset.min === st.min && b.dataset.max === st.max); });
          sortSel.value = st.sort;
          $$('.seg button', root).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.view === st.view); });
          var q = $('#q'); if (q && document.activeElement !== q) q.value = st.q;
        }
        function chipsHtml() {
          var c = [];
          if (st.q) c.push(['q', 'Search: ' + st.q]);
          if (st.dept) c.push(['dept', D.deptById[st.dept].name]);
          if (st.cat) c.push(['cat', D.catById[st.cat].name]);
          st.brands.forEach(function (b) { c.push(['brand:' + b, b]); });
          if (st.min || st.max) c.push(['price', C.currency + ' ' + (st.min || '0') + (st.max ? ' – ' + st.max : '+')]);
          if (st.deal) c.push(['deal', 'On sale']);
          if (st.stock) c.push(['stock', 'In stock']);
          if (st.rate) c.push(['rate', '4★ & up']);
          $('#fbadge', root).textContent = c.length; $('#fbadge', root).hidden = !c.length;
          return c.map(function (x) { return '<button type="button" class="chip on rm" data-rm="' + esc(x[0]) + '">' + esc(x[1]) + ' ' + icon('x') + '</button>'; }).join('') +
            (c.length > 1 ? '<button type="button" class="link" data-f="clear">Clear all</button>' : '');
        }
        function emptyHtml() {
          return '<div class="empty"><div class="empty-ico" aria-hidden="true">🔍</div><h2>No products found</h2><p>' +
            (st.q ? 'We couldn\'t find anything for “' + esc(st.q) + '” with these filters.' : 'No products match these filters.') + ' Try removing a filter or browse a category.</p>' +
            '<div class="empty-actions"><button type="button" class="btn btn-primary" data-f="clear">Clear all filters</button><a class="btn btn-outline" href="#/shop">Browse everything</a></div></div>';
        }
        function moreHtml(shown) {
          if (!list.length) return '';
          return shown < list.length
            ? '<div class="load-more"><p>Showing ' + shown + ' of ' + list.length + '</p><div class="bar"><i style="width:' + Math.round(shown / list.length * 100) + '%"></i></div><button type="button" class="btn btn-outline btn-lg" data-f="more">Load more</button></div>'
            : '<p class="end">You\'ve seen all ' + list.length + ' item' + (list.length === 1 ? '' : 's') + '</p>';
        }
        function paint() {
          list = sorted(base());
          var shown = Math.min(list.length, st.page * C.pageSize);
          grid.innerHTML = list.length ? '<div class="pgrid' + (st.view === 'list' ? ' list' : '') + '">' + cards(list.slice(0, shown)) + '</div>' : emptyHtml();
          moreEl.innerHTML = moreHtml(shown);
          chips.innerHTML = chipsHtml();
          $('#shop-count', root).textContent = list.length + ' product' + (list.length === 1 ? '' : 's');
          $('#fcount', root).textContent = list.length;
          document.title = plainTitle() + ' · ' + C.name;
          countFacets(); renderFacets();
          syncUI(); U.syncControls();
        }
        function update(patch, keepPage) {
          Object.assign(st, patch);
          if (!keepPage) st.page = 1;
          if (st.sort === 'rel' && !st.q) st.sort = 'pop';
          setUrl(); paint();
        }
        function loadMore() {
          st.page++;
          var from = (st.page - 1) * C.pageSize, to = Math.min(list.length, st.page * C.pageSize);
          var g = $('.pgrid', grid), before = g.children.length;
          g.insertAdjacentHTML('beforeend', cards(list.slice(from, to)));
          moreEl.innerHTML = moreHtml(to);
          U.syncControls();
          var first = g.children[before]; if (first) { var a = $('a', first); if (a) a.focus({ preventScroll: true }); }
        }
        function clearAll() {
          st.dept = ''; st.cat = ''; st.brands = []; st.min = ''; st.max = ''; st.deal = st.stock = st.rate = false; st.q = '';
          st.sort = 'pop'; st.page = 1; setUrl(); paint();
        }
        function setSheet(open) {
          shop.classList.toggle('filters-open', open);
          document.body.classList.toggle('lock', open);
        }

        root.addEventListener('click', function (e) {
          var t = e.target.closest('[data-f],[data-rm],[data-view],[data-action],.presets .chip');
          if (!t) return;
          if (t.dataset.action === 'open-filters') { setSheet(true); return; }
          if (t.dataset.action === 'close-filters') { setSheet(false); return; }
          if (t.dataset.f === 'clear') { clearAll(); return; }
          if (t.dataset.f === 'more') { loadMore(); return; }
          if (t.dataset.view) {
            try { localStorage.setItem('freshnest.view', t.dataset.view); } catch (err) { /* ignore */ }
            update({ view: t.dataset.view }, true); return;
          }
          if (t.dataset.rm) {
            var k = t.dataset.rm;
            if (k === 'q') update({ q: '' });
            else if (k === 'dept') update({ dept: '' });
            else if (k === 'cat') update({ cat: '' });
            else if (k === 'price') update({ min: '', max: '' });
            else if (k.indexOf('brand:') === 0) update({ brands: st.brands.filter(function (b) { return b !== k.slice(6); }) });
            else { var patch = {}; patch[k] = false; update(patch); }
            return;
          }
          if (t.matches('.presets .chip')) {
            var on = t.dataset.min === st.min && t.dataset.max === st.max;
            update({ min: on ? '' : t.dataset.min, max: on ? '' : t.dataset.max });
          }
        });
        root.addEventListener('change', function (e) {
          var t = e.target;
          if (t.name === 'dept') update({ dept: t.value, cat: (st.cat && t.value && D.catById[st.cat].dept !== t.value) ? '' : st.cat });
          else if (t.name === 'cat') update({ cat: t.value });
          else if (t.name === 'brand') update({ brands: $$('input[name=brand]:checked', root).map(function (c) { return c.value; }) });
          else if (t.name === 'deal' || t.name === 'stock' || t.name === 'rate') { var p = {}; p[t.name] = t.checked; update(p); }
          else if (t.id === 'sort') update({ sort: t.value });
        });
        root.addEventListener('input', function (e) {
          if (e.target.id !== 'pmin' && e.target.id !== 'pmax') return;
          clearTimeout(timer);
          timer = setTimeout(function () { update({ min: $('#pmin', root).value, max: $('#pmax', root).value }); }, 350);
        });

        paint();
      },
      unmount: function () { document.body.classList.remove('lock'); }
    };
  };

  /* ================= PRODUCT ================= */
  var NAMES = ['Aisha K.', 'Omar S.', 'Priya N.', 'Daniel R.', 'Fatima A.', 'Lucas M.', 'Noor H.', 'Sanjay P.', 'Layla B.', 'Chris T.'];
  var GOOD = [
    ['Great quality', 'Arrived well packed and exactly as described.'],
    ['Will order again', 'Good value for the price and the delivery was right on time.'],
    ['Family favourite', 'Everyone at home loved it. It\'s now a regular on our weekly list.'],
    ['Better than the shop', 'Better quality than what I usually find in store. Very happy.'],
    ['Perfect', 'Just as described. Packaging was neat and nothing was damaged.']
  ];
  var OK = [['Decent', 'Good overall, though I\'d like a slightly bigger pack size.'], ['Fine', 'Does the job. Delivery was a little later than expected.']];
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function sampleReviews(p) {
    var r = rng(p.id), out = [], n = 5;
    for (var i = 0; i < n; i++) {
      var good = r() < (p.rating - 3) / 2.1;
      var pick = good ? GOOD[Math.floor(r() * GOOD.length)] : OK[Math.floor(r() * OK.length)];
      out.push({ name: NAMES[Math.floor(r() * NAMES.length)], stars: good ? (r() < 0.55 ? 5 : 4) : 3, title: pick[0], text: pick[1], ts: Date.now() - Math.floor(r() * 60 + 2) * 86400000, verified: true });
    }
    return out;
  }
  function dist(rating) {
    if (rating >= 4.8) return [78, 17, 3, 1, 1];
    if (rating >= 4.6) return [68, 24, 5, 2, 1];
    if (rating >= 4.4) return [58, 30, 8, 3, 1];
    if (rating >= 4.2) return [48, 32, 13, 5, 2];
    return [38, 32, 18, 8, 4];
  }
  function eta() {
    var now = new Date(), h = now.getHours() + now.getMinutes() / 60;
    if (h >= 7 && h < 21) {
      var left = 21 * 60 - (now.getHours() * 60 + now.getMinutes());
      return 'Order within <b>' + Math.floor(left / 60) + 'h ' + (left % 60) + 'm</b> for same-day delivery';
    }
    return 'Order now for delivery <b>tomorrow from 8:00</b>';
  }

  V.product = function (idStr) {
    var p = D.byId[idStr];
    if (!p) return V.notFound();
    S.pushRecent(p.id);
    var cat = D.catById[p.cat], dept = D.deptById[p.dept];
    var save = p.was ? p.was - p.price : 0;
    var related = D.PRODUCTS.filter(function (x) { return x.cat === p.cat && x.id !== p.id; }).sort(byPop).slice(0, 10);
    var sameBrand = D.PRODUCTS.filter(function (x) { return x.brand === p.brand && x.cat !== p.cat && x.id !== p.id; }).slice(0, 6);
    var recent = S.state.recent.filter(function (id) { return id !== p.id; }).map(function (id) { return D.byId[id]; }).filter(Boolean).slice(0, 8);
    var max = S.maxQty(p), rows = dist(p.rating);
    var thumbs = [0, 1, 2].map(function (v) {
      return '<button type="button" class="thumb' + (v === 0 ? ' on' : '') + '" data-v="' + v + '" aria-label="View image ' + (v + 1) + '" aria-pressed="' + (v === 0) + '">' + U.art(p, v) + '</button>';
    }).join('');

    var html = '<div class="container pdp-page">' +
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>' + icon('right') + '<a href="#/shop?dept=' + dept.id + '">' + esc(dept.name) + '</a>' + icon('right') + '<a href="#/shop?cat=' + cat.id + '">' + esc(cat.name) + '</a>' + icon('right') + '<span aria-current="page">' + esc(p.name) + '</span></nav>' +
      '<div class="pdp">' +
        '<div class="gallery"><div class="thumbs">' + thumbs + '</div><div class="main-art" id="main-art">' + U.art(p, 0, p.name) + '</div></div>' +
        '<div class="pdp-info">' +
          '<a class="pill" href="#/shop?cat=' + cat.id + '">' + cat.emoji + ' ' + esc(cat.name) + '</a>' +
          '<h1>' + esc(p.name) + '</h1>' +
          '<div class="meta"><a href="#/shop?brand=' + encodeURIComponent(p.brand) + '">' + esc(p.brand) + '</a><i></i>' + U.stars(p.rating) + '<b>' + p.rating.toFixed(1) + '</b><a href="#reviews" data-goto="reviews">' + p.reviews + ' reviews</a><i></i><span>SKU ' + p.id + '</span></div>' +
          '<p class="blurb">' + esc(p.blurb) + '</p>' +
          '<div class="buybox">' +
            '<div class="pdp-price"><span class="now num">' + money(p.price) + '</span>' + (p.was ? '<s class="old num">' + U.nf.format(p.was) + '</s><span class="badge badge-sale">Save ' + U.moneyText(save) + ' · ' + p.off + '%</span>' : '') + '</div>' +
            '<p class="unit">' + esc(p.unit) + ' · VAT included</p>' +
            '<p class="stock ' + (p.stock <= 0 ? 'out' : p.stock < 15 ? 'low' : 'ok') + '">' + (p.stock <= 0 ? 'Currently sold out' : p.stock < 15 ? 'Only ' + p.stock + ' left — order soon' : 'In stock') + '</p>' +
            (p.stock > 0 ?
              '<div class="buy-row"><div class="stepper stepper-lg" role="group" aria-label="Quantity"><button type="button" data-p="dec" aria-label="Decrease quantity">' + icon('minus') + '</button><output id="pqty" aria-live="polite">1</output><button type="button" data-p="inc" aria-label="Increase quantity">' + icon('plus') + '</button></div>' +
              '<button type="button" class="btn btn-primary btn-lg grow" data-p="add" id="padd"></button>' +
              '<button type="button" class="wish-btn big' + (S.isWished(p.id) ? ' on' : '') + '" data-action="wish" data-id="' + p.id + '" aria-pressed="' + S.isWished(p.id) + '" aria-label="Add to wishlist">' + icon('heart', S.isWished(p.id) ? 'filled' : '') + '</button></div>' +
              '<div class="buy-second"><button type="button" class="btn btn-outline" data-p="buynow">Buy now</button><button type="button" class="btn btn-ghost" data-action="share" data-title="' + esc(p.name) + '">' + icon('share') + ' Share</button></div>' +
              '<p class="incart" id="incart" hidden></p>'
              : '<div class="buy-row"><button type="button" class="btn btn-outline btn-lg grow" disabled>Sold out</button><button type="button" class="wish-btn big' + (S.isWished(p.id) ? ' on' : '') + '" data-action="wish" data-id="' + p.id + '" aria-pressed="' + S.isWished(p.id) + '" aria-label="Add to wishlist">' + icon('heart', S.isWished(p.id) ? 'filled' : '') + '</button></div><p class="incart">Save it to your wishlist and we\'ll keep it handy for when it\'s back.</p>') +
            '<p class="eta">' + icon('clock') + '<span>' + eta() + '</span></p>' +
          '</div>' +
          '<ul class="perks"><li>' + icon('truck') + '<div><b>Free delivery over ' + U.moneyText(C.freeDeliveryAt) + '</b><small>Or ' + U.moneyText(C.deliveryFee) + ' flat rate below that</small></div></li>' +
          '<li>' + icon('shield') + '<div><b>Quality guarantee</b><small>Replacement or refund, no questions asked</small></div></li>' +
          '<li>' + icon('refresh') + (p.dept === 'grocery' ? '<div><b>Easy substitutions</b><small>Tell us what you prefer in the order notes</small></div>' : '<div><b>Easy returns</b><small>Return unopened items within 14 days</small></div>') + '</li></ul>' +
        '</div>' +
      '</div>' +

      '<section class="pdp-tabs" id="tabs"><div class="tabs" role="tablist" aria-label="Product information">' +
        '<button role="tab" id="t-desc" aria-selected="true" aria-controls="p-desc">Description</button>' +
        '<button role="tab" id="t-det" aria-selected="false" aria-controls="p-det" tabindex="-1">Details</button>' +
        '<button role="tab" id="t-rev" aria-selected="false" aria-controls="p-rev" tabindex="-1">Reviews <span class="count">' + p.reviews + '</span></button></div>' +
        '<div class="tab-panel" id="p-desc" role="tabpanel" aria-labelledby="t-desc"><p>' + esc(p.blurb) + ' Supplied by ' + esc(p.brand) + ' and quality-checked at our fulfilment centre before it reaches you.</p><p>' + esc(cat.note) + '</p>' +
          '<ul class="ticks"><li>Quality checked before dispatch</li><li>Packed securely for delivery</li><li>Covered by our quality guarantee</li></ul></div>' +
        '<div class="tab-panel" id="p-det" role="tabpanel" aria-labelledby="t-det" hidden><table class="spec"><tbody>' +
          [['Brand', p.brand], ['Pack size', p.unit], ['Department', dept.name], ['Category', cat.name], ['Product code', String(p.id)]].concat(cat.spec)
            .map(function (r) { return '<tr><th scope="row">' + r[0] + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
        '<div class="tab-panel" id="p-rev" role="tabpanel" aria-labelledby="t-rev" hidden>' +
          '<div class="rev-top"><div class="rev-score"><b class="num">' + p.rating.toFixed(1) + '</b>' + U.stars(p.rating) + '<small>' + p.reviews + ' ratings</small></div>' +
          '<div class="rev-bars">' + rows.map(function (v, i) { return '<div><span>' + (5 - i) + '★</span><div class="bar"><i style="width:' + v + '%"></i></div><small class="num">' + v + '%</small></div>'; }).join('') + '</div>' +
          '<form class="rev-form" id="rev-form" novalidate><h3>Write a review</h3>' +
            '<div class="star-pick" role="radiogroup" aria-label="Your rating">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" role="radio" aria-checked="false" data-star="' + n + '" aria-label="' + n + ' star' + (n > 1 ? 's' : '') + '">★</button>'; }).join('') + '</div>' +
            '<label class="field"><span>Your name</span><input name="name" autocomplete="name" maxlength="40" required></label>' +
            '<label class="field"><span>Your review</span><textarea name="text" rows="3" maxlength="500" required></textarea></label>' +
            '<p class="form-err" id="rev-err" role="alert" hidden></p><button class="btn btn-primary" type="submit">Submit review</button></form></div>' +
          '<div class="rev-list" id="rev-list"></div></div>' +
      '</section>' +

      (related.length ? '<section class="section">' + head('You might also like', 'More from ' + esc(cat.name), more('#/shop?cat=' + cat.id)) + '<div class="scroller">' + cards(related) + '</div></section>' : '') +
      (sameBrand.length ? '<section class="section">' + head('More from ' + esc(p.brand)) + '<div class="scroller">' + cards(sameBrand) + '</div></section>' : '') +
      (recent.length ? '<section class="section">' + head('Recently viewed') + '<div class="scroller">' + cards(recent) + '</div></section>' : '') +
    '</div>' +

    (p.stock > 0 ? '<div class="sticky-buy" id="sticky-buy"><div><b class="num">' + money(p.price) + '</b><small>' + esc(p.name) + '</small></div><button type="button" class="btn btn-primary btn-lg" data-p="add" id="padd2"></button></div>' : '');

    return {
      title: p.name, html: html,
      mount: function (root) {
        var qty = 1, rating = 0;
        var qEl = $('#pqty', root), addBtns = $$('[data-p=add]', root);

        function paintAdd() {
          if (qEl) qEl.textContent = qty;
          addBtns.forEach(function (b) { b.innerHTML = icon('cart') + ' <span>Add to cart</span><span class="add-total"> · ' + U.moneyText(p.price * qty) + '</span>'; });
          var inCart = S.qty(p.id), n = $('#incart', root);
          if (n && p.stock > 0) { n.hidden = !inCart; n.innerHTML = inCart ? icon('check') + ' ' + inCart + ' in your cart · <a href="#/cart">View cart</a>' : ''; }
        }
        function add(go) {
          var have = S.qty(p.id);
          if (have >= max) { U.toast('You already have the maximum available (' + max + ')'); return; }
          var next = Math.min(max, have + qty);
          S.setQty(p.id, next);
          U.cartBump();
          qty = 1; paintAdd();
          if (go) { location.hash = '#/checkout'; return; }
          U.toast((next - have) + ' × ' + p.name + ' added', { action: 'View cart', onAction: function () { U.openCart(); } });
        }
        root.addEventListener('click', function (e) {
          var t = e.target.closest('[data-p],.thumb,[data-goto],[data-star]');
          if (!t) return;
          if (t.dataset.p === 'inc') { if (qty < max) qty++; else U.toast('Maximum ' + max + ' per order'); paintAdd(); }
          else if (t.dataset.p === 'dec') { qty = Math.max(1, qty - 1); paintAdd(); }
          else if (t.dataset.p === 'add') add(false);
          else if (t.dataset.p === 'buynow') add(true);
          else if (t.classList.contains('thumb')) {
            $$('.thumb', root).forEach(function (b) { var on = b === t; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
            $('#main-art', root).innerHTML = U.art(p, +t.dataset.v, p.name);
          } else if (t.dataset.goto) {
            e.preventDefault(); selectTab('t-rev');
            $('#tabs', root).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
          } else if (t.dataset.star) {
            rating = +t.dataset.star;
            $$('.star-pick button', root).forEach(function (b) { var on = +b.dataset.star <= rating; b.classList.toggle('on', on); b.setAttribute('aria-checked', +b.dataset.star === rating); });
          }
        });

        /* tabs */
        var tabBtns = $$('[role=tab]', root);
        function selectTab(id) {
          tabBtns.forEach(function (b) {
            var on = b.id === id;
            b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
            $('#' + b.getAttribute('aria-controls'), root).hidden = !on;
          });
        }
        tabBtns.forEach(function (b, i) {
          b.addEventListener('click', function () { selectTab(b.id); });
          b.addEventListener('keydown', function (e) {
            var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null;
            if (n === null) return;
            var tgt = tabBtns[(n + tabBtns.length) % tabBtns.length]; tgt.focus(); selectTab(tgt.id);
          });
        });

        /* reviews */
        function paintReviews() {
          var mine = S.state.reviews[p.id] || [];
          $('#rev-list', root).innerHTML = mine.concat(sampleReviews(p)).map(function (r) {
            return '<article class="review"><header><span class="avatar" aria-hidden="true">' + esc(r.name.charAt(0)) + '</span><div><b>' + esc(r.name) + '</b>' + (r.verified ? '<small>Verified buyer</small>' : '<small>Your review</small>') + '</div><time>' + U.ago(r.ts) + '</time></header>' +
              U.stars(r.stars) + (r.title ? '<h4>' + esc(r.title) + '</h4>' : '') + '<p>' + esc(r.text) + '</p></article>';
          }).join('');
        }
        var form = $('#rev-form', root), err = $('#rev-err', root);
        var u = S.state.user; if (u) form.elements.name.value = u.name;
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var name = form.elements.name.value.trim(), text = form.elements.text.value.trim(), msg = '';
          if (!rating) msg = 'Please choose a star rating.'; else if (!name) msg = 'Please enter your name.'; else if (text.length < 5) msg = 'Please write a few words about the product.';
          err.hidden = !msg; err.textContent = msg;
          if (msg) return;
          S.addReview(p.id, { name: name, text: text, stars: rating, ts: Date.now(), title: '' });
          form.reset(); rating = 0; $$('.star-pick button', root).forEach(function (b) { b.classList.remove('on'); b.setAttribute('aria-checked', 'false'); });
          paintReviews(); U.toast('Thanks for your review!');
        });

        paintReviews(); paintAdd();
        this.onStore = paintAdd;
      }
    };
  };

  V.notFound = function () {
    return {
      title: 'Page not found',
      html: '<div class="container"><div class="empty tall"><div class="empty-ico" aria-hidden="true">🥕</div><h1>We couldn\'t find that page</h1><p>The link may be old, or the product may no longer be on our shelves.</p><div class="empty-actions"><a class="btn btn-primary" href="#/">Back to home</a><a class="btn btn-outline" href="#/shop">Browse products</a></div></div></div>'
    };
  };
})();
