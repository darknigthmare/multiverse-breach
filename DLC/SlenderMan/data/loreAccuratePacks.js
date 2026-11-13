// Slender Man — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('kate_slender', 'Kate Milens', 'horror', '#839192', 'flashlight', 'Flashlight Panic Sweep', 'Forest Path Sprint', 'Page Route Dodge', 'Arrival Escape Signal'),
    hero('charlie_matheson', 'Charlie Matheson Echo', 'horror', '#7b7d7d', 'claws', 'Missing Child Echo', 'Mine Tunnel Lunge', 'Memory Static Hide', 'Burned Trail Manifest'),
    hero('lauren_slender', 'Lauren', 'tactical', '#aab7b8', 'camera', 'Camera Light Flash', 'Generator Restart', 'Safe House Barricade', 'Eight Pages Route')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('knife', 'Mask Static Slash', 'Proxy Ambush', 'Camera Jam Guard', 'Marble Hornets Pursuit', '#6c5ce7'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('gun', 'Hooded Proxy Shot', 'Tape Distortion Trap', 'Forest Hide Guard', 'Static Proxy Rush', '#ffeaa7'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Proxy Knife Runner', 75, 13, 7, '#2c3e50', 'knife'),
      monster('Burned Mine Echo', 95, 12, 5, '#5d4037', 'fire'),
      monster('Static Camera Blindspot', 65, 10, 8, '#dfe6e9', 'static')
    ],
    bosses: [
      boss('The Operator Forest Core', 560, 18, 7, '#f5f5f5', 'static_tendrils', 'Page Eight Blackout'),
      boss('Proxy Circle Ambush', 520, 19, 6, '#111111', 'knives', 'No-Eyes Surround')
    ]
  });
}
