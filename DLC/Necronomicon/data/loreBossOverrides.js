// Necronomicon — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Wilbur Whateley',
      weapon: 'occult_ritual_and_hidden_tentacles',
      special: 'Whateley Body Reveal',
      phases: ['Uses ritual wards while keeping the lower body concealed', 'Reveals the text-described nonhuman anatomy after his clothing tears'],
      lore: {
        fr: 'Wilbur Whateley cache une ascendance non humaine decrite dans Dunwich.',
        en: 'Wilbur Whateley conceals a nonhuman ancestry described in Dunwich.'
      },
      referenceUrl: 'https://www.hplovecraft.com/writings/texts/fiction/dh.aspx',
      visualAnchor: 'Original rendering strictly constrained by the story s description of Wilbur, goatlike features and concealed lower-body anatomy.'
    },
    {
      name: 'Dunwich Horror',
      weapon: 'invisible_tentacles_and_crushing_mass',
      special: 'Powder-Revealed Form',
      phases: ['Attacks mostly invisible with terrain depressions and tentacles', 'Briefly reveals the text-described colossal form under powder before banishment'],
      lore: {
        fr: 'L Horreur de Dunwich est le frere invisible et monstrueux de Wilbur.',
        en: 'The Dunwich Horror is Wilbur s invisible monstrous brother.'
      },
      referenceUrl: 'https://www.hplovecraft.com/writings/texts/fiction/dh.aspx',
      visualAnchor: 'Original rendering strictly constrained by the text: colossal mostly invisible protoplasmic body, many eyes, tentacles and temporary powder outline.'
    }
  ]);
}
