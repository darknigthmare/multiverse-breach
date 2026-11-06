// Mad Max — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'War Boy Raider Cadet', hp: 75, atk: 9, spd: 5, color: '#e5e7e9', weapon: 'spear' },
      { name: 'Buzzard Spike Car', hp: 70, atk: 12, spd: 6, color: '#7f8c8d', weapon: 'ram' },
      { name: 'Mutant War Pup Gladiator', hp: 85, atk: 10, spd: 5, color: '#566573', weapon: 'club' }
    ],
    bosses: [
      { name: 'Rictus Erectus Colossus', hp: 620, atk: 22, spd: 4, color: '#5c221e', weapon: 'fists', special: 'Gigantic V8 Engine Smash' },
      { name: 'Immortan Joe Warlord', hp: 560, atk: 20, spd: 5, color: '#cca43b', weapon: 'gun', special: 'Valhalla Chrome Sacrifice' }
    ],
    worldBoss: { name: 'The Gigahorse Interceptor Rig', hp: 1350, atk: 32, spd: 4, color: '#2c3e50', weapon: 'harpoon', special: 'Muzzle-Flash Flame Spewer' }
  });
}
