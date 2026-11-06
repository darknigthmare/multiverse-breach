// Noelle Perna — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'One-Woman-Show Spotlight': 'stageChallenge:performance',
      'Nice Cafe Rumor': 'comedyQTE:cafeDialogue'
    },
    fr: 'Les deux slots deviennent des challenges de scene et de dialogue.',
    en: 'Both slots become stage and dialogue challenges.'
  }));
}
