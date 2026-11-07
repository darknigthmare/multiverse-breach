// Mass Effect — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Mass Effect', fr: 'Mass Effect' },
    desc: {
      en: 'A galaxy-wide space opera defending organic life from the machine Reapers.',
      fr: 'Un space-opera galactique défendant les organiques contre les machines Moissonneurs.'
    }
  });
}
