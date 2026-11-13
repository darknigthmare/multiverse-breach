// Sinister — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Stephanie - BBQ Ghost Child',
      weapon: 'fire_and_film_loop',
      special: 'BBQ Film Manifestation',
      phases: ['Appears through Super 8 flicker and places small fire zones', 'Replays the documented BBQ sequence as a timed spectral rush'],
      lore: {
        fr: 'Stephanie fait partie des enfants fantomes controles par Bughuul.',
        en: 'Stephanie is one of the ghost children controlled by Bughuul.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Sinister_(film)',
      visualAnchor: 'Exact ghost-child clothing, pale film makeup and BBQ-film identity from Sinister; restrained smoke and Super 8 artifacts.'
    },
    {
      name: 'Christopher - Pool Party Ghost Child',
      weapon: 'water_and_film_loop',
      special: 'Pool Party Manifestation',
      phases: ['Creates shallow water hazards while stalking through film flicker', 'Uses the pool-film reenactment for a final drowning grab'],
      lore: {
        fr: 'Christopher est associe au film Pool Party de Bughuul.',
        en: 'Christopher is associated with Bughuul s Pool Party film.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Sinister_(film)',
      visualAnchor: 'Exact ghost-child clothing and Pool Party identity from Sinister, pale face and wet-film effects without aquatic mutation.'
    }
  ]);
}
