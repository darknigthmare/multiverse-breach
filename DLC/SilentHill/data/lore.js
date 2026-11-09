// Silent Hill — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Silent Hill', fr: 'Silent Hill' },
    desc: {
      en: 'A psychological survival-horror universe where the town of Silent Hill reshapes guilt, grief, trauma, cult ritual, and buried truth into fog streets, rust Otherworld cycles, symbolic monsters, sirens, radios, and personal trials that cannot be solved by violence alone.',
      fr: 'Un univers survival-horror psychologique ou la ville de Silent Hill transforme culpabilite, deuil, trauma, rituel de culte et verite enfouie en rues de brouillard, cycles Otherworld rouilles, monstres symboliques, sirenes, radios parasites et proces personnels qui ne se resolvent pas seulement par la violence.'
    }
  });
}
