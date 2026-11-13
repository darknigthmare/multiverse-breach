// Fullmetal Alchemist — definitions consumed by src/game/recentUniverseLevels.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLevelOverrides() {
  return ({ pattern: 'alchemy', melee: 'arcane_ruins', tactics: 'war_frontline' });
}
