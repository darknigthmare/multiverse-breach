// Planete Hurlante — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'David - Type 3 Screamer',
      weapon: 'concealed_screamer_blade',
      special: 'Child-Disguise Rupture',
      phases: ['Approaches in the blond child disguise with the teddy bear', 'Reveals compact Screamer machinery and an internal blade for the attack phase'],
      lore: {
        fr: 'Le Type 3 utilise l apparence de David pour infiltrer les survivants.',
        en: 'The Type 3 uses David s appearance to infiltrate the survivors.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Screamers_(1995_film)',
      visualAnchor: 'Blond child from the 1995 film carrying a teddy bear, with subtle synthetic seams and compact machinery visible only during the reveal.'
    },
    {
      name: 'Becker - Type 2 Screamer',
      weapon: 'sidearm_and_machine_claws',
      special: 'Synthetic Skin Break',
      phases: ['Fights in Becker s human disguise with the film sidearm', 'Torn synthetic skin exposes industrial killer-machine components below 45 percent health'],
      lore: {
        fr: 'La copie de Becker revele la paranoia des nouveaux Screamers humanoides.',
        en: 'The Becker duplicate embodies the paranoia created by the new humanoid Screamers.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Screamers_(1995_film)',
      visualAnchor: 'Becker s exact film clothing and human likeness, progressively exposing thin industrial machine parts under torn synthetic skin.'
    }
  ]);
}
