// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcMagicka from '../../DLC/Magicka/data/wardrobeOfficialR13.js';
import * as dlcPayday from '../../DLC/Payday/data/wardrobeOfficialR13.js';

// R13: source-named shared cosmetics. Exact project wearers are an explicit allowlist,
// NOT evidence that the publisher illustrated every wearer/item combination.
const L=(fr,en)=>Object.freeze({fr,en});
const checkedOn='2026-10-25';
export const WARDROBE_SOURCES_R13=Object.freeze([
 {id:'starbreeze-lawless',publisher:'Starbreeze / OVERKILL',url:'https://store.steampowered.com/app/2352300/',consultedUrl:'https://store.steampowered.com/app/2352300/PAYDAY_2_Lawless_Tailor_Pack/?curator_clanid=4458711&snr=1_16_16_18_curator-tabs',scope:'Publisher names four suits, four masks and four gloves. Shared heister cosmetics; each recipient still needs source-game fit evidence.'},
 {id:'starbreeze-megacity',publisher:'Starbreeze / OVERKILL',url:'https://store.steampowered.com/app/1778791/',consultedUrl:'https://store.steampowered.com/app/1778791/PAYDAY_2_Mega_City_Tailor_Pack/',scope:'Eight named variants across two outfits, four masks and four gloves; Dragon Bomber Red is separately listed as free content, not part of the paid sixteen.'},
 {id:'paradox-gamer',publisher:'Paradox Interactive / Arrowhead',url:'https://store.steampowered.com/app/73057/',consultedUrl:'https://store.steampowered.com/app/73057/Magicka_Gamer_Bundle/',scope:'Three named robes for player wizards. Only appearance is catalogued here; source weapons, resistances, speed and tactics are not replicated by a cosmetic entitlement.'},
 {id:'paradox-survival',publisher:'Paradox Interactive / Arrowhead',url:'https://store.steampowered.com/app/73030/',consultedUrl:'https://store.steampowered.com/app/73030/Magicka_Wizards_Survival_Kit/',scope:'Wizard’s Hat is a wearable item. Sharp Sword, Staff +1 and Meteor Shower are explicitly excluded from costume rewards.'},
 {id:'paradox-villains-research',publisher:'Paradox Interactive / Pieces Interactive',url:'https://store.steampowered.com/app/73095/',scope:'Coldarr, Flamos and Electrobe are described as distinct wizards with personalities, not silently assigned to the existing color archetypes.'},
 {id:'bandai-hokage-research',publisher:'Bandai Namco',url:'https://store.steampowered.com/app/416420/',scope:'Shikamaru’s Tale names Naruto (7th Hokage). The existing young/war-era Naruto actors are not silently aged or replaced.'}
].map(s=>Object.freeze({...s,checkedOn})));
const sources=new Map(WARDROBE_SOURCES_R13.map(s=>[s.id,s]));
export const PAYDAY_WEARERS_R13=dlcPayday.createWearers();
export const MAGICKA_WEARERS_R13=dlcMagicka.createWearers();
const make=(universe,actorIds,key,name,sourceId,scopeId,work,nature,component,fr,en,extra={})=>{
 const source=sources.get(sourceId);if(!source)throw new Error(`Unknown R13 source ${sourceId}`);
 return Object.freeze({universe,actorIds,key,name:L(name,name),sourceId,sourceUrl:source.url,sourceWork:work,targetIncarnation:work,
  coverageScopeId:scopeId,checkedOn,nature,component,sourceMode:universe==='Payday'?'PAYDAY2_PC_SHARED_COSMETIC':'MAGICKA1_PC_PLAYER_ROBE',
  sourceEvidence:'PUBLISHER_NAMED_SHARED_COSMETIC',wearerBinding:'EXPLICIT_PLAYABLE_AVATAR_ALLOWLIST',
  wearerEvidence:'PER_WEARER_VISUAL_REFERENCE_REQUIRED',brief:L(fr,en),
  note:'Nom et composant documentés. Affectation aux avatars jouables présents, sans prétendre que la source montre chaque combinaison. Ajustement par porteur à vérifier. Aucun objet, pouvoir ou bonus transféré.',
  artworkStatus:'NOT_PRODUCED',artApproval:'NOT_REVIEWED',visualEvidence:'NOT_INSPECTED',modelChange:'UNASSESSED',equippable:false,...extra});
};
export const PAYDAY_NAMED_PACKS_R13=dlcPayday.createNamedPacks();
const payday=dlcPayday.createCostumes({ L, make, PAYDAY_NAMED_PACKS_R13, PAYDAY_WEARERS_R13 });
const magicka=dlcMagicka.createCostumes({ make, MAGICKA_WEARERS_R13 });
export const OFFICIAL_COSTUMES_R13=Object.freeze([...payday,...magicka]);
// Independent source requirements: never generate expectations from the delivered
// OFFICIAL_COSTUMES_R13 list, otherwise a missing entry can silently remove its own check.
const sourceRequirements=[
 ...dlcPayday.createSourceRequirements({ PAYDAY_NAMED_PACKS_R13, PAYDAY_WEARERS_R13 }),
 dlcMagicka.createSourceRequirements({ MAGICKA_WEARERS_R13 }),
 dlcMagicka.createSourceRequirements2({ MAGICKA_WEARERS_R13 })
];
export const WARDROBE_SOURCE_SCOPES_R13=Object.freeze(sourceRequirements.flatMap(s=>s.actorIds.map(actorId=>Object.freeze({
 id:s.id,universe:s.universe,actorId,sourceUrl:sources.get(s.sourceId).url,checkedOn,
 boundary:'Named cosmetic components in this exact source only; wearer-specific imagery and whole-character wardrobe completeness remain unverified.',
 expectedItems:Object.freeze(s.items.map(i=>Object.freeze({...i,sourceWork:s.work})))
}))));
export const WARDROBE_RESEARCH_R13=Object.freeze([
 ...dlcPayday.createResearch({ L, sources, PAYDAY_WEARERS_R13 }),
 ...dlcMagicka.createResearch({ L, sources, MAGICKA_WEARERS_R13 })
]);
export const UNBOUND_COSTUME_RESEARCH_R13=Object.freeze([
 ...[['Coldarr','Coldarr Robe'],['Flamos','Flamos Robe'],['Electrobe','Electrobe']].map(([actorName,costume])=>({actorName,costume,universe:'Magicka',sourceWork:'Magicka — Mega Villain Robes (2012)',sourceId:'paradox-villains-research',status:'DISTINCT_IDENTITY_BINDING_REQUIRED'})),
 {actorName:'Naruto Uzumaki — 7th Hokage',costume:'Naruto (7th Hokage)',universe:'Boruto: Naruto Next Generations',sourceWork:'Naruto Shippuden: Ultimate Ninja STORM 4 — Shikamaru’s Tale',sourceId:'bandai-hokage-research',status:'ADULT_INCARNATION_BINDING_REQUIRED'}
].map(r=>Object.freeze({...r,sourceUrl:sources.get(r.sourceId).url,sourceEvidence:'PUBLISHER_NAMED_VARIANT',equippable:false,note:'No exact compatible actor linked; never substitute a nearby name, color archetype or younger incarnation.'})));
