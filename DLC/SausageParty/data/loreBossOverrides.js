// Sausage Party — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Freezer Aisle Cult': 'enemyWave:exactFoodCharactersRequired' },
    fr: 'Le groupe abstrait doit devenir une vague d aliments nommes avant toute image.',
    en: 'The abstract group must become a wave of named food characters before any art is made.'
  }));
}
