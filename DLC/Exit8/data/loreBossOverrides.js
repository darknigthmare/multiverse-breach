// Exit 8 — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Flooded Corridor': 'stageAnomaly:flood',
      'Impossible Signage': 'stageAnomaly:signage'
    },
    fr: 'Les anomalies du couloir sont le gameplay principal et ne sont pas des boss.',
    en: 'The corridor anomalies are the core gameplay and are not bosses.'
  }));
}
