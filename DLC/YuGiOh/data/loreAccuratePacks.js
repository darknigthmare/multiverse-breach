// Yu-Gi-Oh — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('atem', 'Pharaoh Atem', 'tactical', '#1f1b52', 'cards', 'Duelist Command', 'Dark Magician Circle', 'Millennium Puzzle Guard', 'Mind Crush Judgment'),
    hero('pegasus_ygo', 'Maximillion Pegasus', 'hacker', '#d7bde2', 'cards', 'Toon Summon', 'Millennium Eye Read', 'Toon World Escape', 'Relinquished Absorption'),
    hero('tea_gardner', 'Tea Gardner', 'hacker', '#f39c12', 'cards', 'Friendship Draw', 'Support Spell Boost', 'Duel Spirit Guard', 'Heart of the Team'),
    hero('mai_valentine', 'Mai Valentine', 'slayer', '#d4af37', 'cards', 'Harpie Lady Slash', 'Perfume Tactics', 'Mirror Wall Feint', 'Harpie Sisters Storm')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('cards', 'Blue-Eyes Command', 'Enemy Controller Input', 'KaibaCorp Shield', 'Obelisk Tribute Crush', '#2980b9'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('cards', 'Red-Eyes Slash', 'Time Wizard Gamble', 'Brooklyn Guard', 'Flame Swordsman Rally', '#e67e22'));
}

export function createLoreAccurateHeroOverrides3({ loadout }) {
  return (loadout('cards', 'Toon Summon', 'Millennium Eye Read', 'Toon World Escape', 'Relinquished Absorption', '#d7bde2'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Trap Card Mimic', 70, 13, 5, '#8e44ad', 'trap'),
      monster('Kuriboh', 55, 8, 8, '#8d6e63', 'multiply_guard'),
      monster('Blue-Eyes Token Dragon', 130, 16, 5, '#dce9ff', 'white_light')
    ],
    bosses: [
      boss('Marik Shadow Game Host', 560, 20, 6, '#7d3c98', 'millennium_rod', 'Shadow Game Life Drain'),
      boss('Pegasus Toon Master', 520, 18, 5, '#e8d8b0', 'toon_cards', 'Toon World Rewrite')
    ]
  });
}
