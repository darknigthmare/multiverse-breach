const text = value => typeof value === 'string' ? value : value?.fr || value?.en || '';

export function getCgPilotAuthority(hero, pilot) {
  if (!pilot) return null;
  const equipment = Array.isArray(pilot.equipment) ? [...pilot.equipment] : [];
  const runtimeDeclared = typeof hero?.incarnation === 'string' && hero.incarnation.length > 0
    && Array.isArray(hero.equipment) && hero.equipment.length > 0;
  return { incarnation: pilot.continuityId || null, identityLock: text(pilot.promptSummary), equipment,
    currentRuntimeSource: runtimeDeclared ? { actorId: hero.id, universe: hero.universe,
      incarnation: hero.incarnation, equipment: [...hero.equipment],
      referenceUrls: [...new Set([...(hero.referenceUrls || []), hero.referenceUrl].filter(Boolean))],
      authority: false, visualFidelityApproved: false,
      scope: 'Current runtime declaration; not identity or equipment authority for the historical CG image.' } : null,
    equipmentMissing: runtimeDeclared && equipment.length === 0 };
}

export const CG_PILOT_EQUIPMENT_MISSING = 'L’autorité du pilote CG ne renseigne pas son équipement structuré; le préciser depuis cette même édition avant CG02. Ne pas reprendre l’équipement du héros runtime d’une autre version.';

// The frozen pilot establishes a target, not a newly inspected environment.
// A runtime declaration for another version cannot fill its missing scenery.
export function getCgPilotWorldAuthority(authority) {
  if (!authority?.currentRuntimeSource) return null;
  return { sourceWork: authority.incarnation, period: authority.incarnation,
    locations: [], architecture: [], palette: [], props: [],
    boundaries: ['Cible historique du pilote CG : les lieux, matières et accessoires de cette édition restent à attester avec une référence propre à ce pilote.',
      'La déclaration actuelle du héros runtime est conservée séparément avec authority:false ; elle ne renseigne pas le décor ou l’équipement de l’image CG historique.'] };
}
