// Lost Planet 2 — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Gordiant',
      weapon: 'stomps_and_swallow',
      special: 'Thermal Core Exposure',
      phases: ['Uses massive stomps, body slams and a swallowing attack', 'Exposes glowing thermal weak points after internal damage'],
      lore: {
        fr: 'Gordiant est un Akrid de categorie G affronte dans Lost Planet 2.',
        en: 'Gordiant is a Category G Akrid fought in Lost Planet 2.'
      },
      referenceUrl: 'https://news.capcomusa.com/lets/browse/lost-planet-2-boss-profile-gordiant-the-salamander-gets-a-name',
      visualAnchor: 'Exact gigantic red-brown salamander Akrid, low body, broad mouth and glowing orange thermal weak points from Lost Planet 2.'
    },
    {
      name: 'Red Eye',
      weapon: 'sand_charge_and_pods',
      special: 'Train Pursuit',
      phases: ['Pursues laterally with bites and explosive pod launches', 'Opens its enormous mouth as the final exposed weak point'],
      lore: {
        fr: 'Red Eye est le gigantesque Akrid du desert poursuivant le train.',
        en: 'Red Eye is the gigantic desert Akrid that pursues the train.'
      },
      referenceUrl: 'https://news.capcomusa.com/lets/browse/lost-planet-2-boss-profile-red-eye',
      visualAnchor: 'Exact Lost Planet 2 sand-worm Akrid, enormous circular mouth, lateral eye weak points and segmented desert body.'
    }
  ]);
}
