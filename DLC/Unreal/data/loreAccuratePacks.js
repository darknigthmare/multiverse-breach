// Unreal — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('xan_kriegor', 'Xan Kriegor', 'marine', '#f1c40f', 'gun', 'Shock Rifle Combo', 'Liandri Lock-On', 'Champion Armor Belt', 'Tournament Final Sweep'),
    hero('lauren_ut', 'Lauren', 'slayer', '#c0392b', 'gun', 'Dual Enforcer Burst', 'Flak Cannon Rush', 'Armor Shard Guard', 'Arena Queen Combo'),
    hero('gorge_ut', 'Gorge', 'marine', '#7f8c8d', 'gun', 'Rocket Arena Shot', 'Adrenaline Surge', 'Heavy Shield Belt', 'Liandri Tank Push')
  ]);
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Skaarj Warrior', 115, 15, 7, '#27ae60', 'claws'),
      monster('Liandri Combat Bot', 100, 14, 6, '#bdc3c7', 'shock_rifle'),
      monster('Redeemer Drone', 80, 20, 4, '#f1c40f', 'missile')
    ],
    bosses: [
      boss('Xan Kriegor Champion', 650, 25, 7, '#f1c40f', 'shock_combo', 'Tournament Champion Combo'),
      boss('Skaarj Queen', 700, 26, 5, '#27ae60', 'teleport_claws', 'Unreal Hive Gate')
    ]
  });
}
