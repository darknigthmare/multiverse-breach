// Vocaloid — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Hologram glitch core': 'stageHazard:hologramGlitch' },
    fr: 'Le core est un effet de concert/cyber et non un personnage Vocaloid.',
    en: 'The core is a concert/cyber effect rather than a Vocaloid character.'
  }));
}
