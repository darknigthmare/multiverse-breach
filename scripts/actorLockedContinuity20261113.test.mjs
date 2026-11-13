import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { getLoreWorldBossOverride } from '../src/game/loreWorldBossOverrides.js';
import { buildActorFidelityBacklog, inspectActorLockedContinuity, inspectActorRaster } from '../src/game/actorFidelityBacklog.js';

const fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/actorLockedContinuity20261113.json',import.meta.url),'utf8'));
const runtimeHash=()=>createHash('sha256').update(JSON.stringify(ENEMIES_DB)).digest('hex');
const initialRuntimeHash=runtimeHash();
const actorFor=record=>{
  const actor=ENEMIES_DB[record.universe]?.worldBoss;
  assert.ok(actor,record.actorKey);
  return {...actor,universe:actor.universe||record.universe};
};
const options={kind:'worldBoss'};
const hasTask=(row,code)=>row.tasks.some(task=>task.code===code);
const snapshotContract=actor=>({
  actorName:actor.name,universe:actor.universe,actorId:actor.id||'',
  legacyWorldBossId:actor.legacyWorldBossId,continuity:actor.continuity,
  referenceUrl:actor.referenceUrl,visualAnchor:actor.visualAnchor
});
const assertUnapproved=row=>{
  assert.equal(row.artApproved,false);
  assert.equal(row.completeness,'OPEN_NOT_EXHAUSTIVE');
  assert.ok(row.tasks.every(task=>task.status==='OPEN'&&task.artApproved===false));
};

test('review cohort has 40 exact active identities and does not include inactive registry entries',()=>{
  assert.equal(fixture.selected.length,40);
  const all=[...fixture.selected,...fixture.additionalActiveContracts,...fixture.ambiguous];
  assert.equal(all.length,62);
  assert.equal(new Set(all.map(record=>record.actorKey)).size,62);
  assert.equal(fixture.source1to1Verified,false);
});

for(const record of fixture.selected)test(`source continuity: ${record.actorKey}`,()=>{
  const actor=actorFor(record);
  assert.deepEqual(snapshotContract(actor),Object.fromEntries(Object.keys(snapshotContract(actor)).map(key=>[key,record[key]])));
  const before=JSON.stringify(actor);
  const row=buildActorFidelityBacklog(actor,options);
  // Omitting only this structured declaration reproduces the previous reader's
  // unresolved result while keeping the same current actor and raster inputs.
  const withoutDeclaration=buildActorFidelityBacklog({...actor,continuity:undefined},options);
  assert.equal(row.actorKey,record.actorKey);
  assert.equal(row.actorId,record.actorId);
  assert.equal(row.incarnation,record.continuity.label);
  assert.equal(row.incarnationEvidence,'ACTOR_LOCKED_CONTINUITY');
  assert.equal(row.declaredContinuity.sourceId,record.continuity.id);
  assert.equal(row.declaredContinuity.source,record.continuity.source);
  assert.equal(row.declaredContinuity.referenceUrl,record.referenceUrl);
  assert.equal(row.declaredContinuity.sourceField,'continuity.label');
  assert.equal(row.declaredContinuity.requiresModelReview,true);
  assert.equal(row.declaredContinuity.source1to1Verified,false);
  assert.equal(row.declaredContinuity.artApproved,false);
  assert.ok(hasTask(withoutDeclaration,'INCARNATION_UNSPECIFIED'));
  assert.ok(!hasTask(row,'INCARNATION_UNSPECIFIED'));
  const precision=row.tasks.find(task=>task.code==='ACTOR_CONTINUITY_PRECISION');
  assert.equal(precision?.priority,'P2');
  assert.deepEqual(row.tasks.filter(task=>task.code!=='ACTOR_CONTINUITY_PRECISION'),
    withoutDeclaration.tasks.filter(task=>task.code!=='INCARNATION_UNSPECIFIED'));
  assert.deepEqual(row.rasterProbes,withoutDeclaration.rasterProbes);
  assertUnapproved(row);
  assert.equal(JSON.stringify(actor),before);
});

test('the 20 additional active declarations have the same contract and keep their other gaps',()=>{
  for(const record of fixture.additionalActiveContracts){
    const actor=actorFor(record);
    const declared=getLoreWorldBossOverride(record.universe);
    assert.deepEqual(actor.continuity,record.continuity);
    assert.equal(actor.referenceUrl,record.referenceUrl);
    assert.equal(actor.visualAnchor,record.visualAnchor);
    assert.equal(actor.name,record.actorName);
    assert.equal(actor.legacyWorldBossId,record.legacyWorldBossId);
    assert.equal(actor.source,declared.source);
    const row=buildActorFidelityBacklog(actor,options);
    const previous=buildActorFidelityBacklog({...actor,continuity:undefined},options);
    assert.equal(row.incarnationEvidence,'ACTOR_LOCKED_CONTINUITY');
    assert.deepEqual(row.tasks.filter(task=>task.code!=='ACTOR_CONTINUITY_PRECISION'),
      previous.tasks.filter(task=>task.code!=='INCARNATION_UNSPECIFIED'));
    assertUnapproved(row);
  }
});

test('manga/anime declarations remain P1 and cannot borrow a single pack continuity',()=>{
  for(const record of fixture.ambiguous){
    const actor=actorFor(record);
    assert.deepEqual(actor.continuity,record.continuity);
    assert.equal(actor.referenceUrl,record.referenceUrl);
    for(const packContinuities of [[],[{continuity:'An exact pack target',packKey:'test-only',referenceUrl:record.referenceUrl}]]){
      const row=buildActorFidelityBacklog(actor,{...options,continuityIndex:new Map([[record.actorKey,packContinuities]])});
      assert.equal(row.incarnation,'');
      assert.equal(row.incarnationEvidence,'AMBIGUOUS_ACTOR_CONTINUITY');
      assert.equal(row.declaredContinuity.label,record.continuity.label);
      assert.equal(row.tasks.find(task=>task.code==='ACTOR_CONTINUITY_AMBIGUOUS')?.priority,'P1');
      assert.ok(!hasTask(row,'ACTOR_CONTINUITY_PRECISION'));
      assert.ok(!hasTask(row,'PACK_CONTINUITY_PRECISION'));
      assertUnapproved(row);
    }
  }
});

test('a composite actor declaration does not conceal conflicting pack targets',()=>{
  const record=fixture.ambiguous[0],actor=actorFor(record);
  const continuityIndex=new Map([[record.actorKey,[{continuity:'Manga target'},{continuity:'Anime target'}]]]);
  const row=buildActorFidelityBacklog(actor,{...options,continuityIndex});
  assert.equal(row.incarnation,'');
  assert.ok(hasTask(row,'ACTOR_CONTINUITY_AMBIGUOUS'));
  assert.ok(hasTask(row,'PACK_CONTINUITY_CONFLICT'));
});

test('unknown, malformed and unlocked structured declarations never become an incarnation',()=>{
  const actor=actorFor(fixture.selected[0]);
  const invalid=[
    null,[],{label:actor.continuity.label},
    Object.create(actor.continuity),
    {...actor.continuity,id:''},
    {...actor.continuity,id:`${actor.continuity.id}-unrelated`},
    {...actor.continuity,label:''},
    {...actor.continuity,label:'An invented target'},
    {...actor.continuity,status:'unlocked'},
    {...actor.continuity,status:'LOCKED'},
    {...actor.continuity,source:'unreviewed-audit'},
    {...actor.continuity,artApproved:true}
  ];
  for(const continuity of invalid){
    const candidate={...actor,continuity};
    assert.equal(inspectActorLockedContinuity(candidate,'worldBoss'),null);
    const row=buildActorFidelityBacklog(candidate,options);
    assert.equal(row.incarnation,'');
    assert.equal(row.incarnationEvidence,'UNSPECIFIED');
    assert.ok(hasTask(row,'INCARNATION_UNSPECIFIED'));
    assertUnapproved(row);
  }
});

test('name, exact identity, role, source URL and visual contract must all match the registry',()=>{
  const actor=actorFor(fixture.selected[0]);
  for(const override of [
    {id:'some-other-actor'},
    {universe:'Alien Resurrection'},
    {universe:'__proto__'},
    {universe:'constructor'},
    {universe:'toString'},
    {name:'A namesake'},
    {legacyWorldBossId:'unrelated-legacy-id'},
    {source:'unreviewed-source'},
    {type:'boss'},
    {isWorldBoss:false},
    {referenceUrl:'https://example.org/valid-but-not-the-declared-reference'},
    {referenceUrl:actor.referenceUrl.replace('https:','http:')},
    {referenceUrl:'https://user:password@example.org/actor'},
    {referenceUrl:'javascript:alert(1)'},
    {visualAnchor:'A plausible but unrelated model'}
  ]){
    const candidate={...actor,...override};
    assert.equal(inspectActorLockedContinuity(candidate,'worldBoss'),null,JSON.stringify(override));
    assert.ok(hasTask(buildActorFidelityBacklog(candidate,options),'INCARNATION_UNSPECIFIED'));
  }
  for(const kind of ['hero','boss','enemy']){
    assert.equal(inspectActorLockedContinuity(actor,kind),null);
    assert.ok(hasTask(buildActorFidelityBacklog(actor,{kind}),'INCARNATION_UNSPECIFIED'));
  }
});

test('an unrelated actor with a label and valid reference cannot claim this provenance',()=>{
  const actor={id:'not-a-world-boss',universe:'Unrelated',name:'Subject',type:'worldBoss',isWorldBoss:true,
    continuity:{id:'target',label:'Source Game (2000)',status:'locked',source:'world-bosses-lore-gap-audit-2026-07-17'},
    referenceUrl:'https://example.org/subject',visualAnchor:'A detailed source-specific appearance'};
  assert.equal(inspectActorLockedContinuity(actor,'worldBoss'),null);
  assert.ok(hasTask(buildActorFidelityBacklog(actor,options),'INCARNATION_UNSPECIFIED'));
});

test('existing string and localized actor declarations retain priority over structured and pack data',()=>{
  const actor=actorFor(fixture.selected[0]);
  const continuityIndex=new Map([[fixture.selected[0].actorKey,[{continuity:'A different pack target'}]]]);
  for(const override of [
    {incarnation:'Explicit incarnation'},
    {incarnation:{fr:'Version explicite'}},
    {sourceIncarnation:'Explicit source incarnation'},
    {continuity:'Legacy continuity string'},
    {continuity:{en:'Legacy localized continuity'}}
  ]){
    const row=buildActorFidelityBacklog({...actor,...override},{...options,continuityIndex});
    assert.equal(row.incarnationEvidence,'ACTOR_DECLARED');
    assert.ok(row.incarnation);
    assert.equal(row.declaredContinuity,null);
    assert.ok(!hasTask(row,'ACTOR_CONTINUITY_PRECISION'));
    assert.ok(!hasTask(row,'INCARNATION_UNSPECIFIED'));
    assertUnapproved(row);
  }
});

test('continuity recovery preserves missing, unresolved and static raster review tasks',()=>{
  const actor=actorFor(fixture.selected[0]);
  const tree=new Map([['public/sprites/fixture-static.png',{sha:'fixture-only',size:123}]]);
  const rasterProbes=[
    inspectActorRaster('/sprites/fixture-missing.png','enemy-sheet','idle',tree,{columns:4,rows:4}),
    inspectActorRaster('/sprites/fixture-static.png','enemy-sheet','idle',tree,{columns:1,rows:1}),
    inspectActorRaster('https://example.org/unresolved.png','enemy-sheet','idle',tree)
  ];
  const before=JSON.stringify(rasterProbes);
  const row=buildActorFidelityBacklog(actor,{...options,rasterProbes});
  const previous=buildActorFidelityBacklog({...actor,continuity:undefined},{...options,rasterProbes});
  for(const code of ['RASTER_MISSING','STATIC_GAMEPLAY_REVIEW','RASTER_SCOPE_UNRESOLVED']){
    assert.deepEqual(row.tasks.find(task=>task.code===code),previous.tasks.find(task=>task.code===code));
    assert.equal(row.tasks.find(task=>task.code===code)?.priority,'P1');
  }
  assert.deepEqual(row.rasterProbes,rasterProbes);
  assert.equal(JSON.stringify(rasterProbes),before);
  assertUnapproved(row);
});

test('the exporter adds distinct structured counters and preserves the old pack counter',()=>{
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'actor-locked-continuity-export-'));
  try{
    const treeFile=path.join(temporary,'tree.json');
    // Explicitly synthetic: this tree verifies counters, never raster presence.
    fs.writeFileSync(treeFile,JSON.stringify({sourceCommit:fixture.baseCommit,truncated:false,tree:[]}));
    const output=execFileSync(process.execPath,['--no-warnings','--loader',
      fileURLToPath(new URL('./sourceSceneTestLoader.mjs',import.meta.url)),
      fileURLToPath(new URL('./exportActorFidelityBacklog.mjs',import.meta.url)),
      path.join(temporary,'export'),fixture.baseCommit,treeFile,fixture.baseCommit],{
      encoding:'utf8',maxBuffer:1024*1024,env:{...process.env,NODE_OPTIONS:'--max-old-space-size=1024'}
    });
    const summary=JSON.parse(output);
    assert.equal(summary.structuredContinuitiesRecovered,60);
    assert.equal(summary.actorContinuityAmbiguities,2);
    assert.equal(summary.continuitiesRecovered,fixture.previousPackContinuitiesRecovered);
    assert.equal(summary.continuityConflicts,0);
    assert.equal(summary.newArtApprovals,0);
    assert.equal(summary.newSpriteFiles,0);
    assert.equal(summary.reviewComplete,0);
  }finally{fs.rmSync(temporary,{recursive:true,force:true});}
});

test('the real runtime roster is unchanged after continuity inspection and exports',()=>{
  assert.equal(runtimeHash(),initialRuntimeHash);
});
