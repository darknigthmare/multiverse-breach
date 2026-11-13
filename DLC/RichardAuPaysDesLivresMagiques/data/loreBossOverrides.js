// Richard au pays des livres magiques — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Mr. Hyde',
      weapon: 'cane_and_monster_strength',
      special: 'Library Horror Transformation',
      phases: ['Uses the exact illustrated Hyde form with cane strikes', 'Becomes more physically aggressive as the Horror section destabilizes'],
      lore: {
        fr: 'Mr. Hyde est une menace precise rencontree dans le monde des livres.',
        en: 'Mr. Hyde is a specific threat encountered in the book world.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/The_Pagemaster',
      visualAnchor: 'Exact animated Mr. Hyde design from The Pagemaster, broad hunched body, formal torn clothing, hat or cane only as shown.'
    },
    {
      name: 'Dragon',
      weapon: 'fire_breath_and_claws',
      special: 'Fantasy Book Firestorm',
      phases: ['Uses claw swipes and measured fire breath', 'Takes flight for one final pass through the fantasy-book arena'],
      lore: {
        fr: 'Le dragon est la creature du segment Fantasy de The Pagemaster.',
        en: 'The dragon is the creature from The Pagemaster s Fantasy segment.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/The_Pagemaster',
      visualAnchor: 'Exact animated dragon from The Pagemaster, source color palette, horn layout, wings and facial proportions.'
    }
  ]);
}
