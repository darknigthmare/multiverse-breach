// Futurama — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'amy_futurama', name: 'Amy Wong', cat: 'tactical', color: '#f5b7b1' },
    { id: 'hermes_futurama', name: 'Hermes Conrad', cat: 'hacker', color: '#27ae60' },
    { id: 'zoidberg_futurama', name: 'Zoidberg', cat: 'horror', color: '#e74c3c' }
  ]);
}
