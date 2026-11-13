// Evolution: The Animated Series — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Animated Hive Node': 'enemySpawner:genusHive' },
    fr: 'Le node reste un spawner tant qu une creature Genus exacte n est pas identifiee.',
    en: 'The node remains a spawner until an exact Genus creature is identified.'
  }));
}
