// Hoshi — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Hoshi', 'CA')],
    convertTo: { [fallbackName('Hoshi', 'EG')]: 'musicVideoSetPiece:selectExactVideo' },
    fr: 'Aucun antagoniste visuel recurrent n est suffisamment documente.',
    en: 'No recurring visual antagonist is documented well enough.'
  }));
}
