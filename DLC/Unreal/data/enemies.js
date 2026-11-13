// Unreal — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Skaarj Scout Warrior', hp: 85, atk: 10, spd: 6, color: '#27ae60', weapon: 'claws' },
      { name: 'Krall Staff Soldier', hp: 95, atk: 11, spd: 5, color: '#cca43b', weapon: 'staff' },
      { name: 'Flying Gasbag Spitter', hp: 60, atk: 9, spd: 5, color: '#d35400', weapon: 'fire' }
    ],
    bosses: [
      { name: 'Xan Kriegor Champion', hp: 620, atk: 22, spd: 6, color: '#34495e', weapon: 'rocket', special: 'Redeemer shockwave' },
      { name: 'Malcolm Team Leader', hp: 580, atk: 20, spd: 6, color: '#2980b9', weapon: 'rifle', special: 'Flak Cannon Blast Burst' }
    ],
    worldBoss: { name: 'Skaarj Warlord Overlord', hp: 1300, atk: 30, spd: 5, color: '#1e8449', weapon: 'rocket_launcher', special: 'Seeking Missiles Salvo' }
  });
}
