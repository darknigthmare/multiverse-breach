// Attack on Titan — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'levi_aot', name: 'Levi Ackerman', cat: 'slayer', color: '#566573' },
    { id: 'hange_aot', name: 'Hange Zoe', cat: 'hacker', color: '#8e6e53' },
    { id: 'erwin_aot', name: 'Erwin Smith', cat: 'tactical', color: '#d6b465' }
  ]);
}
