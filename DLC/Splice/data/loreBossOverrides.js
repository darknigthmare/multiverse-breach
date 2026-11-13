// Splice — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Adult Dren',
      weapon: 'tail_stinger_and_wings',
      special: 'Sex-Reversal Mutation',
      phases: ['Uses rapid movement, a bladed tail and short wing-assisted attacks', 'Transitions into the documented male form with increased strength'],
      lore: {
        fr: 'Dren est l hybride cree par Clive et Elsa; sa mutation finale reste celle du film.',
        en: 'Dren is the hybrid created by Clive and Elsa; the final mutation remains the one shown in the film.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Splice_(film)',
      visualAnchor: 'Exact adult Dren from Splice, pale human-hybrid body, digitigrade legs, long bladed tail, wide-set eyes and documented wings.'
    }
  ]);
}
