// Hazbin Hotel — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'angel_dust_hazbin', name: 'Angel Dust', cat: 'slayer', color: '#f5b7b1' },
    { id: 'husk_hazbin', name: 'Husk', cat: 'tactical', color: '#7b241c' },
    { id: 'niffty_hazbin', name: 'Niffty', cat: 'horror', color: '#c0392b' },
    { id: 'sir_pentious_hazbin', name: 'Sir Pentious', cat: 'hacker', color: '#2e4053' }
  ]);
}
