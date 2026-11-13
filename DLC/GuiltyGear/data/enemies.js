// Guilty Gear — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Holy Order Squire', hp: 85, atk: 10, spd: 5, color: '#f39c12', weapon: 'sword' },
      { name: 'Automaton Robo-Ky Drone', hp: 80, atk: 11, spd: 6, color: '#95a5a6', weapon: 'laser' },
      { name: 'Leaping Gear Beast', hp: 100, atk: 12, spd: 6, color: '#922b21', weapon: 'claws' }
    ],
    bosses: [
      { name: 'Justice (Slayer Gear)', hp: 600, atk: 22, spd: 6, color: '#2c3e50', weapon: 'laser', special: 'Imperial Ray Blast' },
      { name: 'Testament Reaper Agent', hp: 490, atk: 18, spd: 5, color: '#17202a', weapon: 'scythe', special: 'Nightmare Circle Poison Scythe' }
    ],
    worldBoss: { name: 'Megadeath Class Gear', hp: 1400, atk: 32, spd: 3, color: '#78281f', weapon: 'laser', special: 'Giga-Laser Overdrive Sweep' }
  });
}
