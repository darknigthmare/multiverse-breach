// Portal — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('doug_rattmann', 'Doug Rattmann', 'hacker', '#a68f66', 'terminal', 'Companion Cube Mark', 'Hidden Den Route', 'Schizoid Warning Mural', 'Lab Rat Override'),
    hero('glados_core', 'GLaDOS Potato Core', 'hacker', '#d9d4b8', 'laser', 'Passive Aggressive Zap', 'Neurotoxin Calculation', 'PotatOS Fail-Safe', 'Aperture Central Rewrite'),
    hero('cave_johnson_echo', 'Cave Johnson Echo', 'tactical', '#ff9f43', 'command', 'Combustible Lemon Throw', 'Test Subject Order', 'Moon Rock Shield', 'Science Isn t About Why')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('portalgun', 'Blue Portal Ping', 'Co-op Launch Plate', 'Robot Shell Brace', 'Atlas Portal Chain', '#2980b9'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('portalgun', 'Orange Portal Snap', 'Hardlight Bridge Redirect', 'Co-op Shell Guard', 'P-Body Test Chamber Loop', '#d35400'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Rocket Turret Prototype', 85, 15, 4, '#f4f4f4', 'rocket'),
      monster('Gel Pump Hazard', 75, 12, 5, '#ff7f2a', 'gel'),
      monster('Frankenturret Cube', 95, 10, 7, '#d9d9d9', 'shuffle')
    ],
    bosses: [
      boss('Cave Johnson Recording Core', 460, 16, 4, '#ff9f43', 'combustible_lemons', 'Combustible Lemon Lecture'),
      boss('Aperture Cooperative Test Core', 520, 18, 5, '#2980b9', 'portal_loop', 'Infinite Test Chamber')
    ]
  });
}
