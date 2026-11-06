// Payday — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Payday', fr: 'Payday' },
    desc: {
      en: 'A notorious mask-wearing crew conducting high-stakes robberies and bank heists.',
      fr: 'Un gang de braqueurs masqués effectuant des casses de banques spectaculaires.'
    }
  });
}
