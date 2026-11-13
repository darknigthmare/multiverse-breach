// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcRoboCop from '../../DLC/RoboCop/data/wardrobeOfficialR14.js';
import * as dlcLikeADragon from '../../DLC/LikeADragon/data/wardrobeOfficialR14.js';
import * as dlcHITMANWorldOfAssassination from '../../DLC/HITMANWorldOfAssassination/data/wardrobeOfficialR14.js';

// R14: named cosmetics backed by publisher text. No artwork, actor or gameplay grant.
const L=(fr,en)=>Object.freeze({fr,en});
const checkedOn='2026-10-25';
export const WARDROBE_SOURCES_R14=Object.freeze([
 ['ioi-splitter','IO Interactive','https://store.steampowered.com/app/3254350/','One named suit; weapons, arcade access and safehouse items excluded.'],
 ['ioi-drop','IO Interactive','https://store.steampowered.com/app/3110360/','One named suit; the target identity, audio, gadgets and mission are not included.'],
 ['ioi-banker','IO Interactive','https://store.steampowered.com/app/3711140/','One named suit; chip, weapons, arcade contract and furniture excluded.'],
 ['ioi-wizard','IO Interactive','https://store.steampowered.com/app/4621250/','Named suit in the June 2026 pack; this is clothing for 47, not a new fighter.'],
 ['ioi-champions','IO Interactive','https://store.steampowered.com/app/4542910/','Three named outfits; sports gear, medals, weapons and locker-room decor excluded.'],
 ['ioi-getaway','IO Interactive','https://store.steampowered.com/app/4944070/','Three named outfits in the August 2026 pack; sun-related gadgets and croquet items excluded.'],
 ['ioi-herbalist','IO Interactive','https://store.steampowered.com/app/4911210/','Two named garments; celebrity likeness, voice, mission access and other pack items excluded.'],
 ['ioi-greed','IO Interactive','https://ioi.dk/hitman/news/2021/seven-deadly-sins','Act 1 Rapacious Suit is named. The article does not name all seven suits; no full-collection completeness claim.'],
 ['nacon-damaged','Nacon','https://www.nacongaming.com/en-US/robocop-rogue-city','Publisher names the Damaged skin inspired by the first film. Prototype Auto-9 is a weapon skin, not a body costume. Edition storefront labels are inconsistent: no purchase/availability claim.'],
 ['ioi-patient-research','IO Interactive','https://store.steampowered.com/app/4328240/','Breach Response Gear is named; garment boundaries and model must be inspected before classification in this catalogue.'],
 ['nacon-vanguard-research','Nacon','https://store.steampowered.com/app/2436840/','Product title inspected only; detailed skin list and visual edition are not established by this record.'],
 ['sega-legends-research','SEGA','https://store.steampowered.com/dlc/1235140/','Catalogue advertises eight Legends costumes; individual names and exact recipient-specific appearance remain unresolved.']
].map(([id,publisher,url,scope])=>Object.freeze({id,publisher,url,scope,checkedOn})));
const sources=new Map(WARDROBE_SOURCES_R14.map(s=>[s.id,s]));
// Source manifest is independent of the delivered catalogue. Never derive expected items
// by filtering OFFICIAL_COSTUMES_R14: an omitted delivery must remain an unmet requirement.
export const WARDROBE_NAMED_PACKS_R14=Object.freeze([
 ...dlcHITMANWorldOfAssassination.createWardrobeNamedPacksR14({ L }),
 dlcRoboCop.createWardrobeNamedPacksR14({ L })
]);
export const OFFICIAL_COSTUMES_R14=Object.freeze(WARDROBE_NAMED_PACKS_R14.flatMap(p=>p.items.map(i=>Object.freeze({
 universe:p.universe,actorIds:Object.freeze([p.actorId]),key:i.key,name:L(i.name,i.name),sourceId:p.sourceId,sourceUrl:sources.get(p.sourceId).url,
 sourceWork:p.sourceWork,targetIncarnation:p.sourceWork,sourceMode:p.sourceMode,coverageScopeId:p.id,checkedOn,
 nature:i.nature,component:i.component,sourceEvidence:'PUBLISHER_NAMED_COSMETIC',sourceGameplayTransferred:false,
 wearerEvidence:'IN_GAME_WEARER_VIEWS_REQUIRED',visualEvidence:'NOT_INSPECTED',modelChange:'UNASSESSED',
 brief:L(`${i.focus.fr} Collecter face, dos, profils et détail puis vérifier toutes les poses réellement utilisées. Aucun changement de stats, pouvoir, arme ou identité.`,`${i.focus.en} Collect front, back, sides and detail views, then check every used pose. No stat, power, weapon or identity change.`),
 note:'Nom et provenance documentés ; modèle, planches et animations à produire. Une liste de pack complète ne constitue pas une validation 1:1.',
 artworkStatus:'NOT_PRODUCED',artApproval:'NOT_REVIEWED',equippable:false
}))));
export const WARDROBE_SOURCE_SCOPES_R14=Object.freeze(WARDROBE_NAMED_PACKS_R14.map(p=>Object.freeze({
 id:p.id,universe:p.universe,actorId:p.actorId,sourceUrl:sources.get(p.sourceId).url,checkedOn,
 boundary:'Only the named wearable subset of this exact publisher source. Excludes other packs, weapons, source gameplay, complete character wardrobe and artwork approval.',
 expectedItems:Object.freeze(p.items.map(i=>Object.freeze({key:i.key,name:i.name,nature:i.nature,component:i.component,sourceWork:p.sourceWork,sourceMode:p.sourceMode})))
})));
const research=(universe,id,key,sourceId,status,fr,en)=>Object.freeze({universe,id,key,sourceUrl:sources.get(sourceId).url,status,question:L(fr,en),note:'Research only: no costume reward, art approval or equipment grant.'});
export const WARDROBE_RESEARCH_R14=Object.freeze([
 ...dlcHITMANWorldOfAssassination.createWardrobeResearchR14({ research }),
 dlcRoboCop.createWardrobeResearchR14({ research }),
 dlcLikeADragon.createWardrobeResearchR14({ research })
]);
