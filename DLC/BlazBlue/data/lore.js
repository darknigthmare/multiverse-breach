// BlazBlue — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'BlazBlue', fr: 'BlazBlue' },
    desc: {
      en: 'A magical technological loop centered around the Grimoires and the Boundary.',
      fr: 'Une boucle temporelle magico-technologique centrée sur les Grimoires et la Frontière.'
    }
  });
}
