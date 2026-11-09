// Alien — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'movie',
    title: { en: 'Alien', fr: 'Alien' },
    desc: {
      en: 'Deep-space sci-fi horror centered around Weyland-Yutani and the lethal Xenomorphs.',
      fr: 'Horreur de science-fiction spatiale centrée sur Weyland-Yutani et les Xenomorphes.'
    }
  });
}
