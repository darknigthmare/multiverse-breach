// Harry Potter — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'manga',
    title: { en: 'Harry Potter', fr: 'Harry Potter' },
    desc: {
      en: 'A secret wizarding world fighting the dark forces of Voldemort.',
      fr: 'Un monde secret de sorcellerie combattant les forces obscures de Voldemort.'
    }
  });
}
