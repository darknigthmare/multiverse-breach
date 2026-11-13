// Evil Dead — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Henrietta Knowby - Deadite',
      weapon: 'deadite_grab_and_neck',
      special: 'Cellar Long-Neck Lunge',
      phases: ['Uses the heavy cellar Deadite form for grabs', 'Extends into the canonical long-neck transformation for the final lunge'],
      lore: {
        fr: 'Henrietta est le Deadite enferme dans la cave d Evil Dead II.',
        en: 'Henrietta is the Deadite locked in the cellar in Evil Dead II.'
      },
      referenceUrl: 'https://www.studiocanal.com/title/evil-dead-2-1987/',
      visualAnchor: 'Exact torn dress, practical Deadite makeup, heavy cellar body and stop-motion long-neck form from Evil Dead II.'
    },
    {
      name: 'Evil Ash',
      weapon: 'medieval_sword',
      special: 'Army of Darkness Rally',
      phases: ['Uses armored sword combinations and commands skeleton reinforcements', 'Continues as a damaged skeletal form below 30 percent health'],
      lore: {
        fr: 'Evil Ash commande l Armee des Tenebres dans sa forme medievale morte-vivante.',
        en: 'Evil Ash commands the Army of Darkness in his medieval undead form.'
      },
      referenceUrl: 'https://www.universalpictures.com/movies/army-of-darkness',
      visualAnchor: 'Exact undead Ash face, medieval armor, cape and sword from Army of Darkness, with no modern firearm.'
    }
  ]);
}
