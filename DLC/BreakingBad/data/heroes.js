// Breaking Bad — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'jesse_pinkman', name: 'Jesse Pinkman', cat: 'slayer', color: '#f1c40f' },
    { id: 'saul_goodman', name: 'Saul Goodman', cat: 'hacker', color: '#f4d03f' },
    { id: 'mike_ehrmantraut', name: 'Mike Ehrmantraut', cat: 'tactical', color: '#566573' }
  ]);
}
