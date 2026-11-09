// Team Fortress 2 — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Team Fortress 2', 'EG'), fallbackName('Team Fortress 2', 'CA')],
    fr: 'Saxton Hale et Merasmus sont deja couverts dans le roster.',
    en: 'Saxton Hale and Merasmus are already covered in the roster.'
  }));
}
