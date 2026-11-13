// Parasyte — definitions consumed by src/game/recentUniverseLevels.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLevelOverrides() {
  return ({ pattern: 'organic', melee: 'containment_lab', tactics: 'facility_lockdown' });
}
