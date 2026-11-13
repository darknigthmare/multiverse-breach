// Team Fortress 2 — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'demoman_tf2', name: 'Demoman', cat: 'slayer', color: '#7d3c98' },
    { id: 'heavy_tf2', name: 'Heavy', cat: 'marine', color: '#c0392b' },
    { id: 'engineer_tf2', name: 'Engineer', cat: 'hacker', color: '#f4d03f' },
    { id: 'medic_tf2', name: 'Medic', cat: 'hacker', color: '#ecf0f1' },
    { id: 'spy_tf2', name: 'Spy', cat: 'tactical', color: '#34495e' }
  ]);
}
