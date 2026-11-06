// Deadman Wonderland — definitions consumed by src/game/recentUniverseLevels.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLevelOverrides() {
  return ({ pattern: 'prison', melee: 'split_pit', tactics: 'horror_chokepoint' });
}
