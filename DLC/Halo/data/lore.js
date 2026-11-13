// Halo — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Halo', fr: 'Halo' },
    desc: {
      en: 'A military science-fiction universe where the UNSC fights the Covenant across ancient Forerunner ringworlds, while the Flood and the true purpose of the Halo array threaten every living civilization.',
      fr: 'Un univers de science-fiction militaire ou l UNSC affronte le Covenant sur d anciens anneaux Forerunner, tandis que le Parasite et la vraie fonction du reseau Halo menacent toute civilisation vivante.'
    }
  });
}
