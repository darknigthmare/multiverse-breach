// Buckethead — definitions consumed by src/game/stageLoreProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUniverseProfileDefinitions() {
  return (["Buckethead", "P1", "ABSENT-VISUEL", "Bucketheadland haunted theme-park entrance and Giant Robot ride", ["https://www.bucketheadpikes.com/"]]);
}

export function createStageArcProfileDefinitions() {
  return ({
    key: 'buckethead_bucketheadland_labyrinth',
    stageId: 40014,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Bucketheadland surreal theme-park guitar labyrinth',
    referenceUrls: ['https://www.bucketheadpikes.com/'],
    universes: ['Buckethead']
  });
}
