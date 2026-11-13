// Left 4 Dead — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Boomer Bile Host', hp: 70, atk: 9, spd: 4, color: '#7f8c8d', weapon: 'bile_explosion' },
      { name: 'Hunter Pounce', hp: 80, atk: 14, spd: 8, color: '#566573', weapon: 'pounce' },
      { name: 'Spitter Acid Pool', hp: 75, atk: 13, spd: 5, color: '#2ecc71', weapon: 'acid_spit' }
    ],
    bosses: [
      { name: 'Witch Crying Corner', hp: 560, atk: 24, spd: 5, color: '#d5b895', weapon: 'claw_frenzy', special: 'Startled Scream' },
      { name: 'Tank Horde Breaker', hp: 720, atk: 28, spd: 4, color: '#5d4037', weapon: 'concrete_throw', special: 'Safe Room Breach' }
    ]
  });
}
