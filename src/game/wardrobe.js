import { OFFICIAL_WARDROBE } from './wardrobeOfficial.js';
import { ORIGINAL_COLLECTIONS, SIGNATURE_DESIGNS } from './wardrobeOriginals.js';

const L = (fr,en) => Object.freeze({fr,en});
export const WARDROBE_VERSION = 1;
export const WARDROBE_EFFECTS = Object.freeze([
  Object.freeze({key:'cyan',name:L('Résonance cyan','Cyan resonance'),color:'#39c5bb',shape:'ring'}),
  Object.freeze({key:'amber',name:L('Balise d’expédition','Expedition beacon'),color:'#eab667',shape:'beacon'}),
  Object.freeze({key:'violet',name:L('Sceau nocturne','Nocturne seal'),color:'#b89ce6',shape:'seal'})
]);
const effectByKey = new Map(WARDROBE_EFFECTS.map(e=>[e.key,e]));
// An ID alone is insufficient: two franchises can reuse it. No fuzzy names or translation guesses.
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
    && ['store.steampowered.com','www.starwars.com'].includes(url.hostname);}
  catch {return false;}
}
const officialByActor=new Map();
for(const row of OFFICIAL_WARDROBE) {
  if(!isSafeWardrobeReference(row.sourceUrl))throw new Error(`Invalid wardrobe source ${row.key}`);
  for(const id of row.actorIds) {
    const key=wardrobeActorKey({id,universe:row.universe});
    officialByActor.set(key,[...(officialByActor.get(key)||[]),row]);
  }
}
const bespokeByActor=new Map(SIGNATURE_DESIGNS.map(row=>[wardrobeActorKey(row),row]));
export function getOfficialCostumes(actor) {
  const key=wardrobeActorKey(actor);
  return (officialByActor.get(key)||[]).map(row=>({...row,id:wardrobeEntryId(actor,row.key),actorKey:key,
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
  const rows=ORIGINAL_COLLECTIONS.map(c=>({...base,id:wardrobeEntryId(actor,`original-${c.key}`),key:c.key,
    name:c.name,brief:c.brief,designMethod:'PARAMETRIC_BRIEF',collection:c.key}));
  const signature=bespokeByActor.get(key);
  if(signature) rows.push({...base,id:wardrobeEntryId(actor,'original-signature'),key:'signature',name:signature.name,
    brief:signature.brief,designMethod:'CHARACTER_SPECIFIC_BRIEF',collection:'signature'});
  return rows;
}
export function getWardrobeEffects(actor) {
  const actorKey=wardrobeActorKey(actor); if(!actorKey)return [];
  return WARDROBE_EFFECTS.map(e=>({...e,id:wardrobeEntryId(actor,`effect-${e.key}`),actorKey,
    origin:'ORIGINAL',nature:'procedural-effect',artworkStatus:'PROCEDURAL_EFFECT_READY',artApproval:'NOT_APPLICABLE',
    equippable:true,colors:{},brief:L('Effet au sol uniquement ; ne remplace pas la tenue ni le sprite.',
      'Ground effect only; does not replace the outfit or sprite.')}));
}
export function getWardrobeCoverage(actor) {
  const official=getOfficialCostumes(actor),original=getOriginalCostumes(actor);
  return {actorKey:wardrobeActorKey(actor),official:official.length,originalConcepts:original.length,
    sourceResearch:official.length?'PARTIAL_DOCUMENTED':'NOT_RESEARCHED',
    // Absence from this first wave NEVER asserts that no official alternative exists.
    completedCostumes:0,availableEffects:wardrobeActorKey(actor)?WARDROBE_EFFECTS.length:0,artApproved:false};
}
export function resolveWardrobeEffect(actor, selectedId) {
  if(typeof selectedId!=='string')return null;
  const prefix=wardrobeEntryId(actor,'effect-');
  // Build from an exact actor key, never decode or trust arbitrary saved metadata.
  if(!prefix || !selectedId.startsWith(prefix))return null;
  return effectByKey.get(selectedId.slice(prefix.length)) || null;
}
// Only cosmetic color keys can cross the legacy bridge. No stats, identity, source or abilities.
const LEGACY_COLOR_KEYS=['primaryColor','secondaryColor','weaponColor','color'];
export function applyActorAppearance(actor,selectedId,legacyCatalog={},options={}) {
  if(!actor || !wardrobeActorKey(actor))return actor;
  // Call on base catalogue actors, not on a previously tinted actor.
  if(!selectedId || selectedId==='default' || options.sourceLocked)return actor;
  const effect=resolveWardrobeEffect(actor,selectedId);
  if(effect)return {...actor,wardrobeEffect:selectedId,activeSkin:{id:selectedId,name:effect.name,colors:{},
    kind:'procedural-effect',canonical:false}};
  // Pending official costumes and plans cannot borrow the origin sprite and pretend to be equipped.
  if(typeof selectedId!=='string' || selectedId.startsWith('wardrobe-v1:'))return actor;
  if(!Object.hasOwn(legacyCatalog,selectedId))return actor;
  const skin=legacyCatalog[selectedId];
  if(!skin || (skin.heroId && skin.heroId!==actor.id) || (skin.universe && skin.universe!==actor.universe))return actor;
  const colors={};
  for(const key of LEGACY_COLOR_KEYS) if(typeof skin.colors?.[key]==='string' && /^#[a-f0-9]{3,8}$/i.test(skin.colors[key]))colors[key]=skin.colors[key];
  return {...actor,...colors,activeSkin:skin};
}
export function wardrobeSelectionStatus(actor,selectedId) {
  if(!selectedId || selectedId==='default')return 'ORIGIN';
  if(resolveWardrobeEffect(actor,selectedId))return 'PROCEDURAL_EFFECT';
  if([...getOfficialCostumes(actor),...getOriginalCostumes(actor)].some(c=>c.id===selectedId))return 'ASSET_PENDING';
  return 'UNKNOWN_OR_LEGACY';
}
