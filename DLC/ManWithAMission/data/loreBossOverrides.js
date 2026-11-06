// Man with a Mission — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Man with a Mission', 'CA')],
    convertTo: { [fallbackName('Man with a Mission', 'EG')]: 'rhythmChallenge:concert' },
    fr: 'Le groupe reste jouable ou performeur, jamais un faux boss hostile.',
    en: 'The band remains playable or performative, never an invented hostile boss.'
  }));
}
