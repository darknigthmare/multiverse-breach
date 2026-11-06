// Half-Life — definitions consumed by src/game/stageLoreProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createStageArcProfileDefinitions() {
  return ({
    key: 'half_life_resonance_cascade',
    stageId: 40009,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Black Mesa test chamber aftermath',
    referenceUrls: ['https://store.steampowered.com/app/70/HalfLife/'],
    universes: ['Half-Life']
  });
}
