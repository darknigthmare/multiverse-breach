// Defiance — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'General Rahm Tak',
      weapon: 'votan_rifle_and_grenades',
      special: 'Beast Command Offensive',
      phases: ['Uses Votan rifle fire, grenades and soldier commands', 'Broken armor exposes a faster close-combat phase'],
      lore: {
        fr: 'Rahm Tak dirige l offensive Votanis contre Defiance.',
        en: 'Rahm Tak leads the Votanis offensive against Defiance.'
      },
      referenceUrl: 'https://defiance.fandom.com/wiki/Rahm_Tak',
      visualAnchor: 'Exact pale Castithan facial markings, military armor and Votan weapon from season 3.'
    },
    {
      name: 'Kindzi',
      weapon: 'omec_claws',
      special: 'Omec Predator Rage',
      phases: ['Uses predatory leaps, claws and superior strength', 'Enters a fast rage phase below 40 percent health'],
      lore: {
        fr: 'Kindzi est une Omec predatrice de la troisieme saison.',
        en: 'Kindzi is a predatory Omec from the third season.'
      },
      referenceUrl: 'https://defiance.fandom.com/wiki/Kindzi',
      visualAnchor: 'Exact Omec facial appearance, pale skin, hair and source clothing from Defiance season 3.'
    }
  ]);
}
