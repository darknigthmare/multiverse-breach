// Payday — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Police Blue Swat Force', hp: 75, atk: 7, spd: 5, color: '#2980b9', weapon: 'gun' },
      { name: 'Shield Heavy Swat', hp: 110, atk: 8, spd: 4, color: '#7f8c8d', weapon: 'shield_bash' },
      { name: 'Cloaker Sneaker', hp: 60, atk: 14, spd: 8, color: '#111317', weapon: 'kick' }
    ],
    bosses: [
      { name: 'Heavy Bulldozer', hp: 600, atk: 22, spd: 3, color: '#27ae60', weapon: 'shotgun', special: 'Armor Charge Slam' },
      { name: 'Taser Spec-Ops Force', hp: 440, atk: 15, spd: 6, color: '#2980b9', weapon: 'taser', special: 'Stun Lock Electroshock' }
    ],
    worldBoss: { name: 'SWAT Armored Turret Van', hp: 1250, atk: 28, spd: 4, color: '#34495e', weapon: 'bullet_spray', special: 'Laser Target Gatling Storm' }
  });
}
