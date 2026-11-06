// Rubber — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Psychic Tire Swarm': 'worldBossPhase:Robert duplication' },
    fr: 'Robert est l unique pneu telekinetique; les copies sont une phase, pas un autre boss.',
    en: 'Robert is the sole telekinetic tire; duplicates are a phase rather than another boss.'
  }));
}
