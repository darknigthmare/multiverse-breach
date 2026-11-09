// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcMetalGearRising from '../../DLC/MetalGearRising/data/wardrobeOfficialR7.js';
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/wardrobeOfficialR7.js';
import * as dlcHITMANWorldOfAssassination from '../../DLC/HITMANWorldOfAssassination/data/wardrobeOfficialR7.js';

// R7: publisher-named variants. No produced sprite and no automatic art approval.
const L=(fr,en)=>Object.freeze({fr,en});
const make=(universe,id,key,name,sourceWork,sourceUrl,fr,en,nature='official-costume',sourceEvidence='PUBLISHER_NAMES_EXACT_VARIANT')=>Object.freeze({
 universe,actorIds:Object.freeze([id]),key,name:L(name,name),sourceWork,sourceUrl,nature,sourceEvidence,sourceCheckedOn:'2026-10-24',
 artworkStatus:'NOT_PRODUCED',artApproval:'NOT_REVIEWED',equippable:false,visualSpec:L(fr,en),
 note:'Variante nommée par l’éditeur. Références multi-vues et sprites dédiés encore requis ; aucun bonus, personnage ou équipement de pack transféré.',
 noteEn:'Publisher names this variant. Multi-view references and dedicated sprites remain required; no pack bonus, identity or equipment is transferred.'
});
export const OFFICIAL_COSTUMES_R7=Object.freeze([
 dlcMetalGearRising.createOfficialCostumesR7({ make }),
 dlcMetalGearRising.createOfficialCostumesR72({ make }),
 dlcMetalGearRising.createOfficialCostumesR73({ make }),
 dlcMetalGearRising.createOfficialCostumesR74({ make }),
 dlcMetalGearRising.createOfficialCostumesR75({ make }),
 dlcResidentEvil.createOfficialCostumesR7({ make }),
 dlcResidentEvil.createOfficialCostumesR72({ make }),
 dlcResidentEvil.createOfficialCostumesR73({ make }),
 dlcHITMANWorldOfAssassination.createOfficialCostumesR7({ make }),
 dlcHITMANWorldOfAssassination.createOfficialCostumesR72({ make }),
 dlcHITMANWorldOfAssassination.createOfficialCostumesR73({ make }),
 dlcHITMANWorldOfAssassination.createOfficialCostumesR74({ make }),
 dlcHITMANWorldOfAssassination.createOfficialCostumesR75({ make }),
 dlcHITMANWorldOfAssassination.createOfficialCostumesR76({ make }),
]);
// These names are documented, but no corresponding runtime actor is present in this snapshot.
// Do not silently attach a costume to Claire, Rebecca or another namesake.
export const UNBOUND_COSTUME_RESEARCH_R7=Object.freeze([
 dlcResidentEvil.createUnboundCostumeResearchR7(),
 dlcResidentEvil.createUnboundCostumeResearchR72(),
 dlcResidentEvil.createUnboundCostumeResearchR73()
]);
