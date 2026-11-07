// Final Fantasy VII — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'barret_ff7', name: 'Barret Wallace', cat: 'marine', color: '#566573' },
    { id: 'redxiii_ff7', name: 'Red XIII', cat: 'slayer', color: '#c0392b' },
    { id: 'yuffie_ff7', name: 'Yuffie Kisaragi', cat: 'tactical', color: '#27ae60' },
    { id: 'vincent_ff7', name: 'Vincent Valentine', cat: 'horror', color: '#7b241c' }
  ]);
}
