// Fallout — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('dogmeat', 'Dogmeat', 'horror', '#8b5a2b', 'bite', 'Faithful Bite', 'Fetch Disarm', 'Companion Guard', 'Wasteland Best Friend'),
    hero('courier_six', 'Courier Six', 'tactical', '#c2a76b', 'gun', 'Lucky Revolver Shot', 'V.A.T.S. Gamble', 'Desert Ranger Cover', 'Hoover Dam Wild Card'),
    hero('lone_wanderer', 'Lone Wanderer', 'tactical', '#f1c40f', 'gun', '10mm Vault Shot', 'Pip-Boy Scan', 'Vault 101 Grit', 'Project Purity Stand')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('laser', 'Laser Rifle Volley', 'Power Armor Charge', 'Brotherhood Bulwark', 'Liberty Prime Beacon', '#7f8c8d'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('gun', 'Detective Revolver Shot', 'Synth Clue Scan', 'Noir Trench Guard', 'Valentine Case File', '#2d3436'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Deathclaw Matriarch', 160, 20, 7, '#8d6e63', 'claws'),
      monster('Feral Ghoul Reaver', 115, 14, 8, '#6e6b47', 'radiated_claws'),
      monster('Sentry Bot Mk II', 145, 17, 4, '#7f8c8d', 'minigun')
    ],
    bosses: [
      boss('Frank Horrigan Echo', 700, 27, 5, '#2d3436', 'plasma_blade', 'Enclave Power Armor Crush'),
      boss('Liberty Prime Malfunction', 760, 29, 3, '#bdc3c7', 'laser', 'Democracy Laser Barrage')
    ]
  });
}
