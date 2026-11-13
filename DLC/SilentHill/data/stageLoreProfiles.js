// Silent Hill — definitions consumed by src/game/stageLoreProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createStageArcProfileDefinitions() {
  return ({
    key: 'silent_hill_otherworld_trial',
    stageId: 40011,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Otherworld hospital and industrial corridor',
    referenceUrls: ['https://www.konami.com/games/silenthill/'],
    universes: ['Silent Hill']
  });
}
