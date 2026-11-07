// Pee-wee — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Francis Buxton',
      weapon: 'slapstick_props',
      special: 'Petulant Sabotage',
      phases: ['Uses grounded slapstick props and tantrum feints', 'Panics and throws nearby objects after his sabotage is exposed'],
      lore: {
        fr: 'Francis est le rival qui fait voler le velo de Pee-wee.',
        en: 'Francis is the rival responsible for having Pee-wee s bicycle stolen.'
      },
      referenceUrl: 'https://www.criterion.com/films/34870-pee-wees-big-adventure',
      visualAnchor: 'Stocky adult with the exact pale suit, bow tie, coiffed hair and childish body language from Pee-wee s Big Adventure.'
    },
    {
      name: 'Large Marge',
      weapon: 'spectral_truck_jumpscare',
      special: 'Clay-Face Nightmare Reveal',
      phases: ['Appears as the film truck driver and warns the party', 'Triggers the canonical clay-face spectral reveal and a ghost-truck pass'],
      lore: {
        fr: 'Large Marge est une rencontre spectrale comique, pas une sorciere de fantasy.',
        en: 'Large Marge is a comedy spectral encounter, not a fantasy witch.'
      },
      referenceUrl: 'https://www.criterion.com/films/34870-pee-wees-big-adventure',
      visualAnchor: 'The exact truck-driver clothing and elderly face from the film, followed by the canonical stop-motion clay nightmare face.'
    }
  ]);
}
