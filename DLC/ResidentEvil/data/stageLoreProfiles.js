// Resident Evil — definitions consumed by src/game/stageLoreProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createStageArcProfileDefinitions() {
  return ({
    key: 'resident_evil_raccoon_lockdown',
    stageId: 40008,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'RPD main hall opening onto quarantined Raccoon streets',
    referenceUrls: ['https://game.capcom.com/residentevil/'],
    universes: ['Resident Evil']
  });
}
