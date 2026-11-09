// Oliver Tree — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Bowl Cut Persona': 'performanceChallenge:Bowl Cut',
      'Cowboy Tears Rodeo Loop': 'performanceHazard:Cowboy Tears'
    },
    fr: 'Les personas sont des performances alternatives et ne deviennent pas hostiles.',
    en: 'The personas are alternate performances and do not become hostile.'
  }));
}
