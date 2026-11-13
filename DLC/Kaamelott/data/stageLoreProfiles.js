// Kaamelott — definitions consumed by src/game/stageLoreProfiles.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUniverseProfileDefinitions() {
  return (["Kaamelott", "P0", "FALLBACK", "Salle de la Table Ronde du chateau de Kaamelott, cour visible par les arches", ["https://www.m6.fr/kaamelott-p_888"]]);
}

export function createStageArcProfileDefinitions() {
  return ({
    key: 'kaamelott_grail_council',
    stageId: 40016,
    priority: 'P0',
    auditStatus: 'ABSENT-VISUEL',
    canonicalName: 'Cour de Kaamelott et postes du conseil',
    referenceUrls: ['https://www.m6.fr/kaamelott-p_888'],
    universes: ['Kaamelott']
  });
}
