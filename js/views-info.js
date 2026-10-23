/* Views: track order, profile, address, customer support, coupons, notifications, contact, privacy, terms, about. */
(function () {
  var C = window.CONFIG, S = window.Store, U = window.UI, V = window.Views;
  var esc = U.esc, icon = U.icon, $ = U.$, $$ = U.$$;
  var PHONE = /^[+\d][\d\s-]{7,16}$/, EMAIL = /^\S+@\S+\.\S+$/;

  function page(title, lead, inner) {
    return '<div class="container narrow"><nav class="crumbs" aria-label="Breadcrumb"><a href="#/">Home</a>' + icon('right') + '<a href="#/account">Account</a>' + icon('right') + '<span aria-current="page">' + title + '</span></nav>' +
      '<h1 class="page-title">' + title + '</h1>' + (lead ? '<p class="lead">' + lead + '</p>' : '') + inner + '</div>';
  }
  function fld(id, label, value, opts) {
    opts = opts || {};
    return '<div class="field' + (opts.cls ? ' ' + opts.cls : '') + '"><label for="' + id + '">' + label + (opts.req ? ' <i aria-hidden="true">*</i>' : '') + '</label>' +
      (opts.area ? '<textarea id="' + id + '" name="' + id + '" rows="4" maxlength="600"' + (opts.req ? ' required' : '') + ' aria-describedby="' + id + '-err">' + esc(value || '') + '</textarea>'
        : '<input id="' + id + '" name="' + id + '" type="' + (opts.type || 'text') + '" value="' + esc(value || '') + '"' + (opts.ac ? ' autocomplete="' + opts.ac + '"' : '') + (opts.mode ? ' inputmode="' + opts.mode + '"' : '') + (opts.req ? ' required' : '') + ' aria-describedby="' + id + '-err">') +
      '<small class="err" id="' + id + '-err" role="alert"></small></div>';
  }
  function signInPrompt(title, text) {
    return page(title, '', '<div class="card-box signin-card"><div class="empty-ico" aria-hidden="true">👋</div><h2>Please sign in first</h2><p>' + text + '</p><button type="button" class="btn btn-primary btn-lg" data-action="login">Sign in or create account</button></div>');
  }
  /* validates the named fields of a form; returns the first invalid element name or '' */
  function check(form, root, rules) {
    var bad = '';
    Object.keys(rules).forEach(function (n) {
      var el = form.elements[n], v = el.value.trim(), r = rules[n], msg = '';
      if (r.req && !v) msg = 'This field is required';
      else if (v && r.re && !r.re.test(v)) msg = r.msg;
      el.setAttribute('aria-invalid', !!msg);
      $('#' + n + '-err', root).textContent = msg;
      if (msg && !bad) bad = n;
    });
    return bad;
  }

  /* ================= TRACK ORDER ================= */
  V.track = function (idParam) {
    var cp = V.cartParts, timer;
    var recent = S.state.orders.slice(0, 6);
    var html = page('Track Order', 'Enter your order ID to see where your order is right now.',
      '<form class="card-box track-form" id="track-form" novalidate><div class="field"><label for="t-id">Order ID</label>' +
      '<div class="inline"><input id="t-id" name="t-id" autocomplete="off" spellcheck="false" placeholder="e.g. FN-ABC123" aria-describedby="t-id-err"><button class="btn btn-primary" type="submit">Track</button></div>' +
      '<small class="err" id="t-id-err" role="alert"></small></div></form><div id="t-out"></div>' +
      (recent.length ? '<section class="card-box"><h2>Your recent orders</h2><ul class="mini-orders">' + recent.map(function (o) {
        var st = cp.stageOf(o);
        return '<li><a href="#/track/' + esc(o.id) + '"><b>#' + esc(o.id) + '</b><small>' + U.ago(o.ts) + '</small></a><span class="status s' + st + '">' + cp.STAGES[st][0] + '</span></li>';
      }).join('') + '</ul></section>' : ''));
    return {
      title: 'Track Order', html: html,
      mount: function (root) {
        var form = $('#track-form', root), out = $('#t-out', root), err = $('#t-id-err', root), input = $('#t-id', root);
        function show(id) {
          clearInterval(timer);
          var o = S.order(String(id || '').trim().toUpperCase());
          if (!o) { out.innerHTML = ''; err.textContent = 'We couldn\'t find that order on this device. Check the ID and try again.'; input.setAttribute('aria-invalid', 'true'); return; }
          err.textContent = ''; input.setAttribute('aria-invalid', 'false'); input.value = o.id;
          out.innerHTML = '<div class="card-box"><h2>Order <span class="num">#' + esc(o.id) + '</span></h2><div id="track">' + cp.tracker(cp.stageOf(o)) + '</div><p class="fine">' + esc(o.slot) + '</p></div>' + cp.orderBody(o);
          var track = $('#track', out), last = cp.stageOf(o);
          timer = setInterval(function () { var s = cp.stageOf(o); if (s !== last) { last = s; track.innerHTML = cp.tracker(s); } if (s === 3) clearInterval(timer); }, 3000);
        }
        form.addEventListener('submit', function (e) { e.preventDefault(); show(input.value); });
        if (idParam) show(idParam);
      },
      unmount: function () { clearInterval(timer); }
    };
  };

  /* ================= PROFILE ================= */
  V.profile = function () {
    var u = S.state.user;
    if (!u) return { title: 'Profile', html: signInPrompt('Profile', 'Sign in to view and edit your profile.') };
    var email = u.email || (/@/.test(u.contact || '') ? u.contact : ''), phone = u.phone || (u.contact && !/@/.test(u.contact) ? u.contact : '');
    var html = page('Profile', 'Keep your details up to date so checkout is quicker.',
      '<form class="card-box form-card" id="profile-form" novalidate><div class="avatar-row"><span class="avatar big" aria-hidden="true">' + esc(u.name.charAt(0).toUpperCase()) + '</span><div><b>' + esc(u.name) + '</b><small>' + esc(u.contact) + '</small></div></div>' +
      '<div class="grid2">' + fld('name', 'Full name', u.name, { req: 1, ac: 'name' }) + fld('phone', 'Mobile number', phone, { type: 'tel', ac: 'tel', mode: 'tel' }) +
      fld('email', 'Email', email, { type: 'email', ac: 'email', cls: 'span2' }) + '</div>' +
      '<div class="form-actions"><button class="btn btn-primary btn-lg" type="submit">Save changes</button><button type="button" class="btn btn-outline btn-lg" data-action="logout">' + icon('logout') + ' Sign out</button></div></form>');
    return {
      title: 'Profile', html: html,
      mount: function (root) {
        var form = $('#profile-form', root);
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var bad = check(form, root, { name: { req: 1 }, phone: { re: PHONE, msg: 'Enter a valid mobile number' }, email: { re: EMAIL, msg: 'Enter a valid email address' } });
          if (bad) { form.elements[bad].focus(); return; }
          var name = form.elements.name.value.trim(), em = form.elements.email.value.trim(), ph = form.elements.phone.value.trim();
          if (!em && !ph) { $('#email-err', root).textContent = 'Add an email or a mobile number'; form.elements.email.focus(); return; }
          S.setUser({ name: name, contact: em || ph, email: em, phone: ph });
          U.toast('Profile updated');
          route();
        });
        function route() { window.dispatchEvent(new HashChangeEvent('hashchange')); }
      }
    };
  };

  /* ================= ADDRESS ================= */
  V.address = function () {
    var a = S.state.addr, u = S.state.user || {};
    var cur = (a && a.area) || S.state.area || C.areas[0];
    var saved = a ? '<section class="card-box addr-card"><h2>Saved address</h2><p><b>' + esc(a.name) + '</b> · ' + esc(a.phone) + '<br>' + esc(a.building) + ', ' + esc(a.street) + ', ' + esc(a.area) + (a.landmark ? '<br><small>Near ' + esc(a.landmark) + '</small>' : '') + '</p>' +
      '<button type="button" class="link danger" id="addr-del">Delete this address</button></section>' : '';
    var html = page('Address', 'Your delivery address is filled in automatically at checkout.',
      saved + '<form class="card-box form-card" id="addr-form" novalidate><h2>' + (a ? 'Edit address' : 'Add an address') + '</h2><div class="grid2">' +
      fld('name', 'Full name', (a && a.name) || u.name, { req: 1, ac: 'name' }) + fld('phone', 'Mobile number', (a && a.phone) || u.phone || '', { req: 1, type: 'tel', ac: 'tel', mode: 'tel' }) +
      '<div class="field"><label for="area">City <i aria-hidden="true">*</i></label><select id="area" name="area">' + C.areas.map(function (x) { return '<option value="' + esc(x) + '"' + (x === cur ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('') + '</select></div>' +
      fld('street', 'Street / neighbourhood', a && a.street, { req: 1, ac: 'address-line1' }) + fld('building', 'Building, floor &amp; flat', a && a.building, { req: 1, ac: 'address-line2' }) +
      fld('landmark', 'Nearest landmark (optional)', a && a.landmark) + '</div>' +
      '<div class="form-actions"><button class="btn btn-primary btn-lg" type="submit">Save address</button></div></form>');
    return {
      title: 'Address', html: html,
      mount: function (root) {
        var form = $('#addr-form', root);
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var bad = check(form, root, { name: { req: 1 }, phone: { req: 1, re: PHONE, msg: 'Enter a valid mobile number' }, street: { req: 1 }, building: { req: 1 } });
          if (bad) { form.elements[bad].focus(); return; }
          var v = function (n) { return form.elements[n].value.trim(); };
          S.saveAddress({ name: v('name'), phone: v('phone'), email: (a && a.email) || '', area: v('area'), street: v('street'), building: v('building'), landmark: v('landmark') });
          S.setArea(v('area'));
          U.toast('Address saved');
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        });
        var del = $('#addr-del', root);
        if (del) del.addEventListener('click', function () { S.saveAddress(null); U.toast('Address deleted'); window.dispatchEvent(new HashChangeEvent('hashchange')); });
      }
    };
  };

  /* ================= CUSTOMER SUPPORT ================= */
  var FAQ = [
    ['How fast is delivery?', 'Choose a delivery time slot at checkout, or pick express and we aim to deliver within 60 minutes between 7:00 and 21:00.'],
    ['How much does delivery cost?', 'The delivery fee is shown in your cart before you pay, and delivery is free once your basket passes the free-delivery amount.'],
    ['Which payment methods do you accept?', 'Cash or card on delivery. Online card payment is not part of this demo, so no card details are collected.'],
    ['Can I change or cancel my order?', 'Contact customer support as soon as you can. Orders that are already being packed may not be changeable.'],
    ['What if an item is missing or damaged?', 'Tell us within 24 hours and we will replace it or refund you, no questions asked.'],
    ['How do I use a coupon?', 'Enter the code in your cart under Promo code, or tap Apply on the Coupon page.']
  ];
  V.support = function () {
    var html = page('Customer Support', 'We are here to help, every day. Pick the quickest way to reach us.',
      '<div class="help-cards">' +
        '<a class="card-box help-card" href="tel:' + esc(C.contact.phone.replace(/[^+\d]/g, '')) + '">' + icon('phone') + '<b>Call us</b><small>' + esc(C.contact.phone) + '</small></a>' +
        '<a class="card-box help-card" href="mailto:' + esc(C.contact.email) + '">' + icon('mail') + '<b>Email us</b><small>' + esc(C.contact.email) + '</small></a>' +
        '<button type="button" class="card-box help-card" data-chat>' + icon('chat') + '<b>Live chat</b><small>Chat with our team</small></button></div>' +
      '<section class="card-box"><h2>Frequently asked questions</h2><div class="faq">' + FAQ.map(function (f) {
        return '<details><summary>' + f[0] + '</summary><p>' + f[1] + '</p></details>';
      }).join('') + '</div></section>' +
      '<form class="card-box form-card" id="msg-form" novalidate><h2>Send us a message</h2><div class="grid2">' +
        fld('name', 'Your name', (S.state.user || {}).name, { req: 1, ac: 'name' }) + fld('email', 'Email or mobile number', (S.state.user || {}).contact, { req: 1, ac: 'username' }) +
        fld('text', 'How can we help?', '', { req: 1, area: 1, cls: 'span2' }) + '</div>' +
        '<div class="form-actions"><button class="btn btn-primary btn-lg" type="submit">Send message</button></div></form>');
    return { title: 'Customer Support', html: html, mount: function (root) { wireMessage(root, '#msg-form'); var c = $('[data-chat]', root); if (c) c.addEventListener('click', function () { U.toast('Live chat is not available in this demo — please call or email us.'); }); } };
  };
  function wireMessage(root, sel) {
    var form = $(sel, root);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = check(form, root, { name: { req: 1 }, email: { req: 1, re: /^(\S+@\S+\.\S+|[+\d][\d\s-]{7,16})$/, msg: 'Enter a valid email or mobile number' }, text: { req: 1 } });
      if (bad) { form.elements[bad].focus(); return; }
      form.reset(); U.toast('Thanks! Your message was sent. We will get back to you soon.');
    });
  }

  /* ================= COUPONS ================= */
  var PROMO_FINE = { pct: 'Applies to the whole basket', flat: 'Minimum basket applies', ship: 'Standard delivery fee waived' };
  V.coupons = function () {
    var active = S.state.promo;
    var html = page('Coupon', 'Save on your next order with these codes.',
      '<ul class="coupons">' + Object.keys(C.promos).map(function (code) {
        var p = C.promos[code];
        return '<li class="coupon' + (active === code ? ' on' : '') + '"><div class="cp-main"><span class="cp-ico">' + icon('ticket') + '</span><div><b class="cp-code">' + esc(code) + '</b><span class="cp-label">' + esc(p.label) + '</span><small>' + PROMO_FINE[p.type] + '</small></div></div>' +
          '<div class="cp-actions"><button type="button" class="btn btn-outline btn-sm" data-copy="' + esc(code) + '">' + icon('copy') + ' Copy</button><button type="button" class="btn btn-primary btn-sm" data-apply="' + esc(code) + '">' + (active === code ? 'Applied' : 'Apply') + '</button></div></li>';
      }).join('') + '</ul><p class="hint">Coupons are applied in your cart. Only one coupon can be used per order.</p>');
    return {
      title: 'Coupon', html: html,
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var cp = e.target.closest('[data-copy]'), ap = e.target.closest('[data-apply]');
          if (cp) {
            var code = cp.dataset.copy;
            if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(function () { U.toast('Code ' + code + ' copied'); }, function () { U.toast('Your code is ' + code); });
            else U.toast('Your code is ' + code);
          } else if (ap) {
            var r = S.applyPromo(ap.dataset.apply); U.toast(r.msg);
            $$('.coupon', root).forEach(function (li) { var on = li.querySelector('[data-apply]').dataset.apply === S.state.promo; li.classList.toggle('on', on); li.querySelector('[data-apply]').textContent = on ? 'Applied' : 'Apply'; });
          }
        });
      }
    };
  };

  /* ================= NOTIFICATIONS ================= */
  function notes() {
    var list = [
      { id: 'welcome', ico: 'bell', title: 'Welcome!', text: 'Thanks for choosing us. Use code WELCOME25 for SAR 25 off orders over SAR 120.', ts: 0 },
      { id: 'free', ico: 'truck', title: 'Free delivery', text: 'Spend over the free-delivery amount and we deliver your order for free.', ts: 0 },
      { id: 'deals', ico: 'tag', title: 'New deals every day', text: 'Prices on today\'s deals refresh at midnight. Check the Deals tab.', ts: 0 }
    ];
    S.state.orders.slice(0, 5).forEach(function (o) {
      list.unshift({ id: 'order-' + o.id, ico: 'box', title: 'Order placed', text: 'Your order #' + o.id + ' is confirmed. Track it any time from the Track Order page.', ts: o.ts, href: '#/track/' + o.id });
    });
    return list;
  }
  V.notifications = function () {
    var list = notes(), read = S.state.notesRead || [];
    function item(n) {
      var unread = read.indexOf(n.id) < 0;
      var inner = '<span class="nt-ico">' + icon(n.ico) + '</span><div><b>' + n.title + (unread ? ' <span class="pill sm">New</span>' : '') + '</b><p>' + n.text + '</p>' + (n.ts ? '<small>' + U.ago(n.ts) + '</small>' : '') + '</div>';
      return '<li class="note' + (unread ? ' unread' : '') + '">' + (n.href ? '<a href="' + esc(n.href) + '">' + inner + '</a>' : inner) + '</li>';
    }
    var unreadCount = list.filter(function (n) { return read.indexOf(n.id) < 0; }).length;
    var html = page('Notification', '',
      '<div class="wl-bar"><p>' + (unreadCount ? unreadCount + ' unread' : 'You are all caught up') + '</p>' + (unreadCount ? '<button type="button" class="btn btn-outline btn-sm" data-readall>Mark all as read</button>' : '') + '</div>' +
      '<ul class="notes">' + list.map(item).join('') + '</ul>');
    return {
      title: 'Notification', html: html,
      mount: function (root) {
        var b = $('[data-readall]', root);
        if (b) b.addEventListener('click', function () { S.readNotes(list.map(function (n) { return n.id; })); window.dispatchEvent(new HashChangeEvent('hashchange')); });
      }
    };
  };

  /* ================= CONTACT ================= */
  V.contact = function () {
    var c = C.contact;
    var html = page('Contact Us', 'Questions, feedback or a special request? Reach out any time.',
      '<div class="help-cards">' +
        '<a class="card-box help-card" href="tel:' + esc(c.phone.replace(/[^+\d]/g, '')) + '">' + icon('phone') + '<b>Phone</b><small>' + esc(c.phone) + '</small></a>' +
        '<a class="card-box help-card" href="mailto:' + esc(c.email) + '">' + icon('mail') + '<b>Email</b><small>' + esc(c.email) + '</small></a>' +
        '<div class="card-box help-card">' + icon('clock') + '<b>Opening hours</b><small>' + esc(c.hours) + '</small></div>' +
        '<div class="card-box help-card">' + icon('pin') + '<b>Address</b><small>' + esc(c.address) + '</small></div></div>' +
      '<form class="card-box form-card" id="msg-form" novalidate><h2>Send us a message</h2><div class="grid2">' +
        fld('name', 'Your name', (S.state.user || {}).name, { req: 1, ac: 'name' }) + fld('email', 'Email or mobile number', (S.state.user || {}).contact, { req: 1, ac: 'username' }) +
        fld('text', 'Your message', '', { req: 1, area: 1, cls: 'span2' }) + '</div>' +
        '<div class="form-actions"><button class="btn btn-primary btn-lg" type="submit">Send message</button></div></form>');
    return { title: 'Contact Us', html: html, mount: function (root) { wireMessage(root, '#msg-form'); } };
  };

  /* ================= PRIVACY / TERMS / ABOUT ================= */
  function doc(title, lead, sections) {
    return page(title, lead, '<article class="card-box doc">' + sections.map(function (s) {
      return '<section><h2>' + s[0] + '</h2>' + s.slice(1).map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</section>';
    }).join('') + '<p class="fine">This is sample text for the demo store. Have it reviewed before you go live.</p></article>');
  }
  V.privacy = function () {
    return { title: 'Privacy Policy', html: doc('Privacy Policy', 'How we look after your information.', [
      ['What we collect', 'Your name, contact details, delivery address and order history, plus anything you type into a form or review.'],
      ['How we use it', 'To deliver your orders, keep you updated about them, answer your questions and make shopping with us easier.'],
      ['Where it is stored', 'In this demo, your details are saved only in your browser on this device. Clearing your browser data removes them.'],
      ['Sharing', 'We never sell your personal information. We share only what a delivery partner needs to bring you your order.'],
      ['Your choices', 'You can edit or delete your profile and address at any time from your account, and ask us to remove your data.'],
      ['Contact us', 'Questions about privacy? Use the Contact Us page and we will be happy to help.']
    ]) };
  };
  V.terms = function () {
    return { title: 'Terms & Conditions', html: doc('Terms & Conditions', 'Please read these terms before you place an order.', [
      ['Orders and prices', 'All prices include VAT. We may correct pricing errors, and an order is confirmed once we accept it. Product photos are for illustration.'],
      ['Delivery', 'Delivery times are estimates. You must be available at your chosen time slot, and we may substitute an unavailable item with a similar one if you allow it.'],
      ['Payment', 'Pay by cash or card on delivery. Please have the right amount ready for cash payments.'],
      ['Returns and refunds', 'If something is missing, damaged or not as described, tell us within 24 hours for a replacement or refund. Unopened non-food items can be returned within 14 days.'],
      ['Coupons and promotions', 'Each coupon has its own conditions, only one coupon can be used per order, and coupons have no cash value.'],
      ['Changes', 'We may update these terms from time to time. Continuing to use the store means you accept the updated terms.']
    ]) };
  };
  V.about = function () {
    var html = page('About Us', 'Fresh food and everyday essentials, delivered to your door.',
      '<article class="card-box doc"><section><h2>Who we are</h2><p>We are a neighbourhood supermarket that brings groceries, personal care, household items and baby essentials to your door, fast and at fair prices.</p></section>' +
      '<section><h2>What we believe</h2><p>Great shopping should be simple. We choose products carefully, keep prices honest and treat every order like it is for our own family.</p></section></article>' +
      '<div class="about-grid">' + [
        ['leaf', 'Fresh and carefully chosen', 'Quality-checked produce, halal meat and trusted brands.'],
        ['truck', 'Fast, reliable delivery', 'Pick a time slot, or choose express for delivery in about an hour.'],
        ['shield', 'Easy returns', 'Not happy with something? We replace it or refund you.'],
        ['tag', 'Fair prices every day', 'New deals daily and coupons you can actually use.']
      ].map(function (f) { return '<div class="card-box about-item"><span class="trust-ico">' + icon(f[0]) + '</span><b>' + f[1] + '</b><small>' + f[2] + '</small></div>'; }).join('') + '</div>' +
      '<div class="empty-actions"><a class="btn btn-primary btn-lg" href="#/shop">Start shopping</a><a class="btn btn-outline btn-lg" href="#/contact">Contact us</a></div>');
    return { title: 'About Us', html: html };
  };
})();
