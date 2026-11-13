// Buckethead — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Giant Robot Riff Engine': 'stageAutomaton:sourceRequired',
      'Death Cube K Shadow': 'performanceAvatar:nonHostile'
    },
    fr: 'Les deux concepts demandent une source visuelle exacte ou restent des challenges de performance.',
    en: 'Both concepts require an exact visual source or remain performance challenges.'
  }));
}
