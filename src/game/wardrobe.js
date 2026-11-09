import { OFFICIAL_COSTUMES_R14, WARDROBE_RESEARCH_R14, WARDROBE_SOURCE_SCOPES_R14 } from './wardrobeOfficialR14.js';
import { OFFICIAL_COSTUMES_R13, WARDROBE_RESEARCH_R13, WARDROBE_SOURCE_SCOPES_R13 } from './wardrobeOfficialR13.js';
import { OFFICIAL_COSTUMES_R12, WARDROBE_RESEARCH_R12, WARDROBE_SOURCE_SCOPES_R12 } from './wardrobeOfficialR12.js';
import { assessNamedCostumeScope } from './wardrobeSourceCoverage.js';
import { OFFICIAL_COSTUMES_R11, WARDROBE_RESEARCH_R11 } from './wardrobeOfficialR11.js';
import { OFFICIAL_COSTUMES_R10 } from './wardrobeOfficialR10.js';
import { OFFICIAL_COSTUMES_R9, WARDROBE_RESEARCH_R9 } from './wardrobeOfficialR9.js';
import { OFFICIAL_COSTUMES_R7 } from './wardrobeOfficialR7.js';
import { OFFICIAL_WARDROBE } from './wardrobeOfficial.js';
import { ORIGINAL_COLLECTIONS, SIGNATURE_DESIGNS } from './wardrobeOriginals.js';
import { OFFICIAL_COSTUME_EXTENSION, ORIGINAL_COLLECTION_EXTENSION, SIGNATURE_DESIGN_EXTENSION, WARDROBE_RESEARCH_TARGETS } from './wardrobeExpansion.js';
import { getCostumeProductionContract, assertUniqueWardrobeEntries } from './wardrobeProduction.js';
import { resolveDisciplineCostume } from './disciplineSprites.js';

const L = (fr,en) => Object.freeze({fr,en});
export const WARDROBE_VERSION = 9;
// Persisted IDs deliberately remain wardrobe-v1: migration must not erase selections.
export const WARDROBE_EFFECTS = Object.freeze([
  Object.freeze({key:'cyan',name:L('Résonance cyan','Cyan resonance'),color:'#39c5bb',shape:'ring'}),
  Object.freeze({key:'amber',name:L('Balise d’expédition','Expedition beacon'),color:'#eab667',shape:'beacon'}),
  Object.freeze({key:'violet',name:L('Sceau nocturne','Nocturne seal'),color:'#b89ce6',shape:'seal'})
]);
const effectByKey = new Map(WARDROBE_EFFECTS.map(e=>[e.key,e]));
export function wardrobeActorKey(actor) {
  if (!actor || typeof actor.universe!=='string' || !actor.universe.trim()) return '';
  const ident = typeof actor.id==='string' && actor.id.trim() ? `id:${actor.id}`
    : typeof actor.name==='string' && actor.name.trim() ? `name:${actor.name}` : '';
  return ident ? JSON.stringify([actor.universe,ident]) : '';
}
export function wardrobeEntryId(actor, localKey) {
  const key=wardrobeActorKey(actor);
  return key && typeof localKey==='string' && /^[a-z0-9-]+$/.test(localKey)
    ? `wardrobe-v1:${encodeURIComponent(key)}:${localKey}` : '';
}
export function isSafeWardrobeReference(value) {
  try {const url=new URL(value); return url.protocol==='https:' && !url.username && !url.password
    && ['store.steampowered.com','www.starwars.com','na.store.square-enix-games.com','www.halowaypoint.com','deadbydaylight.com','ioi.dk','www.nacongaming.com'].includes(url.hostname);}
  catch {return false;}
}
export const ALL_OFFICIAL_WARDROBE = Object.freeze([...OFFICIAL_WARDROBE,...OFFICIAL_COSTUME_EXTENSION,...OFFICIAL_COSTUMES_R7,...OFFICIAL_COSTUMES_R9,...OFFICIAL_COSTUMES_R10,...OFFICIAL_COSTUMES_R11,...OFFICIAL_COSTUMES_R12,...OFFICIAL_COSTUMES_R13,...OFFICIAL_COSTUMES_R14]);
const officialByActor=new Map();
for(const row of ALL_OFFICIAL_WARDROBE) {
  if(!isSafeWardrobeReference(row.sourceUrl))throw new Error(`Invalid wardrobe source ${row.key}`);
  for(const id of row.actorIds) {
    const key=wardrobeActorKey({id,universe:row.universe});
    const rows=officialByActor.get(key)||[];
    if(rows.some(c=>c.key===row.key))throw new Error(`Duplicate official outfit ${row.key}`);
    officialByActor.set(key,[...rows,row]);
  }
}
const bespokeByActor=new Map(SIGNATURE_DESIGNS.map(row=>[wardrobeActorKey(row),row]));
const extraByActor=new Map();
for(const row of SIGNATURE_DESIGN_EXTENSION){
  const key=wardrobeActorKey(row);
  const rows=extraByActor.get(key)||[];
  if(rows.some(c=>c.key===row.key))throw new Error(`Duplicate original outfit ${row.key}`);
  extraByActor.set(key,[...rows,row]);
}
const withProduction = row => ({...row,production:getCostumeProductionContract(row)});
export function getOfficialCostumes(actor) {
  const key=wardrobeActorKey(actor);
  return (officialByActor.get(key)||[]).map(row=>withProduction({...row,id:wardrobeEntryId(actor,row.key),actorKey:key,
    origin:'OFFICIAL',sourceScope:'DOCUMENTED_EXISTENCE_NOT_VISUAL_APPROVAL',
    fitStatus:'INCARNATION_AND_ART_REVIEW_REQUIRED', colors:{}}));
}
export function getOriginalCostumes(actor) {
  const key=wardrobeActorKey(actor); if(!key)return [];
  const anchor=String(actor.visualAnchor || actor.incarnation || '').slice(0,2400);
  const base = {actorKey:key,origin:'ORIGINAL',nature:'original-design-brief',artworkStatus:'NOT_PRODUCED',
    artApproval:'NOT_REVIEWED',equippable:false,fitStatus:'MORPHOLOGY_REVIEW_REQUIRED',
    sourceAnchor:anchor,sourceUrl:'',colors:{},
    identityRule:L('Même identité, espèce, âge, proportions et capacités. Si la fiche représente un objet ou une épreuve, concevoir une finition adaptée, pas des habits humains.',
      'Same identity, species, age, proportions and abilities. When the record is an object or trial, design an appropriate surface treatment, not human clothing.')};
  const rows=[...ORIGINAL_COLLECTIONS,...ORIGINAL_COLLECTION_EXTENSION].map(c=>({...base,id:wardrobeEntryId(actor,`original-${c.key}`),key:c.key,
    name:c.name,brief:c.brief,designMethod:'PARAMETRIC_BRIEF',collection:c.key}));
  const signature=bespokeByActor.get(key);
  if(signature) rows.push({...base,id:wardrobeEntryId(actor,'original-signature'),key:'signature',name:signature.name,
    brief:signature.brief,designMethod:'CHARACTER_SPECIFIC_BRIEF',collection:'signature'});
  for(const design of extraByActor.get(key)||[])rows.push({...base,id:wardrobeEntryId(actor,`original-personal-${design.key}`),
    key:design.key,name:design.name,brief:design.brief,designMethod:'CHARACTER_SPECIFIC_BRIEF',collection:'personal'});
  assertUniqueWardrobeEntries(rows);
  return rows.map(withProduction);
}
export function getWardrobeResearchTargets(actor) {
  const actorKey=wardrobeActorKey(actor); if(!actorKey)return [];
  return [...WARDROBE_RESEARCH_TARGETS,...WARDROBE_RESEARCH_R9,...WARDROBE_RESEARCH_R11,...WARDROBE_RESEARCH_R12,...WARDROBE_RESEARCH_R13,...WARDROBE_RESEARCH_R14].filter(row=>wardrobeActorKey(row)===actorKey).map(row=>({...row,
    actorKey,entryId:wardrobeEntryId(actor,`research-${row.key}`),equippable:false,officialConfirmed:false}));
}
export function getWardrobeEffects(actor) {
  const actorKey=wardrobeActorKey(actor); if(!actorKey)return [];
  return WARDROBE_EFFECTS.map(e=>({...e,id:wardrobeEntryId(actor,`effect-${e.key}`),actorKey,
    origin:'ORIGINAL',nature:'procedural-effect',artworkStatus:'PROCEDURAL_EFFECT_READY',artApproval:'NOT_APPLICABLE',
    equippable:true,colors:{},brief:L('Effet au sol uniquement ; ne remplace pas la tenue ni le sprite.',
      'Ground effect only; does not replace the outfit or sprite.')}));
}
export function getWardrobeSourceScopeCoverage(actor) {
  return [...WARDROBE_SOURCE_SCOPES_R12,...WARDROBE_SOURCE_SCOPES_R13,...WARDROBE_SOURCE_SCOPES_R14].filter(scope=>actor?.universe===scope.universe&&actor?.id===scope.actorId)
    .map(scope=>assessNamedCostumeScope(actor,scope,ALL_OFFICIAL_WARDROBE));
}
export function getWardrobeCoverage(actor) {
  const official=getOfficialCostumes(actor),original=getOriginalCostumes(actor);
  return {actorKey:wardrobeActorKey(actor),official:official.length,originalConcepts:original.length,
    sourceResearch:official.length?'PARTIAL_DOCUMENTED':'NOT_RESEARCHED',
    researchTargets:getWardrobeResearchTargets(actor).length,
    namedSourceScopes:getWardrobeSourceScopeCoverage(actor),allCharacterCostumesResearched:false,
    completedCostumes:0,availableEffects:wardrobeActorKey(actor)?WARDROBE_EFFECTS.length:0,artApproved:false};
}
export function resolveWardrobeEffect(actor, selectedId) {
  if(typeof selectedId!=='string')return null;
  const prefix=wardrobeEntryId(actor,'effect-');
  if(!prefix || !selectedId.startsWith(prefix))return null;
  return effectByKey.get(selectedId.slice(prefix.length)) || null;
}
const LEGACY_COLOR_KEYS=['primaryColor','secondaryColor','weaponColor','color'];
export function applyActorAppearance(actor,selectedId,legacyCatalog={},options={}) {
  if(!actor || !wardrobeActorKey(actor))return actor;
  if(!selectedId || selectedId==='default' || options.sourceLocked)return actor;
  const costume=resolveDisciplineCostume(actor,selectedId);
  if(costume)return {...actor,disciplineSpriteId:costume.id,activeSkin:{id:costume.id,name:costume.label,colors:{},
    kind:'generated-static-costume',canonical:false,provenance:costume.provenance}};
  const effect=resolveWardrobeEffect(actor,selectedId);
  if(effect)return {...actor,wardrobeEffect:selectedId,activeSkin:{id:selectedId,name:effect.name,colors:{},
    kind:'procedural-effect',canonical:false}};
  if(typeof selectedId!=='string' || selectedId.startsWith('wardrobe-v1:'))return actor;
  if(!legacyCatalog || !Object.hasOwn(legacyCatalog,selectedId))return actor;
  const skin=legacyCatalog[selectedId];
  if(!skin || (skin.heroId && skin.heroId!==actor.id) || (skin.universe && skin.universe!==actor.universe))return actor;
  const colors={};
  for(const key of LEGACY_COLOR_KEYS) if(typeof skin.colors?.[key]==='string' && /^#(?:[a-f0-9]{3,4}|[a-f0-9]{6}|[a-f0-9]{8})$/i.test(skin.colors[key]))colors[key]=skin.colors[key];
  return {...actor,...colors,activeSkin:skin};
}
export function wardrobeSelectionStatus(actor,selectedId) {
  if(!selectedId || selectedId==='default')return 'ORIGIN';
  if(resolveDisciplineCostume(actor,selectedId))return 'GENERATED_STATIC_COSTUME';
  if(resolveWardrobeEffect(actor,selectedId))return 'PROCEDURAL_EFFECT';
  if([...getOfficialCostumes(actor),...getOriginalCostumes(actor)].some(c=>c.id===selectedId))return 'ASSET_PENDING';
  return 'UNKNOWN_OR_LEGACY';
}
