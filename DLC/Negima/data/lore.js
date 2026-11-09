// Negima — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'manga',
    title: { en: 'Negima!', fr: 'Negima!' },
    desc: {
      en: 'A child wizard tutor training class 3-A in magic and fighting off dark mages.',
      fr: 'Un enfant magicien enseignant à la classe 3-A et combattant des mages noirs.'
    }
  });
}
