// Rammstein — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Mein Teil Butcher Table': 'stageSetPiece:Mein Teil',
      'Du Hast Pyro Wall': 'stageHazard:pyrotechnics'
    },
    fr: 'Les deux noms designent des elements de mise en scene et non des personnages.',
    en: 'Both names describe stage elements rather than characters.'
  }));
}
