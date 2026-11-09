// The Simpsons — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Itchy and Scratchy Bot', hp: 75, atk: 11, spd: 7, color: '#f4d03f', weapon: 'cartoon_saw' },
      { name: 'Springfield Power Mutant', hp: 105, atk: 12, spd: 5, color: '#2ecc71', weapon: 'radioactive_touch' },
      { name: 'Kang and Kodos Probe', hp: 95, atk: 13, spd: 6, color: '#8e44ad', weapon: 'tractor_ray' }
    ],
    bosses: [
      { name: 'Mr Burns Nuclear Scheme', hp: 520, atk: 18, spd: 4, color: '#f1c40f', weapon: 'hounds', special: 'Release the Hounds' },
      { name: 'Sideshow Bob Revenge Plot', hp: 500, atk: 19, spd: 6, color: '#e67e22', weapon: 'rake_trap', special: 'Cape Feare Ambush' }
    ]
  });
}
