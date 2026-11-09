// Ladybaby — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Ladybaby', 'CA')],
    convertTo: { [fallbackName('Ladybaby', 'EG')]: 'rhythmChallenge:concert' },
    fr: 'Le slot devient une performance et non un boss hostile.',
    en: 'The slot becomes a performance rather than a hostile boss.'
  }));
}
