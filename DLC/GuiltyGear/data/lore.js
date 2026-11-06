// Guilty Gear — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Guilty Gear', fr: 'Guilty Gear' },
    desc: {
      en: 'High-octane magical brawls in a future shaped by living biological weapons.',
      fr: 'Combats magiques intenses dans un futur façonné par des armes biologiques vivantes.'
    }
  });
}
