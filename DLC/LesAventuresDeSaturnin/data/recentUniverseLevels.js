// Les Aventures de Saturnin — definitions consumed by src/game/recentUniverseLevels.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLevelOverrides() {
  return ({ pattern: 'miniature', melee: 'absurd_party', tactics: 'nexus_escort_route' });
}
