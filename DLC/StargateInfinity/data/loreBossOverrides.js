// Stargate Infinity — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Infinity Gate Storm': 'stageHazard:unstableGateRoute' },
    fr: 'La tempete de porte est un hazard; DaKyll reste l entite de boss.',
    en: 'The gate storm is a hazard; DaKyll remains the boss entity.'
  }));
}
