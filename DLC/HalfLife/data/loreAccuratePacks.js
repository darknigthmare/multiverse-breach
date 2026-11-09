// Half-Life — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('eli_vance', 'Eli Vance', 'hacker', '#5d4f42', 'terminal', 'Resistance Lab Pulse', 'Gravity Tech Insight', 'Black Mesa Mentor Guard', 'White Forest Rocket Launch'),
    hero('vortigaunt_ally', 'Vortigaunt Ally', 'hacker', '#6f8f4f', 'laser', 'Vortessence Bolt', 'Antlion Guard Tame', 'Vortigaunt Healing Chant', 'Collective Shockwave')
  ]);
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Antlion Guard Spawn', 150, 17, 5, '#b07d3c', 'horn_charge'),
      monster('Combine Hunter', 120, 15, 7, '#5d6d7e', 'flechette'),
      monster('Zombie Poison Headcrab Host', 135, 14, 4, '#6b4b3a', 'poison_claw')
    ],
    bosses: [
      boss('Advisor Pod Controller', 580, 20, 3, '#6c5a7d', 'telekinesis', 'Neural Suppression'),
      boss('Overwatch Nexus Relay', 560, 21, 4, '#2c3e50', 'pulse_grid', 'Combine Suppression Field')
    ]
  });
}
