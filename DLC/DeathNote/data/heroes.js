// Death Note — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'misa_dn', name: 'Misa Amane', cat: 'hacker', color: '#f5b7b1' },
    { id: 'ryuk_dn', name: 'Ryuk', cat: 'horror', color: '#1c1c1c' },
    { id: 'near_dn', name: 'Near', cat: 'hacker', color: '#d5dbdb' }
  ]);
}
