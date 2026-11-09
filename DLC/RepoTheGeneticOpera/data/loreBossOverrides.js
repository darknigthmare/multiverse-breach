// Repo! The Genetic Opera — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Luigi Largo',
      weapon: 'knife',
      special: 'Largo Rage',
      phases: ['Uses impulsive knife lunges and enraged gestures', 'Escalates into a rapid stabbing pattern after the family argument'],
      lore: {
        fr: 'Luigi est separe de Pavi au lieu de former une cellule abstraite.',
        en: 'Luigi is separated from Pavi rather than forming an abstract cell.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Repo!_The_Genetic_Opera',
      visualAnchor: 'Exact Bill Moseley likeness as Luigi Largo, black slick hair, dark fashionable suit, facial makeup and knife.'
    },
    {
      name: 'Pavi Largo',
      weapon: 'face_mask_and_cane',
      special: 'Masquerade Feint',
      phases: ['Uses theatrical cane strikes and evasive poses', 'Changes to one documented face mask and attacks more erratically'],
      lore: {
        fr: 'Pavi utilise ses visages greffes comme identite scenique.',
        en: 'Pavi uses grafted faces as his stage identity.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Repo!_The_Genetic_Opera',
      visualAnchor: 'Exact Nivek Ogre likeness as Pavi Largo, flamboyant suit, one source face mask, stylized hair and cane.'
    }
  ]);
}
