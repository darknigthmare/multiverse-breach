// Rocky Horror Picture Show — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Riff Raff',
      weapon: 'anti_matter_laser',
      special: 'Transylvanian Recall',
      phases: ['Uses theatrical servant feints and command gestures', 'Reveals the canonical final Transylvanian uniform and anti-matter laser'],
      lore: {
        fr: 'Riff Raff renverse Frank-N-Furter et reprend le controle du chateau.',
        en: 'Riff Raff overthrows Frank-N-Furter and retakes control of the castle.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/the-rocky-horror-picture-show',
      visualAnchor: 'Exact bald-top long-hair likeness and the final Transylvanian uniform with the film anti-matter laser.'
    },
    {
      name: 'Eddie',
      weapon: 'saxophone_and_stage_chain',
      special: 'Freezer Rock Entrance',
      phases: ['Bursts into the arena with saxophone-driven shockwaves', 'Uses grounded rocker brawling and stage props when cornered'],
      lore: {
        fr: 'Eddie est une rencontre musicale violente mais reste humain.',
        en: 'Eddie is a violent musical encounter but remains human.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/the-rocky-horror-picture-show',
      visualAnchor: 'Exact leather vest, forehead scar, pompadour and saxophone from the film, with no undead mutation.'
    }
  ]);
}
