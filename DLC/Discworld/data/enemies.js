// Discworld — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Nac Mac Feegle Raid', hp: 70, atk: 13, spd: 8, color: '#3498db', weapon: 'tiny_brawl' },
      { name: 'Unseen University Spell Leak', hp: 95, atk: 12, spd: 5, color: '#8e44ad', weapon: 'octarine_bolt' },
      { name: 'Ankh-Morpork Assassin', hp: 90, atk: 14, spd: 7, color: '#1c2833', weapon: 'licensed_blade' }
    ],
    bosses: [
      { name: 'Auditor of Reality', hp: 560, atk: 19, spd: 5, color: '#d5dbdb', weapon: 'anti_narrative', special: 'Eliminate Irregularity' },
      { name: 'Death on Binky', hp: 680, atk: 24, spd: 6, color: '#ecf0f1', weapon: 'scythe', special: 'Final Appointment' }
    ]
  });
}
