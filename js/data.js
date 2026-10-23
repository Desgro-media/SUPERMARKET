/* Demo catalogue: 4 departments, 30 categories, 192 products.
   Products show real photos (IMAGES below); the emoji in each row is the fallback for anything without one. */
(function () {
  var DEPTS = [
    { id: 'grocery', name: 'Groceries', emoji: '🛒', blurb: 'Fresh food, pantry staples and drinks' },
    { id: 'beauty', name: 'Health & Beauty', emoji: '🪒', blurb: 'Personal care, grooming and wellness' },
    { id: 'home', name: 'Home & Living', emoji: '🏠', blurb: 'Cleaning, kitchen and electricals' },
    { id: 'baby', name: 'Baby & Kids', emoji: '🍼', blurb: 'Nappies, feeding and playtime' }
  ];

  /* note = one sentence for the description tab; spec = three rows for the details tab */
  var CATEGORIES = [
    { id: 'dairy', dept: 'grocery', name: 'Dairy & Eggs', emoji: '🧀', tint: '#cfe5fb', note: 'Kept chilled from farm to doorstep and delivered daily.', spec: [['Origin', 'Chilled supply chain, delivered daily'], ['Storage', 'Keep refrigerated at 2–5°C'], ['Typical shelf life', '5–21 days']] },
    { id: 'grab', dept: 'grocery', name: 'Grab & Go', emoji: '🥪', tint: '#ffe3c2', note: 'Fresh ready-to-eat meals and snacks for when you are on the move.', spec: [['Prepared', 'Fresh daily'], ['Storage', 'Keep refrigerated and eat by the date shown'], ['Typical shelf life', '1–3 days']] },
    { id: 'canned', dept: 'grocery', name: 'Canned & Jarred Food', emoji: '🥫', tint: '#f6d9c4', note: 'Pantry-ready cans and jars that keep for months.', spec: [['Origin', 'Imported and local producers'], ['Storage', 'Store in a cool, dry place; refrigerate once opened'], ['Typical shelf life', '12–24 months']] },
    { id: 'frozen', dept: 'grocery', name: 'Frozen Food', emoji: '🍕', tint: '#d3d9fb', note: 'Flash-frozen to lock in quality.', spec: [['Origin', 'Flash-frozen at source'], ['Storage', 'Keep frozen at −18°C'], ['Typical shelf life', '6–12 months frozen']] },
    { id: 'baby', dept: 'baby', name: 'Baby', emoji: '🍼', tint: '#fff0b8', note: 'Gentle, safe essentials for babies and little ones.', spec: [['Safety', 'Dermatologically tested, BPA-free'], ['Storage', 'Store in a cool, dry place'], ['Shelf life', 'See pack']] },
    { id: 'pet', dept: 'home', name: 'Pet Care', emoji: '🐾', tint: '#e7dcc9', note: 'Food and care essentials for cats, dogs and other pets.', spec: [['Suitable for', 'See the pack for the recommended pet'], ['Storage', 'Keep sealed in a cool, dry place'], ['Shelf life', 'See expiry date on pack']] },
    { id: 'personal', dept: 'beauty', name: 'Personal Care', emoji: '🧴', tint: '#ffd0e1', note: 'Dermatologically tested everyday personal care.', spec: [['Tested', 'Dermatologically tested'], ['Storage', 'Store at room temperature'], ['Shelf life', '24 months unopened']] },
    { id: 'grooming', dept: 'beauty', name: 'Shaving & Grooming', emoji: '🪒', tint: '#c9d9ee', note: 'Built for a close, comfortable shave and made to last.', spec: [['Build', 'Stainless steel and ergonomic grips'], ['Care', 'Rinse and dry after every use'], ['Returns', '14 days if unopened']] },
    { id: 'sensual', dept: 'beauty', name: 'Sensual Care', emoji: '💞', tint: '#f8cfe0', note: 'Discreet intimate-care and relaxation essentials.', spec: [['Packaging', 'Discreet delivery packaging'], ['Tested', 'Dermatologically tested'], ['Shelf life', '24 months unopened']] },
    { id: 'pharmacy', dept: 'beauty', name: 'Pharmacy', emoji: '💊', tint: '#c8ece4', note: 'Over-the-counter medicines and first-aid essentials.', spec: [['Use', 'Follow the instructions on the pack'], ['Storage', 'Keep below 25°C, away from children'], ['Shelf life', 'See expiry date on pack']] },
    { id: 'cleaning', dept: 'home', name: 'Cleaning & Laundry', emoji: '🧽', tint: '#dcd3f7', note: 'Cleaning tools and laundry essentials for every room.', spec: [['Use', 'For household use only'], ['Storage', 'Keep away from children'], ['Shelf life', '24 months unopened']] },
    { id: 'disposables', dept: 'home', name: 'Disposables', emoji: '🧻', tint: '#e4e0d4', note: 'Paper, plastic and foil essentials for parties, picnics and everyday convenience.', spec: [['Material', 'Food-safe materials'], ['Use', 'Single use, please dispose responsibly'], ['Shelf life', 'No expiry']] },
    { id: 'electronics', dept: 'home', name: 'Electronics', emoji: '🔌', tint: '#e2e5ea', note: 'Everyday electricals and accessories that meet safety standards.', spec: [['Safety', 'Meets safety standards'], ['Warranty', '12 months'], ['Returns', '14 days if unopened']] },
    { id: 'stationery', dept: 'home', name: 'Stationery & Office Supplies', emoji: '✏️', tint: '#d9e6ff', note: 'Pens, paper and desk essentials for school, home and the office.', spec: [['Quality', 'Smooth-writing and long-lasting'], ['Use', 'School, home and office'], ['Returns', '14 days if unopened']] },
    { id: 'organic', dept: 'grocery', name: 'Organic & Special Diet', emoji: '🌱', tint: '#d6efc9', note: 'Organic, gluten-free, sugar-free and plant-based choices.', spec: [['Dietary', 'See the pack for organic, gluten-free or sugar-free claims'], ['Storage', 'Store in a cool, dry place'], ['Typical shelf life', '6–18 months']] },
    { id: 'breakfast', dept: 'grocery', name: 'Breakfast Food', emoji: '🥣', tint: '#ffe9b0', note: 'Cereals, spreads and everything to start the day well.', spec: [['Origin', 'Leading breakfast brands'], ['Storage', 'Store in a cool, dry place'], ['Typical shelf life', '6–18 months']] },
    { id: 'produce', dept: 'grocery', name: 'Fruits & Vegetables', emoji: '🥬', tint: '#cdeebb', note: 'Sourced from regional farms and trusted importers.', spec: [['Origin', 'Regional farms and trusted importers'], ['Storage', 'Refrigerate at 4–8°C'], ['Typical shelf life', '3–7 days']] },
    { id: 'dates', dept: 'grocery', name: 'Dates & Dried Fruits', emoji: '🌴', tint: '#ecd5b5', note: 'Premium dates, dried fruit and nuts, naturally sweet and energising.', spec: [['Origin', 'Selected growers and importers'], ['Storage', 'Store in a cool, dry place'], ['Typical shelf life', '6–12 months']] },
    { id: 'snacks', dept: 'grocery', name: 'Snacks & Candy', emoji: '🍫', tint: '#f5cdea', note: 'Packed in certified food facilities.', spec: [['Origin', 'Certified food facilities'], ['Storage', 'Store in a cool, dry place'], ['Typical shelf life', '4–9 months']] },
    { id: 'bakery', dept: 'grocery', name: 'Bakery', emoji: '🥐', tint: '#ffe0ae', note: 'Baked fresh every morning.', spec: [['Origin', 'Baked fresh every morning'], ['Storage', 'Store in a cool, dry place'], ['Typical shelf life', '2–4 days']] },
    { id: 'beverages', dept: 'grocery', name: 'Beverages', emoji: '🧃', tint: '#bde9ef', note: 'Bottled and canned drinks from leading producers.', spec: [['Origin', 'Leading drink producers'], ['Storage', 'Store in a cool, dry place'], ['Typical shelf life', '6–12 months']] },
    { id: 'milk', dept: 'grocery', name: 'Milk', emoji: '🥛', tint: '#d7ebff', note: 'Fresh and long-life milk, from full cream to lactose-free.', spec: [['Origin', 'Pasteurised, chilled supply chain'], ['Storage', 'Keep refrigerated at 2–5°C; long-life milk until opened'], ['Typical shelf life', '5–180 days']] },
    { id: 'water', dept: 'grocery', name: 'Water', emoji: '💧', tint: '#c9eef3', note: 'Still, sparkling and mineral waters in family packs.', spec: [['Source', 'Natural spring and purified drinking water'], ['Storage', 'Store away from direct sunlight'], ['Typical shelf life', '12–24 months']] },
    { id: 'icecream', dept: 'grocery', name: 'Ice Cream', emoji: '🍦', tint: '#e6d7fb', note: 'Creamy tubs, cups and bars to cool down.', spec: [['Origin', 'Made with real dairy'], ['Storage', 'Keep frozen at −18°C'], ['Typical shelf life', '12 months frozen']] },
    { id: 'cooking', dept: 'grocery', name: 'Cooking & Baking', emoji: '🍚', tint: '#f4e2b0', note: 'Rice, flour, oils and baking essentials for everyday cooking.', spec: [['Origin', 'Imported and local staples'], ['Storage', 'Store in a cool, dry place'], ['Typical shelf life', '12–24 months']] },
    { id: 'condiments', dept: 'grocery', name: 'Condiments', emoji: '🧂', tint: '#ffd4c4', note: 'Sauces, dressings and seasonings to finish every dish.', spec: [['Origin', 'Leading sauce makers'], ['Storage', 'Refrigerate after opening'], ['Typical shelf life', '12–24 months unopened']] },
    { id: 'coffeetea', dept: 'grocery', name: 'Coffee & Tea', emoji: '☕', tint: '#e0cdb8', note: 'Ground and instant coffee, black and green tea.', spec: [['Origin', 'Leading coffee and tea growers'], ['Storage', 'Keep airtight in a cool, dry place'], ['Typical shelf life', '12–24 months']] },
    { id: 'deli', dept: 'grocery', name: 'Deli & Fresh Chicken', emoji: '🍗', tint: '#ffddb8', note: 'Fresh halal chicken and sliced deli meats, packed to order.', spec: [['Origin', 'Halal certified, packed to order'], ['Storage', 'Keep refrigerated or freeze on arrival'], ['Typical shelf life', '2–3 days chilled']] },
    { id: 'meat', dept: 'grocery', name: 'Meat & Seafood', emoji: '🥩', tint: '#ffcfc8', note: 'Halal certified, cut and packed to order.', spec: [['Origin', 'Halal certified, packed to order'], ['Storage', 'Keep refrigerated or freeze on arrival'], ['Typical shelf life', '2–3 days chilled']] },
    { id: 'household', dept: 'home', name: 'Household Essentials', emoji: '🏠', tint: '#ffd9bd', note: 'Kitchenware and home essentials designed for everyday use.', spec: [['Material', 'Food-safe materials'], ['Care', 'Hand wash recommended'], ['Warranty', '12 months']] }
  ];

  /* id, name, category, brand, price, was (0 = no sale), unit, emoji, rating, reviews, stock, flags ('n' = new), blurb */
  var RAW = [
    // ---- Dairy & Eggs
    [6322, 'Free Range Eggs', 'dairy', 'Pure Meadow', 13.95, 0, 'Dozen', '🥚', 4.7, 489, 55, '', 'Large eggs from hens raised outdoors.'],
    [6323, 'Greek Yoghurt', 'dairy', 'Pure Meadow', 9.75, 11.5, '500 g', '🥣', 4.6, 301, 38, '', 'Thick, creamy and high in protein.'],
    [6324, 'Mature Cheddar', 'dairy', 'Pure Meadow', 18.5, 0, '400 g block', '🧀', 4.5, 176, 29, '', 'Sharp, full-flavoured cheddar aged for depth.'],
    [6325, 'Salted Butter', 'dairy', 'Pure Meadow', 10.95, 0, '200 g', '🧈', 4.7, 254, 47, '', 'Churned slowly for a rich, silky spread.'],
    [6326, 'Shredded Mozzarella', 'dairy', 'Pure Meadow', 16.95, 19.5, '450 g', '🧀', 4.4, 132, 33, '', 'Melts perfectly for pizza, pasta and toasties.'],
    [6327, 'Cream Cheese Spread', 'dairy', 'Pure Meadow', 7.95, 0, '200 g', '🥄', 4.3, 88, 41, '', 'Smooth and tangy, ideal on bagels.'],
    // ---- Grab & Go
    [6500, 'Chicken Caesar Wrap', 'grab', 'Deli Express', 16.95, 0, '1 wrap', '🌯', 4.5, 142, 24, 'n', 'Grilled chicken, crisp lettuce and Caesar dressing in a soft tortilla.'],
    [6501, 'Cheese & Tomato Sandwich', 'grab', 'Deli Express', 11.5, 0, '1 pack', '🥪', 4.3, 96, 30, '', 'Mature cheese and juicy tomato on soft wholemeal bread.'],
    [6502, 'Fresh Fruit Cup', 'grab', 'Deli Express', 12.95, 0, '250 g', '🍇', 4.6, 118, 20, 'n', 'A colourful mix of cut seasonal fruit, ready to eat.'],
    [6503, 'Hummus & Pita Snack Pack', 'grab', 'Deli Express', 9.95, 11.5, '1 pack', '🥙', 4.4, 87, 28, '', 'Creamy hummus with warm pita chips for dipping.'],
    [6504, 'Chocolate Protein Bar', 'grab', 'Crunchy Lane', 8.95, 0, '60 g', '🍫', 4.2, 203, 80, '', '20 g of protein in a chewy chocolate bar.'],
    [6505, 'Spicy Instant Noodle Cup', 'grab', 'Crunchy Lane', 5.5, 0, '75 g', '🍜', 4.1, 168, 90, '', 'Just add hot water for a spicy hot meal in three minutes.'],
    // ---- Canned & Jarred Food
    [6373, 'Tomato Pasta Sauce', 'canned', 'Harvest Table', 7.95, 0, '400 g', '🥫', 4.3, 118, 63, '', 'Slow-simmered with basil and garlic.'],
    [6374, 'Chickpeas', 'canned', 'Harvest Table', 3.75, 0, '400 g can', '🫘', 4.4, 147, 88, '', 'Tender and ready for hummus, curries and salads.'],
    [6506, 'Tuna Chunks in Water', 'canned', 'Ocean Catch', 8.95, 10.5, '3 × 160 g cans', '🐟', 4.5, 224, 60, '', 'Light tuna chunks, high in protein and low in fat.'],
    [6507, 'Sweet Corn Kernels', 'canned', 'Harvest Table', 4.5, 0, '340 g can', '🌽', 4.3, 91, 70, '', 'Sweet golden kernels, ready for salads and soups.'],
    [6508, 'Green Olives', 'canned', 'Harvest Table', 9.5, 0, '450 g jar', '🫒', 4.4, 113, 45, '', 'Plump green olives in a light brine.'],
    [6509, 'Pickled Cucumbers', 'canned', 'Harvest Table', 7.95, 0, '700 g jar', '🥒', 4.2, 79, 52, '', 'Crunchy gherkins pickled with dill and garlic.'],
    // ---- Frozen Food
    [6381, 'Margherita Pizza', 'frozen', 'Arctic Bay', 14.95, 18.5, '380 g', '🍕', 4.4, 218, 40, '', 'Stone-baked base with tomato and mozzarella.'],
    [6382, 'Crinkle Cut Fries', 'frozen', 'Arctic Bay', 11.5, 0, '1 kg', '🍟', 4.5, 195, 59, '', 'Golden and crispy straight from the oven.'],
    [6383, 'Garden Mixed Vegetables', 'frozen', 'Arctic Bay', 8.95, 0, '750 g', '🥦', 4.2, 70, 46, '', 'Peas, carrots, corn and beans, frozen at peak.'],
    [6384, 'Breaded Fish Fingers', 'frozen', 'Arctic Bay', 15.95, 0, '10 pcs', '🐟', 4.3, 101, 28, 'n', 'Crunchy crumb coating over flaky white fish.'],
    // ---- Baby
    [6450, 'Baby Diapers Size 3', 'baby', 'Tiny Steps', 79.95, 92, '60 pcs', '👶', 4.7, 287, 36, '', 'Soft, leak-guard diapers for up to 12 hours.'],
    [6451, 'Baby Wipes', 'baby', 'Tiny Steps', 24.95, 0, '3 × 80', '🧻', 4.6, 215, 78, '', 'Fragrance-free wipes made with 99% water.'],
    [6452, 'Gentle Baby Shampoo', 'baby', 'Tiny Steps', 18.95, 0, '300 ml', '🧴', 4.6, 132, 54, '', 'Tear-free formula for delicate skin and hair.'],
    [6453, 'Anti-colic Feeding Bottles', 'baby', 'Tiny Steps', 34.95, 0, '2 pcs', '🍼', 4.5, 168, 41, 'n', 'BPA-free bottles with a slow-flow teat.'],
    [6454, 'Plush Teddy Bear', 'baby', 'Tiny Steps', 29.95, 0, '30 cm', '🧸', 4.7, 109, 33, '', 'Ultra-soft toy that is safe from birth.'],
    [6455, 'Baby Cereal', 'baby', 'Tiny Steps', 14.95, 0, '250 g', '🥣', 4.4, 74, 49, '', 'Iron-enriched cereal for little ones from six months.'],
    // ---- Pet Care
    [6510, 'Dry Cat Food Chicken', 'pet', 'Paws & Co', 39.95, 45, '2 kg', '🐱', 4.6, 156, 36, '', 'Complete adult cat food with real chicken and added taurine.'],
    [6511, 'Dry Dog Food Beef', 'pet', 'Paws & Co', 69.95, 0, '4 kg', '🐶', 4.5, 131, 28, '', 'Balanced adult dog food with beef for strong muscles.'],
    [6512, 'Clumping Cat Litter', 'pet', 'Paws & Co', 29.95, 0, '5 kg', '🐾', 4.4, 98, 40, '', 'Fast-clumping litter with odour control.'],
    [6513, 'Gentle Pet Shampoo', 'pet', 'Paws & Co', 19.95, 0, '300 ml', '🧴', 4.5, 66, 33, '', 'Soap-free shampoo that leaves fur soft and shiny.'],
    [6514, 'Rubber Chew Toy', 'pet', 'Paws & Co', 14.95, 0, '1 pc', '🦴', 4.3, 59, 48, '', 'Tough rubber toy that keeps dogs busy and teeth clean.'],
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
    // ---- Sensual Care
    [6515, 'Intimate Hygiene Wash', 'sensual', 'Velvet', 24.95, 0, '200 ml', '🧴', 4.5, 77, 35, '', 'pH-balanced daily wash, gentle and fragrance-free.'],
    [6516, 'Relaxing Massage Oil', 'sensual', 'Velvet', 34.95, 39.95, '150 ml', '🌸', 4.6, 64, 22, 'n', 'Warm, nourishing oil with lavender and almond.'],
    [6517, 'Ultra Thin Condoms', 'sensual', 'Velvet', 29.95, 0, '12 pcs', '💞', 4.4, 142, 60, '', 'Ultra-thin and lubricated for comfort and protection.'],
    [6518, 'Scented Body Mist', 'sensual', 'Velvet', 27.95, 0, '150 ml', '🌺', 4.5, 88, 30, '', 'A light, long-lasting floral mist for body and hair.'],
    // ---- Pharmacy
    [6460, 'Vitamin C 1000 mg', 'pharmacy', 'VitaWell', 34.95, 42, '60 tablets', '💊', 4.6, 201, 45, '', 'Daily immune support with a citrus flavour.'],
    [6461, 'Daily Multivitamin', 'pharmacy', 'VitaWell', 49.95, 0, '90 tablets', '💊', 4.5, 167, 37, '', 'Essential vitamins and minerals in one daily tablet.'],
    [6462, 'Digital Thermometer', 'pharmacy', 'VitaWell', 27.95, 0, '1 pc', '🌡️', 4.4, 109, 33, '', 'Fast, accurate readings with a backlit display.'],
    [6463, 'Adhesive Bandages', 'pharmacy', 'VitaWell', 12.95, 0, '100 pcs', '🩹', 4.5, 144, 92, '', 'Flexible, breathable strips in assorted sizes.'],
    [6464, 'Hand Sanitizer', 'pharmacy', 'VitaWell', 14.95, 0, '500 ml', '🧴', 4.3, 128, 85, '', 'Kills 99.9% of germs with moisturising aloe.'],
    [6465, 'Disposable Face Masks', 'pharmacy', 'VitaWell', 16.95, 19.95, '50 pcs', '😷', 4.2, 83, 70, 'n', 'Three-layer breathable masks with soft ear loops.'],
    [6519, 'Paracetamol 500 mg', 'pharmacy', 'VitaWell', 9.95, 0, '24 tablets', '💊', 4.7, 312, 85, '', 'Fast relief from headaches, fever and mild pain.'],
    [6520, 'Antiseptic Cream', 'pharmacy', 'VitaWell', 12.95, 0, '30 g', '🩹', 4.5, 104, 54, '', 'Helps clean and protect minor cuts, scrapes and burns.'],
    [6521, 'Throat Lozenges', 'pharmacy', 'VitaWell', 10.95, 0, '24 lozenges', '🍯', 4.4, 126, 66, '', 'Honey and lemon lozenges that soothe a sore throat.'],
    [6522, 'Oral Rehydration Salts', 'pharmacy', 'VitaWell', 11.5, 0, '10 sachets', '🧂', 4.5, 73, 47, '', 'Restores fluids and salts lost through sweating or an upset stomach.'],
    // ---- Cleaning & Laundry
    [6388, 'Air Freshener Spray', 'cleaning', 'Sparkle Home', 10.95, 0, '300 ml', '🌸', 4.3, 92, 66, '', 'A light floral scent that lasts all day.'],
    [6390, 'Dishwashing Liquid', 'cleaning', 'Sparkle Home', 8.95, 0, '750 ml', '🧼', 4.5, 174, 68, '', 'Cuts through grease with a fresh lemon scent.'],
    [6391, 'Laundry Detergent', 'cleaning', 'Sparkle Home', 36.95, 42, '3 L', '🧺', 4.6, 241, 37, '', 'Deep-clean formula, gentle on colours.'],
    [6394, 'All-Purpose Cleaner', 'cleaning', 'Sparkle Home', 12.5, 14.5, '1 L', '🧽', 4.5, 112, 45, '', 'Streak-free shine on every surface.'],
    [6395, 'Scrub Brush Set', 'cleaning', 'Sparkle Home', 15.95, 0, '3 pcs', '🧽', 4.4, 88, 56, '', 'Stiff bristles for tiles, pots and tough stains.'],
    [6396, 'Microfibre Mop & Bucket', 'cleaning', 'Sparkle Home', 59.95, 69, '1 set', '🪣', 4.5, 143, 22, 'n', 'Spin-wring bucket with two washable mop heads.'],
    [6397, 'Soft Broom & Dustpan', 'cleaning', 'Sparkle Home', 24.95, 0, '1 set', '🧹', 4.3, 97, 40, '', 'Soft bristles that sweep up fine dust and crumbs.'],
    [6398, 'Toilet Brush & Holder', 'cleaning', 'Sparkle Home', 13.95, 0, '1 set', '🚽', 4.2, 61, 63, '', 'Hygienic holder with a slim, hard-wearing brush.'],
    [6399, 'Dish Brush with Soap Dispenser', 'cleaning', 'Sparkle Home', 11.95, 14.5, '1 pc', '🧼', 4.5, 120, 74, '', 'A press-to-fill handle keeps washing-up quick and tidy.'],
    // ---- Disposables
    [6392, 'Kitchen Paper Towels', 'disposables', 'Sparkle Home', 19.95, 0, '6 rolls', '🧻', 4.5, 189, 52, '', 'Extra-absorbent two-ply sheets.'],
    [6393, 'Heavy Duty Bin Bags', 'disposables', 'Sparkle Home', 9.5, 0, '30 bags', '🗑️', 4.3, 64, 74, '', 'Strong, leak-proof bags with drawstring.'],
    [6523, 'Paper Cups', 'disposables', 'PackRight', 8.95, 0, '50 pcs', '🥤', 4.3, 109, 75, '', 'Sturdy 8 oz cups for hot and cold drinks.'],
    [6524, 'Paper Plates', 'disposables', 'PackRight', 9.5, 0, '50 pcs', '🍽️', 4.2, 88, 66, '', 'Strong 9-inch plates for parties and picnics.'],
    [6525, 'Aluminium Foil', 'disposables', 'PackRight', 12.95, 14.95, '30 m roll', '🧻', 4.5, 154, 58, '', 'Heavy-duty foil for baking, grilling and wrapping.'],
    [6526, 'Cling Film', 'disposables', 'PackRight', 7.95, 0, '60 m roll', '🧻', 4.3, 97, 61, '', 'Clear, clingy film that keeps food fresh.'],
    [6527, 'Disposable Cutlery Set', 'disposables', 'PackRight', 10.5, 0, '100 pcs', '🍴', 4.1, 71, 50, '', 'Forks, knives and spoons in a convenient pack.'],
    // ---- Electronics
    [6440, 'AA Alkaline Batteries', 'electronics', 'VoltEdge', 24.95, 0, '12 pack', '🔋', 4.6, 311, 120, '', 'Long-lasting power for remotes, toys and torches.'],
    [6441, 'LED Light Bulbs E27', 'electronics', 'VoltEdge', 29.95, 34.95, '4 pack', '💡', 4.5, 174, 64, '', 'Warm white, 10 W, rated for up to 15,000 hours.'],
    [6442, 'USB-C Fast Charger', 'electronics', 'VoltEdge', 39.95, 0, '30 W', '🔌', 4.5, 148, 47, '', 'Compact wall charger for phones and tablets.'],
    [6443, 'Wired Earphones', 'electronics', 'VoltEdge', 24.95, 0, '1 pair', '🎧', 4.2, 96, 82, '', 'Clear sound with an in-line mic and volume control.'],
    [6444, 'Rechargeable LED Torch', 'electronics', 'VoltEdge', 32.95, 0, '1 pc', '🔦', 4.5, 85, 39, '', 'Bright beam with USB charging and three modes.'],
    [6445, 'Power Bank', 'electronics', 'VoltEdge', 79, 95, '10,000 mAh', '🔋', 4.6, 233, 24, 'n', 'Slim, fast-charging power on the go.'],
    [6446, '4-Way Extension Socket', 'electronics', 'VoltEdge', 34.95, 0, '3 m', '🔌', 4.4, 119, 55, '', 'Surge-protected with individual switches.'],
    // ---- Stationery & Office Supplies
    [6528, 'A4 Copy Paper', 'stationery', 'DeskPro', 24.95, 0, '500 sheets', '📄', 4.6, 167, 70, '', 'Bright white 80 gsm paper for printers and copiers.'],
    [6529, 'Ballpoint Pens', 'stationery', 'DeskPro', 9.95, 12.5, '10 pcs', '🖊️', 4.4, 142, 90, '', 'Smooth-writing blue pens with a comfortable grip.'],
    [6530, 'Spiral Notebook', 'stationery', 'DeskPro', 11.95, 0, 'A5, 100 pages', '📓', 4.5, 118, 64, '', 'Ruled pages and a sturdy cover for school or work.'],
    [6531, 'Sticky Notes', 'stationery', 'DeskPro', 7.5, 0, '12 pads', '🗒️', 4.6, 93, 77, '', 'Bright repositionable notes for reminders and planning.'],
    [6532, 'Permanent Markers', 'stationery', 'DeskPro', 13.95, 0, '6 colours', '🖍️', 4.3, 61, 44, '', 'Quick-drying markers that write on almost any surface.'],
    [6533, 'Desktop Stapler Set', 'stationery', 'DeskPro', 17.95, 0, '1 set', '📎', 4.4, 55, 38, '', 'Stapler with 1,000 staples and a staple remover.'],
    // ---- Organic & Special Diet
    [6534, 'Organic Quinoa', 'organic', 'Pure Earth', 24.95, 0, '500 g', '🌾', 4.6, 82, 40, 'n', 'Protein-rich organic grain that cooks in 15 minutes.'],
    [6535, 'Gluten-Free Pasta', 'organic', 'Pure Earth', 12.95, 0, '400 g', '🍝', 4.3, 69, 46, '', 'Corn and rice pasta with a classic firm bite.'],
    [6536, 'Unsweetened Almond Milk', 'organic', 'Pure Earth', 13.95, 15.95, '1 L', '🥛', 4.4, 91, 38, '', 'Dairy-free, creamy and naturally low in sugar.'],
    [6537, 'Chia Seeds', 'organic', 'Pure Earth', 16.95, 0, '250 g', '🌱', 4.7, 104, 35, '', 'Rich in fibre and omega-3, great in smoothies and puddings.'],
    [6538, 'Sugar-Free Sweetener', 'organic', 'Pure Earth', 14.5, 0, '200 tablets', '🍬', 4.2, 58, 50, '', 'Zero-calorie tablets for tea, coffee and desserts.'],
    // ---- Breakfast Food
    [6356, 'Wild Flower Honey', 'breakfast', 'Harvest Table', 38.5, 45, '500 g jar', '🍯', 4.8, 318, 42, '', 'Raw, unblended honey with a floral aroma and a naturally thick, golden texture.'],
    [6377, 'Crunchy Corn Flakes', 'breakfast', 'Harvest Table', 13.5, 15.5, '500 g', '🥣', 4.2, 135, 57, '', 'Golden flakes that stay crisp in milk.'],
    [6378, 'Creamy Peanut Butter', 'breakfast', 'Harvest Table', 15.95, 0, '340 g', '🥜', 4.6, 197, 39, '', 'Smooth, roasted and made with just peanuts and salt.'],
    [6540, 'Rolled Oats', 'breakfast', 'Sunrise', 11.95, 0, '1 kg', '🥣', 4.6, 143, 62, '', 'Wholegrain oats for creamy porridge and overnight oats.'],
    [6541, 'Strawberry Jam', 'breakfast', 'Sunrise', 8.95, 0, '370 g jar', '🍓', 4.4, 101, 57, '', 'Made with real fruit and a spoonful of sunshine.'],
    [6542, 'Chocolate Hazelnut Spread', 'breakfast', 'Sunrise', 19.95, 23.95, '400 g jar', '🍫', 4.7, 276, 44, '', 'Silky chocolate and hazelnut spread for toast and pancakes.'],
    [6543, 'Pancake Mix', 'breakfast', 'Sunrise', 9.5, 0, '500 g', '🥞', 4.3, 74, 49, 'n', 'Fluffy pancakes in minutes, just add milk and eggs.'],
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
    // ---- Dates & Dried Fruits
    [6362, 'Roasted Mixed Nuts', 'dates', 'Crunchy Lane', 29.95, 34.95, '400 g', '🥜', 4.6, 212, 35, '', 'Cashews, almonds and pistachios, lightly roasted.'],
    [6544, 'Medjool Dates', 'dates', 'Palm Grove', 39.95, 0, '500 g', '🌴', 4.8, 321, 41, '', 'Large, soft and caramel-sweet dates.'],
    [6545, 'Ajwa Dates', 'dates', 'Palm Grove', 54.95, 59.95, '500 g', '🌴', 4.9, 267, 26, '', 'Premium dark dates from Madinah, soft and rich.'],
    [6546, 'Dried Apricots', 'dates', 'Palm Grove', 17.95, 0, '250 g', '🍑', 4.4, 96, 52, '', 'Sun-dried, tangy-sweet and full of fibre.'],
    [6547, 'Seedless Raisins', 'dates', 'Palm Grove', 9.95, 0, '300 g', '🍇', 4.3, 84, 66, '', 'Plump golden raisins for baking and snacking.'],
    // ---- Snacks & Candy
    [6360, 'Sea Salt Potato Chips', 'snacks', 'Crunchy Lane', 6.5, 0, '150 g', '🍟', 4.5, 267, 77, '', 'Thin, crisp and lightly salted.'],
    [6361, 'Dark Chocolate Bar', 'snacks', 'Crunchy Lane', 8.95, 10.5, '100 g · 70% cocoa', '🍫', 4.7, 291, 62, '', 'Deep, smooth and not too sweet.'],
    [6363, 'Salted Pretzels', 'snacks', 'Crunchy Lane', 5.95, 0, '200 g', '🥨', 4.2, 84, 54, '', 'Crunchy twists with a salty finish.'],
    [6364, 'Butter Popcorn', 'snacks', 'Crunchy Lane', 7.5, 0, '3 × 80 g', '🍿', 4.4, 120, 66, '', 'Movie-night popcorn ready in three minutes.'],
    [6365, 'Choc Chip Cookies', 'snacks', 'Crunchy Lane', 10.95, 0, '12 pcs', '🍪', 4.6, 233, 48, '', 'Chewy centres loaded with chocolate chips.'],
    [6366, 'Fruity Gummy Bears', 'snacks', 'Crunchy Lane', 5.25, 0, '180 g', '🍬', 4.1, 76, 91, '', 'Soft, fruity and fun for all ages.'],
    // ---- Bakery
    [6330, 'Sourdough Loaf', 'bakery', 'Golden Crust', 8.5, 0, '500 g', '🍞', 4.8, 226, 22, '', 'Slow-fermented with a crackly crust and chewy crumb.'],
    [6331, 'Butter Croissants', 'bakery', 'Golden Crust', 11.95, 0, '4 pcs', '🥐', 4.9, 398, 28, '', 'Flaky, buttery layers baked fresh each morning.'],
    [6332, 'Arabic Bread', 'bakery', 'Golden Crust', 3.5, 0, 'Pack of 6', '🫓', 4.5, 372, 85, '', 'Soft, warm flatbread for every meal.'],
    [6333, 'Wholewheat Sandwich Loaf', 'bakery', 'Golden Crust', 5.95, 0, '600 g', '🍞', 4.2, 141, 44, '', 'Fibre-rich sliced loaf for everyday sandwiches.'],
    [6334, 'Double Chocolate Muffins', 'bakery', 'Golden Crust', 14.5, 17, '4 pcs', '🧁', 4.6, 167, 19, '', 'Moist, indulgent muffins studded with chocolate.'],
    [6335, 'Glazed Donuts', 'bakery', 'Golden Crust', 16, 0, '6 pcs', '🍩', 4.5, 129, 0, '', 'Pillowy donuts finished with a sweet glaze.'],
    [6336, 'Plain Bagels', 'bakery', 'Golden Crust', 9.5, 0, '4 pcs', '🥯', 4.4, 92, 31, 'n', 'Dense, chewy bagels that toast beautifully.'],
    // ---- Beverages
    [6350, 'Orange Juice', 'beverages', 'Splash', 9.95, 0, '1 L', '🍊', 4.5, 288, 58, '', '100% juice, no added sugar.'],
    [6352, 'Classic Cola', 'beverages', 'Splash', 13.95, 15.95, '6 × 330 ml cans', '🥤', 4.6, 502, 96, '', 'Ice-cold refreshment in every can.'],
    [6357, 'Mango Nectar', 'beverages', 'Splash', 8.75, 0, '1 L', '🥭', 4.3, 98, 49, 'n', 'Sun-ripened mango flavour, served chilled.'],
    [6573, 'Energy Drink', 'beverages', 'Splash', 11.95, 0, '4 × 250 ml', '⚡', 4.0, 133, 88, '', 'Fizzy energy drink with caffeine and B vitamins.'],
    [6574, 'Apple Juice', 'beverages', 'Splash', 8.95, 0, '1 L', '🍎', 4.4, 119, 62, '', '100% pressed apple juice, no added sugar.'],
    // ---- Milk
    [6320, 'Fresh Whole Milk', 'milk', 'Pure Meadow', 6.25, 0, '1 L', '🥛', 4.6, 612, 90, '', 'Full-cream milk with a rich, creamy taste.'],
    [6321, 'Low Fat Milk', 'milk', 'Pure Meadow', 11.5, 0, '2 L', '🥛', 4.4, 233, 64, '', 'Light, fresh and lower in fat.'],
    [6565, 'Long Life Full Cream Milk', 'milk', 'Pure Meadow', 9.95, 0, '1 L', '🥛', 4.5, 267, 110, '', 'UHT milk that keeps for months until opened.'],
    [6566, 'Chocolate Milk', 'milk', 'Pure Meadow', 4.5, 0, '250 ml', '🍫', 4.6, 176, 96, '', 'Cold and creamy chocolate milk, a favourite with kids.'],
    [6567, 'Lactose-Free Milk', 'milk', 'Pure Meadow', 8.75, 0, '1 L', '🥛', 4.3, 72, 40, '', 'All the taste of milk, gentle on sensitive stomachs.'],
    // ---- Water
    [6351, 'Sparkling Water', 'water', 'Splash', 11.5, 0, '6 × 330 ml', '🫧', 4.4, 137, 72, '', 'Crisp bubbles with a clean, light taste.'],
    [6355, 'Natural Mineral Water', 'water', 'Splash', 9.95, 0, '12 × 500 ml', '💧', 4.7, 624, 120, '', 'Pure spring water, naturally balanced minerals.'],
    [6563, 'Drinking Water', 'water', 'Splash', 8.5, 0, '6 × 1.5 L', '💧', 4.5, 389, 130, '', 'Purified drinking water in a convenient family pack.'],
    [6564, 'Lemon Sparkling Water', 'water', 'Splash', 10.95, 0, '6 × 330 ml', '🍋', 4.4, 96, 64, '', 'Sparkling water with a zero-sugar lemon twist.'],
    // ---- Ice Cream
    [6380, 'Vanilla Bean Ice Cream', 'icecream', 'Arctic Bay', 17.95, 0, '1 L tub', '🍨', 4.7, 276, 34, '', 'Real vanilla specks in a velvety scoop.'],
    [6560, 'Chocolate Ice Cream', 'icecream', 'Arctic Bay', 17.95, 0, '1 L tub', '🍨', 4.7, 238, 38, '', 'Deep cocoa ice cream with chocolate chunks.'],
    [6561, 'Strawberry Ice Cream Cups', 'icecream', 'Arctic Bay', 14.95, 0, '6 × 100 ml', '🍧', 4.4, 112, 46, '', 'Single-serve cups, creamy with real strawberry pieces.'],
    [6562, 'Mango Sorbet Bars', 'icecream', 'Arctic Bay', 12.95, 15.5, '6 bars', '🍡', 4.5, 97, 42, 'n', 'Dairy-free bars bursting with ripe mango.'],
    // ---- Cooking & Baking
    [6370, 'Basmati Rice', 'cooking', 'Harvest Table', 34.95, 39.95, '5 kg', '🍚', 4.7, 584, 50, '', 'Long, fragrant grains that cook up fluffy and separate.'],
    [6371, 'Spaghetti', 'cooking', 'Harvest Table', 4.95, 0, '500 g', '🍝', 4.5, 331, 110, '', 'Durum wheat pasta with a firm bite.'],
    [6372, 'Extra Virgin Olive Oil', 'cooking', 'Harvest Table', 42, 0, '750 ml', '🫒', 4.8, 267, 24, '', 'Cold-pressed with a fruity, peppery finish.'],
    [6376, 'Plain Flour', 'cooking', 'Harvest Table', 5.5, 0, '2 kg', '🌾', 4.4, 109, 76, '', 'Fine, versatile flour for baking and sauces.'],
    [6548, 'White Sugar', 'cooking', 'Harvest Table', 6.95, 0, '2 kg', '🍚', 4.4, 112, 90, '', 'Fine granulated sugar for baking and hot drinks.'],
    [6549, 'Baking Powder', 'cooking', 'Harvest Table', 3.95, 0, '100 g', '🧁', 4.3, 67, 80, '', 'Reliable raising agent for light cakes and scones.'],
    [6550, 'Pure Vanilla Extract', 'cooking', 'Harvest Table', 14.95, 0, '50 ml', '🍦', 4.6, 58, 33, '', 'Natural vanilla for cakes, creams and custards.'],
    [6551, 'Sunflower Oil', 'cooking', 'Harvest Table', 16.95, 19.95, '1.5 L', '🌻', 4.5, 189, 72, '', 'Light, neutral oil for frying and everyday cooking.'],
    // ---- Condiments
    [6375, 'Fine Sea Salt', 'condiments', 'Harvest Table', 2.95, 0, '750 g', '🧂', 4.3, 61, 100, '', 'Pure and mineral-rich for everyday cooking.'],
    [6552, 'Tomato Ketchup', 'condiments', 'Taste Co.', 7.95, 0, '500 g', '🍅', 4.5, 232, 85, '', 'Thick, sweet-tangy ketchup made with ripe tomatoes.'],
    [6553, 'Mayonnaise', 'condiments', 'Taste Co.', 9.5, 0, '400 ml', '🥚', 4.4, 154, 70, '', 'Smooth and creamy for sandwiches, salads and dips.'],
    [6554, 'Yellow Mustard', 'condiments', 'Taste Co.', 6.5, 0, '255 g', '🌭', 4.2, 63, 55, '', 'Classic tangy mustard for burgers and hot dogs.'],
    [6555, 'Soy Sauce', 'condiments', 'Taste Co.', 8.95, 0, '500 ml', '🍶', 4.5, 118, 60, '', 'Naturally brewed for stir-fries and marinades.'],
    [6556, 'Hot Chilli Sauce', 'condiments', 'Taste Co.', 7.5, 9.5, '200 ml', '🌶️', 4.6, 141, 48, 'n', 'A fiery, garlicky sauce for noodles, eggs and grills.'],
    // ---- Coffee & Tea
    [6353, 'Green Tea Bags', 'coffeetea', 'Harvest Table', 12.5, 0, '40 bags', '🍵', 4.5, 109, 43, '', 'Light, fragrant and gently energising.'],
    [6354, 'Ground Coffee', 'coffeetea', 'Harvest Table', 27.95, 32.95, '250 g', '☕', 4.8, 346, 31, '', 'Medium roast with notes of cocoa and caramel.'],
    [6557, 'Instant Coffee', 'coffeetea', 'Harvest Table', 24.95, 28.95, '200 g jar', '☕', 4.6, 210, 52, '', 'Rich, smooth freeze-dried coffee, ready in seconds.'],
    [6558, 'Black Tea Bags', 'coffeetea', 'Harvest Table', 11.95, 0, '100 bags', '🍵', 4.7, 305, 78, '', 'Strong, bright black tea for a classic cup.'],
    [6559, 'Cardamom Arabic Coffee', 'coffeetea', 'Harvest Table', 29.95, 0, '250 g', '☕', 4.8, 147, 36, 'n', 'Lightly roasted coffee blended with fresh cardamom.'],
    // ---- Deli & Fresh Chicken
    [6340, 'Chicken Breast Fillets', 'deli', 'Prime Cut', 32.95, 36.95, '1 kg', '🍗', 4.6, 457, 36, '', 'Skinless, boneless and trimmed for easy cooking.'],
    [6345, 'Chicken Wings', 'deli', 'Prime Cut', 24.95, 0, '1 kg', '🍗', 4.4, 203, 33, '', 'Juicy wings ready for baking or air-frying.'],
    [6568, 'Sliced Turkey Breast', 'deli', 'Prime Cut', 17.95, 0, '200 g', '🦃', 4.4, 109, 34, '', 'Lean, thinly sliced halal turkey for sandwiches.'],
    [6569, 'Chicken Mortadella', 'deli', 'Prime Cut', 12.95, 14.5, '250 g', '🥓', 4.2, 81, 41, '', 'Mild halal chicken mortadella with pistachios.'],
    [6570, 'Marinated Chicken Skewers', 'deli', 'Prime Cut', 29.95, 0, '500 g', '🍢', 4.6, 163, 27, 'n', 'Ready to grill, marinated in garlic, lemon and herbs.'],
    // ---- Meat & Seafood
    [6341, 'Lean Beef Mince', 'meat', 'Prime Cut', 29.95, 0, '500 g', '🥩', 4.5, 238, 27, '', 'Freshly minced lean beef for burgers and sauces.'],
    [6342, 'Lamb Chops', 'meat', 'Prime Cut', 44.5, 0, '500 g', '🍖', 4.7, 144, 0, '', 'Tender, well-marbled chops for the grill.'],
    [6343, 'Atlantic Salmon Fillet', 'meat', 'Ocean Catch', 54.95, 62, '400 g', '🐟', 4.8, 311, 16, '', 'Rich in omega-3 with a buttery texture.'],
    [6344, 'Jumbo Shrimp', 'meat', 'Ocean Catch', 48, 0, '500 g', '🦐', 4.6, 119, 14, '', 'Peeled and deveined, cooks in minutes.'],
    [6346, 'Beef Burger Patties', 'meat', 'Prime Cut', 26.5, 0, '6 pcs', '🍔', 4.5, 175, 25, 'n', 'Thick, flavourful patties for the perfect burger.'],
    // ---- Household Essentials
    [6389, 'Laundry Basket', 'household', 'Sparkle Home', 29.95, 0, '50 L', '🧺', 4.4, 78, 31, '', 'Ventilated basket with sturdy carry handles.'],
    [6430, 'Non-stick Frying Pan', 'household', 'Cozy Kitchen', 54.95, 65, '28 cm', '🍳', 4.6, 189, 29, '', 'Even heating and a durable non-stick coating.'],
    [6431, 'Food Storage Containers', 'household', 'Cozy Kitchen', 39.95, 0, '10 pcs', '🥡', 4.5, 163, 44, 'n', 'Airtight, stackable and microwave safe.'],
    [6432, 'Insulated Travel Mug', 'household', 'Cozy Kitchen', 29.95, 0, '450 ml', '☕', 4.5, 118, 51, '', 'Keeps drinks hot for 6 hours or cold for 12.'],
    [6433, 'Chef\'s Knife', 'household', 'Cozy Kitchen', 34.95, 0, '8 inch', '🔪', 4.7, 142, 26, '', 'Razor-sharp stainless steel with a balanced grip.'],
    [6434, 'Porcelain Dinner Set', 'household', 'Cozy Kitchen', 119, 149, '12 pcs', '🍽️', 4.6, 97, 12, '', 'Plates and bowls for four with a clean modern finish.'],
    [6435, 'Electric Kettle', 'household', 'Cozy Kitchen', 64.95, 0, '1.7 L', '🫖', 4.6, 205, 31, '', 'Rapid-boil kettle with auto shut-off.'],
    [6436, 'Wooden Cutting Boards', 'household', 'Cozy Kitchen', 32.95, 0, '3 pcs', '🪵', 4.4, 76, 38, '', 'Three sizes of sturdy boards with juice grooves.']
  ];

  /* Photos: product id -> how many photos it has. They live in images/products/<id>.webp (then <id>-2.webp, <id>-3.webp), each
     with a small copy in images/products/t/. Credits for every photo are in images/CREDITS.md. A product with no entry shows its emoji.
     To add one: drop the two files in, list the id here. */
  var IMAGES = {
    /*images:start*/
    6301: 1, 6302: 1, 6303: 1, 6304: 1, 6305: 1, 6306: 1, 6307: 1, 6308: 1, 6309: 1, 6310: 1, 6311: 1, 6312: 1, 6320: 1,
    6322: 1, 6324: 1, 6325: 1, 6330: 1, 6331: 2, 6332: 1, 6333: 1, 6334: 1, 6335: 2, 6336: 1, 6340: 1, 6341: 1, 6342: 1,
    6343: 1, 6344: 1, 6345: 1, 6346: 1, 6350: 1, 6351: 1, 6352: 1, 6353: 1, 6354: 1, 6355: 1, 6357: 1, 6360: 1, 6361: 1,
    6362: 1, 6363: 1, 6364: 1, 6365: 1, 6366: 1, 6370: 1, 6372: 1, 6373: 1, 6374: 1, 6375: 1, 6376: 1, 6377: 1, 6378: 1,
    6380: 1, 6381: 1, 6382: 1, 6383: 1, 6384: 1, 6388: 1, 6390: 1, 6391: 1, 6392: 1, 6394: 1, 6400: 1, 6402: 1, 6403: 1,
    6404: 1, 6407: 1, 6408: 1, 6412: 1, 6413: 1, 6450: 1, 6451: 1, 6452: 1, 6455: 1, 6463: 1
    /*images:end*/
  };
  function photos(id, dir) {
    var out = [];
    for (var i = 1; i <= (IMAGES[id] || 0); i++) out.push('images/' + dir + id + (i > 1 ? '-' + i : '') + '.webp');
    return out;
  }

  /* the product whose photo stands in for each department / category (home tiles, menus, search results) */
  var DEPT_COVER = { grocery: 6303, beauty: 6410, home: 6430, baby: 6453 };
  var CAT_COVER = {
    dairy: 6322, canned: 6374, frozen: 6381, baby: 6450, personal: 6400, grooming: 6412, pharmacy: 6463, cleaning: 6394, disposables: 6392,
    breakfast: 6377, produce: 6301, dates: 6362, snacks: 6361, bakery: 6331, beverages: 6350, milk: 6320, water: 6355, icecream: 6380,
    cooking: 6370, condiments: 6375, coffeetea: 6354, deli: 6340, meat: 6343
  };

  var deptById = {};
  DEPTS.forEach(function (d) { deptById[d.id] = d; d.count = 0; });
  var catById = {};
  CATEGORIES.forEach(function (c) { catById[c.id] = c; c.count = 0; });

  var PRODUCTS = RAW.map(function (r) {
    var p = {
      id: r[0], name: r[1], cat: r[2], brand: r[3], price: r[4], was: r[5] || 0, unit: r[6], emoji: r[7],
      rating: r[8], reviews: r[9], stock: r[10], isNew: r[11] === 'n', blurb: r[12]
    };
    p.imgs = photos(p.id, 'products/');
    p.thumbs = photos(p.id, 'products/t/');
    p.dept = catById[p.cat].dept;
    p.off = p.was > p.price ? Math.round((1 - p.price / p.was) * 100) : 0;
    p.pop = p.reviews * p.rating;
    catById[p.cat].count++;
    deptById[p.dept].count++;
    return p;
  });

  var byId = {};
  PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  /* department / category tile art: the preferred cover product's photo, else the most popular product in it that has one
     (img = full size, thumb = small copy; '' = no photo in that group yet, so the tile keeps its emoji) */
  function cover(x, preferred, pool) {
    var p = byId[preferred];
    if (!(p && p.imgs.length)) p = pool.filter(function (q) { return q.imgs.length; }).sort(function (a, b) { return b.pop - a.pop; })[0];
    x.img = p ? p.imgs[0] : ''; x.thumb = p ? p.thumbs[0] : '';
  }
  DEPTS.forEach(function (d) { cover(d, DEPT_COVER[d.id], PRODUCTS.filter(function (p) { return p.dept === d.id; })); });
  CATEGORIES.forEach(function (c) { cover(c, CAT_COVER[c.id], PRODUCTS.filter(function (p) { return p.cat === c.id; })); });

  var BRANDS = Array.from(new Set(PRODUCTS.map(function (p) { return p.brand; }))).sort();

  window.DATA = { DEPTS: DEPTS, deptById: deptById, CATEGORIES: CATEGORIES, PRODUCTS: PRODUCTS, BRANDS: BRANDS, catById: catById, byId: byId };
})();
