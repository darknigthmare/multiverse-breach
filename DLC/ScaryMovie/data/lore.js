// Scary Movie — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'movie',
    title: { en: 'Scary Movie', fr: 'Scary Movie' },
    desc: {
      en: 'A hilarious parody franchise spoofing popular horror movies.',
      fr: 'Une franchise de parodies hilarantes tournant en dérision les films d\'horreur.'
    }
  });
}
