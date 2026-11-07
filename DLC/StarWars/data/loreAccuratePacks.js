// Star Wars — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('leia', 'Leia Organa', 'tactical', '#f5eef8', 'gun', 'Rebel Blaster Shot', 'Command Cell Rally', 'Diplomatic Resolve Guard', 'Resistance Beacon'),
    hero('obiwan', 'Obi-Wan Kenobi', 'slayer', '#d8c3a5', 'lightsaber', 'Soresu Saber Cut', 'Jedi Mind Feint', 'High Ground Guard', 'Kenobi Final Lesson'),
    hero('ahsoka', 'Ahsoka Tano', 'slayer', '#f39c12', 'lightsaber', 'Twin Saber Flash', 'Fulcrum Ambush', 'Force Leap Guard', 'World Between Paths')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('lightsaber', 'Sith Saber Cut', 'Force Choke Hold', 'Dark Side Guard', 'Imperial March Execution', '#2d3436'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('gun', 'DL-44 Quickdraw', 'Falcon Smuggler Run', 'Carbonite Luck Guard', 'Kessel Run Fire', '#ffeaa7'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Stormtrooper Fireteam', 85, 10, 5, '#f5f5f5', 'blaster'),
      monster('Droideka Shield Unit', 125, 14, 4, '#b8860b', 'twin_blaster'),
      monster('Inquisitor Probe', 110, 15, 7, '#111111', 'red_saber')
    ],
    bosses: [
      boss('Emperor Palpatine', 620, 24, 5, '#1b1b1b', 'force_lightning', 'Unlimited Power Storm'),
      boss('Darth Maul Phantom', 600, 23, 8, '#8b0000', 'double_saber', 'Duel of the Fates Rush')
    ]
  });
}
