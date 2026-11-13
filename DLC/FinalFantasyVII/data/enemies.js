// Final Fantasy VII — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Shinra Guard', hp: 85, atk: 10, spd: 5, color: '#34495e', weapon: 'rifle' },
      { name: 'Sweeper Machine', hp: 120, atk: 13, spd: 4, color: '#7f8c8d', weapon: 'machine_gun' },
      { name: 'Tonberry Stalker', hp: 130, atk: 18, spd: 2, color: '#2e7d32', weapon: 'knife' }
    ],
    bosses: [
      { name: 'Sephiroth One-Winged', hp: 760, atk: 30, spd: 7, color: '#d7dbdd', weapon: 'masamune', special: 'Supernova Memory' },
      { name: 'Jenova Synthesis Core', hp: 720, atk: 26, spd: 5, color: '#7d3c98', weapon: 'alien_cells', special: 'Jenova Reunion' }
    ]
  });
}
