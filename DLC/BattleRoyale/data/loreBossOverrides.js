// Battle Royale — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Kazuo Kiriyama',
      weapon: 'compact_firearms',
      special: 'Cold Ambush',
      phases: ['Uses the film compact firearm loadout and calculated ambushes', 'Keeps attacking with visible wounds in the final phase'],
      lore: {
        fr: 'Kiriyama est l adversaire le plus meurtrier du programme du film.',
        en: 'Kiriyama is the deadliest opponent in the film s program.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Battle_Royale_(film)',
      visualAnchor: 'Exact Japanese school uniform, black hair, cold expression and source-accurate firearm loadout from the 2000 film.'
    },
    {
      name: 'Mitsuko Souma',
      weapon: 'sickle_and_sidearm',
      special: 'Deceptive Sickle Rush',
      phases: ['Uses feints and fast sickle combinations', 'Adds the film sidearm after being staggered'],
      lore: {
        fr: 'Mitsuko survit par la tromperie, la faucille et les armes prises aux autres eleves.',
        en: 'Mitsuko survives through deception, her sickle and weapons taken from other students.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Battle_Royale_(film)',
      visualAnchor: 'Exact school uniform, hair, facial likeness and sickle from the 2000 film, with no armor.'
    }
  ]);
}
