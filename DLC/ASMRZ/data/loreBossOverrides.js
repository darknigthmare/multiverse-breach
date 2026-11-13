// ASMRZ — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('ASMRZ', 'CA')],
    convertTo: { [fallbackName('ASMRZ', 'EG')]: 'musicVideoSetPiece:Goodnight Ojosama' },
    fr: 'Le clip doit rester une scene choregraphiee, pas un faux avatar de crise.',
    en: 'The video remains a choreographed set piece rather than an invented crisis avatar.'
  }));
}
