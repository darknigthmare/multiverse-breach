// Digital Circus — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'movie',
    title: { en: 'The Amazing Digital Circus', fr: 'The Amazing Digital Circus' },
    desc: {
      en: 'Humans trapped in a whimsical yet distressing digital virtual reality circus.',
      fr: 'Des humains piégés dans un cirque virtuel de réalité numérique loufoque.'
    }
  });
}
