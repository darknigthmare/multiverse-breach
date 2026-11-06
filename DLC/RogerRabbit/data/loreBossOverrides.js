// Roger Rabbit — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Smart Ass',
      weapon: 'toon_revolver',
      special: 'Toon Patrol Execution Order',
      phases: ['Uses a cartoon revolver and directs Toon Patrol attacks', 'Combines elastic toon movement with faster close-range shots'],
      lore: {
        fr: 'Smart Ass dirige la Toon Patrol au service du juge Doom.',
        en: 'Smart Ass leads the Toon Patrol for Judge Doom.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Who_Framed_Roger_Rabbit',
      visualAnchor: 'Exact short brown weasel toon, zoot suit, fedora and revolver from Who Framed Roger Rabbit.'
    },
    {
      name: 'Psycho and Greasy - Toon Patrol Duo',
      weapon: 'straight_razor_and_toon_props',
      special: 'Toon Patrol Crossfire',
      phases: ['Greasy uses a straight razor while Psycho attacks with manic lunges', 'The duo alternates attacks faster after one is staggered'],
      lore: {
        fr: 'Psycho et Greasy combattent comme un duo indivisible de la Toon Patrol.',
        en: 'Psycho and Greasy fight as one inseparable Toon Patrol duo.'
      },
      referenceUrl: 'https://disney.fandom.com/wiki/Toon_Patrol',
      visualAnchor: 'Exact green-suited Greasy and wild-haired Psycho toon designs, both fully visible, no Judge Doom features.'
    }
  ]);
}
