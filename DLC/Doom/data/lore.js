// Doom — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Doom', fr: 'Doom' },
    desc: {
      en: 'Hellish portals on Mars producing waves of demons crushed by the Doom Slayer.',
      fr: 'Des portails infernaux s\'ouvrant sur Mars, terrassés par le Doom Slayer.'
    }
  });
}
