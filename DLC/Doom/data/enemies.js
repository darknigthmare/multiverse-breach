// Doom — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Imp Fireball Thrower', hp: 70, atk: 10, spd: 5, color: '#d35400', weapon: 'fire' },
      { name: 'Possessed Combat Soldier', hp: 85, atk: 9, spd: 5, color: '#2ecc71', weapon: 'shotgun' },
      { name: 'Leaping Pinky Demon', hp: 110, atk: 12, spd: 6, color: '#e74c3c', weapon: 'charge' }
    ],
    bosses: [
      { name: 'Cyberdemon Lord', hp: 750, atk: 26, spd: 4, color: '#5d4037', weapon: 'rocket_launcher', special: 'Tyrant Rocket Storm' },
      { name: 'Spider Mastermind Mother', hp: 680, atk: 22, spd: 4, color: '#7f8c8d', weapon: 'plasma', special: 'Plasma Pulse Ring' }
    ],
    worldBoss: { name: 'Icon Of Sin Titan', hp: 1600, atk: 38, spd: 3, color: '#3e2723', weapon: 'fists', special: 'Apocalyptic Fire Breath' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Imp Fireballer', hp: 75, atk: 11, spd: 6, color: '#a04000', weapon: 'fireball' },
      { name: 'Cacodemon Orb', hp: 115, atk: 13, spd: 4, color: '#c0392b', weapon: 'bite' },
      { name: 'Revenant Jetpack', hp: 120, atk: 15, spd: 6, color: '#d7dbdd', weapon: 'missiles' },
      { name: 'Mancubus Flame Tank', hp: 150, atk: 17, spd: 3, color: '#8b4513', weapon: 'flame_cannons' }
    ],
    bosses: [
      { name: 'Marauder Sentinel-Fallen', hp: 620, atk: 25, spd: 7, color: '#7b241c', weapon: 'argent_axe', special: 'Wolf and Axe Counter' },
      { name: 'Spider Mastermind Core', hp: 720, atk: 27, spd: 3, color: '#2c3e50', weapon: 'plasma_brain', special: 'Hell Network Overload' }
    ]
  });
}
