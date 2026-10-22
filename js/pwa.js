/* "Install app" button + service worker registration.
   Chrome/Edge/Android: the button triggers the browser's native install dialog.
   iPhone/iPad Safari, Firefox, or anywhere a native prompt isn't available: it opens a short how-to sheet. */
(function () {
  var U = window.UI, icon = U.icon, esc = U.esc, NAME = window.CONFIG.name;
  var btn = U.$('#install-btn');
  var standalone = window.matchMedia('(display-mode: standalone)');

  function isInstalled() { return standalone.matches || window.navigator.standalone === true; }

  function sync() {
    if (!btn) return;
    btn.hidden = isInstalled();
    btn.classList.toggle('ready', !!window.__bip); // a dot shows when the one-tap native install is available
  }

  function platform() {
    var ua = navigator.userAgent;
    var ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (ios) return 'ios';
    if (/android/i.test(ua)) return 'android';
    if (/firefox/i.test(ua)) return 'firefox';
    if (/safari/i.test(ua) && !/chrome|chromium|edg/i.test(ua)) return 'safari-mac';
    return 'desktop';
  }

  var STEPS = {
    ios: [
      ['share', 'Tap the <b>Share</b> button', 'The square with an arrow, in Safari\'s toolbar.'],
      ['plus', 'Choose <b>Add to Home Screen</b>', 'Scroll down the share sheet if you don\'t see it.'],
      ['check', 'Tap <b>Add</b>', NAME + ' appears on your home screen like any other app.']
    ],
    android: [
      ['menu', 'Open the browser menu <b>⋮</b>', 'Top-right corner of Chrome.'],
      ['download', 'Tap <b>Install app</b>', 'Some phones call it <b>Add to Home screen</b>.'],
      ['check', 'Confirm <b>Install</b>', 'The icon lands on your home screen and app drawer.']
    ],
    desktop: [
      ['download', 'Find the <b>install icon</b> in the address bar', 'A small monitor-with-arrow icon on the right of the web address.'],
      ['plus', 'Click <b>Install</b>', 'Or open the browser menu and choose <b>Install ' + NAME + '…</b>'],
      ['check', 'Open it from your desktop or Start menu', 'It runs in its own window, without browser tabs.']
    ],
    'safari-mac': [
      ['share', 'Click <b>Share</b> in the Safari toolbar', 'Or open the <b>File</b> menu.'],
      ['plus', 'Choose <b>Add to Dock</b>', 'Requires macOS Sonoma or later.'],
      ['check', 'Open ' + NAME + ' from your Dock', 'It runs in its own window.']
    ],
    firefox: [
      ['info', 'Firefox on desktop can\'t install web apps', 'Open this page in <b>Chrome</b> or <b>Edge</b> to install it.'],
      ['menu', 'On Android Firefox, open the menu <b>⋮</b>', 'Then tap <b>Install</b>.'],
      ['check', 'Or just bookmark it', 'Press <b>Ctrl/⌘ + D</b> for quick access.']
    ]
  };

  function openHelp() {
    var p = platform();
    var secure = window.isSecureContext;
    var steps = STEPS[p] || STEPS.desktop;
    var html = '<div class="modal-body install-help">' +
      '<img class="app-icon" src="icons/icon-192.png" alt="" width="64" height="64">' +
      '<h2>Install ' + esc(NAME) + '</h2>' +
      '<p class="muted">Add it to your home screen to open it full-screen like a real app — faster, works offline, and no app store needed.</p>' +
      (secure ? '' : '<p class="notice">' + icon('info') + '<span>Browsers only allow installing from a secure address (<b>https://</b> or <b>localhost</b>). You\'re on <b>' + esc(location.protocol + '//' + location.host) + '</b>, so use the https link once it\'s deployed.</span></p>') +
      '<ol class="install-steps">' + steps.map(function (s, i) {
        return '<li><span class="n">' + (i + 1) + '</span><div><b>' + s[1] + '</b><small>' + s[2] + '</small></div>' + icon(s[0]) + '</li>';
      }).join('') + '</ol>' +
      '<button type="button" class="btn btn-primary btn-lg btn-block" data-action="close-modal">Got it</button></div>';
    U.openModal('Install ' + NAME, html);
  }

  function install() {
    var ev = window.__bip;
    if (!ev) { openHelp(); return; }
    window.__bip = null; sync();
    ev.prompt();
    ev.userChoice.then(function (c) { if (c && c.outcome === 'accepted') U.toast('Installing ' + NAME + '…'); });
  }

  document.addEventListener('click', function (e) { if (e.target.closest('[data-action="install"]')) install(); });
  window.addEventListener('fn-installable', sync);
  window.addEventListener('appinstalled', function () {
    window.__bip = null; sync();
    U.toast(NAME + ' installed — find it on your home screen');
  });
  if (standalone.addEventListener) standalone.addEventListener('change', sync);
  sync();

  if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () { /* offline support is optional */ }); });
  }
})();
