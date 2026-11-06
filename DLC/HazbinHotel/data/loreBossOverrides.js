// Hazbin Hotel — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Adam',
      weapon: 'guitar_axe_and_holy_light',
      special: 'Extermination Beam',
      phases: ['Uses flight, guitar-axe combinations and holy-light slashes', 'Broken mask reveals his face before the full beam attack'],
      lore: {
        fr: 'Adam dirige l Extermination et remplace le contrat d Alastor comme boss hostile.',
        en: 'Adam leads the Extermination and replaces Alastor s contract as the hostile boss.'
      },
      referenceUrl: 'https://www.primevideo.com/detail/Hazbin-Hotel/0HZWTBZYQQXYW48YBANMDM2MZE',
      visualAnchor: 'Exact Hazbin Hotel Adam, white-gold exorcist uniform, black LED mask, horns, wings and guitar-axe.'
    },
    {
      name: 'Lute',
      weapon: 'angelic_sword_and_spear',
      special: 'Exorcist Captain Dive',
      phases: ['Uses aerial spear dives and angelic sword combinations', 'Fights one-armed with increased speed after the documented injury'],
      lore: {
        fr: 'Lute est la lieutenante et capitaine exorciste d Adam.',
        en: 'Lute is Adam s lieutenant and Exorcist captain.'
      },
      referenceUrl: 'https://www.primevideo.com/detail/Hazbin-Hotel/0HZWTBZYQQXYW48YBANMDM2MZE',
      visualAnchor: 'Exact Hazbin Hotel Lute, gray skin, white hair, exorcist mask and uniform, black wings and angelic weapons.'
    }
  ]);
}
