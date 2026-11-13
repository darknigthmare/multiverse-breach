// Rosario + Vampire — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'manga',
    title: { en: 'Rosario + Vampire', fr: 'Rosario + Vampire' },
    desc: {
      en: 'A human boy accidentally enrolling in a boarding school for Yokai monsters.',
      fr: 'Un garçon humain inscrit par erreur dans un lycée secret pour monstres Yokai.'
    }
  });
}
