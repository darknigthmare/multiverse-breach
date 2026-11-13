// Elfen Lied — definitions consumed by src/game/recentUniverseLevels.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLevelOverrides() {
  return ({ pattern: 'concrete', melee: 'split_pit', tactics: 'horror_chokepoint' });
}
