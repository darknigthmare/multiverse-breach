// Dungeon Meshi — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'chilchuck_meshi', name: 'Chilchuck', cat: 'tactical', color: '#a67c52' },
    { id: 'falin_meshi', name: 'Falin', cat: 'hacker', color: '#f5d6a1' },
    { id: 'izutsumi_meshi', name: 'Izutsumi', cat: 'slayer', color: '#5d6d7e' }
  ]);
}
