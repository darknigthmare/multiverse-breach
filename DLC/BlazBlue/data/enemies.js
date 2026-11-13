// BlazBlue — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Murakumo Unit Drone', hp: 85, atk: 11, spd: 6, color: '#95a5a6', weapon: 'laser' },
      { name: 'Sector Seven Soldier', hp: 95, atk: 9, spd: 5, color: '#34495e', weapon: 'gun' },
      { name: 'Boundary Beast Spawn', hp: 70, atk: 13, spd: 7, color: '#4a148c', weapon: 'claws' }
    ],
    bosses: [
      { name: 'Nu-13 Sword Unit', hp: 580, atk: 21, spd: 7, color: '#16a085', weapon: 'swords', special: 'Calamity Trigger Sword Barrage' },
      { name: 'Hazama Evil Agent', hp: 500, atk: 19, spd: 8, color: '#1e8449', weapon: 'knives', special: 'Eternal Coils Serpent Strike' }
    ],
    worldBoss: { name: 'Sword Core Mu-12', hp: 1280, atk: 30, spd: 6, color: '#1a5276', weapon: 'swords', special: 'Ouroboros Rift Destruction' }
  });
}
