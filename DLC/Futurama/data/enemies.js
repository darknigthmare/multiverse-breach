// Futurama — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Robot Mafia Enforcer', hp: 95, atk: 12, spd: 5, color: '#7f8c8d', weapon: 'tommy_gun' },
      { name: 'Brain Slug Host', hp: 70, atk: 8, spd: 6, color: '#2ecc71', weapon: 'mind_control' },
      { name: 'Momcorp Killbot', hp: 115, atk: 14, spd: 5, color: '#bdc3c7', weapon: 'laser' }
    ],
    bosses: [
      { name: 'Roberto Knife Bot', hp: 530, atk: 21, spd: 7, color: '#95a5a6', weapon: 'knife', special: 'Crazy Stab Routine' },
      { name: 'Hypnotoad Broadcast', hp: 560, atk: 20, spd: 4, color: '#2ecc71', weapon: 'hypnosis', special: 'All Glory Protocol' }
    ]
  });
}
