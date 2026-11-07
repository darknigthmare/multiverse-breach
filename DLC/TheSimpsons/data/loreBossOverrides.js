// The Simpsons — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('The Simpsons', 'EG'), fallbackName('The Simpsons', 'CA')],
    fr: 'Mr. Burns Nuclear Scheme et Sideshow Bob Revenge Plot couvrent deja ces emplacements.',
    en: 'Mr. Burns Nuclear Scheme and Sideshow Bob Revenge Plot already cover these slots.'
  }));
}
