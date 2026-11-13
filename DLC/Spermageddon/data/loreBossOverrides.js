// Spermageddon — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Contraception Gatekeeper': 'biologicalObstacle:contraception',
      'Cringe Chorus Beast': 'rhythmObstacle:chorus'
    },
    fr: 'Ces noms sont des obstacles biologiques et musicaux, pas des personnages attestes.',
    en: 'These names are biological and musical obstacles rather than documented characters.'
  }));
}
