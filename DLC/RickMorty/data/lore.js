// Rick & Morty — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'movie',
    title: { en: 'Rick & Morty', fr: 'Rick & Morty' },
    desc: {
      en: 'Crazed multiversal dimension hopping adventures of a cynical scientist and his grandson.',
      fr: 'Les aventures dimensionnelles d\'un scientifique cynique et de son petit-fils.'
    }
  });
}
