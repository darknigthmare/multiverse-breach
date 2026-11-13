// Cthulhu — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Shoggoth',
      weapon: 'protoplasmic_tentacles',
      special: 'Tekeli-li Surge',
      phases: ['Flows through openings and attacks with temporary limbs', 'Forms many eyes and a larger crushing wave while repeating the documented cry'],
      lore: {
        fr: 'Le Shoggoth suit la description protoplasmique des Montagnes hallucinees.',
        en: 'The Shoggoth follows the protoplasmic description from At the Mountains of Madness.'
      },
      referenceUrl: 'https://www.hplovecraft.com/writings/texts/fiction/mm.aspx',
      visualAnchor: 'Original rendering constrained by the text: vast black protoplasmic mass, temporary eyes and limbs, no fixed humanoid anatomy.'
    }
  ]);
}
