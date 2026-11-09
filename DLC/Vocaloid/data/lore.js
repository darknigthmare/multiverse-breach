// Vocaloid — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'manga',
    title: { en: 'Vocaloid', fr: 'Vocaloid' },
    desc: {
      en: 'Synthesized voice music idols performing on virtual holographic neon stages.',
      fr: 'Idoles de chant synthétisé performant sur des scènes holographiques néon.'
    }
  });
}
