// Le Cinquième Element — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('vito_cornelius', 'Vito Cornelius', 'hacker', '#d9b86b', 'relic', 'Element Glyph Trace', 'Priest Archive Seal', 'Sacred Wall Guard', 'Temple Alignment'),
    hero('diva_plavalaguna', 'Diva Plavalaguna', 'hacker', '#3498db', 'microphone', 'Operatic Pulse', 'Element Stone Reveal', 'Blue Lagoon Barrier', 'Lucia Cosmic Aria'),
    hero('david_fifth', 'David', 'tactical', '#7f8c8d', 'relic', 'Apprentice Signal', 'Stone Carry Route', 'Temple Door Hold', 'Acolyte Rescue Push')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('melee', 'Multipass Kick', 'Divine Language Burst', 'Elemental Guard', 'Supreme Being Light', '#ff7675'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('microphone', 'Supergreen Shout', 'Radio Panic Burst', 'Broadcast Dodge', 'Fhloston Paradise Signal', '#fdcb6e'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Mangalore Mercenary', 100, 13, 5, '#5d4037', 'rifle'),
      monster('Airport Police Drone', 80, 11, 6, '#34495e', 'stunner'),
      monster('Evil Planet Ember', 120, 16, 3, '#8b0000', 'fire')
    ],
    bosses: [
      boss('Jean-Baptiste Emanuel Zorg', 560, 20, 5, '#6e2c00', 'zorg_zf1', 'ZF-1 Demonstration'),
      boss('Great Evil Planet Core', 760, 28, 2, '#2b0000', 'cosmic_fire', 'Anti-Life Collision')
    ]
  });
}
