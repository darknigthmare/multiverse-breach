/** Reproducible read-only source audit. No gameplay edits, no network, no secrets. */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import { stageReferenceIndex, resolveStageReference, rasterEvidence, summarizeResolutions,
  reviewSubstitution, gitTreeIndex, toCsv } from './fidelityEvidence.mjs';

const opts = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, all) => {
  if (i % 2 === 0) { if (!value.startsWith('--') || !all[i + 1]) throw new Error('Use --option value pairs'); pairs.push([value.slice(2), all[i + 1]]); }
  return pairs;
}, []));
const root = path.resolve(opts['source-root'] || fileURLToPath(new URL('../../../', import.meta.url)));
const commit = opts.commit || execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], {encoding:'utf8'}).trim();
if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('Exact source commit SHA required');
const out = path.resolve(opts.out || path.join(root, 'audit/fidelity-r3'));
let tree;
if (opts.tree) tree = JSON.parse(fs.readFileSync(opts.tree, 'utf8'));
else {
  const raw = execFileSync('git', ['-C', root, 'ls-tree', '-r', '-l', '-z', '--full-tree', commit], {encoding:'utf8', maxBuffer:64*1024*1024});
  tree = {truncated:false, tree:raw.split('\0').filter(Boolean).map(line => {
    const [header, ...tail] = line.split('\t'); const [mode,type,sha,size] = header.trim().split(/\s+/);
    return {path:tail.join('\t'), mode, type, sha, size:Number(size)};
  })};
}
const treeIndex = gitTreeIndex(tree);
// Ensure the imported source snapshot matches the declared Git tree before execution.
const sourceEntries = [...treeIndex.values()].filter(e =>
  (e.path.startsWith('src/') && /\.(js|jsx|json)$/.test(e.path))
  || ['package.json','scripts/riftDossierStaticStages.mjs'].includes(e.path));
for (const entry of sourceEntries) {
  const bytes = fs.readFileSync(path.join(root, entry.path));
  const actual = createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');
  if (actual !== entry.sha) throw new Error(`Source blob mismatch: ${entry.path}`);
}
const load = relative => import(pathToFileURL(path.join(root, relative)).href);
const [{HEROES_DB}, {ENEMIES_DB}, {createPlayerHero}, sprites, {CANON_ROSTER_WAVE},
  {getExpandedStages}, narrative, {OC_CAMPAIGN_MISSIONS}, {projectCharacterArcStage},
  {projectUniverseArcDeploymentPhases}, {readStaticStages}, {SOURCE_SCENE_STAGES}] = await Promise.all([
  load('src/game/heroes.js'), load('src/game/enemies.js'), load('src/game/playerHero.js'),
  load('src/game/spriteAssets.js'), load('src/game/canonRosterWave.js'), load('src/game/expandedUniverses.js'),
  load('src/game/narrativeSystems.js'), load('src/game/ocCampaign.js'), load('src/game/characterArcStage.js'),
  load('src/game/missions/missionStageProjection.js'), load('scripts/riftDossierStaticStages.mjs'), load('src/game/sourceSceneStages.js')
]);
const actors=[];
const add = (actor,kind,index,universe) => actors.push({ ...actor, universe:actor.universe || universe,
  kind, inventoryKey:`${universe}::${kind}::${index}::${actor.id || actor.name}` });
[createPlayerHero(), ...HEROES_DB].forEach((a,i)=>add(a,'hero',i,a.universe));
for (const [u,roster] of Object.entries(ENEMIES_DB)) {
  (roster.monsters || []).forEach((a,i)=>add(a,'enemy',i,u));
  (roster.bosses || []).forEach((a,i)=>add(a,'boss',i,u));
  if (roster.worldBoss) add(roster.worldBoss,'worldBoss',0,u);
}
if (new Set(actors.map(a=>a.inventoryKey)).size !== actors.length) throw new Error('Duplicate actor keys');
// This projects identity/metadata only, not mission rewards, access or behavior.
const stages = [
  ...readStaticStages(fs.readFileSync(path.join(root,'src/components/HubScreen.jsx'),'utf8')),
  ...OC_CAMPAIGN_MISSIONS,
  ...getExpandedStages(),
  ...SOURCE_SCENE_STAGES,
  ...narrative.FUSION_MISSIONS.map(m=>({id:m.stageId,name:m.title.en,universe:m.primaryUniverse,mode:m.mode})),
  ...narrative.CHARACTER_NARRATIVE_ARCS.map(projectCharacterArcStage),
  ...narrative.TRIO_NARRATIVE_ARCS.map(a=>({id:a.stageId,name:a.title.en,universe:a.universes[0],mode:a.mode})),
  ...narrative.UNIVERSE_NARRATIVE_ARCS.flatMap((a,i)=>projectUniverseArcDeploymentPhases(a,i).map(p=>({
    id:p.runtimeStageId, name:p.arcPhaseCount>1 && !p.isArcFinalPhase ? `${a.title.en} - Deployment ${p.arcPhaseIndex+1}/${p.arcPhaseCount}` : a.title.en,
    universe:p.sourceUniverses[0],mode:['RPG','Tactics','Smash'][i%3]
  })))
];
if (new Set(stages.map(s=>String(s.id))).size !== stages.length) throw new Error('Duplicate stage IDs');
const index=stageReferenceIndex(CANON_ROSTER_WAVE);
const stageReferences=stages.map(s=>({id:s.id,universe:s.universe,name:s.name,mode:s.mode,...resolveStageReference(s,index)}));
const baselinePath=opts.baseline || path.join(root,'docs/excel/evidence/sprite-production-checks.json');
const baseline=fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath,'utf8')) : [];
const p0=new Set(baseline.filter(x=>x.unchangedFromBaseline===true).map(x=>x.id));
const actorAssets=actors.map(actor=>{
  const requests=actor.kind==='hero'
    ? [ ['auto','idle'],['tactics','idle'],['collection','idle'],['hud','idle'],['melee','idle'],['melee','run'],['melee','attack'],['melee','hit'] ]
        .map(([context,state])=>({context,state,src:sprites.getHeroSpriteSheetSrc({...actor,state},context)}))
    : [{context:'enemy-sheet',state:'idle',src:sprites.getEnemySpriteSheetSrc(actor)}];
  if (actor.kind==='hero') for (const src of sprites.getHeroMeleeSpriteSheetSrcs(actor)) requests.push({context:'melee-manifest',state:'declared',src});
  const probes=requests.map(r=>({...r,...rasterEvidence(r.src,treeIndex),...sprites.getSpriteSheetLayout(r.src)}));
  const previousPriority=p0.has(actor.id) ? 'P0' : 'NOT_REASSESSED';
  return {key:actor.inventoryKey,id:actor.id || actor.name,universe:actor.universe,name:actor.name,kind:actor.kind,
    incarnation:actor.incarnation || '',visualAnchor:actor.visualAnchor || '',referenceUrl:actor.referenceUrl || '',
    canonStatus:actor.canonStatus || '',...summarizeResolutions(probes),priorityReview:reviewSubstitution(actor,previousPriority),resolutions:probes};
});
const summary={actors:actors.length,stages:stages.length,packs:CANON_ROSTER_WAVE.length,
  stageReferencesFound:stageReferences.filter(r=>r.status==='PACK_REFERENCE_FOUND').length,
  stageReferencesAmbiguous:stageReferences.filter(r=>r.status==='AMBIGUOUS').length,
  stageReferenceConflicts:stageReferences.filter(r=>r.status==='CONFLICT_PRESERVE_EXISTING').length,
  resolverProbes:actorAssets.reduce((n,a)=>n+a.probes,0),
  actorsWithMissingRaster:actorAssets.filter(a=>a.missingAssets>0).length,
  actorsWithStaticRaster:actorAssets.filter(a=>a.staticAssets>0).length,
  actorsWithStaticGameplayRaster:actorAssets.filter(a=>a.staticGameplayAssets>0).length,
  verifiedSourceFiles:sourceEntries.length,
  historicalP0Candidates:actorAssets.filter(a=>p0.has(a.id)).length,
  p0ExternalCanon:actorAssets.filter(a=>a.priorityReview.priority==='P0').length,
  originalIdentityReclassifications:actorAssets.filter(a=>p0.has(a.id)&&a.priorityReview.priority==='P1').length,
  artApprovals:0};
const report={schemaVersion:1,sourceCommit:commit,sourceTree:tree.sha || null,
  scope:'Declared pack references and sampled sprite resolver paths; not gameplay, visual certification or current HTTP validation.',
  summary,stageReferences,actorAssets};
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'fidelity-evidence-r3.json'),JSON.stringify(report,null,2)+'\n');
fs.writeFileSync(path.join(out,'stage-references-r3.csv'),toCsv(stageReferences.filter(s=>s.status!=='NOT_FOUND'),['id','universe','name','mode','status','referenceUrl','continuity','visualAnchor','referenceScope','packKey','locator']));
fs.writeFileSync(path.join(out,'actor-assets-r3.csv'),toCsv(actorAssets,['key','id','universe','name','kind','probes','distinctAssets','missingAssets','staticAssets','staticGameplayAssets','unknownAssets','artApproved']));
console.log(JSON.stringify(summary,null,2));
