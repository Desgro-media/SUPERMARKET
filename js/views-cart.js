/* Views: cart, checkout, order confirmation, orders, wishlist, account. */
(function () {
  var C = window.CONFIG, D = window.DATA, S = window.Store, U = window.UI, V = window.Views;
  var esc = U.esc, icon = U.icon, money = U.money, $ = U.$, $$ = U.$$;

  /* ---------- shared bits (also used by the cart drawer) ---------- */
  function cartLine(l) {
    var p = l.p;
    return '<li class="cart-line"><a class="cl-art" href="#/product/' + p.id + '" tabindex="-1" aria-hidden="true">' + U.art(p) + '</a>' +
      '<div class="cl-body"><a class="cl-name" href="#/product/' + p.id + '">' + esc(p.name) + '</a>' +
      '<small>' + esc(p.unit) + ' · ' + money(p.price) + ' each</small>' + U.ctl(p) + '</div>' +
      '<div class="cl-end"><b class="num">' + money(l.total) + '</b><button type="button" class="icon-btn sm" data-action="remove" data-id="' + p.id + '" aria-label="Remove ' + esc(p.name) + ' from cart">' + icon('trash') + '</button></div></li>';
  }
  function shipMeter(t) {
    if (!t.count) return '';
    if (t.freeShip || t.toFree <= 0) return '<div class="meter ok"><p>' + icon('truck') + ' <b>You\'ve unlocked free delivery!</b></p><div class="bar"><i style="width:100%"></i></div></div>';
    return '<div class="meter"><p>' + icon('truck') + ' Add <b>' + U.moneyText(t.toFree) + '</b> more for <b>free delivery</b></p><div class="bar"><i style="width:' + Math.min(100, Math.round(t.subtotal / C.freeDeliveryAt * 100)) + '%"></i></div></div>';
  }
  function rows(t) {
    var r = '<div class="row"><span>Subtotal (' + t.count + ' item' + (t.count === 1 ? '' : 's') + ')</span><b class="num">' + money(t.subtotal) + '</b></div>';
    if (t.discount > 0) r += '<div class="row good"><span>Promo ' + esc(t.promoCode) + '</span><b class="num">−' + money(t.discount) + '</b></div>';
    r += '<div class="row"><span>Delivery</span><b class="num">' + (t.delivery ? money(t.delivery) : '<span class="free">Free</span>') + '</b></div>';
    if (t.express) r += '<div class="row"><span>Express 60-min</span><b class="num">' + money(t.express) + '</b></div>';
    r += '<div class="row total"><span>Total</span><b class="num">' + money(t.total) + '</b></div>';
    if (t.savings > 0) r += '<p class="saved">' + icon('tag') + ' You\'re saving ' + U.moneyText(t.savings + t.discount) + ' on this order</p>';
    return r;
  }
  V.cartParts = { line: cartLine, meter: shipMeter, rows: rows };

  function suggestions(n) {
    var inCart = S.state.cart;
    return D.PRODUCTS.filter(function (p) { return !inCart[p.id] && p.stock > 0; }).sort(function (a, b) { return b.pop - a.pop; }).slice(0, n);
  }

  /* ================= CART ================= */
  V.cart = function () {
    function dyn() {
      var t = S.totals();
      if (!t.count) {
        return '<div class="empty tall"><div class="empty-ico" aria-hidden="true">🛒</div><h2>Your cart is empty</h2><p>Add a few things you need to get started — your basket is saved on this device.</p><div class="empty-actions"><a class="btn btn-primary btn-lg" href="#/shop">Start shopping</a></div></div>';
      }
      var promoHtml = t.promoCode
        ? '<div class="promo-on">' + icon('tag') + '<span><b>' + esc(t.promoCode) + '</b> applied</span><button type="button" class="link" data-action="promo-remove">Remove</button></div>' + (t.promoNote ? '<p class="note">' + esc(t.promoNote) + '</p>' : '')
        : '<form class="promo-form" data-promo><label class="sr" for="promo-in">Promo code</label><input id="promo-in" placeholder="Promo code" autocomplete="off" spellcheck="false"><button class="btn btn-outline" type="submit">Apply</button></form><p class="hint">Try <button type="button" class="link" data-fill="SAVE10">SAVE10</button></p>';
      return '<div class="cart-layout"><section class="cart-main">' + shipMeter(t) +
        '<ul class="cart-lines">' + t.items.map(cartLine).join('') + '</ul>' +
        '<div class="cart-actions"><a class="link" href="#/shop">' + icon('left') + ' Continue shopping</a><button type="button" class="link danger" data-action="clear-cart">Clear cart</button></div></section>' +
        '<aside class="summary" aria-label="Order summary"><h2>Order summary</h2>' + promoHtml + '<div class="rows">' + rows(t) + '</div>' +
        '<a class="btn btn-primary btn-lg btn-block" href="#/checkout">Go to checkout ' + icon('arrow') + '</a>' +
        '<ul class="secure"><li>' + icon('shield') + ' Pay on delivery — cash or card</li><li>' + icon('refresh') + ' Easy returns on every order</li></ul></aside></div>';
    }
    var html = '<div class="container"><h1 class="page-title">Your cart</h1><div id="cart-dyn">' + dyn() + '</div>' +
      '<section class="section" id="cart-sugg">' + '<div class="section-head"><div><h2>Complete your basket</h2><p>Popular picks to go with your order</p></div></div><div class="scroller">' + suggestions(8).map(U.card).join('') + '</div></section></div>';
    return {
      title: 'Your cart', html: html,
      mount: function (root) {
        var wrap = $('#cart-dyn', root);
        function paint() { U.keepFocus(wrap, function () { wrap.innerHTML = dyn(); }); }
        this.onStore = paint;
        wrap.addEventListener('submit', function (e) {
          if (!e.target.matches('[data-promo]')) return;
          e.preventDefault();
          var r = S.applyPromo($('#promo-in', wrap).value);
          U.toast(r.msg);
        });
        wrap.addEventListener('click', function (e) {
          var f = e.target.closest('[data-fill]');
          if (f) { var i = $('#promo-in', wrap); i.value = f.dataset.fill; i.focus(); }
        });
      }
    };
  };

  /* ================= CHECKOUT ================= */
  var PHONE = /^[+\d][\d\s-]{7,16}$/;
  function field(id, label, opts) {
    opts = opts || {};
    return '<div class="field' + (opts.cls ? ' ' + opts.cls : '') + '"><label for="' + id + '">' + label + (opts.req ? ' <i aria-hidden="true">*</i>' : '') + '</label>' +
      '<input id="' + id + '" name="' + id + '" type="' + (opts.type || 'text') + '"' + (opts.ac ? ' autocomplete="' + opts.ac + '"' : '') + (opts.mode ? ' inputmode="' + opts.mode + '"' : '') + (opts.req ? ' required' : '') + ' aria-describedby="' + id + '-err">' +
      '<small class="err" id="' + id + '-err" role="alert"></small></div>';
  }
  function slotOk(slot, day) {
    if (day === 'tomorrow') return true;
    var h = parseInt(slot, 10), now = new Date();
    return h * 60 >= now.getHours() * 60 + now.getMinutes() + 60;
  }
  function openHours() { var h = new Date().getHours(); return h >= 7 && h < 21; }

  V.checkout = function () {
    var t0 = S.totals();
    if (!t0.count) {
      return { title: 'Checkout', html: '<div class="container"><div class="empty tall"><div class="empty-ico" aria-hidden="true">🛒</div><h1>Nothing to check out yet</h1><p>Your cart is empty. Add a few items and come back.</p><div class="empty-actions"><a class="btn btn-primary btn-lg" href="#/shop">Start shopping</a></div></div></div>' };
    }
    var u = S.state.user, a = S.state.addr || {};
    var today = C.slots.some(function (s) { return slotOk(s, 'today'); });
    var expressOk = openHours();

    var html = '<div class="container"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/cart">Cart</a>' + icon('right') + '<span aria-current="page">Checkout</span></nav><h1 class="page-title">Checkout</h1>' +
      '<div class="checkout"><form id="co" novalidate class="co-form">' +
      '<section class="step"><h2><span class="n">1</span> Contact</h2><div class="grid2">' +
        field('name', 'Full name', { req: 1, ac: 'name' }) + field('phone', 'Mobile number', { req: 1, ac: 'tel', type: 'tel', mode: 'tel' }) +
        field('email', 'Email (for your receipt)', { type: 'email', ac: 'email', cls: 'span2' }) + '</div></section>' +
      '<section class="step"><h2><span class="n">2</span> Delivery address</h2><div class="grid2">' +
        '<div class="field"><label for="area">City <i aria-hidden="true">*</i></label><select id="area" name="area" required>' + C.areas.map(function (x) { return '<option>' + x + '</option>'; }).join('') + '</select></div>' +
        field('street', 'Street / neighbourhood', { req: 1, ac: 'address-line1' }) +
        field('building', 'Building, floor &amp; flat', { req: 1, ac: 'address-line2' }) +
        field('landmark', 'Nearest landmark (optional)') + '</div></section>' +
      '<section class="step"><h2><span class="n">3</span> Delivery time</h2>' +
        '<div class="opt-cards" role="radiogroup" aria-label="Delivery type">' +
          '<label class="opt-card"><input type="radio" name="dtype" value="slot" checked><span><b>Scheduled</b><small>Pick a time that suits you · ' + (t0.delivery ? U.moneyText(t0.delivery) : 'Free') + '</small></span></label>' +
          '<label class="opt-card' + (expressOk ? '' : ' off') + '"><input type="radio" name="dtype" value="express"' + (expressOk ? '' : ' disabled') + '><span><b>Express ' + icon('zap', 'accent') + '</b><small>' + (expressOk ? 'Within 60 minutes · +' + U.moneyText(C.expressFee) : 'Available 7:00 – 21:00') + '</small></span></label></div>' +
        '<div id="slot-box"><div class="seg-days" role="radiogroup" aria-label="Delivery day"><label><input type="radio" name="day" value="today"' + (today ? ' checked' : ' disabled') + '><span>Today</span></label><label><input type="radio" name="day" value="tomorrow"' + (today ? '' : ' checked') + '><span>Tomorrow</span></label></div>' +
        '<div class="slots" id="slots" role="radiogroup" aria-label="Time slot"></div></div></section>' +
      '<section class="step"><h2><span class="n">4</span> Payment</h2><div class="opt-cards" role="radiogroup" aria-label="Payment method">' +
        '<label class="opt-card"><input type="radio" name="pay" value="Cash on delivery" checked><span><b>Cash on delivery</b><small>Pay the driver when your order arrives</small></span></label>' +
        '<label class="opt-card"><input type="radio" name="pay" value="Card on delivery"><span><b>Card on delivery</b><small>Driver brings a card machine</small></span></label></div>' +
        '<p class="hint">Online card payment isn\'t part of this demo, so no card details are collected.</p></section>' +
      '<section class="step"><h2><span class="n">5</span> Notes <small>(optional)</small></h2><div class="field"><label class="sr" for="notes">Order notes</label><textarea id="notes" name="notes" rows="3" maxlength="300" placeholder="Substitution preferences, gate code, ring the bell…"></textarea></div></section>' +
      '</form><aside class="summary sticky" aria-label="Order summary"><h2>Order summary</h2><ul class="mini-lines">' +
        t0.items.map(function (l) { return '<li><span class="mini-art" aria-hidden="true">' + l.p.emoji + '</span><span class="mini-name">' + esc(l.p.name) + '<small>' + l.qty + ' × ' + esc(l.p.unit) + '</small></span><b class="num">' + money(l.total) + '</b></li>'; }).join('') + '</ul>' +
        '<div class="rows" id="co-rows"></div><p class="form-err" id="co-err" role="alert" hidden></p>' +
        '<button class="btn btn-primary btn-lg btn-block" type="submit" form="co" id="place">Place order</button>' +
        '<p class="fine">By placing your order you agree to our terms. Prices include VAT.</p></aside></div></div>';

    return {
      title: 'Checkout', html: html,
      mount: function (root) {
        var form = $('#co', root), slotsEl = $('#slots', root), rowsEl = $('#co-rows', root), placed = false;
        function v(n) { return form.elements[n].value.trim(); }
        function express() { return form.elements.dtype.value === 'express'; }
        function paintRows() { rowsEl.innerHTML = rows(S.totals({ express: express() })); }
        function paintSlots() {
          var day = form.elements.day.value, firstOk = null;
          slotsEl.innerHTML = C.slots.map(function (s) {
            var ok = slotOk(s, day); if (ok && !firstOk) firstOk = s;
            return '<label class="slot' + (ok ? '' : ' off') + '"><input type="radio" name="slot" value="' + s + '"' + (ok ? '' : ' disabled') + '><span>' + s + '</span></label>';
          }).join('');
          if (firstOk) form.querySelector('input[name=slot][value="' + firstOk + '"]').checked = true;
          $('#slot-box', root).classList.toggle('off', express());
        }
        // prefill
        if (u) form.elements.name.value = u.name;
        if (u && u.contact && /@/.test(u.contact)) form.elements.email.value = u.contact;
        if (u && u.contact && !/@/.test(u.contact)) form.elements.phone.value = u.contact;
        if (a.name) form.elements.name.value = a.name;
        if (a.phone) form.elements.phone.value = a.phone;
        if (a.email) form.elements.email.value = a.email;
        form.elements.area.value = a.area || S.state.area || C.areas[0];
        if (a.street) form.elements.street.value = a.street;
        if (a.building) form.elements.building.value = a.building;
        if (a.landmark) form.elements.landmark.value = a.landmark;
        paintSlots(); paintRows();
        form.addEventListener('change', function (e) {
          if (e.target.name === 'day') paintSlots();
          if (e.target.name === 'dtype') { paintRows(); $('#slot-box', root).classList.toggle('off', express()); }
        });

        function check(name) {
          var el = form.elements[name], val = el.value.trim(), msg = '';
          if (el.required && !val) msg = 'This field is required';
          else if (name === 'phone' && !PHONE.test(val)) msg = 'Enter a valid mobile number';
          else if (name === 'email' && val && !/^\S+@\S+\.\S+$/.test(val)) msg = 'Enter a valid email address';
          el.setAttribute('aria-invalid', !!msg);
          $('#' + name + '-err', root).textContent = msg;
          return !msg;
        }
        ['name', 'phone', 'email', 'street', 'building'].forEach(function (n) {
          form.elements[n].addEventListener('blur', function () { check(n); });
          form.elements[n].addEventListener('input', function () { if (form.elements[n].getAttribute('aria-invalid') === 'true') check(n); });
        });

        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var bad = ['name', 'phone', 'email', 'street', 'building'].filter(function (n) { return !check(n); });
          var err = $('#co-err', root);
          if (bad.length) {
            err.hidden = false; err.textContent = 'Please fix the highlighted fields.';
            form.elements[bad[0]].focus(); return;
          }
          if (!express() && !form.elements.slot.value) { err.hidden = false; err.textContent = 'Please choose a delivery time slot.'; return; }
          err.hidden = true;
          var addr = { name: v('name'), phone: v('phone'), email: v('email'), area: v('area'), street: v('street'), building: v('building'), landmark: v('landmark') };
          S.saveAddress(addr);
          var day = form.elements.day.value;
          placed = true; // stops onStore redirecting to the (now empty) cart
          var order = S.placeOrder({
            express: express(), customer: { name: addr.name, phone: addr.phone, email: addr.email },
            address: { area: addr.area, street: addr.street, building: addr.building, landmark: addr.landmark },
            slot: express() ? 'Express · within 60 minutes' : (day === 'today' ? 'Today' : 'Tomorrow') + ', ' + form.elements.slot.value,
            payment: form.elements.pay.value, notes: v('notes')
          });
          location.hash = '#/order/' + order.id;
        });
        this.onStore = function () {
          if (placed) return;
          if (!S.totals().count) location.hash = '#/cart'; else paintRows();
        };
      }
    };
  };

  /* ================= ORDER CONFIRMATION ================= */
  var STAGES = [['Order placed', 'We\'ve got your order'], ['Packing', 'Our team is picking your items'], ['On the way', 'Your driver is heading to you'], ['Delivered', 'Enjoy your groceries!']];
  function stageOf(o) {
    var e = (Date.now() - o.ts) / 1000;
    return e < 12 ? 0 : e < 40 ? 1 : e < 90 ? 2 : 3;
  }
  function orderBody(o) {
    var t = o.totals;
    return '<div class="od-grid"><section class="card-box"><h2>Items</h2><ul class="mini-lines">' +
      o.items.map(function (i) { return '<li><span class="mini-art" aria-hidden="true">' + i.emoji + '</span><span class="mini-name">' + esc(i.name) + '<small>' + i.qty + ' × ' + esc(i.unit) + '</small></span><b class="num">' + money(i.price * i.qty) + '</b></li>'; }).join('') + '</ul></section>' +
      '<section class="card-box"><h2>Delivery</h2><dl class="kv"><dt>When</dt><dd>' + esc(o.slot) + '</dd><dt>Address</dt><dd>' + esc(o.address.building) + ', ' + esc(o.address.street) + ', ' + esc(o.address.area) + (o.address.landmark ? '<br><small>Near ' + esc(o.address.landmark) + '</small>' : '') + '</dd><dt>Contact</dt><dd>' + esc(o.customer.name) + ' · ' + esc(o.customer.phone) + '</dd><dt>Payment</dt><dd>' + esc(o.payment) + '</dd>' + (o.notes ? '<dt>Notes</dt><dd>' + esc(o.notes) + '</dd>' : '') + '</dl>' +
      '<div class="rows"><div class="row"><span>Subtotal</span><b class="num">' + money(t.subtotal) + '</b></div>' + (t.discount > 0 ? '<div class="row good"><span>Promo ' + esc(t.promo) + '</span><b class="num">−' + money(t.discount) + '</b></div>' : '') +
      '<div class="row"><span>Delivery</span><b class="num">' + (t.delivery ? money(t.delivery) : '<span class="free">Free</span>') + '</b></div>' + (t.express ? '<div class="row"><span>Express</span><b class="num">' + money(t.express) + '</b></div>' : '') +
      '<div class="row total"><span>Total</span><b class="num">' + money(t.total) + '</b></div></div></section></div>';
  }
  function tracker(stage) {
    return '<ol class="tracker" aria-label="Order progress">' + STAGES.map(function (s, i) {
      return '<li class="' + (i < stage ? 'done' : i === stage ? 'now' : '') + '"' + (i === stage ? ' aria-current="step"' : '') + '><span class="dot">' + (i < stage || stage === 3 ? icon('check') : i + 1) + '</span><b>' + s[0] + '</b><small>' + s[1] + '</small></li>';
    }).join('') + '</ol>';
  }

  V.order = function (id) {
    var o = S.order(id);
    if (!o) return V.notFound();
    var timer;
    var html = '<div class="container narrow"><div class="thanks"><div class="tick" aria-hidden="true">' + icon('check') + '</div><h1>Thank you, ' + esc(o.customer.name.split(' ')[0]) + '!</h1>' +
      '<p>Order <b>#' + esc(o.id) + '</b> is confirmed. ' + (o.customer.email ? 'A receipt is on its way to ' + esc(o.customer.email) + '.' : '') + '</p></div>' +
      '<div class="card-box"><div id="track">' + tracker(stageOf(o)) + '</div><p class="fine">Tracking in this demo advances automatically over a couple of minutes.</p></div>' +
      orderBody(o) +
      '<div class="empty-actions"><a class="btn btn-primary btn-lg" href="#/shop">Continue shopping</a><a class="btn btn-outline btn-lg" href="#/orders">All my orders</a></div></div>';
    return {
      title: 'Order #' + o.id, html: html,
      mount: function (root) {
        var track = $('#track', root), last = stageOf(o);
        timer = setInterval(function () { var s = stageOf(o); if (s !== last) { last = s; track.innerHTML = tracker(s); } if (s === 3) clearInterval(timer); }, 3000);
      },
      unmount: function () { clearInterval(timer); }
    };
  };

  /* ================= ORDERS ================= */
  V.orders = function () {
    var list = S.state.orders;
    var html = '<div class="container narrow"><h1 class="page-title">My orders</h1>' + (list.length ? '<ul class="orders">' + list.map(function (o) {
      var st = stageOf(o), n = o.items.reduce(function (a, i) { return a + i.qty; }, 0);
      return '<li class="card-box order-row"><div class="or-top"><div><b>#' + esc(o.id) + '</b><small>' + U.ago(o.ts) + ' · ' + n + ' item' + (n === 1 ? '' : 's') + '</small></div><span class="status s' + st + '">' + STAGES[st][0] + '</span></div>' +
        '<div class="or-emojis" aria-hidden="true">' + o.items.slice(0, 8).map(function (i) { return '<span>' + i.emoji + '</span>'; }).join('') + (o.items.length > 8 ? '<span class="more">+' + (o.items.length - 8) + '</span>' : '') + '</div>' +
        '<div class="or-bot"><b class="num">' + money(o.totals.total) + '</b><div><button type="button" class="btn btn-outline btn-sm" data-reorder="' + esc(o.id) + '">' + icon('refresh') + ' Reorder</button> <a class="btn btn-primary btn-sm" href="#/order/' + esc(o.id) + '">View</a></div></div></li>';
    }).join('') + '</ul>' : '<div class="empty tall"><div class="empty-ico" aria-hidden="true">📦</div><h2>No orders yet</h2><p>When you place an order it will show up here, ready to reorder in one tap.</p><div class="empty-actions"><a class="btn btn-primary btn-lg" href="#/shop">Start shopping</a></div></div>') + '</div>';
    return {
      title: 'My orders', html: html,
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var b = e.target.closest('[data-reorder]'); if (!b) return;
          var o = S.order(b.dataset.reorder), added = 0;
          o.items.forEach(function (i) { var p = D.byId[i.id]; if (p && p.stock > 0) { S.setQty(p.id, Math.max(S.qty(p.id), i.qty)); added++; } });
          U.cartBump();
          U.toast(added ? added + ' item' + (added === 1 ? '' : 's') + ' added to your cart' : 'Those items are currently unavailable', added ? { action: 'View cart', onAction: function () { U.openCart(); } } : null);
        });
      }
    };
  };

  /* ================= WISHLIST ================= */
  V.wishlist = function () {
    function body() {
      var items = S.state.wish.map(function (id) { return D.byId[id]; }).filter(Boolean);
      if (!items.length) return '<div class="empty tall"><div class="empty-ico" aria-hidden="true">💚</div><h2>Your wishlist is empty</h2><p>Tap the heart on any product to save it here for later.</p><div class="empty-actions"><a class="btn btn-primary btn-lg" href="#/shop">Discover products</a></div></div>';
      return '<div class="wl-bar"><p>' + items.length + ' saved item' + (items.length === 1 ? '' : 's') + '</p><button type="button" class="btn btn-primary" data-action="wish-all">' + icon('cart') + ' Add all to cart</button></div><div class="pgrid">' + items.map(U.card).join('') + '</div>';
    }
    return {
      title: 'Wishlist', html: '<div class="container"><h1 class="page-title">Wishlist</h1><div id="wl">' + body() + '</div></div>',
      mount: function (root) {
        var wl = $('#wl', root), count = S.state.wish.length;
        // re-render only when the list itself changes (hearts toggle in place otherwise)
        this.onStore = function () { if (S.state.wish.length !== count) { count = S.state.wish.length; wl.innerHTML = body(); U.syncControls(); } };
      }
    };
  };

  /* ================= ACCOUNT ================= */
  V.account = function () {
    var u = S.state.user, a = S.state.addr, theme = S.state.theme, pal = S.state.palette || 'ocean';
    var prefs = '<section class="card-box"><h2>Preferences</h2><div class="pref"><span>Appearance</span><div class="seg" role="group" aria-label="Theme">' +
      [['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']].map(function (x) { return '<button type="button" data-theme-set="' + x[0] + '" aria-pressed="' + (theme === x[0]) + '">' + x[1] + '</button>'; }).join('') + '</div></div>' +
      (C.paletteSwitcher ? '<div class="pref"><span>Colour theme</span><div class="swatches" role="radiogroup" aria-label="Colour theme">' + C.palettes.map(function (x) {
        return '<button type="button" role="radio" aria-checked="' + (pal === x.id) + '" data-palette-set="' + x.id + '" style="--sw:' + x.color + '" aria-label="' + esc(x.name) + '" title="' + esc(x.name) + '"></button>';
      }).join('') + '</div></div>' : '') +
      '<div class="pref"><span>Delivery city</span><select id="pref-area" aria-label="Delivery city">' + C.areas.map(function (x) { return '<option' + (x === (S.state.area || C.areas[0]) ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select></div></section>';
    var html;
    if (!u) {
      html = '<div class="container narrow"><h1 class="page-title">My account</h1><div class="card-box signin-card"><div class="empty-ico" aria-hidden="true">👋</div><h2>Welcome to ' + esc(C.name) + '</h2><p>Sign in to check out faster and keep your orders together. This demo stores your details on this device only.</p><button type="button" class="btn btn-primary btn-lg" data-action="login">Sign in or create account</button></div>' + prefs + '</div>';
    } else {
      html = '<div class="container narrow"><h1 class="page-title">My account</h1><div class="card-box profile"><span class="avatar big" aria-hidden="true">' + esc(u.name.charAt(0).toUpperCase()) + '</span><div><h2>' + esc(u.name) + '</h2><p>' + esc(u.contact) + '</p></div><button type="button" class="btn btn-outline" data-action="logout">' + icon('logout') + ' Sign out</button></div>' +
        '<div class="quick"><a class="card-box q" href="#/orders">' + icon('box') + '<b>My orders</b><small>' + S.state.orders.length + ' placed</small></a><a class="card-box q" href="#/wishlist">' + icon('heart') + '<b>Wishlist</b><small>' + S.state.wish.length + ' saved</small></a></div>' +
        '<section class="card-box"><h2>Saved address</h2>' + (a ? '<p>' + esc(a.building) + ', ' + esc(a.street) + ', ' + esc(a.area) + '<br><small>' + esc(a.name) + ' · ' + esc(a.phone) + '</small></p>' : '<p>No address saved yet. It will be remembered after your first order.</p>') + '</section>' + prefs + '</div>';
    }
    return {
      title: 'My account', html: html,
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var sw = e.target.closest('[data-palette-set]');
          if (sw) {
            S.setPalette(sw.dataset.paletteSet);
            $$('[data-palette-set]', root).forEach(function (x) { x.setAttribute('aria-checked', x === sw); });
            return;
          }
          var b = e.target.closest('[data-theme-set]'); if (!b) return;
          S.setTheme(b.dataset.themeSet);
          $$('[data-theme-set]', root).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        });
        var sel = $('#pref-area', root); if (sel) sel.addEventListener('change', function () { S.setArea(sel.value); U.toast('Delivering to ' + sel.value); });
      }
    };
  };

  /* ---------- sign-in modal (front-end demo only) ---------- */
  V.openAuth = function (after) {
    U.openModal('Sign in',
      '<div class="modal-body"><div class="empty-ico sm" aria-hidden="true">🥬</div><h2>Welcome to ' + esc(C.name) + '</h2><p class="muted">Sign in to check out faster. Demo only — no password needed and your details stay on this device.</p>' +
      '<form id="auth" novalidate><div class="field"><label for="a-name">Your name</label><input id="a-name" autocomplete="name" required><small class="err" id="a-name-err" role="alert"></small></div>' +
      '<div class="field"><label for="a-contact">Email or mobile number</label><input id="a-contact" autocomplete="username" required><small class="err" id="a-contact-err" role="alert"></small></div>' +
      '<button class="btn btn-primary btn-lg btn-block" type="submit">Continue</button></form></div>',
      function (card) {
        var f = $('#auth', card);
        f.addEventListener('submit', function (e) {
          e.preventDefault();
          var name = $('#a-name', card).value.trim(), contact = $('#a-contact', card).value.trim(), ok = true;
          $('#a-name-err', card).textContent = name ? '' : 'Please tell us your name'; if (!name) ok = false;
          var valid = /^\S+@\S+\.\S+$/.test(contact) || PHONE.test(contact);
          $('#a-contact-err', card).textContent = valid ? '' : 'Enter a valid email or mobile number'; if (!valid) ok = false;
          if (!ok) return;
          S.setUser({ name: name, contact: contact });
          U.closeModal(); U.toast('Welcome, ' + name.split(' ')[0] + '!');
          if (after) after();
        });
      });
  };
})();
