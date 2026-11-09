// Chappie — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Vincent Moore',
      weapon: 'military_rifle_and_moose_command',
      special: 'MOOSE Deployment',
      phases: ['Uses grounded rifle fire and commands the MOOSE remotely', 'Panics and fights directly after the MOOSE link is disrupted'],
      lore: {
        fr: 'Vincent Moore cherche a imposer MOOSE au detriment des Scouts et de Chappie.',
        en: 'Vincent Moore tries to impose MOOSE at the expense of the Scouts and Chappie.'
      },
      referenceUrl: 'https://www.sonypictures.com/movies/chappie',
      visualAnchor: 'Exact Hugh Jackman likeness, mullet, khaki shorts, tactical vest and film firearm.'
    },
    {
      name: 'Hippo',
      weapon: 'gang_rifle',
      special: 'Gang Suppression Fire',
      phases: ['Uses heavy suppressive fire and intimidation', 'Advances aggressively after his gang support is defeated'],
      lore: {
        fr: 'Hippo est le chef de gang qui menace Ninja, Yolandi et Chappie.',
        en: 'Hippo is the gang leader who threatens Ninja, Yolandi and Chappie.'
      },
      referenceUrl: 'https://www.sonypictures.com/movies/chappie',
      visualAnchor: 'Exact bulky gangster build, beard, street clothing and film rifle, with no robotic parts.'
    }
  ]);
}
