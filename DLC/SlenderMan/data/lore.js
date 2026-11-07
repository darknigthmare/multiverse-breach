// Slender Man — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'manga',
    title: { en: 'Slender Man', fr: 'Slender Man' },
    desc: {
      en: 'A tall, faceless entity in a suit stalking and abducting victims in dark woods.',
      fr: 'Une entité longiligne sans visage traquant ses victimes dans les bois sombres.'
    }
  });
}
