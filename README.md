# NestMart — supermarket web app

A general-merchandise supermarket storefront: groceries, health & beauty (including shaving and grooming), home & kitchen, electricals and baby care. Static, no build step.

## Run locally

```
cd SUPERMARKET
python -m http.server 5173 --bind 127.0.0.1
```

Then open http://127.0.0.1:5173. Any static server works (`npx serve`, VS Code Live Server, …); opening `index.html` directly also works, but installing and offline mode need `localhost` or `https://`.

## What's in the catalogue

4 departments → 15 categories → 120 demo products.

| Department | Categories |
| --- | --- |
| Groceries | Fruits & Vegetables, Dairy & Eggs, Bakery, Meat & Seafood, Pantry & Staples, Frozen Foods, Snacks & Sweets, Beverages |
| Health & Beauty | Personal Care, Shaving & Grooming, Health & Wellness |
| Home & Living | Household & Cleaning, Kitchen & Dining, Electricals |
| Baby & Kids | Baby Care |

Navigation, the mega menu, the mobile category sheet, home-page tabs and the shop filters are all organised by department. Add products in `js/data.js`.

## Colour themes

The default is **Ocean** (trustworthy blue with sunshine-yellow highlights and orange/red for offers), chosen because general retailers typically lead with blue and use yellow/red for value and urgency, whereas green reads as "produce only". Four alternatives are built in — Crimson, Sunset, Plum and Teal — each with a light and a dark variant, and every text/background pair meets WCAG AA contrast.

Try them at **Account → Preferences → Colour theme**. Once you've settled on one, set `paletteSwitcher: false` in `js/config.js` to hide the picker. Palettes are plain CSS variables at the top of `css/styles.css` (`:root[data-palette='…']`).

## Install as an app (PWA)

The header has an **Install app** button (icon-only on phones). On Chrome/Edge/Android it opens the browser's one-tap install dialog; on iPhone/iPad Safari and other browsers it opens a short how-to sheet. Once installed it opens full-screen from the home screen, works offline, and has shortcuts for Deals, Cart and Orders. The button disappears inside the installed app.

Installing requires a secure origin: `https://…` or `localhost`. To try it on a real phone, deploy the folder to any HTTPS static host (Netlify, GitHub Pages, Vercel, Cloudflare Pages) or use Chrome's remote-debugging port forwarding to your PC's `localhost`. A plain `http://192.168.x.x` address works for viewing, but browsers won't offer install there.

## Files

```
index.html          page shell
css/styles.css      design tokens + palettes (light/dark), components, responsive rules
js/config.js        store name, currency, fees, promo codes, cities, time slots, colour themes
js/data.js          departments, categories, products
js/store.js         cart / wishlist / orders / account / theme / palette state (localStorage, synced across tabs)
js/ui.js            icons, product card, add-to-cart control, toasts, modal
js/views-shop.js    home, shop (search + filters), product page
js/views-cart.js    cart, checkout, order tracking, orders, wishlist, account
js/app.js           header, search suggestions, cart drawer, router, theme, global actions
js/pwa.js           "Install app" button + service-worker registration
manifest.json       web app manifest (name, icons, shortcuts, standalone display)
sw.js               service worker: offline support
icons/              app icons (any / maskable / apple-touch)
```

## Routes (hash-based)

`#/` · `#/shop?dept=beauty&cat=grooming&q=brush&sort=price-asc&min=10&deal=1` · `#/product/6418` · `#/cart` · `#/checkout` · `#/order/<id>` · `#/orders` · `#/wishlist` · `#/account`

## Customising

- **Brand / currency / fees / cities / promo codes** — `js/config.js`. Demo promo codes: `SAVE10`, `WELCOME25`, `FREESHIP`.
- **Products** — add rows to `RAW` in `js/data.js`. Products use emoji art on a tinted tile; add `img: 'images/foo.jpg'` to a product object to use a real photo instead.

## Demo limitations

Front-end only: there is no server, payment gateway or real account system. Orders, sign-in and reviews live in the browser's `localStorage`. Checkout offers cash/card on delivery and collects no card details. Order tracking advances automatically over ~90 seconds for demonstration. Contact details are placeholders.
