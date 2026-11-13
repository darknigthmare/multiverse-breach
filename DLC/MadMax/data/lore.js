// Mad Max — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'movie',
    title: { en: 'Mad Max', fr: 'Mad Max' },
    desc: {
      en: 'A desolate apocalyptic desert wasteland ruled by high-speed vehicular gangs.',
      fr: 'Un désert apocalyptique gouverné par des gangs motorisés de bolides armés.'
    }
  });
}
