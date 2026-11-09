// Kaamelott — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Leodagan War Council': 'nonLethalChallenge:tacticalDebate' },
    fr: 'Leodagan est un allie et rival politique, pas un boss ennemi.',
    en: 'Leodagan is an ally and political rival rather than an enemy boss.'
  }));
}
