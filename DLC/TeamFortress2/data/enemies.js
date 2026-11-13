// Team Fortress 2 — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'RED Scout Rush', hp: 75, atk: 11, spd: 9, color: '#c0392b', weapon: 'scattergun' },
      { name: 'BLU Sentry Level 3', hp: 135, atk: 15, spd: 2, color: '#3498db', weapon: 'sentry_rockets' },
      { name: 'Pyro Ambush', hp: 105, atk: 14, spd: 6, color: '#e67e22', weapon: 'flamethrower' }
    ],
    bosses: [
      { name: 'Saxton Hale Arena Boss', hp: 720, atk: 28, spd: 7, color: '#d35400', weapon: 'fists', special: 'Mann Co. Punch' },
      { name: 'Merasmus Spellfield', hp: 600, atk: 23, spd: 5, color: '#8e44ad', weapon: 'bombinomicon', special: 'Halloween Spell Chaos' }
    ]
  });
}
