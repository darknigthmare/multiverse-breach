// Star Wars — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'movie',
    title: { en: 'Star Wars', fr: 'Star Wars' },
    desc: {
      en: 'A space conflict between the Jedi Knights and the Sith Lords.',
      fr: 'Un conflit spatial galactique opposant les Chevaliers Jedi aux Seigneurs Sith.'
    }
  });
}
