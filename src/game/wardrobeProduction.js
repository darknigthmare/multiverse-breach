import { COSTUME_FIDELITY_CRITERIA, COSTUME_REFERENCE_VIEWS } from './wardrobeFidelity.js';
// Production guidance, not a sprite generator or an automatic art approval system.
const L = (fr, en) => Object.freeze({fr, en});
const task = (key, fr, en) => Object.freeze({key, name:L(fr,en), status:'TODO'});
const common = Object.freeze([
  task('identity','Verrouiller personnage, époque, âge et morphologie','Lock identity, era, age and anatomy'),
  task('turnaround','Références face, dos, profils et détails','Front, back, side and detail references'),
  task('sheets','Produire les planches et portraits dédiés','Produce dedicated sheets and portraits'),
  task('states','Vérifier chaque état et chaque direction réellement utilisés','Check every state and direction actually used'),
  task('review','Comparer en jeu et consigner la revue artistique','Compare in-game and record the art review')
]);
export function getCostumeProductionContract(item) {
  if(!item || item.nature==='procedural-effect')return null;
  const focus={
    'official-palette':L('Échantillonner la palette officielle sans changer la coupe.','Sample the official palette without changing the cut.'),
    'official-accessory':L('Vérifier points d’attache, occlusion et synchronisation des poses.','Check attachment points, occlusion and pose synchronization.'),
    'official-hairstyle':L('Coiffure seulement : visage, crâne et époque inchangés.','Hair only: preserve face, skull and era.'),
    'official-model':L('Respecter les proportions et le style du modèle officiel ciblé.','Respect the target official model’s proportions and style.')
  }[item.nature] || L('Conserver les marqueurs d’identité ; produire une tenue, pas un effet au sol.','Keep identity markers; produce an outfit, not a ground effect.');
  return {version:1,status:'ARTWORK_PENDING',equippable:false,artApproved:false,
    identityScope:item.actorKey || '', sourceWork:item.sourceWork || '',
    sourceUrl:item.sourceUrl || '',focus,
    tasks:common.map(t=>({...t})),
    fidelityCriteria:COSTUME_FIDELITY_CRITERIA,requiredReferenceViews:COSTUME_REFERENCE_VIEWS,
    proofRule:L('Un score seul ne valide jamais une tenue : références et planches identifiées par empreinte, poses requises et captures en jeu sont nécessaires.',
      'A score alone never approves an outfit: hashed references and sheets, required poses and in-game captures are needed.'),
    acceptance:L('Silhouette, tête, vêtements, couleurs, marquages, équipement, gestuelle, identité et lisibilité à vérifier. Les animations requises viennent du moteur, pas d’un nombre de cellules supposé.',
      'Check silhouette, head, clothes, colors, markings, equipment, gestures, identity and readability. Required animations come from the engine, not an assumed cell count.')};
}
const fold = value => String(value || '').normalize('NFD').replace(/\p{M}/gu,'').toLowerCase();
export function filterWardrobeEntries(entries,query='',nature='all') {
  const words=fold(query).trim().split(/\s+/).filter(Boolean);
  return entries.filter(item=>(nature==='all'||item.nature===nature) && words.every(word=>
    fold([item.name?.fr,item.name?.en,item.sourceWork,item.brief?.fr,item.brief?.en,item.key].join(' ')).includes(word)));
}
// Fail closed for catalogue errors; no fuzzy rebinding to another identity.
export function assertUniqueWardrobeEntries(entries) {
  const ids=new Set();
  for(const item of entries){
    if(!item.id || !item.actorKey || ids.has(item.id))throw new Error(`Invalid/duplicate wardrobe entry: ${item.id}`);
    ids.add(item.id);
  }
  return true;
}
