// Predator 2 — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'City Hunter',
      weapon: 'combi_stick_smart_disc_and_plasmacaster',
      special: 'Rooftop Hunt',
      phases: ['Uses cloak, plasmacaster and rooftop movement', 'Loses the mask and switches to combi-stick and smart-disc combat'],
      lore: {
        fr: 'City Hunter est le Predator principal de Los Angeles.',
        en: 'City Hunter is the main Predator hunting in Los Angeles.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/predator-2',
      visualAnchor: 'Exact Predator 2 City Hunter armor, bronze biomask, netting, shoulder cannon, combi-stick and smart disc.'
    },
    {
      name: 'Greyback Elder Predator',
      weapon: 'flintlock_pistol_and_wrist_blades',
      special: 'Elder Ship Trial',
      phases: ['Tests the target with restrained wrist-blade attacks', 'Uses the documented antique flintlock only as a symbolic final pattern'],
      lore: {
        fr: 'Greyback est l ancien qui remet le pistolet a Harrigan.',
        en: 'Greyback is the elder who gives Harrigan the antique pistol.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/predator-2',
      visualAnchor: 'Exact elder Predator from the ship finale, aged unmasked face, ornate armor, cape details and Raphael Adolini flintlock.'
    }
  ]);
}
