// Fallout — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Fallout', fr: 'Fallout' },
    desc: {
      en: 'A retro-futuristic post-apocalyptic nuclear wasteland survival world.',
      fr: 'Un monde rétro-futuriste post-apocalyptique ravagé par la guerre nucléaire.'
    }
  });
}
