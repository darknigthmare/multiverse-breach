// Rick & Morty — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('beth_smith', 'Beth Smith', 'tactical', '#f5b7b1', 'gun', 'Horse Surgeon Precision', 'Space Mom Shot', 'Family Denial Guard', 'Clone Question Split'),
    hero('jerry_smith', 'Jerry Smith', 'horror', '#f7dc6f', 'melee', 'Awkward Flail', 'Beekeeping Distraction', 'Pathetic Luck Guard', 'Jerryboree Chaos'),
    hero('space_beth', 'Space Beth', 'slayer', '#e74c3c', 'laser', 'Galactic Rebel Beam', 'Federation Raid', 'Clone Armor Guard', 'Space Mom Revolution')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('laser', 'Morty Panic Shot', 'Death Crystal Warning', 'Nervous Dodge', 'Aw Geez Reality Split', '#ffeaa7'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('laser', 'Teen Rebel Blast', 'Mad Max Detour', 'Family Armor Guard', 'Post-Apocalyptic Sister Rush', '#ff7675'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Federation Bug Soldier', 90, 12, 5, '#8d6e63', 'laser'),
      monster('Cronenberg Mutation', 120, 15, 6, '#d35400', 'claws'),
      monster('Meeseeks Panic Clone', 70, 11, 8, '#5dade2', 'melee')
    ],
    bosses: [
      boss('Evil Morty President', 560, 20, 7, '#f1c40f', 'portal_pistol', 'For The Damaged Coda'),
      boss('Rick Prime Decoy', 620, 23, 8, '#00d8ff', 'omega_device', 'Central Finite Trap')
    ]
  });
}
