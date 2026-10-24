# NestMart — supermarket web app

A general-merchandise supermarket storefront: groceries, health & beauty (including shaving and grooming), home & kitchen, electricals and baby care. Static, no build step.

## Run locally

```
cd SUPERMARKET
python -m http.server 5173 --bind 127.0.0.1
```

Then open http://127.0.0.1:5173. Any static server works (`npx serve`, VS Code Live Server, …); opening `index.html` directly also works, but installing and offline mode need `localhost` or `https://`.

## What's in the catalogue

4 departments → 30 categories → 192 demo products. The categories follow the "All categories" list: Dairy & Eggs, Grab & Go, Canned & Jarred Food, Frozen Food, Baby, Pet Care, Personal Care, Shaving & Grooming, Sensual Care, Pharmacy, Cleaning & Laundry, Disposables, Electronics, Stationery & Office Supplies, Organic & Special Diet, Breakfast Food, Fruits & Vegetables, Dates & Dried Fruits, Snacks & Candy, Bakery, Beverages, Milk, Water, Ice Cream, Cooking & Baking, Condiments, Coffee & Tea, Deli & Fresh Chicken, Meat & Seafood and Household Essentials.

Navigation, the mega menu, the mobile category sheet, home-page tabs and the shop filters are all organised by department. Add products in `js/data.js`.

## Product photos

Products that have a photo show it; any product without one falls back to its emoji on a tinted tile (at the moment that is mainly Kitchen & Dining, Electricals and most of Shaving & Grooming and Health & Wellness, plus a handful of others, so the catalogue is photographed in part, not in full). Each photo is a square 720 px WebP in `images/products/<id>.webp`, with a 160 px copy in `images/products/t/` that small slots (search results, menus, cart and order lines, category tiles) use so they stay light. The product page gallery shows one thumbnail per photo when a product has more than one (`<id>-2.webp`, `<id>-3.webp`). The home-page hero, promo cards, category tiles and menus use the same photos, and a category tile with no photographed product yet keeps its emoji.

The demo photos are openly licensed pictures from [Wikimedia Commons](https://commons.wikimedia.org) and [Open Food Facts](https://openfoodfacts.org) (plus its Beauty and Products sister projects). Each photo's author, licence and source are listed in [`images/CREDITS.md`](images/CREDITS.md) and on the in-app page `credits.html` (linked from the footer). Brand names and packaging that show in a photo belong to their owners, and the shop's own brand names are placeholders, so **swap in your own product photos before going live**.

To add or replace a photo: save the square image as `images/products/<id>.webp` and a ~160 px copy as `images/products/t/<id>.webp`, then set the photo count for that id in the `IMAGES` map in `js/data.js`. Which product stands in for each department and category tile is set by `DEPT_COVER` and `CAT_COVER` in the same file.

## Languages

English, বাংলা (Bengali) and العربية (Arabic, right-to-left). Switch from the **EN ▾** menu in the top bar or under **Account → Preferences → Language**; the choice is remembered. `js/i18n.js` translates whatever English is on screen from the dictionary in `js/lang.js` (interface) and `js/lang-data.js` (products, categories); text without a translation simply stays in English. Product descriptions are not translated yet. To add a language: add it to `LANGS` in `js/i18n.js` and a column to every row in the two `lang` files.

## Account and help pages

`#/account` is a tile menu: My Orders, Track Order, Profile, Address, Customer Support, Coupon, Notification, Contact Us, Privacy Policy, Terms & Conditions, About Us and Login/Logout. The code is in `js/views-info.js` (and `js/views-cart.js` for the account page). The policy and about text is sample copy: replace it before launch.

## Logo

`icons/logo.png` (transparent) and `icons/logo-160.png` are used in the header and footer; the app and favicon icons in `icons/` are generated from the same logo.

## Colour themes

The shop opens in **light** mode. Visitors can switch at any time with the moon/sun button in the header, or under **Account → Preferences → Appearance** (Light, Dark, or Match device to follow their phone/PC setting); the choice is remembered on that device.

The default colour theme is **Ocean** (trustworthy blue with sunshine-yellow highlights and orange/red for offers), chosen because general retailers typically lead with blue and use yellow/red for value and urgency, whereas green reads as "produce only". Four alternatives are built in — Crimson, Sunset, Plum and Teal — each with a light and a dark variant, and every text/background pair meets WCAG AA contrast.

Try them at **Account → Preferences → Colour theme**. Once you've settled on one, set `paletteSwitcher: false` in `js/config.js` to hide the picker. Palettes are plain CSS variables at the top of `css/styles.css` (`:root[data-palette='…']`).

## Install as an app (PWA)

The header has an **Install app** button (icon-only on phones). On Chrome/Edge/Android it opens the browser's one-tap install dialog. Apple gives web pages no install API, so on iPhone/iPad the button is relabelled **Add to Home Screen** and opens a short how-to sheet (with a "open this in Safari" hint inside Chrome/Firefox/in-app browsers); other browsers get the same kind of sheet. Once installed it opens full-screen from the home screen, works offline, and has shortcuts for Deals, Cart and Orders. The button disappears inside the installed app.

Installing requires a secure origin: `https://…` or `localhost`. To try it on a real phone, deploy the folder to any HTTPS static host (Netlify, GitHub Pages, Vercel, Cloudflare Pages) or use Chrome's remote-debugging port forwarding to your PC's `localhost`. A plain `http://192.168.x.x` address works for viewing, but browsers won't offer install there.

## Files

```
index.html          page shell
css/styles.css      design tokens + palettes (light/dark), components, responsive rules
js/config.js        store name, currency, fees, promo codes, cities, time slots, colour themes
js/data.js          departments, categories, products, photo map (IMAGES) and tile covers
js/store.js         cart / wishlist / orders / account / theme / palette state (localStorage, synced across tabs)
js/ui.js            icons, product card, add-to-cart control, toasts, modal
js/i18n.js          language switcher + on-screen translator (English / Bengali / Arabic)
js/lang.js          interface translations
js/lang-data.js     product and category translations
js/views-shop.js    home, shop (search + filters), product page
js/views-cart.js    cart, checkout, order tracking, orders, wishlist, account
js/views-info.js    track order, profile, address, support, coupons, notifications, contact, privacy, terms, about
js/app.js           header, search suggestions, cart drawer, router, theme, global actions
js/pwa.js           "Install app" button + service-worker registration
manifest.json       web app manifest (name, icons, shortcuts, standalone display)
sw.js               service worker: offline support
icons/              app icons (any / maskable / apple-touch)
images/products/    product photos (+ t/ thumbnails) and CREDITS.md
credits.html        photo credits page (linked from the footer)
```

## Routes (hash-based)

`#/` · `#/shop?dept=beauty&cat=grooming&q=brush&sort=price-asc&min=10&deal=1` · `#/product/6418` · `#/cart` · `#/checkout` · `#/order/<id>` · `#/orders` · `#/wishlist` · `#/account`

## Customising

- **Brand / currency / fees / cities / promo codes** — `js/config.js`. Demo promo codes: `SAVE10`, `WELCOME25`, `FREESHIP`.
- **Products** — add rows to `RAW` in `js/data.js` and add the product's photos (see *Product photos* above). A product with no photo falls back to its emoji on a tinted tile.

## Demo limitations

Front-end only: there is no server, payment gateway or real account system. Orders, sign-in, reviews and the theme choice live in the browser's `localStorage`. Checkout offers cash/card on delivery and collects no card details. Order tracking advances automatically over ~90 seconds for demonstration. Contact details are placeholders.
