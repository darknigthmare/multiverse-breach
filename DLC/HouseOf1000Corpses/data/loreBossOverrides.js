// House of 1000 Corpses — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Otis B. Driftwood',
      weapon: 'revolver_and_knife',
      special: 'Firefly House Hunt',
      phases: ['Uses a revolver from cover and taunts the target', 'Switches to a knife and aggressive grapples at close range'],
      lore: {
        fr: 'Otis est un membre meurtrier central de la famille Firefly.',
        en: 'Otis is a central murderous member of the Firefly family.'
      },
      referenceUrl: 'https://www.lionsgate.com/movies/house-of-1000-corpses',
      visualAnchor: 'Exact Bill Moseley likeness in House of 1000 Corpses, long pale hair, facial hair, dirty period clothing, revolver and knife.'
    },
    {
      name: 'Captain Spaulding',
      weapon: 'revolver_and_roadside_props',
      special: 'Murder Ride Ambush',
      phases: ['Uses roadside attraction props and a concealed revolver', 'Drops the salesman act and attacks directly after the arena darkens'],
      lore: {
        fr: 'Captain Spaulding attire les voyageurs vers la famille Firefly.',
        en: 'Captain Spaulding draws travelers toward the Firefly family.'
      },
      referenceUrl: 'https://www.lionsgate.com/movies/house-of-1000-corpses',
      visualAnchor: 'Exact Sid Haig likeness, bald clown head, red-white-blue makeup, stained clown suit and revolver from the film.'
    }
  ]);
}
