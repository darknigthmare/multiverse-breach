// Stargate — definitions consumed by src/game/stageLoreProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createStageArcProfileDefinitions() {
  return ({
    key: 'stargate_sgc_first_contact',
    stageId: 40010,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'SGC embarkation room and Abydos gate platform',
    referenceUrls: ['https://www.mgm.com/television/stargate-sg-1'],
    universes: ['Stargate']
  });
}
