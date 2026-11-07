// Guns N Roses — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Guns N Roses', 'CA')],
    convertTo: { [fallbackName('Guns N Roses', 'EG')]: 'rhythmChallenge:guitarDuel' },
    fr: 'Le duel est musical et non un combat contre un membre reel.',
    en: 'The duel is musical rather than combat against a real band member.'
  }));
}
