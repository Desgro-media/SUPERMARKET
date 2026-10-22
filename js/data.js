/* Demo catalogue: 4 departments, 15 categories, 120 products.
   Products use emoji art; add `img: 'path.jpg'` to any product to use a real photo instead. */
(function () {
  var DEPTS = [
    { id: 'grocery', name: 'Groceries', emoji: '🛒', blurb: 'Fresh food, pantry staples and drinks' },
    { id: 'beauty', name: 'Health & Beauty', emoji: '🪒', blurb: 'Personal care, grooming and wellness' },
    { id: 'home', name: 'Home & Living', emoji: '🏠', blurb: 'Cleaning, kitchen and electricals' },
    { id: 'baby', name: 'Baby & Kids', emoji: '🍼', blurb: 'Nappies, feeding and playtime' }
  ];

  /* note = one sentence for the description tab; spec = three rows for the details tab */
  var CATEGORIES = [
    { id: 'produce', dept: 'grocery', name: 'Fruits & Vegetables', emoji: '🥬', tint: '#cdeebb', note: 'Sourced from regional farms and trusted importers.', spec: [['Origin', 'Regional farms and trusted importers'], ['Storage', 'Refrigerate at 4–8°C'], ['Typical shelf life', '3–7 days']] },
    { id: 'dairy', dept: 'grocery', name: 'Dairy & Eggs', emoji: '🥛', tint: '#cfe5fb', note: 'Kept chilled from farm to doorstep and delivered daily.', spec: [['Origin', 'Chilled supply chain, delivered daily'], ['Storage', 'Keep refrigerated at 2–5°C'], ['Typical shelf life', '5–21 days']] },
    { id: 'bakery', dept: 'grocery', name: 'Bakery', emoji: '🥐', tint: '#ffe0ae', note: 'Baked fresh every morning.', spec: [['Origin', 'Baked fresh every morning'], ['Storage', 'Store in a cool, dry place'], ['Typical shelf life', '2–4 days']] },
    { id: 'meat', dept: 'grocery', name: 'Meat & Seafood', emoji: '🥩', tint: '#ffcfc8', note: 'Halal certified, cut and packed to order.', spec: [['Origin', 'Halal certified, packed to order'], ['Storage', 'Keep refrigerated or freeze on arrival'], ['Typical shelf life', '2–3 days chilled']] },
    { id: 'pantry', dept: 'grocery', name: 'Pantry & Staples', emoji: '🍯', tint: '#f4e2b0', note: 'Imported and local staples for everyday cooking.', spec: [['Origin', 'Imported and local staples'], ['Storage', 'Store in a cool, dry place'], ['Typical shelf life', '12–24 months']] },
    { id: 'frozen', dept: 'grocery', name: 'Frozen Foods', emoji: '🍦', tint: '#d3d9fb', note: 'Flash-frozen to lock in quality.', spec: [['Origin', 'Flash-frozen at source'], ['Storage', 'Keep frozen at −18°C'], ['Typical shelf life', '6–12 months frozen']] },
    { id: 'snacks', dept: 'grocery', name: 'Snacks & Sweets', emoji: '🍫', tint: '#f5cdea', note: 'Packed in certified food facilities.', spec: [['Origin', 'Certified food facilities'], ['Storage', 'Store in a cool, dry place'], ['Typical shelf life', '4–9 months']] },
    { id: 'beverages', dept: 'grocery', name: 'Beverages', emoji: '🧃', tint: '#bde9ef', note: 'Bottled and canned drinks from leading producers.', spec: [['Origin', 'Leading drink producers'], ['Storage', 'Store in a cool, dry place'], ['Typical shelf life', '6–12 months']] },

    { id: 'personal', dept: 'beauty', name: 'Personal Care', emoji: '🧴', tint: '#ffd0e1', note: 'Dermatologically tested everyday personal care.', spec: [['Tested', 'Dermatologically tested'], ['Storage', 'Store at room temperature'], ['Shelf life', '24 months unopened']] },
    { id: 'grooming', dept: 'beauty', name: 'Shaving & Grooming', emoji: '🪒', tint: '#c9d9ee', note: 'Built for a close, comfortable shave and made to last.', spec: [['Build', 'Stainless steel and ergonomic grips'], ['Care', 'Rinse and dry after every use'], ['Returns', '14 days if unopened']] },
    { id: 'health', dept: 'beauty', name: 'Health & Wellness', emoji: '💊', tint: '#c8ece4', note: 'Everyday wellness essentials from trusted brands.', spec: [['Use', 'Follow the instructions on the pack'], ['Storage', 'Keep below 25°C, away from children'], ['Shelf life', 'See expiry date on pack']] },

    { id: 'household', dept: 'home', name: 'Household & Cleaning', emoji: '🧽', tint: '#dcd3f7', note: 'Cleaning tools and household essentials for every room.', spec: [['Use', 'For household use only'], ['Storage', 'Keep away from children'], ['Shelf life', '24 months unopened']] },
    { id: 'kitchen', dept: 'home', name: 'Kitchen & Dining', emoji: '🍳', tint: '#ffd9bd', note: 'Cookware and kitchen tools designed for everyday use.', spec: [['Material', 'Food-safe materials'], ['Care', 'Hand wash recommended'], ['Warranty', '12 months']] },
    { id: 'electricals', dept: 'home', name: 'Electricals', emoji: '🔌', tint: '#e2e5ea', note: 'Everyday electricals and accessories that meet safety standards.', spec: [['Safety', 'Meets safety standards'], ['Warranty', '12 months'], ['Returns', '14 days if unopened']] },

    { id: 'baby', dept: 'baby', name: 'Baby Care', emoji: '🍼', tint: '#fff0b8', note: 'Gentle, safe essentials for babies and little ones.', spec: [['Safety', 'Dermatologically tested, BPA-free'], ['Storage', 'Store in a cool, dry place'], ['Shelf life', 'See pack']] }
  ];

  /* id, name, category, brand, price, was (0 = no sale), unit, emoji, rating, reviews, stock, flags ('n' = new), blurb */
  var RAW = [
    // ---- Fruits & Vegetables
    [6301, 'Fresh Strawberries', 'produce', 'Green Valley', 14.95, 18.95, '250 g punnet', '🍓', 4.7, 312, 24, 'n', 'Sweet, ripe and hand-picked for the juiciest bite.'],
    [6302, 'Bananas', 'produce', 'Green Valley', 5.95, 0, '1 kg', '🍌', 4.5, 540, 80, '', 'Naturally sweet and perfect for breakfast or smoothies.'],
    [6303, 'Red Apples', 'produce', 'Orchard Co.', 9.95, 0, '1 kg', '🍎', 4.6, 421, 60, '', 'Crisp, crunchy apples with a balanced sweetness.'],
    [6304, 'Ripe Avocados', 'produce', 'Green Valley', 12.5, 15, 'Pack of 3', '🥑', 4.4, 268, 18, '', 'Creamy avocados, ready to eat within two days.'],
    [6305, 'Vine Tomatoes', 'produce', 'Green Valley', 3.95, 0, '500 g', '🍅', 4.3, 198, 45, '', 'Juicy vine-ripened tomatoes for salads and sauces.'],
    [6306, 'Baby Carrots', 'produce', 'Orchard Co.', 4.25, 0, '500 g', '🥕', 4.5, 143, 52, '', 'Sweet, crunchy and washed, ready to snack on.'],
    [6307, 'Broccoli Crown', 'produce', 'Green Valley', 5.5, 0, 'Each', '🥦', 4.4, 117, 30, '', 'Tender florets that steam or roast beautifully.'],
    [6308, 'Cucumbers', 'produce', 'Green Valley', 3.25, 0, '500 g', '🥒', 4.2, 96, 70, '', 'Cool, crisp cucumbers for salads and sandwiches.'],
    [6309, 'Sweet Corn', 'produce', 'Orchard Co.', 6.5, 0, '2 pcs', '🌽', 4.3, 74, 26, 'n', 'Golden cobs, perfect for grilling or boiling.'],
    [6310, 'Lemons', 'produce', 'Orchard Co.', 4.5, 0, '500 g', '🍋', 4.6, 156, 40, '', 'Zesty lemons packed with juice and aroma.'],
    [6311, 'Blueberries', 'produce', 'Green Valley', 16.95, 19.95, '125 g punnet', '🫐', 4.8, 205, 15, '', 'Plump antioxidant-rich berries, great with yoghurt.'],
    [6312, 'Seedless Watermelon', 'produce', 'Orchard Co.', 18, 0, 'Approx. 3 kg', '🍉', 4.7, 188, 12, 'n', 'Refreshingly sweet and ideal for hot days.'],

    // ---- Dairy & Eggs
    [6320, 'Fresh Whole Milk', 'dairy', 'Pure Meadow', 6.25, 0, '1 L', '🥛', 4.6, 612, 90, '', 'Full-cream milk with a rich, creamy taste.'],
    [6321, 'Low Fat Milk', 'dairy', 'Pure Meadow', 11.5, 0, '2 L', '🥛', 4.4, 233, 64, '', 'Light, fresh and lower in fat.'],
    [6322, 'Free Range Eggs', 'dairy', 'Pure Meadow', 13.95, 0, 'Dozen', '🥚', 4.7, 489, 55, '', 'Large eggs from hens raised outdoors.'],
    [6323, 'Greek Yoghurt', 'dairy', 'Pure Meadow', 9.75, 11.5, '500 g', '🥣', 4.6, 301, 38, '', 'Thick, creamy and high in protein.'],
    [6324, 'Mature Cheddar', 'dairy', 'Pure Meadow', 18.5, 0, '400 g block', '🧀', 4.5, 176, 29, '', 'Sharp, full-flavoured cheddar aged for depth.'],
    [6325, 'Salted Butter', 'dairy', 'Pure Meadow', 10.95, 0, '200 g', '🧈', 4.7, 254, 47, '', 'Churned slowly for a rich, silky spread.'],
    [6326, 'Shredded Mozzarella', 'dairy', 'Pure Meadow', 16.95, 19.5, '450 g', '🧀', 4.4, 132, 33, '', 'Melts perfectly for pizza, pasta and toasties.'],
    [6327, 'Cream Cheese Spread', 'dairy', 'Pure Meadow', 7.95, 0, '200 g', '🥄', 4.3, 88, 41, '', 'Smooth and tangy, ideal on bagels.'],

    // ---- Bakery
    [6330, 'Sourdough Loaf', 'bakery', 'Golden Crust', 8.5, 0, '500 g', '🍞', 4.8, 226, 22, '', 'Slow-fermented with a crackly crust and chewy crumb.'],
    [6331, 'Butter Croissants', 'bakery', 'Golden Crust', 11.95, 0, '4 pcs', '🥐', 4.9, 398, 28, '', 'Flaky, buttery layers baked fresh each morning.'],
    [6332, 'Arabic Bread', 'bakery', 'Golden Crust', 3.5, 0, 'Pack of 6', '🫓', 4.5, 372, 85, '', 'Soft, warm flatbread for every meal.'],
    [6333, 'Wholewheat Sandwich Loaf', 'bakery', 'Golden Crust', 5.95, 0, '600 g', '🍞', 4.2, 141, 44, '', 'Fibre-rich sliced loaf for everyday sandwiches.'],
    [6334, 'Double Chocolate Muffins', 'bakery', 'Golden Crust', 14.5, 17, '4 pcs', '🧁', 4.6, 167, 19, '', 'Moist, indulgent muffins studded with chocolate.'],
    [6335, 'Glazed Donuts', 'bakery', 'Golden Crust', 16, 0, '6 pcs', '🍩', 4.5, 129, 0, '', 'Pillowy donuts finished with a sweet glaze.'],
    [6336, 'Plain Bagels', 'bakery', 'Golden Crust', 9.5, 0, '4 pcs', '🥯', 4.4, 92, 31, 'n', 'Dense, chewy bagels that toast beautifully.'],

    // ---- Meat & Seafood
    [6340, 'Chicken Breast Fillets', 'meat', 'Prime Cut', 32.95, 36.95, '1 kg', '🍗', 4.6, 457, 36, '', 'Skinless, boneless and trimmed for easy cooking.'],
    [6341, 'Lean Beef Mince', 'meat', 'Prime Cut', 29.95, 0, '500 g', '🥩', 4.5, 238, 27, '', 'Freshly minced lean beef for burgers and sauces.'],
    [6342, 'Lamb Chops', 'meat', 'Prime Cut', 44.5, 0, '500 g', '🍖', 4.7, 144, 0, '', 'Tender, well-marbled chops for the grill.'],
    [6343, 'Atlantic Salmon Fillet', 'meat', 'Ocean Catch', 54.95, 62, '400 g', '🐟', 4.8, 311, 16, '', 'Rich in omega-3 with a buttery texture.'],
    [6344, 'Jumbo Shrimp', 'meat', 'Ocean Catch', 48, 0, '500 g', '🦐', 4.6, 119, 14, '', 'Peeled and deveined, cooks in minutes.'],
    [6345, 'Chicken Wings', 'meat', 'Prime Cut', 24.95, 0, '1 kg', '🍗', 4.4, 203, 33, '', 'Juicy wings ready for baking or air-frying.'],
    [6346, 'Beef Burger Patties', 'meat', 'Prime Cut', 26.5, 0, '6 pcs', '🍔', 4.5, 175, 25, 'n', 'Thick, flavourful patties for the perfect burger.'],

    // ---- Beverages
    [6350, 'Orange Juice', 'beverages', 'Splash', 9.95, 0, '1 L', '🍊', 4.5, 288, 58, '', '100% juice, no added sugar.'],
    [6351, 'Sparkling Water', 'beverages', 'Splash', 11.5, 0, '6 × 330 ml', '🫧', 4.4, 137, 72, '', 'Crisp bubbles with a clean, light taste.'],
    [6352, 'Classic Cola', 'beverages', 'Splash', 13.95, 15.95, '6 × 330 ml cans', '🥤', 4.6, 502, 96, '', 'Ice-cold refreshment in every can.'],
    [6353, 'Green Tea Bags', 'beverages', 'Harvest Table', 12.5, 0, '40 bags', '🍵', 4.5, 109, 43, '', 'Light, fragrant and gently energising.'],
    [6354, 'Ground Coffee', 'beverages', 'Harvest Table', 27.95, 32.95, '250 g', '☕', 4.8, 346, 31, '', 'Medium roast with notes of cocoa and caramel.'],
    [6355, 'Natural Mineral Water', 'beverages', 'Splash', 9.95, 0, '12 × 500 ml', '💧', 4.7, 624, 120, '', 'Pure spring water, naturally balanced minerals.'],
    [6357, 'Mango Nectar', 'beverages', 'Splash', 8.75, 0, '1 L', '🥭', 4.3, 98, 49, 'n', 'Sun-ripened mango flavour, served chilled.'],

    // ---- Snacks & Sweets
    [6360, 'Sea Salt Potato Chips', 'snacks', 'Crunchy Lane', 6.5, 0, '150 g', '🍟', 4.5, 267, 77, '', 'Thin, crisp and lightly salted.'],
    [6361, 'Dark Chocolate Bar', 'snacks', 'Crunchy Lane', 8.95, 10.5, '100 g · 70% cocoa', '🍫', 4.7, 291, 62, '', 'Deep, smooth and not too sweet.'],
    [6362, 'Roasted Mixed Nuts', 'snacks', 'Crunchy Lane', 29.95, 34.95, '400 g', '🥜', 4.6, 212, 35, '', 'Cashews, almonds and pistachios, lightly roasted.'],
    [6363, 'Salted Pretzels', 'snacks', 'Crunchy Lane', 5.95, 0, '200 g', '🥨', 4.2, 84, 54, '', 'Crunchy twists with a salty finish.'],
    [6364, 'Butter Popcorn', 'snacks', 'Crunchy Lane', 7.5, 0, '3 × 80 g', '🍿', 4.4, 120, 66, '', 'Movie-night popcorn ready in three minutes.'],
    [6365, 'Choc Chip Cookies', 'snacks', 'Crunchy Lane', 10.95, 0, '12 pcs', '🍪', 4.6, 233, 48, '', 'Chewy centres loaded with chocolate chips.'],
    [6366, 'Fruity Gummy Bears', 'snacks', 'Crunchy Lane', 5.25, 0, '180 g', '🍬', 4.1, 76, 91, '', 'Soft, fruity and fun for all ages.'],

    // ---- Pantry & Staples
    [6356, 'Wild Flower Honey', 'pantry', 'Harvest Table', 38.5, 45, '500 g jar', '🍯', 4.8, 318, 42, '', 'Raw, unblended honey with a floral aroma and a naturally thick, golden texture.'],
    [6370, 'Basmati Rice', 'pantry', 'Harvest Table', 34.95, 39.95, '5 kg', '🍚', 4.7, 584, 50, '', 'Long, fragrant grains that cook up fluffy and separate.'],
    [6371, 'Spaghetti', 'pantry', 'Harvest Table', 4.95, 0, '500 g', '🍝', 4.5, 331, 110, '', 'Durum wheat pasta with a firm bite.'],
    [6372, 'Extra Virgin Olive Oil', 'pantry', 'Harvest Table', 42, 0, '750 ml', '🫒', 4.8, 267, 24, '', 'Cold-pressed with a fruity, peppery finish.'],
    [6373, 'Tomato Pasta Sauce', 'pantry', 'Harvest Table', 7.95, 0, '400 g', '🥫', 4.3, 118, 63, '', 'Slow-simmered with basil and garlic.'],
    [6374, 'Chickpeas', 'pantry', 'Harvest Table', 3.75, 0, '400 g can', '🫘', 4.4, 147, 88, '', 'Tender and ready for hummus, curries and salads.'],
    [6375, 'Fine Sea Salt', 'pantry', 'Harvest Table', 2.95, 0, '750 g', '🧂', 4.3, 61, 100, '', 'Pure and mineral-rich for everyday cooking.'],
    [6376, 'Plain Flour', 'pantry', 'Harvest Table', 5.5, 0, '2 kg', '🌾', 4.4, 109, 76, '', 'Fine, versatile flour for baking and sauces.'],
    [6377, 'Crunchy Corn Flakes', 'pantry', 'Harvest Table', 13.5, 15.5, '500 g', '🥣', 4.2, 135, 57, '', 'Golden flakes that stay crisp in milk.'],
    [6378, 'Creamy Peanut Butter', 'pantry', 'Harvest Table', 15.95, 0, '340 g', '🥜', 4.6, 197, 39, '', 'Smooth, roasted and made with just peanuts and salt.'],

    // ---- Frozen Foods
    [6380, 'Vanilla Bean Ice Cream', 'frozen', 'Arctic Bay', 17.95, 0, '1 L tub', '🍨', 4.7, 276, 34, '', 'Real vanilla specks in a velvety scoop.'],
    [6381, 'Margherita Pizza', 'frozen', 'Arctic Bay', 14.95, 18.5, '380 g', '🍕', 4.4, 218, 40, '', 'Stone-baked base with tomato and mozzarella.'],
    [6382, 'Crinkle Cut Fries', 'frozen', 'Arctic Bay', 11.5, 0, '1 kg', '🍟', 4.5, 195, 59, '', 'Golden and crispy straight from the oven.'],
    [6383, 'Garden Mixed Vegetables', 'frozen', 'Arctic Bay', 8.95, 0, '750 g', '🥦', 4.2, 70, 46, '', 'Peas, carrots, corn and beans, frozen at peak.'],
    [6384, 'Breaded Fish Fingers', 'frozen', 'Arctic Bay', 15.95, 0, '10 pcs', '🐟', 4.3, 101, 28, 'n', 'Crunchy crumb coating over flaky white fish.'],

    // ---- Household & Cleaning
    [6388, 'Air Freshener Spray', 'household', 'Sparkle Home', 10.95, 0, '300 ml', '🌸', 4.3, 92, 66, '', 'A light floral scent that lasts all day.'],
    [6389, 'Laundry Basket', 'household', 'Sparkle Home', 29.95, 0, '50 L', '🧺', 4.4, 78, 31, '', 'Ventilated basket with sturdy carry handles.'],
    [6390, 'Dishwashing Liquid', 'household', 'Sparkle Home', 8.95, 0, '750 ml', '🧼', 4.5, 174, 68, '', 'Cuts through grease with a fresh lemon scent.'],
    [6391, 'Laundry Detergent', 'household', 'Sparkle Home', 36.95, 42, '3 L', '🧺', 4.6, 241, 37, '', 'Deep-clean formula, gentle on colours.'],
    [6392, 'Kitchen Paper Towels', 'household', 'Sparkle Home', 19.95, 0, '6 rolls', '🧻', 4.5, 189, 52, '', 'Extra-absorbent two-ply sheets.'],
    [6393, 'Heavy Duty Bin Bags', 'household', 'Sparkle Home', 9.5, 0, '30 bags', '🗑️', 4.3, 64, 74, '', 'Strong, leak-proof bags with drawstring.'],
    [6394, 'All-Purpose Cleaner', 'household', 'Sparkle Home', 12.5, 14.5, '1 L', '🧽', 4.5, 112, 45, '', 'Streak-free shine on every surface.'],
    [6395, 'Scrub Brush Set', 'household', 'Sparkle Home', 15.95, 0, '3 pcs', '🧽', 4.4, 88, 56, '', 'Stiff bristles for tiles, pots and tough stains.'],
    [6396, 'Microfibre Mop & Bucket', 'household', 'Sparkle Home', 59.95, 69, '1 set', '🪣', 4.5, 143, 22, 'n', 'Spin-wring bucket with two washable mop heads.'],
    [6397, 'Soft Broom & Dustpan', 'household', 'Sparkle Home', 24.95, 0, '1 set', '🧹', 4.3, 97, 40, '', 'Soft bristles that sweep up fine dust and crumbs.'],
    [6398, 'Toilet Brush & Holder', 'household', 'Sparkle Home', 13.95, 0, '1 set', '🚽', 4.2, 61, 63, '', 'Hygienic holder with a slim, hard-wearing brush.'],
    [6399, 'Dish Brush with Soap Dispenser', 'household', 'Sparkle Home', 11.95, 14.5, '1 pc', '🧼', 4.5, 120, 74, '', 'A press-to-fill handle keeps washing-up quick and tidy.'],

    // ---- Personal Care
    [6400, 'Nourishing Shampoo', 'personal', 'Gentle Touch', 17.95, 0, '400 ml', '🧴', 4.5, 143, 41, '', 'Gently cleanses and leaves hair soft and shiny.'],
    [6401, 'Whitening Toothpaste', 'personal', 'Gentle Touch', 7.95, 9.95, '120 ml', '🦷', 4.6, 301, 83, '', 'Fluoride protection with a fresh mint finish.'],
    [6402, 'Antibacterial Hand Wash', 'personal', 'Gentle Touch', 6.5, 0, '500 ml', '🫧', 4.4, 126, 79, '', 'Kills 99.9% of germs, kind to skin.'],
    [6403, 'Moisturising Body Lotion', 'personal', 'Gentle Touch', 21.95, 0, '400 ml', '🧴', 4.7, 184, 30, '', 'Long-lasting hydration with shea butter.'],
    [6404, 'Soft Facial Tissues', 'personal', 'Gentle Touch', 8.5, 0, '3 boxes', '📦', 4.3, 95, 61, '', 'Ultra-soft, three-ply tissues for sensitive skin.'],
    [6405, 'Soft Bristle Toothbrush', 'personal', 'Gentle Touch', 9.95, 0, '2 pcs', '🪥', 4.5, 210, 88, '', 'Gentle on gums with a compact brush head.'],
    [6406, 'Electric Toothbrush', 'personal', 'Gentle Touch', 69, 85, '1 set', '🪥', 4.6, 134, 18, 'n', 'Rechargeable with two brush heads and a two-minute timer.'],
    [6407, 'Roll-on Deodorant', 'personal', 'Gentle Touch', 11.95, 0, '50 ml', '🧴', 4.4, 176, 71, '', '48-hour protection that is kind to skin.'],
    [6408, 'Moisturising Soap Bars', 'personal', 'Gentle Touch', 16.5, 19.5, '6 × 100 g', '🧼', 4.6, 189, 59, '', 'Creamy lather enriched with shea butter.'],
    [6419, 'Makeup Brush Set', 'personal', 'Gentle Touch', 44.95, 55, '12 pcs', '🖌️', 4.6, 118, 27, '', 'Soft synthetic bristles in a handy travel pouch.'],

    // ---- Shaving & Grooming
    [6410, 'Men\'s Razor Starter Set', 'grooming', 'Sharp Edge', 34.95, 42, 'Handle + 4 blades', '🪒', 4.7, 264, 34, '', 'Weighted handle with a pivoting five-blade head.'],
    [6411, 'Replacement Razor Blades', 'grooming', 'Sharp Edge', 29.95, 0, '8 pack', '🪒', 4.6, 198, 52, '', 'Fits all Sharp Edge handles and stays sharp for longer.'],
    [6412, 'Sensitive Shaving Foam', 'grooming', 'Sharp Edge', 14.95, 0, '250 ml', '🧴', 4.5, 173, 68, '', 'Rich, non-drying foam for a smooth glide.'],
    [6413, 'Aftershave Balm', 'grooming', 'Sharp Edge', 18.95, 22, '100 ml', '🧴', 4.5, 112, 41, '', 'Soothes and hydrates skin straight after shaving.'],
    [6414, 'Beard Trimmer Kit', 'grooming', 'Sharp Edge', 79, 0, '1 set', '✂️', 4.6, 147, 16, 'n', 'Cordless trimmer with 20 length settings and 4 combs.'],
    [6415, 'Shaving Brush & Bowl Set', 'grooming', 'Sharp Edge', 39.95, 0, '2 pcs', '🖌️', 4.7, 91, 23, '', 'Dense bristles whip up a rich lather for a classic shave.'],
    [6416, 'Women\'s Razor', 'grooming', 'Gentle Touch', 17.95, 0, '3 pack', '🪒', 4.4, 132, 60, '', 'Moisture strip and flexible head for smooth legs.'],
    [6417, 'Nail Clipper Set', 'grooming', 'Gentle Touch', 12.95, 0, '6 pcs', '✂️', 4.3, 74, 80, '', 'Stainless steel clippers, file and cuticle tools.'],
    [6418, 'Deluxe Shaving Gift Set', 'grooming', 'Sharp Edge', 89, 110, 'Razor, brush, bowl & foam', '🎁', 4.8, 156, 14, 'n', 'Everything for a traditional shave in a gift-ready box.'],

    // ---- Health & Wellness
    [6460, 'Vitamin C 1000 mg', 'health', 'VitaWell', 34.95, 42, '60 tablets', '💊', 4.6, 201, 45, '', 'Daily immune support with a citrus flavour.'],
    [6461, 'Daily Multivitamin', 'health', 'VitaWell', 49.95, 0, '90 tablets', '💊', 4.5, 167, 37, '', 'Essential vitamins and minerals in one daily tablet.'],
    [6462, 'Digital Thermometer', 'health', 'VitaWell', 27.95, 0, '1 pc', '🌡️', 4.4, 109, 33, '', 'Fast, accurate readings with a backlit display.'],
    [6463, 'Adhesive Bandages', 'health', 'VitaWell', 12.95, 0, '100 pcs', '🩹', 4.5, 144, 92, '', 'Flexible, breathable strips in assorted sizes.'],
    [6464, 'Hand Sanitizer', 'health', 'VitaWell', 14.95, 0, '500 ml', '🧴', 4.3, 128, 85, '', 'Kills 99.9% of germs with moisturising aloe.'],
    [6465, 'Disposable Face Masks', 'health', 'VitaWell', 16.95, 19.95, '50 pcs', '😷', 4.2, 83, 70, 'n', 'Three-layer breathable masks with soft ear loops.'],

    // ---- Kitchen & Dining
    [6430, 'Non-stick Frying Pan', 'kitchen', 'Cozy Kitchen', 54.95, 65, '28 cm', '🍳', 4.6, 189, 29, '', 'Even heating and a durable non-stick coating.'],
    [6431, 'Food Storage Containers', 'kitchen', 'Cozy Kitchen', 39.95, 0, '10 pcs', '🥡', 4.5, 163, 44, 'n', 'Airtight, stackable and microwave safe.'],
    [6432, 'Insulated Travel Mug', 'kitchen', 'Cozy Kitchen', 29.95, 0, '450 ml', '☕', 4.5, 118, 51, '', 'Keeps drinks hot for 6 hours or cold for 12.'],
    [6433, 'Chef\'s Knife', 'kitchen', 'Cozy Kitchen', 34.95, 0, '8 inch', '🔪', 4.7, 142, 26, '', 'Razor-sharp stainless steel with a balanced grip.'],
    [6434, 'Porcelain Dinner Set', 'kitchen', 'Cozy Kitchen', 119, 149, '12 pcs', '🍽️', 4.6, 97, 12, '', 'Plates and bowls for four with a clean modern finish.'],
    [6435, 'Electric Kettle', 'kitchen', 'Cozy Kitchen', 64.95, 0, '1.7 L', '🫖', 4.6, 205, 31, '', 'Rapid-boil kettle with auto shut-off.'],
    [6436, 'Wooden Cutting Boards', 'kitchen', 'Cozy Kitchen', 32.95, 0, '3 pcs', '🪵', 4.4, 76, 38, '', 'Three sizes of sturdy boards with juice grooves.'],

    // ---- Electricals
    [6440, 'AA Alkaline Batteries', 'electricals', 'VoltEdge', 24.95, 0, '12 pack', '🔋', 4.6, 311, 120, '', 'Long-lasting power for remotes, toys and torches.'],
    [6441, 'LED Light Bulbs E27', 'electricals', 'VoltEdge', 29.95, 34.95, '4 pack', '💡', 4.5, 174, 64, '', 'Warm white, 10 W, rated for up to 15,000 hours.'],
    [6442, 'USB-C Fast Charger', 'electricals', 'VoltEdge', 39.95, 0, '30 W', '🔌', 4.5, 148, 47, '', 'Compact wall charger for phones and tablets.'],
    [6443, 'Wired Earphones', 'electricals', 'VoltEdge', 24.95, 0, '1 pair', '🎧', 4.2, 96, 82, '', 'Clear sound with an in-line mic and volume control.'],
    [6444, 'Rechargeable LED Torch', 'electricals', 'VoltEdge', 32.95, 0, '1 pc', '🔦', 4.5, 85, 39, '', 'Bright beam with USB charging and three modes.'],
    [6445, 'Power Bank', 'electricals', 'VoltEdge', 79, 95, '10,000 mAh', '🔋', 4.6, 233, 24, 'n', 'Slim, fast-charging power on the go.'],
    [6446, '4-Way Extension Socket', 'electricals', 'VoltEdge', 34.95, 0, '3 m', '🔌', 4.4, 119, 55, '', 'Surge-protected with individual switches.'],

    // ---- Baby Care
    [6450, 'Baby Diapers Size 3', 'baby', 'Tiny Steps', 79.95, 92, '60 pcs', '👶', 4.7, 287, 36, '', 'Soft, leak-guard diapers for up to 12 hours.'],
    [6451, 'Baby Wipes', 'baby', 'Tiny Steps', 24.95, 0, '3 × 80', '🧻', 4.6, 215, 78, '', 'Fragrance-free wipes made with 99% water.'],
    [6452, 'Gentle Baby Shampoo', 'baby', 'Tiny Steps', 18.95, 0, '300 ml', '🧴', 4.6, 132, 54, '', 'Tear-free formula for delicate skin and hair.'],
    [6453, 'Anti-colic Feeding Bottles', 'baby', 'Tiny Steps', 34.95, 0, '2 pcs', '🍼', 4.5, 168, 41, 'n', 'BPA-free bottles with a slow-flow teat.'],
    [6454, 'Plush Teddy Bear', 'baby', 'Tiny Steps', 29.95, 0, '30 cm', '🧸', 4.7, 109, 33, '', 'Ultra-soft toy that is safe from birth.'],
    [6455, 'Baby Cereal', 'baby', 'Tiny Steps', 14.95, 0, '250 g', '🥣', 4.4, 74, 49, '', 'Iron-enriched cereal for little ones from six months.']
  ];

  var deptById = {};
  DEPTS.forEach(function (d) { deptById[d.id] = d; d.count = 0; });
  var catById = {};
  CATEGORIES.forEach(function (c) { catById[c.id] = c; c.count = 0; });

  var PRODUCTS = RAW.map(function (r) {
    var p = {
      id: r[0], name: r[1], cat: r[2], brand: r[3], price: r[4], was: r[5] || 0, unit: r[6], emoji: r[7],
      rating: r[8], reviews: r[9], stock: r[10], isNew: r[11] === 'n', blurb: r[12]
    };
    p.dept = catById[p.cat].dept;
    p.off = p.was > p.price ? Math.round((1 - p.price / p.was) * 100) : 0;
    p.pop = p.reviews * p.rating;
    catById[p.cat].count++;
    deptById[p.dept].count++;
    return p;
  });

  var byId = {};
  PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  var BRANDS = Array.from(new Set(PRODUCTS.map(function (p) { return p.brand; }))).sort();

  window.DATA = { DEPTS: DEPTS, deptById: deptById, CATEGORIES: CATEGORIES, PRODUCTS: PRODUCTS, BRANDS: BRANDS, catById: catById, byId: byId };
})();
