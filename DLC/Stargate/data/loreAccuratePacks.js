// Stargate — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('hammond', 'General Hammond', 'tactical', '#6d7d8b', 'command', 'SGC Command Mark', 'Iris Shutdown Order', 'Cheyenne Mountain Hold', 'Global Gate Authorization'),
    hero('cameron_mitchell', 'Cameron Mitchell', 'marine', '#2f4f3e', 'gun', 'F-302 Pilot Burst', 'Gate Team Push', 'Pilot Evasion Roll', 'Odyssey Fire Mission'),
    hero('vala_mal_doran', 'Vala Mal Doran', 'hacker', '#7d5f8c', 'zat', 'Goauld Trick Shot', 'Ancient Device Scam', 'Thief Exit Plan', 'Ark of Truth Gambit'),
    hero('bratac', 'Master Bra\'tac', 'tactical', '#7f8c8d', 'staff', 'Ma Tok Staff Strike', 'Rapid Staff Plasma', 'Jaffa Master Guard', 'Free Jaffa Uprising')
  ]);
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Ori Prior Zealot', 110, 14, 5, '#d9b86b', 'staff'),
      monster('Wraith Dart Raider', 95, 13, 7, '#4d6b63', 'stunner'),
      monster('Ancient Drone Trap', 80, 16, 8, '#fff6a6', 'drone')
    ],
    bosses: [
      boss('Replicarter Nanite Avatar', 600, 22, 7, '#b8c0c8', 'nanites', 'Replicator Mind Flood'),
      boss('Adria Ori Vessel', 620, 23, 6, '#e8d087', 'ori_fire', 'Book of Origin Flame')
    ]
  });
}
