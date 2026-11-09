// Chucky — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('kyle_chucky', 'Kyle', 'tactical', '#6c7a89', 'knife', 'Foster Home Strike', 'Good Guy Factory Trap', 'Protective Dodge', 'Childs Play Rescue'),
    hero('nica_pierce', 'Nica Pierce', 'horror', '#8e6f70', 'blade', 'Possession Resist Cut', 'Wheelchair Ambush', 'Mind Split Guard', 'Cult Breakout'),
    hero('jake_wheeler', 'Jake Wheeler', 'tactical', '#5dade2', 'bat', 'School Hall Swing', 'Doll Trap Reveal', 'Teen Survival Guard', 'Hackensack Stand'),
    hero('tiffany_human_bride', 'Tiffany Valentine - Human (Bride)', 'slayer', '#d8c7c2', 'knife', 'Kitchen Knife Slash', 'Aerosol Flame Burst', 'Leather Jacket Dodge', 'Damballa Bride Ritual'),
    hero('tiffany_human_wedding', 'Tiffany Valentine - Gothic Bride', 'slayer', '#f4f1e8', 'knife', 'Bridal Knife Cut', 'Bouquet Feint', 'Veil Step Guard', 'Til Death Wedding Blaze'),
    hero('tiffany_human_all_black_1998', 'Tiffany Valentine - All-Black Gothic (1998)', 'slayer', '#161016', 'knife', 'Black Leather Knife Cut', 'Aerosol Lighter Flash', 'Gothic Jacket Guard', 'Damballa Black Dress Ritual'),
    hero('tiffany_voluptuous_original_au', 'Tiffany Valentine - Voluptuous Original (Adult AU)', 'slayer', '#6f1235', 'knife', 'Velvet Knife Feint', 'Handbag Weight Swing', 'Corset Stance Guard', 'Nexus Horror Glamour'),
    hero('tiffany_leather_jacket_bride_1998', 'Tiffany Doll - Leather Jacket Bride (1998)', 'slayer', '#eee8dc', 'knife', 'Vinyl Bride Knife Cut', 'Aerosol Spark Burst', 'Black Jacket Dodge', 'Til Death Doll Ritual'),
    hero('tiffany_dark_haired_wedding_belle_au', 'Tiffany Doll - Dark-Haired Wedding Belle (AU)', 'horror', '#eee3d7', 'knife', 'Porcelain Knife Prick', 'Belle Body Feint', 'Wedding Ribbon Guard', 'Alternate Bride Possession'),
    hero('tiffany_burned_bald_damage_au', 'Tiffany Doll - Burned and Bald (Damage AU)', 'horror', '#5a3a2f', 'knife', 'Charred Vinyl Slash', 'Smoke Spark Burst', 'Scorched Jacket Brace', 'Damaged Damballa Return'),
    hero('tiffany_human_two_piece_bikini_au', 'Tiffany Valentine - Two-Piece Bikini (Adult AU)', 'horror', '#6d1829', 'magic', 'Gothic Palm Strike', 'Poolside Sidestep', 'Crossed-Arm Guard', 'Nexus Damballa Sigil'),
    hero('tiffany_doll_two_piece_bikini_au', 'Tiffany Doll - Two-Piece Bikini (Adult AU)', 'horror', '#8d2036', 'magic', 'Vinyl Palm Jab', 'Toy-Step Spin', 'Jointed Guard', 'Damballa Doll Sigil'),
    hero('tiffany_street_siren_au', 'Tiffany Valentine - Street Siren (Adult AU)', 'slayer', '#b3132b', 'knife', 'Handbag Chain Swing', 'Pepper Spray Burst', 'Platform Heel Reversal', 'Neon Night Ambush'),
    hero('tiffany_synthetic_companion_doll_au', 'Tiffany Valentine - Synthetic Doll (Adult AU)', 'hacker', '#d34b91', 'blade', 'Spring Handbag Strike', 'Perfume Circuit Mist', 'Articulated Kick Guard', 'Companion Protocol Override'),
    hero('tiffany_leather_mistress_au', 'Tiffany Valentine - Leather Mistress (Adult AU)', 'slayer', '#5e1738', 'blade', 'Riding Crop Cut', 'Chain Lash Snare', 'Leather Stance Counter', 'Damballa Command Performance'),
    hero('tiffany_street_siren_doll_au', 'Tiffany Doll - Street Siren (Adult AU)', 'slayer', '#a6192e', 'knife', 'Mini Handbag Swing', 'Pocket Spray Burst', 'Vinyl Boot Counter', 'Street Doll Ambush'),
    hero('tiffany_synthetic_companion_doll_form_au', 'Tiffany Doll - Synthetic Companion (Adult AU)', 'hacker', '#cf4d9a', 'blade', 'Spring Purse Strike', 'Circuit Perfume Cloud', 'Toy Joint Guard', 'Wind-Up Protocol Override'),
    hero('tiffany_leather_mistress_doll_au', 'Tiffany Doll - Leather Mistress (Adult AU)', 'slayer', '#49132d', 'blade', 'Mini Crop Slash', 'Toy Chain Snare', 'Vinyl Leather Counter', 'Damballa Doll Command'),
    hero('jennifer_tilly_seed', 'Jennifer Tilly (Seed of Chucky)', 'tactical', '#6b4a32', 'handbag', 'Handbag Swing', 'Movie Set Flash', 'Fur Coat Brace', 'Final Girl Self-Parody'),
    hero('jennifer_tilly_seed_glamour', 'Jennifer Tilly - Seed Glamour Costume', 'tactical', '#eee4cf', 'handbag', 'Gala Handbag Counter', 'Camera Flash Feint', 'Satin Step Guard', 'Red Carpet Escape')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('knife', 'Bride Knife Cut', 'Voodoo Doll Hex', 'Glamour Dodge', 'Til Death Do Us Part', '#dfe6e9'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('axe', 'Doll Family Swing', 'Identity Split Feint', 'Good Doll Guard', 'Seed of Chucky Burst', '#a29bfe'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Good Guy Doll Swarm', 65, 10, 7, '#3498db', 'knife'),
      monster('Voodoo Amulet Echo', 80, 12, 5, '#d4af37', 'hex'),
      monster('Factory Conveyor Trap', 100, 13, 3, '#7f8c8d', 'machinery')
    ],
    bosses: [
      boss('Charles Lee Ray - Human (1988)', 580, 20, 6, '#4a4038', 'voodoo_knife', 'Damballa Soul Transfer', { spriteSource: '/sprites/generated/bosses/chucky/charles-lee-ray-human.png' }),
      boss('Nica Possession Split', 500, 18, 7, '#8e44ad', 'split_mind', 'Cult Identity Break'),
      boss('Bride Chucky (1998)', 640, 22, 7, '#d35400', 'stitched_knife', 'Stitched Bride Ambush', { spriteSource: '/sprites/generated/bosses/chucky/bride-chucky-1998.png' }),
      boss('Buddi Chucky (2019 Remake)', 610, 21, 7, '#2e86c1', 'smart_home_override', 'Kaslan Network Lockdown', { spriteSource: '/sprites/generated/bosses/chucky/buddi-chucky-2019.png' }),
      boss('Good Chucky - Scout (Season 2)', 470, 16, 7, '#5dade2', 'conditioned_doll', 'Baptism Identity Break', { spriteSource: '/sprites/generated/bosses/chucky/good-chucky-season-2.png' }),
      boss('Buff Chucky - Hulk (Season 2)', 760, 29, 5, '#b9770e', 'brute_fists', 'Good Guy Power Slam', { spriteSource: '/sprites/generated/bosses/chucky/buff-chucky-season-2.png' }),
      boss('Colonel Chucky (Season 2)', 690, 24, 6, '#6b5b3e', 'survival_knife', 'Incarnate Lord Command', { spriteSource: '/sprites/generated/bosses/chucky/colonel-chucky-season-2.png' }),
      boss('Belle Disguise Chucky (Season 2)', 560, 20, 8, '#f2f2ed', 'hidden_knife', 'Blonde Disguise Reveal', { spriteSource: '/sprites/generated/bosses/chucky/belle-chucky-season-2.png' }),
      boss('Christmas Chucky (Season 2)', 650, 25, 7, '#c0392b', 'chainsaw', 'Silent Night Chainsaw', { spriteSource: '/sprites/generated/bosses/chucky/christmas-chucky-season-2.png' }),
      boss('Old Chucky (Season 3)', 720, 27, 4, '#8b7355', 'voodoo_cane', 'White House Damballa Last Stand', { spriteSource: '/sprites/generated/bosses/chucky/old-chucky-season-3.png' })
    ]
  });
}
