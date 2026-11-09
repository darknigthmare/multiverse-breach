// Sharknado — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Great White Alpha in Funnel',
      weapon: 'bite_and_falling_charge',
      special: 'Sharknado Dive',
      phases: ['Dives from the funnel with a direct bite pattern', 'Returns through a debris lane for a faster vertical crash'],
      lore: {
        fr: 'Le boss reste un grand requin blanc emporte par la tornade.',
        en: 'The boss remains a great white shark carried by the tornado.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Sharknado',
      visualAnchor: 'Anatomically correct great white shark, wet gray skin and compact storm debris; no humanoid limbs, armor or hybrid head.'
    },
    {
      name: 'Hammerhead Swarm Alpha',
      weapon: 'side_charge_and_bite',
      special: 'Hammerhead Crosswind',
      phases: ['Crosses the arena laterally through the storm', 'Performs a double charge with a short exposed recovery'],
      lore: {
        fr: 'Le second boss est un requin-marteau identifiable, pas un avatar cosmique.',
        en: 'The second boss is an identifiable hammerhead shark rather than a cosmic avatar.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Sharknado',
      visualAnchor: 'Anatomically recognizable hammerhead shark with the film s B-movie storm presentation and limited debris, entire body visible.'
    }
  ]);
}
