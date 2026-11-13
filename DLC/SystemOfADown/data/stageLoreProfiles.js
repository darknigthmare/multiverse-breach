// System of a Down — definitions consumed by src/game/stageLoreProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUniverseProfileDefinitions() {
  return (["System of a Down", "P0", "FALLBACK", "B.Y.O.B. militarized banquet march through an urban protest set", ["https://www.systemofadown.com/music"]]);
}

export function createStageArcProfileDefinitions() {
  return ({
    key: 'soad_toxicity_protest_stage',
    stageId: 40015,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Toxicity aerial-city performance room',
    referenceUrls: ['https://www.systemofadown.com/music'],
    universes: ['System of a Down']
  });
}
