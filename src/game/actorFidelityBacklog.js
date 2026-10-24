/** Read-only per-actor gaps. Source metadata and file presence are not visual approval. */
import { wardrobeActorKey, getOfficialCostumes, getOriginalCostumes, getWardrobeResearchTargets } from './wardrobe.js';
const text = value => typeof value === 'string' ? value : value?.en || value?.fr || '';
const httpReference = value => {
  if (typeof value !== 'string') return '';
  try { const u = new URL(value); return u.protocol === 'https:' && !u.username && !u.password ? u.href : ''; }
  catch { return ''; }
};
export function actorSourceScope(actor, originalUniverses = new Set()) {
  if (actor.originalContent === true || actor.contentOrigin === 'oc' || originalUniverses.has(actor.universe)
    || /^Multiverse Breach original (?:companion|tribute persona)\b/i.test(text(actor.incarnation))
    || /^Original (?:project companion|tribute persona from the project)[,.;: ]/i.test(text(actor.canonStatus))) return 'ORIGINAL_DESIGN';
  // "original fan-made artwork" never turns a licensed character into an original identity.
  return 'EXTERNAL_OR_UNRESOLVED';
}
export function indexActorContinuities(packs) {
  const index=new Map();
  for(const pack of packs) {
    const continuity=text(pack.continuity)||text(pack.canonProfile?.continuity);
    if(!continuity || !pack.universe)continue;
    const candidates=[pack.hero,...(pack.allies||[]),...(pack.monsters||[]),...(pack.bosses||[]),pack.worldBoss].filter(Boolean);
    for(const value of candidates) {
      const actor=Array.isArray(value)?{id:value[0],name:value[1],universe:pack.universe}
        :typeof value==='object'?{...value,universe:pack.universe}:null;
      const key=wardrobeActorKey(actor);if(!key)continue;
      const rows=index.get(key)||[];
      if(!rows.some(row=>row.continuity===continuity))rows.push({continuity,packKey:pack.key||'',referenceUrl:pack.referenceUrl||''});
      index.set(key,rows);
    }
  }
  return index;
}
export function readActorTechniques(actor) {
  return ['simple','secondary','defense','special'].map(slot => {
    const value = actor[slot];
    const name = typeof value === 'string' ? value : text(value?.name);
    const generic = /(?:signature strike|breach technique|origin burst|signature action|signature technique|defensive action|decisive action)$/i.test(name);
    return { slot, name, type: typeof value === 'object' ? value?.type || '' : '', genericName: generic };
  });
}
export function inspectActorRaster(src, context, state, treeIndex, layout = {}) {
  const result = { path: typeof src === 'string' ? src : '', context, state,
    columns: layout.columns ?? null, rows: layout.rows ?? null, artApproved: false };
  if (!src || typeof src !== 'string') return {...result, status:'UNRESOLVED', present:null};
  if (!src.startsWith('/') || src.startsWith('//')) return {...result, status:'EXTERNAL_OR_UNSUPPORTED', present:null};
  let local;
  try { local=decodeURIComponent(src.split(/[?#]/,1)[0]); } catch { return {...result,status:'INVALID_PATH',present:null}; }
  if (local.includes('\\') || local.split('/').some(s=>s==='..'||s==='.')) return {...result,status:'INVALID_PATH',present:null};
  const file = treeIndex.get(`public${local}`);
  return {...result,path:local,status:file?'PRESENT_IN_GIT':'MISSING_IN_GIT',present:Boolean(file),
    gitBlob:file?.sha||'',bytes:file?.size??null};
}
export function buildActorFidelityBacklog(actor, {kind='hero',originalUniverses=new Set(),rasterProbes=[],sourceCommit='',continuityIndex=new Map()}={}) {
  const actorKey=wardrobeActorKey(actor);
  if(!actorKey) throw new TypeError('Exact actor identity and universe required.');
  const scope=actorSourceScope(actor,originalUniverses);
  const official=getOfficialCostumes(actor), originals=getOriginalCostumes(actor), research=getWardrobeResearchTargets(actor);
  const actorIncarnation=text(actor.incarnation)||text(actor.sourceIncarnation)||text(actor.continuity);
  const packContinuities=continuityIndex.get(actorKey)||[];
  const incarnation=actorIncarnation||(packContinuities.length===1?packContinuities[0].continuity:'');
  const incarnationEvidence=actorIncarnation?'ACTOR_DECLARED':packContinuities.length===1?'EXACT_PACK_BINDING':packContinuities.length>1?'AMBIGUOUS_PACK_BINDING':'UNSPECIFIED';
  const anchor=text(actor.visualAnchor);
  const declaredSource=text(actor.referenceUrl);
  const reference=httpReference(declaredSource);
  const techniques=readActorTechniques(actor);
  const distinct=[...new Map(rasterProbes.map(p=>[p.path,p])).values()];
  const missing=distinct.filter(p=>p.status==='MISSING_IN_GIT');
  const staticGameplay=[...new Map(rasterProbes.filter(p=>p.present&&p.columns===1&&p.rows===1&&!['hud','collection'].includes(p.context)).map(p=>[p.path,p])).values()];
  const tasks=[];
  const add=(code,priority,reason,action,evidence='')=>tasks.push({id:`${actorKey}::${code}`,code,priority,status:'OPEN',reason,action,evidence,artApproved:false});
  if(!incarnation)add('INCARNATION_UNSPECIFIED','P1',`L’édition ou incarnation n’est pas renseignée explicitement pour ${actor.name}.`,
    scope==='ORIGINAL_DESIGN'?'Fixer la version du design interne avant déclinaisons.':'Fixer opus, époque, forme et modèle cible avant production ; ne pas mélanger les épisodes.',String(actor.canonStatus||''));
  if(incarnationEvidence==='EXACT_PACK_BINDING')add('PACK_CONTINUITY_PRECISION','P2','La continuité a été retrouvée dans un pack lié par identité exacte.',
    'Conserver cette continuité, puis préciser le modèle, la tenue et la scène de l’acteur. Un pack n’est pas une comparaison visuelle.',incarnation);
  if(incarnationEvidence==='AMBIGUOUS_PACK_BINDING')add('PACK_CONTINUITY_CONFLICT','P1','Plusieurs continuités de pack sont déclarées pour la même identité.',
    'Choisir une cible explicite ; ne pas fusionner automatiquement les versions.',packContinuities.map(p=>p.continuity).join(' | '));
  if(!anchor)add('VISUAL_CONTRACT_MISSING','P1',`Pas de visualAnchor individuel pour ${actor.name}.`,
    'Décrire tête, proportions, silhouette, tenue, palette, marquages et accessoires à partir de références validées.');
  else if(/preserving the canonical silhouette, palette, outfit and signature prop from the locked continuity/i.test(anchor))
    add('VISUAL_CONTRACT_GENERIC','P1','Le contrat visuel utilise encore une phrase générique.',
      'Remplacer la phrase générique par des détails observables propres à ce personnage et à cette incarnation.',anchor);
  if(scope==='ORIGINAL_DESIGN')add('INTERNAL_DESIGN_REVIEW','P2','Identité originale explicitement déclarée ; pas de costume officiel externe à inventer.',
    'Comparer les variantes au design interne, aux proportions et aux pièces déjà définies.',text(actor.spritePrompt)||anchor);
  else if(!reference)add(declaredSource?'REFERENCE_INVALID':'REFERENCE_MISSING','P1',
    'Pas de référence HTTPS exploitable déclarée sur la fiche acteur.',
    'Documenter la source primaire exacte et les vues nécessaires. Ne pas considérer un lien de costume comme validation du sprite de base.',declaredSource);
  else add('REFERENCE_SCENE_REVIEW','P2','Un lien est déclaré dans le code, mais sa scène et sa portée restent à contrôler.',
    'Relier ce lien à l’incarnation exacte et collecter les vues ; une URL ne prouve pas la ressemblance.',reference);
  if(/original face/i.test(anchor)&&scope!=='ORIGINAL_DESIGN')add('SOURCE_FACE_CONTRACT_REVIEW','P1',
    'Le contrat demande un visage original pour une identité de source.',
    'Arbitrer cette consigne avec l’objectif 1:1 ; documenter le visage du personnage cible au lieu d’approuver une substitution.',anchor);
  if(missing.length)add('RASTER_MISSING','P1',`${missing.length} fichier(s) résolu(s) absent(s) de l’arbre Git contrôlé.`,
    'Produire ou raccorder ces fichiers puis rejouer le rendu. Un affichage de secours éventuel n’est pas une réparation 1:1.',missing.map(p=>p.path).join(' | '));
  if(!rasterProbes.length||rasterProbes.some(p=>p.present===null))add('RASTER_SCOPE_UNRESOLVED','P1',
    'Au moins un contexte ne dispose pas de preuve de fichier locale exploitable.','Résoudre le chemin et vérifier l’asset sans assimiler inconnue et absence.');
  if(staticGameplay.length)add('STATIC_GAMEPLAY_REVIEW','P1',
    `${staticGameplay.length} planche(s) de jeu déclarée(s) 1×1.`,
    'Vérifier si la pose fixe est voulue ; sinon produire les états utilisés. Ne pas confondre avec un portrait HUD légitimement statique.',staticGameplay.map(p=>p.path).join(' | '));
  const generic=techniques.filter(t=>t.genericName);
  if(generic.length)add('GENERIC_TECHNIQUE_NAMES','P1',`${generic.length} technique(s) portent encore un nom générique.`,
    'Comparer les actions, animations et règles réelles aux techniques de source ; un nom générique seul ne prouve pas un moteur manquant.',generic.map(t=>`${t.slot}: ${t.name}`).join(' | '));
  if(scope!=='ORIGINAL_DESIGN')add('OFFICIAL_COSTUME_RESEARCH',official.length?'P2':'P1',
    official.length?`${official.length} variante(s) documentée(s), sans recensement exhaustif.`:'Aucune variante officielle documentée pour cette identité dans le registre courant.',
    'Comparer opus par opus les tenues, modèles, palettes et accessoires. Marquer recherche terminée seulement avec un périmètre et des sources, jamais par défaut.',official.map(c=>`${c.name.en} — ${c.sourceWork}`).join(' | '));
  if(official.length)add('OFFICIAL_COSTUME_ARTWORK','P1',`${official.length} variante(s) officielle(s) sans planche dédiée livrée.`,
    'Produire portraits, planches et animations propres à chaque variante, puis revue 1:1. Ne pas changer le porteur ni transférer les bonus du pack.',official.map(c=>c.id).join(' | '));
  add('ORIGINAL_COSTUME_ARTWORK','P2',`${originals.length} concepts originaux, pas des costumes graphiques terminés.`,
    'Adapter les concepts au corps et au rôle exacts puis produire les assets ; aucune approbation automatique.',originals.filter(c=>c.designMethod==='CHARACTER_SPECIFIC_BRIEF').map(c=>c.name.fr).join(' | '));
  for(const r of research)add(`RESEARCH_${r.key}`,'P1',text(r.question),'Résoudre cette piste avant tout ajout actif au registre de récompenses.',r.sourceUrl);
  add('ANIMATION_AND_VISUAL_REVIEW','P2','Aucune certification visuelle individuelle créée par cet export.',
    'Contrôler les états et directions, silhouette, visage, tenue, équipement, proportions et raccords dans chaque mode. Revue séparée des mains FPS et du kart.');
  return {actorKey,actorId:actor.id||'',actorName:actor.name,universe:actor.universe,kind,sourceScope:scope,
    incarnation,incarnationEvidence,packContinuities,declaredReference:declaredSource,visualAnchor:anchor,canonStatus:text(actor.canonStatus),
    sourceRecord:`${kind==='hero'?'HEROES_DB + player anchor':'ENEMIES_DB after overrides'}`,sourceCommit,
    primaryColor:actor.primaryColor||actor.color||'',weapon:actor.weapon||actor.weaponType||'',
    officialCount:official.length,officialNames:official.map(c=>c.name.fr),originalCount:originals.length,
    personalConcepts:originals.filter(c=>c.designMethod==='CHARACTER_SPECIFIC_BRIEF').map(c=>c.name.fr),
    officialResearchStatus:scope==='ORIGINAL_DESIGN'?'EXTERNAL_NOT_APPLICABLE':official.length?'PARTIAL_DOCUMENTED':'NOT_RESEARCHED',
    rasterPaths:distinct.map(p=>p.path),missingRasterPaths:missing.map(p=>p.path),staticGameplayPaths:staticGameplay.map(p=>p.path),
    techniques,rasterProbes,tasks,priority:tasks.some(t=>t.priority==='P1')?'P1':'P2',
    completeness:'OPEN_NOT_EXHAUSTIVE',artApproved:false};
}
