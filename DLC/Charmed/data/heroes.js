// Charmed — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'prue_charmed', name: 'Prue Halliwell', cat: 'hacker', color: '#8e44ad' },
    { id: 'paige_charmed', name: 'Paige Matthews', cat: 'hacker', color: '#d7bde2' },
    { id: 'leo_charmed', name: 'Leo Wyatt', cat: 'marine', color: '#85c1e9' }
  ]);
}
