// Death Note — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Rem Contract': 'narrativeArc:shinigamiRules',
      'Near Deduction Trap': 'narrativeArc:investigation'
    },
    fr: 'Rem et Near appartiennent a des arcs de choix et d enquete, pas a un duel physique.',
    en: 'Rem and Near belong in choice and investigation arcs rather than physical duels.'
  }));
}
