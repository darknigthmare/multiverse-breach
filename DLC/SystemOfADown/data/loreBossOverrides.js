// System of a Down — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'B.Y.O.B. War Machine': 'musicVideoSetPiece:BYOB',
      'Aerials Signal Tower': 'audiovisualObjective:Aerials'
    },
    fr: 'Les clips fournissent des set-pieces, pas des boss mecaniques inventes.',
    en: 'The videos provide set pieces rather than invented mechanical bosses.'
  }));
}
