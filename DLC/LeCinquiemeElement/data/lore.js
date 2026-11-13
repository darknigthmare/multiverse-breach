// Le Cinquième Element — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'movie',
    title: { en: 'The Fifth Element', fr: 'Le Cinquième Élément' },
    desc: {
      en: 'A colorful future defending the universe from the Ultimate Cosmic Evil.',
      fr: 'Un futur coloré défendant l\'univers contre le Mal Cosmique Suprême.'
    }
  });
}
