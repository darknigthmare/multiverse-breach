// Saw — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Bathroom Chain Trial': 'stageHazard:timedChainTrial',
      'Jigsaw Classroom Trap Hub': 'stageController:trapObjectives'
    },
    fr: 'Les pieges sont des objectifs de niveau; Billy et Kramer restent narration ou props.',
    en: 'The traps are level objectives; Billy and Kramer remain narration or props.'
  }));
}
