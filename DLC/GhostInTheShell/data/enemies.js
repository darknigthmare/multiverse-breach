// Ghost in the Shell — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Cyborg Terrorist Commando', hp: 90, atk: 10, spd: 5, color: '#34495e', weapon: 'gun' },
      { name: 'Rogue Police Heavy Drone', hp: 80, atk: 11, spd: 5, color: '#7f8c8d', weapon: 'laser' },
      { name: 'Tachikoma Hatchling Droid', hp: 65, atk: 9, spd: 7, color: '#2980b9', weapon: 'zap' }
    ],
    bosses: [
      { name: 'Puppet Master Cyborg', hp: 520, atk: 18, spd: 6, color: '#d5dbdb', weapon: 'glitch', special: 'Cyberbrain Hack Stun' },
      { name: 'Section 6 Agent Squad', hp: 490, atk: 17, spd: 6, color: '#2c3e50', weapon: 'rifle', special: 'Thermoptic Camouflage Strike' }
    ],
    worldBoss: { name: 'Think Tank Tachikoma Core', hp: 1280, atk: 30, spd: 5, color: '#2980b9', weapon: 'missiles', special: 'Gatling Cannon Barrage Storm' }
  });
}
