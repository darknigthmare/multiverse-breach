// Steins;Gate — definitions consumed by src/game/recentUniverseLevels.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLevelOverrides() {
  return ({ pattern: 'lab', melee: 'city_rooftops', tactics: 'facility_lockdown' });
}
