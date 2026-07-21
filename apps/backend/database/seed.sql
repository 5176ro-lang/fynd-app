INSERT INTO users (name, username, email, zip_code, neighborhood, bio) VALUES
('Maya Chen', 'mayac', 'maya@example.com', '43201', 'Short North', 'Grad student, always decluttering my closet.'),
('Deja Williams', 'dejaw', 'deja@example.com', '43214', 'Clintonville', 'Vintage collector, happy to trade for plants or tools.'),
('Sam Osei', 'samosei', 'sam@example.com', '43203', 'Olde Towne East', 'Handy with yard work and small repairs.'),
('Ruth Kaplan', 'ruthk', 'ruth@example.com', '43206', 'German Village', 'Downsizing after 30 years in the same house.');

INSERT INTO listings (user_id, title, description, category, listing_type, listing_mode, looking_for, photo_url, hashtags, status, expires_at) VALUES
(1, 'Hand-painted Minion dresser', 'Solid wood dresser, hand-painted as a Minion character. 5 working drawers, some paint wear on the bottom drawer.', 'Yard & Home', 'item', 'swap', 'A plain dresser or storage bin, or a small bookshelf', '/photos/minion-dresser.png', '{furniture,kidsroom,upcycled}', 'available', NOW() + INTERVAL '3 weeks'),
(2, 'Boho patchwork slip dress', 'Sequin bodice, flowy patchwork skirt with lace side panels. Worn twice, no damage.', 'Fashion', 'item', 'swap', 'Another statement dress or a pair of boots', '/photos/boho-slip-dress.png', '{boho,slipdress,y2k}', 'available', NOW() + INTERVAL '2 weeks'),
(3, 'Roborock QR Series robot vacuum', 'Brand new, still sealed in box. Multifunctional dock, HyperForce suction, auto mop lifting.', 'Electronics', 'item', 'swap', 'Kitchen appliances or a lawn mowing session', '/photos/roborock-vacuum.png', '{roborock,vacuum,unopened}', 'pending', NOW() + INTERVAL '1 month'),
(4, 'Dark wood office desk + chair', 'Matching desk and rolling office chair, both solid condition. Great for a dorm or home office.', 'Yard & Home', 'item', 'swap', 'A couch, dresser, or moving help', '/photos/office-desk-chair.png', '{deskchair,homeoffice,furniture}', 'available', NOW() + INTERVAL '1 month'),
(1, 'Woven rattan serving bowl', 'Rattan bowl with a polished metal rim, great as a fruit bowl or centerpiece.', 'Kitchen', 'item', 'free', NULL, '/photos/woven-bowl.png', '{rattan,kitchen,decor}', 'available', NOW() + INTERVAL '1 week'),
(2, 'Tall faux bamboo potted plant', 'Realistic faux bamboo plant in a ceramic-look pot, about 5 feet tall. No watering required.', 'Yard & Home', 'item', 'swap', 'A real houseplant or a plant stand', '/photos/potted-plant.jpg', '{plant,homedecor,faux}', 'available', NOW() + INTERVAL '2 weeks'),
(3, 'Antique drop-leaf coffee table', 'Solid wood coffee table with drop-leaf sides, some surface wear consistent with age.', 'Yard & Home', 'item', 'swap', 'A modern coffee table or an area rug', '/photos/wood-coffee-table.png', '{vintage,coffeetable,wood}', 'available', NOW() + INTERVAL '3 weeks'),
(4, 'Ray-Ban Clubmaster sunglasses', 'Classic Ray-Ban Clubmasters, comes with original box and cleaning cloth.', 'Fashion', 'item', 'swap', 'A wallet or another pair of sunglasses', '/photos/rayban-sunglasses.png', '{rayban,sunglasses,y2k}', 'swapped', NOW() - INTERVAL '2 days'),
(1, 'Designer perfume bottle', 'Barely used designer fragrance, roughly 80% full.', 'Fashion', 'item', 'free', NULL, '/photos/perfume-bottle.webp', '{perfume,fragrance,beauty}', 'available', NOW() + INTERVAL '1 week'),
(2, 'Fragrance rollerball & mini set', 'A set of rollerball perfumes and mini fragrance bottles, mixed brands, mostly full.', 'Fashion', 'item', 'swap', 'Jewelry or a tote bag', '/photos/fragrance-set.jpg', '{fragrance,rollerball,beauty}', 'available', NOW() + INTERVAL '2 weeks'),
(3, 'Sports video game bundle', 'Stack of sports video games (NBA, soccer titles, and more), all in cases.', 'Electronics', 'item', 'swap', 'Different video games or a controller', '/photos/video-game-bundle.png', '{videogames,sports,bundle}', 'swapped', NOW() - INTERVAL '1 day'),
(4, 'Costume jewelry lot — necklaces & bracelets', 'A large mixed lot of necklaces and bracelets, costume jewelry, great for layering.', 'Fashion', 'item', 'swap', 'Another jewelry lot or hair accessories', '/photos/jewelry-lot-1.jpg', '{jewelry,necklaces,vintage}', 'available', NOW() + INTERVAL '3 weeks'),
(1, 'Jewelry lot — necklaces & watch', 'Assorted necklaces plus a watch, mixed metals and styles.', 'Fashion', 'item', 'swap', 'A wallet, belt, or scarf', '/photos/jewelry-lot-2.jpg', '{jewelry,watch,accessories}', 'available', NOW() + INTERVAL '1 month'),
(2, 'Jewelry lot — bracelets & rings', 'Mixed bracelets and rings, costume jewelry in good condition.', 'Fashion', 'item', 'free', NULL, '/photos/jewelry-lot-3.jpg', '{jewelry,rings,bracelets}', 'available', NOW() + INTERVAL '1 week'),
(3, 'Khaki canvas shoulder bag', 'Canvas shoulder bag with leather trim, roomy main compartment.', 'Fashion', 'item', 'swap', 'A backpack or crossbody bag', '/photos/khaki-bag.jpg', '{bag,canvas,everyday}', 'available', NOW() + INTERVAL '2 weeks'),
(4, 'Silver bucket bag', 'Metallic silver bucket-style handbag with drawstring closure, lightly worn.', 'Fashion', 'item', 'swap', 'A neutral tote or clutch', '/photos/silver-bucket-bag.jpg', '{bag,silver,y2k}', 'available', NOW() + INTERVAL '3 weeks'),
(1, 'Mixed clothing lot', 'A bundle of mixed clothing — tops, shorts, and dresses in various sizes and colors.', 'Fashion', 'item', 'free', NULL, '/photos/clothing-lot.jpg', '{clothinglot,bundle,mixed}', 'available', NOW() + INTERVAL '1 week'),
(2, 'Plaid pleated dress', 'Plaid schoolgirl-style pleated dress, fitted bodice, above-the-knee length.', 'Fashion', 'item', 'swap', 'A cardigan or knee-high socks/boots', '/photos/plaid-dress.jpg', '{plaid,pleated,preppy}', 'available', NOW() + INTERVAL '2 weeks'),
(3, 'Black suede knee-high boots', 'Wedge knee-high boots in black suede, true to size, good condition.', 'Fashion', 'item', 'swap', 'Sneakers or ankle boots, same size', '/photos/black-boots-1.jpg', '{boots,suede,fall}', 'swapped', NOW() - INTERVAL '3 days'),
(4, 'Dark textured leggings', 'Patterned textured leggings, stretchy, barely worn.', 'Fashion', 'item', 'swap', 'Leggings or joggers in a similar style', '/photos/dark-leggings.jpg', '{leggings,activewear,pattern}', 'available', NOW() + INTERVAL '1 month'),
(1, 'Striped woven throw blanket', 'Colorful striped throw blanket, soft woven cotton, great for a couch or picnic.', 'Yard & Home', 'item', 'swap', 'A different throw blanket or pillows', '/photos/striped-blanket.jpg', '{blanket,throw,homedecor}', 'available', NOW() + INTERVAL '3 weeks');

INSERT INTO swaps (listing_id, requester_id, offered_listing_id, offer_description, status) VALUES
(3, 1, 5, NULL, 'proposed'),
(19, 2, 2, NULL, 'completed'),
(8, 3, 11, NULL, 'completed'),
(5, 4, NULL, 'I would love this bowl, happy to pick up anytime!', 'proposed');

INSERT INTO reviews (swap_id, reviewer_id, reviewee_id, rating, comment) VALUES
(2, 2, 3, 5, 'Boots fit perfectly and were exactly as described!'),
(3, 3, 4, 4, 'Sunglasses were great, smooth pickup at the library.');