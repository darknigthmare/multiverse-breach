// Les Tuche — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Les Tuche', 'CA')],
    convertTo: { [fallbackName('Les Tuche', 'EG')]: 'comedyChallenge:familyObjective' },
    fr: 'Ces slots deviennent un objectif familial comique et non des combattants.',
    en: 'These slots become a family comedy objective rather than combatants.'
  }));
}
