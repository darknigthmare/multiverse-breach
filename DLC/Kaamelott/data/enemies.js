// Kaamelott — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Pict Raider', hp: 85, atk: 10, spd: 6, color: '#6e4f39', weapon: 'axe' },
      { name: 'Roman Tax Patrol', hp: 95, atk: 11, spd: 5, color: '#7f8c8d', weapon: 'gladius' },
      { name: 'Quest Bureaucrat', hp: 80, atk: 8, spd: 4, color: '#d6b465', weapon: 'paperwork' }
    ],
    bosses: [
      { name: 'Roi Burgonde', hp: 580, atk: 18, spd: 3, color: '#d6b465', weapon: 'feast_command', special: 'Cuillere Diplomatique' },
      { name: 'Meleagant Shadow', hp: 540, atk: 19, spd: 5, color: '#1c1c1c', weapon: 'despair_word', special: 'Kingdom Doubt' },
      { name: 'Lancelot War Camp', hp: 600, atk: 22, spd: 5, color: '#d7dbdd', weapon: 'white_blade', special: 'Betrayal Formation' }
    ]
  });
}
