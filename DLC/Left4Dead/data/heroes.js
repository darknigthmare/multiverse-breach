// Left 4 Dead — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'coach_l4d', name: 'Coach', cat: 'marine', color: '#34495e' },
    { id: 'ellis_l4d', name: 'Ellis', cat: 'tactical', color: '#f8c471' },
    { id: 'rochelle_l4d', name: 'Rochelle', cat: 'hacker', color: '#d7dbdd' },
    { id: 'nick_l4d', name: 'Nick', cat: 'tactical', color: '#d6d6d6' }
  ]);
}
