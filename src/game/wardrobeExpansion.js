// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcFinalFantasyVII from '../../DLC/FinalFantasyVII/data/wardrobeExpansion.js';
import * as dlcDeadSpace from '../../DLC/DeadSpace/data/wardrobeExpansion.js';
import * as dlcTombRaider from '../../DLC/TombRaider/data/wardrobeExpansion.js';
import * as dlcAlien from '../../DLC/Alien/data/wardrobeExpansion.js';
import * as dlcAliens from '../../DLC/Aliens/data/wardrobeExpansion.js';
import * as dlcHalo from '../../DLC/Halo/data/wardrobeExpansion.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/wardrobeExpansion.js';
import * as dlcPortal from '../../DLC/Portal/data/wardrobeExpansion.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/wardrobeExpansion.js';
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/wardrobeExpansion.js';
import * as dlcPredator from '../../DLC/Predator/data/wardrobeExpansion.js';
import * as dlcStarWars from '../../DLC/StarWars/data/wardrobeExpansion.js';

// R6: publisher evidence proves an outfit exists, not that its game sprite is finished.
const L = (fr, en) => Object.freeze({ fr, en });
const official = (universe, id, key, fr, en, sourceWork, sourceUrl, evidence, visualSpec) => Object.freeze({
  universe, actorIds: Object.freeze([id]), key, name: L(fr, en), sourceWork, sourceUrl,
  nature: 'official-costume', sourceEvidence: evidence, sourceCheckedOn: '2026-10-24',
  artworkStatus: 'NOT_PRODUCED', artApproval: 'NOT_REVIEWED', equippable: false,
  visualSpec, note: 'Existence sourcée. Vérifier cette incarnation, les captures du jeu et toutes les poses ; aucun équipement ou bonus transféré.',
  noteEn: 'Existence sourced. Check this incarnation, game captures and all poses; no equipment or bonus is transferred.'
});
export const OFFICIAL_COSTUME_EXTENSION = Object.freeze([
  dlcFinalFantasyVII.createOfficialCostumeExtension({ L, official }),
  dlcFinalFantasyVII.createOfficialCostumeExtension2({ L, official }),
  dlcFinalFantasyVII.createOfficialCostumeExtension3({ L, official }),
  dlcFinalFantasyVII.createOfficialCostumeExtension4({ L, official }),
  dlcDeadSpace.createOfficialCostumeExtension({ L, official }),
  dlcDeadSpace.createOfficialCostumeExtension2({ L, official }),
  dlcDeadSpace.createOfficialCostumeExtension3({ L, official }),
  dlcTombRaider.createOfficialCostumeExtension({ L, official })
]);
export const ORIGINAL_COLLECTION_EXTENSION = Object.freeze([
  Object.freeze({key:'commando',name:L('Commando des Failles','Rift commando'),brief:L(
    'Collection originale : graphite, kaki désaturé et identification ambre. Adapter protections et attaches au corps réel. Enfant : tenue d’exploration protectrice, sans militarisation. Machine/créature : traitement de coque, carapace ou harnachement approprié. Épreuve abstraite : aucun costume corporel. Ne changer ni âge, membres, capacités ni armes.',
    'Original collection: graphite, desaturated olive and amber identification. Fit protection and straps to the actual body. Children receive protective explorer clothing, not militarization. Machines/creatures need appropriate shell, carapace or harness treatment. Abstract trials receive no body outfit. Never change age, limbs, abilities or weapons.')})
]);
const design = (universe,id,key,fr,en,briefFr,briefEn) => Object.freeze({universe,id,key,name:L(fr,en),brief:L(briefFr,briefEn)});
export const SIGNATURE_DESIGN_EXTENSION = Object.freeze([
 dlcAlien.createSignatureDesignExtension({ design }),
 dlcAliens.createSignatureDesignExtension({ design }),
 dlcAliens.createSignatureDesignExtension2({ design }),
 dlcAliens.createSignatureDesignExtension3({ design }),
 dlcAliens.createSignatureDesignExtension4({ design }),
 dlcAliens.createSignatureDesignExtension5({ design }),
 dlcHalo.createSignatureDesignExtension({ design }),
 dlcHalo.createSignatureDesignExtension2({ design }),
 dlcHalo.createSignatureDesignExtension3({ design }),
 dlcHalo.createSignatureDesignExtension4({ design }),
 dlcHalfLife.createSignatureDesignExtension({ design }),
 dlcHalfLife.createSignatureDesignExtension2({ design }),
 dlcHalfLife.createSignatureDesignExtension3({ design }),
 dlcHalfLife.createSignatureDesignExtension4({ design }),
 dlcPortal.createSignatureDesignExtension({ design }),
 dlcPortal.createSignatureDesignExtension2({ design }),
 dlcPortal.createSignatureDesignExtension3({ design }),
 dlcMetalGear.createSignatureDesignExtension({ design }),
 dlcMetalGear.createSignatureDesignExtension2({ design }),
 dlcMetalGear.createSignatureDesignExtension3({ design }),
 dlcResidentEvil.createSignatureDesignExtension({ design }),
 dlcResidentEvil.createSignatureDesignExtension2({ design }),
 dlcResidentEvil.createSignatureDesignExtension3({ design }),
 dlcResidentEvil.createSignatureDesignExtension4({ design }),
 dlcPredator.createSignatureDesignExtension({ design }),
 dlcPredator.createSignatureDesignExtension2({ design }),
 dlcDeadSpace.createSignatureDesignExtension({ design }),
 dlcDeadSpace.createSignatureDesignExtension2({ design }),
 dlcFinalFantasyVII.createSignatureDesignExtension({ design }),
 dlcFinalFantasyVII.createSignatureDesignExtension2({ design }),
 dlcFinalFantasyVII.createSignatureDesignExtension3({ design }),
 dlcFinalFantasyVII.createSignatureDesignExtension4({ design }),
 dlcStarWars.createSignatureDesignExtension({ design }),
 dlcStarWars.createSignatureDesignExtension2({ design }),
 design('NieR','yorha_2b','commando','Reconnaissance Nexus','Nexus reconnaissance','Veste de terrain fermée, coutures cyan et poches basses non flottantes ; conserver bandeau et silhouette de 2B, aucune arme ajoutée.','Closed field jacket, cyan seams and low non-flapping pockets; preserve 2B’s visor and silhouette, no added weapon.'),
 dlcTombRaider.createSignatureDesignExtension({ design })
]);
// Explicit research tasks are NOT costumes confirmed to exist and are never equippable.
export const WARDROBE_RESEARCH_TARGETS = Object.freeze([
 dlcHalo.createWardrobeResearchTargets({ L }),
 dlcDeadSpace.createWardrobeResearchTargets({ L }),
 dlcTombRaider.createWardrobeResearchTargets({ L })
]);
