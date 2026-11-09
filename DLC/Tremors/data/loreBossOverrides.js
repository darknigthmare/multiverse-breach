// Tremors — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Graboid',
      weapon: 'underground_charge_and_tongues',
      special: 'Seismic Ambush',
      phases: ['Tracks ground vibration and erupts with snake-like tongues', 'Uses a full-body surface charge after its beak is damaged'],
      lore: {
        fr: 'Le Graboid remplace toute classification de Burt Gummer comme boss.',
        en: 'The Graboid replaces any classification of Burt Gummer as a boss.'
      },
      referenceUrl: 'https://www.universalpictures.com/movies/tremors',
      visualAnchor: 'Exact original Tremors Graboid, thick segmented subterranean body, armored beak and three inner snake-like tongues.'
    },
    {
      name: 'Shrieker',
      weapon: 'heat_sense_and_leap',
      special: 'Feeding Multiplication',
      phases: ['Uses heat-sensing pursuit, bites and leaps', 'Consumes a heat source and produces one limited documented offspring wave'],
      lore: {
        fr: 'Le Shrieker utilise sa reproduction par alimentation telle que montree dans Tremors 2.',
        en: 'The Shrieker uses the feeding-based reproduction shown in Tremors 2.'
      },
      referenceUrl: 'https://www.universalpictures.com/movies/tremors',
      visualAnchor: 'Exact bipedal Shrieker anatomy, infrared head crest, short limbs, beaked mouth and pale-brown practical-creature texture.'
    }
  ]);
}
