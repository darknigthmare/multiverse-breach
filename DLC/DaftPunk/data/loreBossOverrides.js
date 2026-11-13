// Daft Punk — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Alive Pyramid Light Wall': 'stageHazard:concertPyramid' },
    fr: 'La pyramide Alive est un decor interactif de concert.',
    en: 'The Alive pyramid is an interactive concert environment.'
  }));
}
