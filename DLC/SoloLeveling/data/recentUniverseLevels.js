// Solo Leveling — definitions consumed by src/game/recentUniverseLevels.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLevelOverrides() {
  return ({ pattern: 'dungeon', melee: 'arcane_ruins', tactics: 'portal_lockdown' });
}
