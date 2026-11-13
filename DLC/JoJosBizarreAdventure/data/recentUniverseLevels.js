// JoJo's Bizarre Adventure — definitions consumed by src/game/recentUniverseLevels.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLevelOverrides() {
  return ({ pattern: 'stone', melee: 'triplat_duel', tactics: 'boss_command_zone' });
}
