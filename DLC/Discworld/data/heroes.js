// Discworld — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'twoflower_dw', name: 'Twoflower', cat: 'hacker', color: '#f4d03f' },
    { id: 'death_dw', name: 'Death', cat: 'horror', color: '#d5dbdb' },
    { id: 'vetinari_dw', name: 'Lord Vetinari', cat: 'tactical', color: '#1c2833' },
    { id: 'nanny_ogg_dw', name: 'Nanny Ogg', cat: 'hacker', color: '#9b59b6' }
  ]);
}
