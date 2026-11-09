// Michael Jackson — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Thriller Werecat Persona',
      weapon: 'dance_claws',
      special: 'Thriller Transformation',
      phases: ['Uses precise dance-combat footwork in the red-black jacket', 'Reveals the canonical werecat makeup and claw attacks'],
      lore: {
        fr: 'Cette entree est la persona fictive du court-metrage Thriller, pas Michael Jackson biographique.',
        en: 'This entry is the fictional persona from the Thriller short film, not biographical Michael Jackson.'
      },
      referenceUrl: 'https://www.michaeljackson.com/video/michael-jacksons-thriller-shortened-version/',
      visualAnchor: 'Exact 1983 hair, red-black Thriller jacket and canonical werecat prosthetic makeup from the official short film.'
    },
    {
      name: 'Smooth Criminal Gangster Persona',
      weapon: 'rhythm_feints_and_stage_props',
      special: 'Anti-Gravity Lean Counter',
      phases: ['Uses white-suit dance feints and precise footwork', 'Uses the anti-gravity lean as a counter window in the final phase'],
      lore: {
        fr: 'La persona de Smooth Criminal reste une rencontre de performance ancree dans le court-metrage.',
        en: 'The Smooth Criminal persona remains a performance encounter anchored in the short film.'
      },
      referenceUrl: 'https://www.michaeljackson.com/video/michael-jackson-smooth-criminal-official-video/',
      visualAnchor: 'Exact white suit, blue shirt, white fedora, armband and shoes from the official Smooth Criminal short film.'
    }
  ]);
}
