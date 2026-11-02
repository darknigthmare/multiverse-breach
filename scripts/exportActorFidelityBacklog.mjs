/** Execute trusted local source only. No network, game mutation or automatic visual approval. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CANON_ROSTER_WAVE } from '../src/game/canonRosterWave.js';
import { HEROES_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { ORIGINAL_UNIVERSE_DEFINITIONS } from '../src/game/originalUniverseWave.js';
import { OC_DLC_UNIVERSE_KEYS } from '../src/game/ocDlcPacks.js';
import { getHeroSpriteSheetSrc, getHeroMeleeSpriteSheetSrcs, getEnemySpriteSheetSrc, getSpriteSheetLayout } from '../src/game/spriteAssets.js';
import { getWardrobeBoosterRoutes } from '../src/game/wardrobeBoosterRewards.js';
import { buildActorFidelityBacklog, inspectActorRaster, indexActorContinuities } from '../src/game/actorFidelityBacklog.js';
const [outArg,sourceBaseCommit,treeFile,treeSourceCommit=sourceBaseCommit]=process.argv.slice(2);
if(!outArg || !/^[a-f0-9]{40}$/.test(sourceBaseCommit||'') || !/^[a-f0-9]{40}$/.test(treeSourceCommit||''))
  throw new Error('Usage: exportActorFidelityBacklog.mjs OUT BASE_COMMIT [TREE_JSON TREE_COMMIT]');
const root=fileURLToPath(new URL('../',import.meta.url));
let tree;
if(treeFile)tree=JSON.parse(fs.readFileSync(treeFile,'utf8'));
else {
 const raw=execFileSync('git',['-C',root,'ls-tree','-r','-l','-z','--full-tree',sourceBaseCommit],{encoding:'utf8',maxBuffer:64*1024*1024});
 tree={truncated:false,tree:raw.split('\0').filter(Boolean).map(line=>{
  const [head,...tail]=line.split('\t'),[mode,type,sha,size]=head.trim().split(/\s+/);
  return {path:tail.join('\t'),mode,type,sha,size:Number(size)};
 })};
}
if(tree.truncated!==false || !Array.isArray(tree.tree))throw new Error('Complete Git tree required, no silent partial audit.');
const index=new Map(tree.tree.filter(e=>e.type==='blob').map(e=>[e.path,e]));
const originals=new Set(['Nexus de Convergence',...ORIGINAL_UNIVERSE_DEFINITIONS.filter(d=>d.isOriginal===true||d.sourceType==='original').map(d=>d.universe),...OC_DLC_UNIVERSE_KEYS]);
const actors=[createPlayerHero(),...HEROES_DB].map(actor=>({actor,kind:'hero'}));
for(const [universe,roster] of Object.entries(ENEMIES_DB))for(const [field,kind] of [['monsters','enemy'],['bosses','boss'],['worldBoss','worldBoss']]) {
 for(const actor of field==='worldBoss'?(roster[field]?[roster[field]]:[]):roster[field]||[])
  actors.push({actor:{...actor,universe:actor.universe||universe},kind});
}
const continuityIndex=indexActorContinuities(CANON_ROSTER_WAVE);
const rows=actors.map(({actor,kind})=>{
 const requests=kind==='hero'?[['auto','idle'],['tactics','idle'],['collection','idle'],['hud','idle'],['melee','idle'],['melee','run'],['melee','attack'],['melee','hit']]
  .map(([context,state])=>({context,state,src:getHeroSpriteSheetSrc({...actor,state},context)}))
  :[{context:'enemy-sheet',state:'idle',src:getEnemySpriteSheetSrc(actor)}];
 if(kind==='hero')for(const src of getHeroMeleeSpriteSheetSrcs(actor))requests.push({context:'melee-manifest',state:'declared',src});
 const rasterProbes=requests.map(r=>inspectActorRaster(r.src,r.context,r.state,index,getSpriteSheetLayout(r.src)));
 const row=buildActorFidelityBacklog(actor,{kind,originalUniverses:originals,rasterProbes,sourceCommit:sourceBaseCommit,continuityIndex});
 return {...row,boosterRoutes:getWardrobeBoosterRoutes(actor)};
});
if(new Set(rows.map(r=>r.actorKey)).size!==rows.length)throw new Error('Actor identities collided.');
const out=path.resolve(outArg);fs.mkdirSync(out,{recursive:true});
const count=predicate=>rows.filter(predicate).length;
const summary={version:'R14',sourceBaseCommit,assetTreeCommit:treeSourceCommit,
 scope:'All active runtime actors after overrides; not every character absent from a franchise, nor all NPC contacts/trials. Declared data and sampled paths only.',
 actors:rows.length,heroes:count(r=>r.kind==='hero'),universes:new Set(rows.map(r=>r.universe)).size,
 originalIdentities:count(r=>r.sourceScope==='ORIGINAL_DESIGN'),externalOrUnresolved:count(r=>r.sourceScope!=='ORIGINAL_DESIGN'),
 actorsWithOfficialVariants:count(r=>r.officialCount>0),actorsWithMissingRaster:count(r=>r.missingRasterPaths.length>0),
 actorsWithStaticGameplay:count(r=>r.staticGameplayPaths.length>0),actorsWithGenericTechniqueNames:count(r=>r.techniques.some(t=>t.genericName)),
 continuitiesRecovered:count(r=>r.incarnationEvidence==='EXACT_PACK_BINDING'),
 continuityConflicts:count(r=>r.incarnationEvidence==='AMBIGUOUS_PACK_BINDING'),
 incarnationsUnspecified:count(r=>r.tasks.some(t=>t.code==='INCARNATION_UNSPECIFIED')),
 visualContractsMissing:count(r=>r.tasks.some(t=>t.code==='VISUAL_CONTRACT_MISSING')),
 visualContractsGeneric:count(r=>r.tasks.some(t=>t.code==='VISUAL_CONTRACT_GENERIC')),
 historicalP0:'Not reclassified by this export; see prior fidelity audit. P1/P2 here prioritize newly exported work only.',
 newArtApprovals:0,newSpriteFiles:0,reviewComplete:0};
const tasks=rows.flatMap(r=>r.tasks.map(t=>({actorKey:r.actorKey,actorId:r.actorId,actorName:r.actorName,universe:r.universe,kind:r.kind,sourceScope:r.sourceScope,...t})));
const cell=value=>{let s=Array.isArray(value)?value.join(' | '):String(value??'');const first=[...s].find(c=>c.charCodeAt(0)>31&&!/\s/.test(c));if(first&&'=+@-'.includes(first))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
const csv=(items,keys)=>'\uFEFF'+[keys,...items.map(r=>keys.map(k=>r[k]))].map(r=>r.map(cell).join(';')).join('\r\n')+'\r\n';
fs.writeFileSync(path.join(out,'actors.json'),JSON.stringify(rows,null,2)+'\n');
fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');
fs.writeFileSync(path.join(out,'actors.csv'),csv(rows,['actorKey','actorId','actorName','universe','kind','sourceScope','incarnation','incarnationEvidence','declaredReference','visualAnchor','officialCount','officialNames','officialResearchStatus','missingRasterPaths','staticGameplayPaths','priority','boosterRoutes','completeness']));
fs.writeFileSync(path.join(out,'tasks.csv'),csv(tasks,['actorKey','actorId','actorName','universe','kind','sourceScope','code','priority','status','reason','action','evidence']));
console.log(JSON.stringify({...summary,taskRows:tasks.length},null,2));
