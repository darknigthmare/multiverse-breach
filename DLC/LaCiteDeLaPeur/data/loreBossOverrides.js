// La Cite de la Peur — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Emile Gravier',
      weapon: 'sickle',
      special: 'Red Is Dead Killer Reveal',
      phases: ['Uses the masked Red Is Dead killer disguise and clumsy chase attacks', 'Loses the mask and becomes more frantic after the reveal'],
      lore: {
        fr: 'Emile Gravier est le meurtrier cache derriere le costume de Red Is Dead.',
        en: 'Emile Gravier is the murderer behind the Red Is Dead costume.'
      },
      referenceUrl: 'https://fr.wikipedia.org/wiki/La_Cit%C3%A9_de_la_peur_(film,_1994)',
      visualAnchor: 'Exact black killer costume, pale mask, sickle and later film likeness, without generic slasher additions.'
    },
    {
      name: 'Jean-Paul Martoni',
      weapon: 'handgun',
      special: 'Cannes Gangster Escape',
      phases: ['Uses intimidation and aimed handgun fire', 'Attempts a panicked escape when his protection is broken'],
      lore: {
        fr: 'Martoni est un criminel humain et ne possede aucun pouvoir surnaturel.',
        en: 'Martoni is a human criminal with no supernatural power.'
      },
      referenceUrl: 'https://fr.wikipedia.org/wiki/La_Cit%C3%A9_de_la_peur_(film,_1994)',
      visualAnchor: 'Exact Gerard Darmon likeness, dark suit and 1994 film handgun.'
    }
  ]);
}
