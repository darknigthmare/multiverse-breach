// Le Cinquième Element — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Great Evil Planet Core': 'worldBossSetPiece:Great Evil' },
    fr: 'Le Grand Mal est une planete et doit rester un set-piece ou world boss.',
    en: 'The Great Evil is a planet and must remain a set piece or world boss.'
  }));
}
