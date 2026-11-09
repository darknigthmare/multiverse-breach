// Ghostbusters — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Class V Full Roaming Vapor', hp: 85, atk: 10, spd: 7, color: '#2ecc71', weapon: 'slime' },
      { name: 'Terror Dog', hp: 120, atk: 14, spd: 6, color: '#5d4037', weapon: 'claws' },
      { name: 'Library Ghost', hp: 80, atk: 9, spd: 5, color: '#d5dbdb', weapon: 'fear_scream' }
    ],
    bosses: [
      { name: 'Gozer the Gozerian', hp: 650, atk: 24, spd: 6, color: '#d7bde2', weapon: 'dimension_bolt', special: 'Choose and Perish' },
      { name: 'Stay Puft Marshmallow Man', hp: 740, atk: 27, spd: 3, color: '#ecf0f1', weapon: 'marshmallow_stomp', special: 'Cross the Streams' }
    ]
  });
}
