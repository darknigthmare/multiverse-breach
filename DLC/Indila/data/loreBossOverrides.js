// Indila — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Indila', 'CA')],
    convertTo: { [fallbackName('Indila', 'EG')]: 'musicVideoSetPiece:selectExactVideo' },
    fr: 'Aucun antagoniste recurrent; verrouiller un clip avant de creer une rencontre.',
    en: 'There is no recurring antagonist; lock one music video before creating an encounter.'
  }));
}
