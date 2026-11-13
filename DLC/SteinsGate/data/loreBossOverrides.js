// Steins;Gate — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Nae Time-Leap Echo': 'narrativeRoute:timeLeap' },
    fr: 'La route de Nae reste narrative et ne doit pas definir le boss principal.',
    en: 'Nae s route remains narrative and must not define the main boss.'
  }));
}
