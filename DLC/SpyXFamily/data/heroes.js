// Spy x Family — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'bond_spy', name: 'Bond Forger', cat: 'hacker', color: '#d7d3c8' },
    { id: 'fiona_spy', name: 'Fiona Frost', cat: 'tactical', color: '#d7dbdd' },
    { id: 'yuri_spy', name: 'Yuri Briar', cat: 'slayer', color: '#34495e' }
  ]);
}
