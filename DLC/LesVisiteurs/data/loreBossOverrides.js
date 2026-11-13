// Les Visiteurs — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Sorciere de Montmirail',
      weapon: 'witchcraft_and_herbs',
      special: 'Montmirail Curse',
      phases: ['Uses smoke, herbs and evasive curse gestures', 'Summons a short disorientation effect before attempting to flee'],
      lore: {
        fr: 'La sorciere est liee a la malediction initiale de Montmirail.',
        en: 'The witch is tied to Montmirail s initial curse.'
      },
      referenceUrl: 'https://fr.wikipedia.org/wiki/Les_Visiteurs_(film,_1993)',
      visualAnchor: 'Exact medieval witch clothing and aged likeness from the 1993 film, cloth pouches and herbs, no generic fantasy staff.'
    },
    {
      name: 'Jacques-Henri Jacquard',
      weapon: 'improvised_modern_props',
      special: 'Hotel Panic',
      phases: ['Uses improvised hotel props and calls security', 'Panics into fast slapstick charges when his support is gone'],
      lore: {
        fr: 'Jacquard est un antagoniste comique humain du present.',
        en: 'Jacquard is a human comic antagonist in the present day.'
      },
      referenceUrl: 'https://fr.wikipedia.org/wiki/Les_Visiteurs_(film,_1993)',
      visualAnchor: 'Exact Christian Clavier likeness as Jacquard, 1990s hotel-owner suit and hairstyle; keep him distinct from Jacquouille.'
    }
  ]);
}
