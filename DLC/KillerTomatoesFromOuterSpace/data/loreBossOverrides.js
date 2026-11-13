// Killer Tomatoes from Outer Space — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Dr. Putrid T. Gangreen',
      weapon: 'mutation_serum',
      special: 'Mutant Tomato Formula',
      phases: ['Throws mutation serum and commands tomato reinforcements', 'Switches formulas and uses unstable laboratory traps below 50 percent health'],
      lore: {
        fr: 'Le savant responsable des tomates mutantes remplace le gardien generique.',
        en: 'The scientist responsible for the mutant tomatoes replaces the generic guardian.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Attack_of_the_Killer_Tomatoes_(TV_series)',
      visualAnchor: 'Bald mad scientist, white laboratory coat, spectacles, moustache, glass serum flasks and the animated-series proportions.'
    },
    {
      name: 'Igor Smith',
      weapon: 'laboratory_tools',
      special: 'Tomato Capture Net',
      phases: ['Uses heavy laboratory tools and a capture net', 'Calls a short tomato reinforcement wave when staggered'],
      lore: {
        fr: 'L assistant de Gangreen devient le second encounter local sans pouvoir cosmique invente.',
        en: 'Gangreen s assistant becomes the second local encounter without invented cosmic powers.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Attack_of_the_Killer_Tomatoes_(TV_series)',
      visualAnchor: 'Large laboratory henchman with the exact animated-series clothing, face and proportions; no armor and no supernatural mutation.'
    }
  ]);
}
