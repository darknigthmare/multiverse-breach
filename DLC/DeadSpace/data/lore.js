// Dead Space — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Dead Space', fr: 'Dead Space' },
    desc: {
      en: 'An industrial space miner fighting mutated Necromorphs spawned by Marker signals.',
      fr: 'Un ingénieur spatial combattant des Nécromorphes mutants générés par le Monolithe.'
    }
  });
}
