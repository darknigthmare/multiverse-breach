// Predator — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'movie',
    title: { en: 'Predator', fr: 'Predator' },
    desc: {
      en: 'An interstellar clan of honorable trophy hunters stalking deadly prey.',
      fr: 'Un clan de chasseurs extraterrestres honorables traquant les proies les plus dangereuses.'
    }
  });
}
