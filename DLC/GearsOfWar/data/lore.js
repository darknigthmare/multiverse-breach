// Gears of War — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Gears of War', fr: 'Gears of War' },
    desc: {
      en: 'A war-torn industrial planet, Sera, devastated by the subterranean Locust Horde threat.',
      fr: 'Une planète industrielle ravagée par la guerre contre la Horde de Locustes souterraines.'
    }
  });
}
