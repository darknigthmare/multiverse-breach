// Dino Crisis — definitions consumed by src/game/stageLoreProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createStageArcProfileDefinitions() {
  return ({
    key: 'dino_crisis_third_energy_incident',
    stageId: 40012,
    priority: 'P1',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Ibis Island Third Energy reactor room',
    referenceUrls: ['https://www.capcom-games.com/product/en-us/dinocrisis/'],
    universes: ['Dino Crisis']
  });
}
