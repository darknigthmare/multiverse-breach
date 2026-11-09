// Digimon — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Digimon', fr: 'Digimon' },
    desc: {
      en: 'Digital monsters bred in the internet networking parallel world.',
      fr: 'Des monstres numériques élevés dans le monde virtuel parallèle du réseau internet.'
    }
  });
}
