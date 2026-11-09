// Saw — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'movie',
    title: { en: 'Saw', fr: 'Saw' },
    desc: {
      en: 'Moral testing traps designed by the Jigsaw killer to value human life.',
      fr: 'Des pièges moraux mortels conçus par le tueur au puzzle pour évaluer la volonté de vivre.'
    }
  });
}
