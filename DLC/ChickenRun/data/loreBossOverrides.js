// Chicken Run — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Mrs. Tweedy',
      weapon: 'axe_and_pie_machine',
      special: 'Pie Machine Overdrive',
      phases: ['Commands farm traps and the pie machine', 'Uses the canonical axe directly after the machine is disabled'],
      lore: {
        fr: 'Mrs. Tweedy transforme la ferme en usine a tourtes puis affronte les poules avec sa hache.',
        en: 'Mrs. Tweedy turns the farm into a pie factory and then confronts the chickens with her axe.'
      },
      referenceUrl: 'https://www.aardman.com/film-tv-games/chicken-run/',
      visualAnchor: 'Exact Aardman stop-motion proportions, severe farm clothing, boots, coiffure and axe from the first film.'
    },
    {
      name: 'Mr. Tweedy',
      weapon: 'chicken_net_and_pitchfork',
      special: 'Clumsy Farm Pursuit',
      phases: ['Sweeps with a chicken net and blocks escape routes', 'Uses a slow pitchfork charge and falls after missing'],
      lore: {
        fr: 'Mr. Tweedy est un sous-boss comique et non une creature magique.',
        en: 'Mr. Tweedy is a comedy sub-boss rather than a magical creature.'
      },
      referenceUrl: 'https://www.aardman.com/film-tv-games/chicken-run/',
      visualAnchor: 'Exact stocky Aardman farmer, cap, moustache, earthy work clothes, chicken net and farm tools.'
    }
  ]);
}
