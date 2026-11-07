// Yakuza — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExpansion() {
  return ([
    { id: 'ichiban_yakuza', name: 'Ichiban Kasuga', cat: 'slayer', color: '#c0392b' },
    { id: 'saejima_yakuza', name: 'Taiga Saejima', cat: 'marine', color: '#7f8c8d' },
    { id: 'akiyama_yakuza', name: 'Shun Akiyama', cat: 'tactical', color: '#f4d03f' }
  ]);
}
