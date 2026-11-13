// Yu-Gi-Oh — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'manga',
    title: { en: 'Yu-Gi-Oh', fr: 'Yu-Gi-Oh' },
    desc: {
      en: 'Ancient Egyptian magic manifest through modern trading card duel monsters.',
      fr: 'La magie de l\'Égypte ancienne manifestée à travers des cartes de duels de monstres.'
    }
  });
}
