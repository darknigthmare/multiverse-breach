// Band-Maid — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Band-Maid', 'CA')],
    convertTo: { [fallbackName('Band-Maid', 'EG')]: 'rhythmChallenge:concert' },
    fr: 'Aucun personnage hostile canonique n est etabli.',
    en: 'No canonical hostile character is established.'
  }));
}
