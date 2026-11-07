// Harry Potter — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('dumbledore', 'Albus Dumbledore', 'hacker', '#d9b86b', 'wand', 'Elder Wand Spark', 'Phoenix Flame Ward', 'Pensieve Foresight', 'Army of Light Duel'),
    hero('sirius_black', 'Sirius Black', 'slayer', '#2c3e50', 'wand', 'Animagus Lunge', 'Order Ambush Hex', 'Godfather Guard', 'Azkaban Breakout'),
    hero('neville', 'Neville Longbottom', 'tactical', '#27ae60', 'sword', 'Gryffindor Sword Cut', 'Herbology Snare', 'D.A. Defiance Guard', 'Nagini Final Strike')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('wand', 'Stupefy Precision', 'Alohomora Route Hack', 'Protego Maxima', 'Time-Turner Study Loop', '#fdcb6e'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('wand', 'Chessboard Strike', 'Deluminator Spark', 'Weasley Courage Guard', 'Knight Sacrifice Rally', '#e67e22'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Dementor Patrol', 105, 13, 5, '#111111', 'soul_drain'),
      monster('Basilisk Hatchling', 130, 17, 4, '#145a32', 'venom'),
      monster('Acromantula Swarm', 95, 14, 7, '#3d2b1f', 'web')
    ],
    bosses: [
      boss('Bellatrix Lestrange Duelist', 560, 21, 7, '#2c3e50', 'dark_wand', 'Cruciatus Spiral'),
      boss('Voldemort Horcrux Shade', 680, 25, 6, '#dfe6e9', 'elder_wand', 'Avada Kedavra Thread')
    ]
  });
}
