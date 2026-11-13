// Zero Escape: The Nonary Games — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Zero II Decision Engine': 'mastermindPuzzle:ABProject' },
    fr: 'Zero II controle des decisions et des puzzles; ce n est pas un corps de boss melee.',
    en: 'Zero II controls decisions and puzzles rather than being a melee boss body.'
  }));
}
