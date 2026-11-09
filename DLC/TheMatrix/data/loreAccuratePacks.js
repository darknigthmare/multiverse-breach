// The Matrix — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('niobe', 'Niobe', 'tactical', '#202020', 'gun', 'Logos Pistol Line', 'Highway Countermove', 'Captain Evasive Drive', 'Zion Run Through Fire'),
    hero('link_matrix', 'Link', 'hacker', '#3b4a3b', 'terminal', 'Operator Weapon Drop', 'Exit Phone Trace', 'Nebuchadnezzar Uplink', 'Construct Reload Surge'),
    hero('seraph', 'Seraph', 'slayer', '#d9b86b', 'fists', 'Guardian Palm Strike', 'Oracle Door Test', 'Golden Code Guard', 'Seraphim Firewall Kick')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('gun', 'Dual Beretta Burst', 'Motorcycle Wall Run', 'Bullet Time Cartwheel', 'Kiss of System Reboot', '#2c3e50'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('katana', 'Dojo Staff Strike', 'Red Pill Choice', 'Nebuchadnezzar Captain Guard', 'There Is No Spoon Rally', '#34495e'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Agent Upgrade Program', 115, 15, 8, '#111111', 'desert_eagle'),
      monster('Twin Ghost Exile', 100, 14, 7, '#d7d7d7', 'phase_blade'),
      monster('Merovingian Guard', 105, 13, 6, '#2b2b2b', 'smg')
    ],
    bosses: [
      boss('Merovingian Exile Lord', 540, 19, 6, '#5d4037', 'causality_code', 'Cause And Effect Trap'),
      boss('Trainman Limbo Keeper', 520, 18, 7, '#6b5b4b', 'rail_spike', 'Mobil Avenue Lock')
    ]
  });
}
