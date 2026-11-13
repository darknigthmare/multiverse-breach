// Neon Genesis Evangelion — definitions consumed by src/game/recentUniverseLevels.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLevelOverrides() {
  return ({ pattern: 'armor', melee: 'boss_coliseum', tactics: 'boss_command_zone' });
}
